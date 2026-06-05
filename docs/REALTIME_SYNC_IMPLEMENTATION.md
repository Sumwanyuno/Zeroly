# Real-Time Item Availability Synchronization & Request Conflict Prevention

## Overview
This document describes the implementation of real-time synchronization and conflict prevention for item availability in Zeroly, addressing issue #21.

## Problem Statement
When multiple users interact with the same listing simultaneously, item availability may not update instantly across all clients, leading to:
- Duplicate requests for the same item
- Stale listing information
- User confusion from inconsistent states
- Race conditions in concurrent operations

## Solution Architecture

### 1. Backend Changes

#### 1.1 Optimistic Concurrency Control
**File: `server/models/Item.js`**
- Added `version` field to Item schema for optimistic concurrency control
- Each update increments the version number to track changes

```javascript
version: {
    type: Number,
    default: 0
}
```

#### 1.2 Atomic Request Creation
**File: `server/controllers/requestController.js`**
- Replaced non-atomic check-and-set with atomic `findOneAndUpdate` operation
- Prevents race conditions by checking item status and updating it in a single atomic operation
- Returns 409 Conflict status if item is no longer available

```javascript
const item = await Item.findOneAndUpdate(
    { 
        _id: itemId, 
        status: 'available',
        user: { $ne: requesterId }
    },
    { 
        $set: { status: 'requested' },
        $inc: { version: 1 }
    },
    { new: true }
);
```

#### 1.3 Real-time Socket Events
**Files: `server/controllers/requestController.js`, `server/index.js`**
- Emit `item-status-changed` event whenever item status changes
- Event includes: `itemId`, `status`, `version`, and optionally `requestId`
- Socket.io instance made accessible to controllers via `app.set('io', io)`

**Events emitted on:**
- Request creation (item → requested)
- Request acceptance (item → requested)
- Request decline (item → available)
- Handshake verification (item → given)

### 2. Frontend Changes

#### 2.1 Socket Integration
**File: `client/src/context/AuthContext.jsx`**
- Integrated Socket.io connection into AuthContext
- Socket automatically connects when user logs in
- Socket disconnects when user logs out
- Socket instance made available to all components via context

```javascript
const socketInstance = initSocket(userInfo.token);
setSocket(socketInstance);
```

#### 2.2 Real-time Listeners
**Files: `client/src/pages/ExplorePage.jsx`, `ItemDetailsPage.jsx`, `ProfilePage.jsx`, `RequestsDashboard.jsx`**
- Added socket listeners for `item-status-changed` events
- Components update their local state when item status changes
- Users see instant updates without page refresh

**ExplorePage:**
```javascript
socket.on('item-status-changed', (data) => {
    setItems(prevItems => 
        prevItems.map(item => 
            item._id === data.itemId 
                ? { ...item, status: data.status, version: data.version }
                : item
        )
    );
});
```

**ItemDetailsPage:**
- Shows toast notifications when item status changes
- Updates item state in real-time
- Prevents users from requesting already-requested items

#### 2.3 Optimistic UI Updates
**Files: `client/src/pages/ItemDetailsPage.jsx`, `RequestsDashboard.jsx`**
- Implemented optimistic updates for better UX
- UI updates immediately on user action
- Reverts on error with proper error handling
- Refreshes from server after successful operation

**ItemDetailsPage handleRequest:**
```javascript
// Optimistic update
const previousStatus = item.status;
setItem(prev => ({ ...prev, status: 'requested' }));

try {
    await axios.post(`${API_BASE_URL}/requests`, { itemId: item._id }, config);
    // Refresh to get latest state
    const { data: updatedItem } = await api.get(`${API_BASE_URL}/items/${id}`);
    setItem(updatedItem);
} catch (error) {
    // Revert on error
    setItem(prev => ({ ...prev, status: previousStatus }));
}
```

**RequestsDashboard handleUpdateStatus:**
```javascript
// Optimistic update
const previousRequests = [...receivedRequests];
setRequests(prev => 
    prev.map(req => 
        req._id === requestId ? { ...req, status } : req
    )
);

try {
    await axios.put(`${API_BASE_URL}/requests/${requestId}`, { status }, config);
    fetchRequests(); // Refresh from server
} catch (error) {
    setRequests(previousRequests); // Revert on error
}
```

### 3. Testing

#### Test Script
**File: `server/test-concurrent-requests.js`**
- Simulates multiple concurrent requests to the same item
- Validates atomic operation prevents duplicate requests
- Only one request should succeed, others should be blocked

**To run the test:**
```bash
cd server
node test-concurrent-requests.js
```

## Acceptance Criteria Met

✅ **Item availability updates instantly**
- Socket events broadcast status changes to all connected clients
- All major pages (Explore, ItemDetails, Profile, RequestsDashboard) listen for updates

✅ **Duplicate request conflicts are prevented**
- Atomic `findOneAndUpdate` operation ensures only one request succeeds
- Returns 409 Conflict status with descriptive message

✅ **Listing states remain synchronized**
- Version field tracks changes for optimistic concurrency
- All clients receive real-time updates via socket events

✅ **Users always see the latest item status**
- Real-time socket listeners update UI instantly
- Optimistic updates provide immediate feedback
- Server refresh ensures data consistency

## Benefits

1. **Improved User Experience**: Users see real-time updates without refreshing
2. **Conflict Prevention**: Atomic operations prevent race conditions
3. **Data Consistency**: Version tracking ensures optimistic concurrency control
4. **Better Error Handling**: Descriptive error messages guide users
5. **Scalability**: Socket-based architecture scales well with multiple users

## Technical Details

### Socket Event Format
```javascript
{
    itemId: ObjectId,
    status: 'available' | 'requested' | 'given',
    version: Number,
    requestId: ObjectId (optional)
}
```

### Error Codes
- **409 Conflict**: Item no longer available or already requested
- **400 Bad Request**: Insufficient points, own item, or existing request

### Performance Considerations
- Atomic operations are faster than transactions for single-document updates
- Socket events are lightweight and efficient
- Optimistic updates reduce perceived latency
- Version field adds minimal overhead

## Future Enhancements

1. Add request-specific socket events for more granular updates
2. Implement retry logic for failed optimistic updates
3. Add request queue system for high-demand items
4. Implement conflict resolution UI for manual intervention
5. Add analytics to track conflict rates and system performance
