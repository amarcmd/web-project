
function getBasePath() {
   const path = window.location.pathname;
    const match = path.match(/^\/[^/]+\//); 
    return match ? match[0] : '/';
}

function getProfileUrl() {
    const base = getBasePath();
    if (window.location.pathname.includes('/pages/')) {
        return base + 'pages/Profile.html';
    } else {
        return base + 'pages/Profile.html';
    }
}