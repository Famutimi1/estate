// Test Cloudinary configuration
// Run this in the browser console

async function testCloudinaryConfig() {
  console.log('=== Testing Cloudinary Configuration ===');
  
  try {
    // Test the existing upload endpoint to see if Cloudinary is working
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(0, 0, 100, 100);
    }
    
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
    
    // Test the existing upload endpoint
    const formData = new FormData();
    formData.append('file', blob, 'test-cloudinary.png');
    
    console.log('Testing existing /api/upload endpoint...');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Upload response status:', response.status);
    const result = await response.json();
    console.log('Upload response:', result);
    
    if (result.url) {
      console.log('✅ Cloudinary upload working!');
      console.log('Uploaded to:', result.url);
    } else {
      console.log('❌ Cloudinary upload failed:', result.error);
    }
    
  } catch (error) {
    console.error('Cloudinary test error:', error);
  }
}

console.log('Cloudinary Config Test Script Loaded');
console.log('Run testCloudinaryConfig() to test');
