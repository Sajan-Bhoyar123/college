import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAddSchool() {
  try {
    const response = await fetch(`${BASE_URL}/addSchool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test School',
        address: 'Test Address',
        latitude: 12.9716,
        longitude: 77.5946
      })
    });

    const data = await response.json();
    console.log('Add School Response:', {
      status: response.status,
      data: data
    });
  } catch (error) {
    console.error('Error testing add school:', error);
  }
}

async function testListSchools() {
  try {
    const response = await fetch(`${BASE_URL}/listSchools?latitude=12.9716&longitude=77.5946`);
    const data = await response.json();
    console.log('List Schools Response:', {
      status: response.status,
      data: data
    });
  } catch (error) {
    console.error('Error testing list schools:', error);
  }
}

async function runTests() {
  console.log('Testing API endpoints...');
  await testAddSchool();
  await testListSchools();
}

runTests();
