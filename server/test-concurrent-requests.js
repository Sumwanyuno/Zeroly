// Test script for concurrent request handling
// This script simulates multiple users trying to request the same item simultaneously

import mongoose from 'mongoose';
import Item from './models/Item.js';
import Request from './models/Request.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function testConcurrentRequests() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Create a test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Test user not found. Please create a test user first.');
      return;
    }

    // Find an available item
    const availableItem = await Item.findOne({ status: 'available', user: { $ne: testUser._id } });
    if (!availableItem) {
      console.log('No available items found for testing.');
      return;
    }

    console.log(`Testing concurrent requests for item: ${availableItem.name} (${availableItem._id})`);

    // Simulate 5 concurrent requests
    const requests = Array(5).fill(null).map((_, index) => {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            console.log(`User ${index + 1} attempting to request item...`);
            
            // Use atomic operation to check and update item status
            const item = await Item.findOneAndUpdate(
              { 
                _id: availableItem._id, 
                status: 'available',
                user: { $ne: testUser._id }
              },
              { 
                $set: { status: 'requested' },
                $inc: { version: 1 }
              },
              { new: true }
            );

            if (!item) {
              console.log(`User ${index + 1}: Item no longer available (race condition prevented)`);
              resolve({ success: false, reason: 'Item no longer available' });
              return;
            }

            // Create request
            const request = new Request({
              item: availableItem._id,
              requester: testUser._id,
              owner: availableItem.user,
            });

            await request.save();
            console.log(`User ${index + 1}: Request successful!`);
            resolve({ success: true, requestId: request._id });
          } catch (error) {
            console.error(`User ${index + 1}: Error - ${error.message}`);
            reject(error);
          }
        }, Math.random() * 100); // Small random delay to simulate real-world timing
      });
    });

    const results = await Promise.allSettled(requests);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

    console.log('\n=== Test Results ===');
    console.log(`Successful requests: ${successful}`);
    console.log(`Failed/Blocked requests: ${failed}`);
    console.log(`Expected: Only 1 successful request (atomic operation prevents conflicts)`);

    // Cleanup: Reset item status
    await Item.findByIdAndUpdate(availableItem._id, { status: 'available' });
    await Request.deleteMany({ item: availableItem._id });
    console.log('\nCleanup complete. Item status reset to available.');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testConcurrentRequests();
