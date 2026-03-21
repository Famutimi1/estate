// Test script to verify property API includes user information
// Run this in the browser console when viewing a property page

async function testPropertyUserAPI() {
  console.log('Testing Property User API...');
  
  try {
    // Get the current property ID from the URL
    const pathParts = window.location.pathname.split('/');
    const propertyId = pathParts[pathParts.length - 1];
    
    if (!propertyId) {
      console.error('No property ID found in URL');
      return;
    }
    
    console.log(`Testing property ID: ${propertyId}`);
    
    // Test the property API
    const response = await fetch(`/api/properties/${propertyId}`);
    const propertyData = await response.json();
    
    console.log('Property API Response:', propertyData);
    
    if (propertyData.user) {
      console.log('✅ User information found:');
      console.log('Name:', propertyData.user.name);
      console.log('Email:', propertyData.user.email);
      console.log('Phone:', propertyData.user.phone);
      console.log('Role:', propertyData.user.role);
      console.log('Avatar URL:', propertyData.user.avatarUrl);
    } else {
      console.log('❌ No user information found in property data');
    }
    
  } catch (error) {
    console.error('Error testing property API:', error);
  }
}

// Auto-run the test
testPropertyUserAPI();
