// Test script to verify profile APIs work
// Run this in the browser console when logged in

async function testProfileAPIs() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No auth token found. Please log in first.');
    return;
  }

  console.log('Testing Profile APIs...');

  try {
    // Test GET profile
    console.log('1. Testing GET /api/user/profile');
    const profileResponse = await fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profileData = await profileResponse.json();
    console.log('Profile data:', profileData);

    // Test PUT profile update
    console.log('2. Testing PUT /api/user/profile');
    const updateResponse = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test User Updated',
        phone: '+1234567890'
      })
    });
    const updateData = await updateResponse.json();
    console.log('Update response:', updateData);

    console.log('Profile API tests completed successfully!');
  } catch (error) {
    console.error('Error testing profile APIs:', error);
  }
}

// Auto-run the test
testProfileAPIs();
