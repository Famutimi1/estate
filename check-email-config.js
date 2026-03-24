// Check current email configuration
require('dotenv').config();

console.log('📧 Email Configuration Check:');
console.log('');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ Missing');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Missing');

console.log('');
console.log('💡 Recommended fix:');
console.log('Set RESEND_FROM_EMAIL="onboarding@resend.dev" in your .env file');
console.log('This will work for testing with your verified email (famutimi95@gmail.com)');
