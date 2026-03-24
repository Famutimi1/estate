// Simple Debug - Check if User Exists
require('dotenv').config();

console.log('🔍 Simple Debug - Checking User Existence\n');

// Check environment variables
console.log('Environment Variables:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
console.log('- RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ Missing');
console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Missing');

console.log('\n📧 Testing Email Sending (without database)...');

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmailOnly() {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: ['famutimi95@gmail.com'],
      subject: 'Direct Test - Forgot Password Debug',
      html: `
        <h1>Direct Email Test</h1>
        <p>This is a direct test to verify email sending works.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>If you receive this email, the Resend integration is working.</p>
        <p>The issue might be with database user lookup or the API flow.</p>
      `,
    });
    
    if (error) {
      console.log('❌ Direct email test failed:', error);
    } else {
      console.log('✅ Direct email test successful!');
      console.log('Response:', data);
      console.log('\n📧 Check your inbox for this test email!');
    }
  } catch (error) {
    console.log('❌ Direct email error:', error.message);
  }
}

testEmailOnly();
