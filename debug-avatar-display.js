// Debug script to check avatar display issue
// Run this in the browser console when viewing the profile page

function debugAvatarDisplay() {
  console.log('=== Avatar Display Debug ===');
  
  // Check current user data
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ No token found');
    return;
  }
  
  console.log('✅ Token found');
  
  // Check user data from useAuth hook (if accessible)
  console.log('Current user data:', window.user || 'Not accessible');
  
  // Check the image element
  const avatarImg = document.querySelector('img[alt="Profile"]');
  if (avatarImg) {
    console.log('✅ Avatar image element found');
    console.log('Current src:', avatarImg.src);
    console.log('Natural width:', avatarImg.naturalWidth);
    console.log('Natural height:', avatarImg.naturalHeight);
    
    // Check if image is loading
    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      console.log('✅ Image loaded successfully');
    } else if (avatarImg.complete) {
      console.log('❌ Image failed to load (broken image)');
    } else {
      console.log('⏳ Image still loading...');
      
      // Wait for image to load
      avatarImg.onload = () => {
        console.log('✅ Image loaded after wait');
        console.log('Natural size:', avatarImg.naturalWidth + 'x' + avatarImg.naturalHeight);
      };
      
      avatarImg.onerror = () => {
        console.log('❌ Image failed to load');
      };
    }
  } else {
    console.log('❌ Avatar image element not found');
  }
  
  // Check if there are any network errors
  fetch('/api/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Profile API response:', data);
    console.log('Avatar URL from API:', data.avatar_url);
  })
  .catch(error => {
    console.log('❌ Profile API error:', error);
  });
  
  console.log('=== Debug Complete ===');
}

console.log('Avatar Display Debug Script Loaded');
console.log('Run debugAvatarDisplay() to debug avatar display');
