// Test script to verify profile picture upload functionality
// Run this in the browser console when viewing the profile page

async function testAvatarUpload() {
  console.log('Testing Avatar Upload API...');
  
  try {
    // Create a test image file (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillRect(0, 0, 1, 1);
    }
    
    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
    
    // Create form data
    const formData = new FormData();
    formData.append('file', blob, 'test-avatar.png');
    
    // Get auth token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found. Please login first.');
      return;
    }
    
    console.log('Uploading test avatar...');
    
    // Test the avatar upload API
    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    
    console.log('Avatar Upload API Response:', result);
    
    if (result.success) {
      console.log('✅ Avatar uploaded successfully!');
      console.log('Avatar URL:', result.avatarUrl);
      console.log('Cloudinary Public ID:', result.publicId);
      
      // Refresh the page to see the new avatar
      setTimeout(() => {
        console.log('Refreshing page to see new avatar...');
        window.location.reload();
      }, 2000);
    } else {
      console.log('❌ Avatar upload failed:', result.error);
    }
    
  } catch (error) {
    console.error('Error testing avatar upload:', error);
  }
}

// Auto-run the test
console.log('Profile Avatar Upload Test Script Loaded');
console.log('Run testAvatarUpload() to test the upload functionality');
