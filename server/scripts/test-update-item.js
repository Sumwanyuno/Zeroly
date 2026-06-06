import axios from 'axios';

async function run() {
  try {
    console.log("Registering user A...");
    const userA = await axios.post('http://localhost:5001/api/users/register', {
      name: 'User A', email: `usera${Date.now()}@example.com`, password: 'password'
    });

    console.log("Registering user B...");
    const userB = await axios.post('http://localhost:5001/api/users/register', {
      name: 'User B', email: `userb${Date.now()}@example.com`, password: 'password'
    });

    console.log("User A creates an item...");
    const item = await axios.post('http://localhost:5001/api/items', {
      name: 'Test Item', description: 'Desc', category: 'Other', address: '123 Test St', ecoSeeds: 10, imageUrl: 'http://example.com/image.png'
    }, { headers: { Authorization: `Bearer ${userA.data.token}` } });
    
    const itemId = item.data._id;
    console.log("Item ID:", itemId);

    console.log("User B tries to update User A's item...");
    try {
      await axios.put(`http://localhost:5001/api/items/${itemId}`, {
        name: 'Hacked Item'
      }, { headers: { Authorization: `Bearer ${userB.data.token}` } });
      console.log("FAIL: User B successfully updated User A's item! (IDOR Vulnerability)");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("SUCCESS: User B was correctly forbidden from updating User A's item. (403)");
      } else {
        console.log("FAIL: Unexpected error", err.response?.data || err.message);
      }
    }

    console.log("User A updates their own item...");
    const updateRes = await axios.put(`http://localhost:5001/api/items/${itemId}`, {
      name: 'Legitimate Update'
    }, { headers: { Authorization: `Bearer ${userA.data.token}` } });

    if (updateRes.data.name === 'Legitimate Update') {
      console.log("SUCCESS: User A updated their own item.");
    } else {
      console.log("FAIL: Item did not update correctly.");
    }

  } catch (err) {
    console.error("Test error:", err.response?.data || err.message);
  }
}

run();
