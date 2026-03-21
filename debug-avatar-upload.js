// Debug script to test avatar upload step by step
// Run this in the browser console when viewing the profile page

async function debugAvatarUpload() {
  console.log('=== Avatar Upload Debug ===');
  
  try {
    // 1. Check if user is logged in
    const token = localStorage.getItem('token');
    console.log('1. Token check:', token ? '✅ Token found' : '❌ No token');
    
    if (!token) {
      console.log('❌ Please login first');
      return;
    }
    
    // 2. Check if uploadAvatar function exists
    const profilePage = document.querySelector('body');
    if (!profilePage) {
      console.log('❌ Profile page not found');
      return;
    }
    
    console.log('2. Profile page found ✅');
    
    // 3. Find the file input
    const fileInput = document.querySelector('input[type="file"]');
    console.log('3. File input:', fileInput ? '✅ Found' : '❌ Not found');
    
    if (!fileInput) {
      console.log('❌ File input not found');
      return;
    }
    
    // 4. Find the camera button
    const cameraButton = document.querySelector('button[title="Change profile picture"]');
    console.log('4. Camera button:', cameraButton ? '✅ Found' : '❌ Not found');
    
    if (!cameraButton) {
      console.log('❌ Camera button not found');
      return;
    }
    
    // 5. Create a test file
    console.log('5. Creating test file...');
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 100, 100);
    }
    
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
    
    console.log('5. Test file created ✅');
    
    // 6. Test the API directly
    console.log('6. Testing API directly...');
    const formData = new FormData();
    formData.append('file', blob, 'test-avatar.png');
    
    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    console.log('6. API Response status:', response.status);
    const result = await response.json();
    console.log('6. API Response data:', result);
    
    if (result.success) {
      console.log('✅ API test successful!');
      console.log('Avatar URL:', result.avatarUrl);
    } else {
      console.log('❌ API test failed:', result.error);
    }
    
    console.log('=== Debug Complete ===');
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

// Auto-run the debug
console.log('Avatar Upload Debug Script Loaded');
console.log('Run debugAvatarUpload() to start debugging');
