const { sendAdminNotificationEmail, sendWelcomeEmail } = require('./src/lib/email');

async function testAllNotifications() {
  try {
    console.log('🧪 Testing All Email Notifications...\n');
    
    // Test 1: Registration Notification
    console.log('1. 🎉 Testing Registration Notification...');
    await sendAdminNotificationEmail('registration', {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      phone: '+2348031234567'
    });
    console.log('✅ Registration notification sent successfully!\n');
    
    // Test 2: Agent Registration Notification
    console.log('2. 🏢 Testing Agent Registration Notification...');
    await sendAdminNotificationEmail('registration', {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'agent',
      phone: '+2348059876543'
    });
    console.log('✅ Agent registration notification sent successfully!\n');
    
    // Test 3: Contact Message Notification
    console.log('3. 📧 Testing Contact Message Notification...');
    await sendAdminNotificationEmail('contact', {
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+2348023456789',
      subject: 'Inquiry about 3-bedroom apartment',
      message: 'Hello, I am interested in the 3-bedroom apartment listed in Victoria Island. Can you provide more details about the property and schedule a viewing? I am looking to move within the next month. Please let me know the availability and pricing. Thank you!'
    });
    console.log('✅ Contact message notification sent successfully!\n');
    
    // Test 4: Viewing Schedule Notification
    console.log('4. 📅 Testing Viewing Schedule Notification...');
    await sendAdminNotificationEmail('schedule', {
      name: 'Mary Williams',
      email: 'mary.w@example.com',
      phone: '+2348087654321',
      preferredDate: '2024-04-15',
      preferredTime: '2:00 PM',
      viewerType: 'buyer',
      message: 'I would like to view the property. I have been pre-approved for a mortgage and am seriously interested in making an offer if the property meets my requirements.',
      propertyTitle: 'Modern 3-Bedroom Apartment in Lekki',
      propertyId: 'property-123'
    });
    console.log('✅ Viewing schedule notification sent successfully!\n');
    
    // Test 5: Renter Schedule Notification
    console.log('5. 🏠 Testing Renter Schedule Notification...');
    await sendAdminNotificationEmail('schedule', {
      name: 'David Brown',
      email: 'david.b@example.com',
      phone: '+2348091234567',
      preferredDate: '2024-04-20',
      preferredTime: '10:00 AM',
      viewerType: 'renter',
      message: 'Looking for a 2-bedroom apartment to rent for at least 1 year. Working professional, can provide references and proof of income.',
      propertyTitle: 'Cozy 2-Bedroom Flat in Ikeja',
      propertyId: 'property-456'
    });
    console.log('✅ Renter schedule notification sent successfully!\n');
    
    // Test 6: Welcome Email (for comparison)
    console.log('6. 🎉 Testing Welcome Email...');
    await sendWelcomeEmail('test.user@example.com', 'Test User', 'user');
    console.log('✅ Welcome email sent successfully!\n');
    
    console.log('🎉 All notification tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Registration notifications (user & agent)');
    console.log('- ✅ Contact message notifications');
    console.log('- ✅ Viewing schedule notifications (buyer & renter)');
    console.log('- ✅ Welcome emails');
    
  } catch (error) {
    console.error('❌ Notification test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Check environment variables
console.log('🔍 Checking environment variables...');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'Using default');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'Using default');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Using default (admin@myhome.ng)');
console.log('');

// Run the test
testAllNotifications();
