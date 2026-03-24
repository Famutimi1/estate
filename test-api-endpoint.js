// Test the actual forgot password API endpoint
require('dotenv').config();

async function testForgotPasswordAPI() {
  console.log('🔍 Testing Actual Forgot Password API\n');
  
  const testEmail = 'famutimi95@gmail.com';
  
  try {
    console.log('📧 Sending request to /api/auth/forgot-password...');
    console.log('Email:', testEmail);
    
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });
    
    const data = await response.json();
    
    console.log('\n📬 API Response:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ API call successful');
      console.log('📧 Check your email - should have received reset link');
    } else {
      console.log('\n❌ API call failed');
      console.log('Error:', data.error?.message);
    }
    
  } catch (error) {
    console.log('❌ API call error:', error.message);
    console.log('\n💡 Make sure your development server is running on localhost:3000');
  }
}

testForgotPasswordAPI();
