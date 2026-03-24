// Test Resend Configuration
const { Resend } = require('resend');

// Load environment variables
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('Testing Resend configuration...');
  console.log('API Key:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('From Email:', process.env.RESEND_FROM_EMAIL || '❌ Missing');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('\n❌ RESEND_API_KEY is not set in your environment variables');
    console.log('Please add it to your .env file:');
    console.log('RESEND_API_KEY="re_your_actual_resend_api_key"');
    return;
  }
  
  if (!process.env.RESEND_FROM_EMAIL) {
    console.log('\n❌ RESEND_FROM_EMAIL is not set in your environment variables');
    console.log('Please add it to your .env file:');
    console.log('RESEND_FROM_EMAIL="noreply@yourdomain.com"');
    return;
  }
  
  try {
    console.log('\n📧 Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: ['famutimi95@gmail.com'], // Your verified email
      subject: 'Test Email from myHOME',
      html: '<h1>Test Email</h1><p>This is a test email from myHOME application.</p>',
    });
    
    if (error) {
      console.log('❌ Email sending failed:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Email sent successfully!');
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testResend();
