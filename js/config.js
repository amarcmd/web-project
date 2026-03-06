
function getProfileUrl() {
    if (window.location.pathname.includes('/pages/')) {
        return 'Profile.html';          
    } else {
        return 'pages/Profile.html';    
    }
}