const { sendWelcomeEmail } = require('./src/lib/email');

async function testWelcomeEmail() {
  try {
    console.log('Testing welcome email functionality...');
    
    // Test with regular user
    console.log('\n1. Testing regular user welcome email...');
    await sendWelcomeEmail(
      'famutimi95@gmail.com',
      'John Doe',
      'user'
    );
    console.log('✅ Regular user welcome email sent successfully!');
    
    // Test with agent user
    console.log('\n2. Testing agent welcome email...');
    await sendWelcomeEmail(
      'famutimi95@gmail.com',
      'Jane Smith',
      'agent'
    );
    console.log('✅ Agent welcome email sent successfully!');
    
    // Test with admin user
    console.log('\n3. Testing admin welcome email...');
    await sendWelcomeEmail(
      'famutimi95@gmail.com',
      'Admin User',
      'admin'
    );
    console.log('✅ Admin welcome email sent successfully!');
    
    console.log('\n🎉 All welcome email tests passed!');
    
  } catch (error) {
    console.error('❌ Welcome email test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Check environment variables
console.log('Checking environment variables...');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'Using default');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'Using default');

// Run the test
testWelcomeEmail();
