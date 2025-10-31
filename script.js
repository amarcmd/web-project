let menuToggle = document.getElementById("hamburger");
let header=document.querySelector("header");
let gallery=document.querySelector(".gallery");


menuToggle.addEventListener("click",()=>{
    header.classList.toggle("header-nav-open");
});

// --- Modal Elements ---
let modal = document.getElementById('card-modal');
let modalTrailer = document.getElementById('modal-trailer'); 
let modalTitle = document.getElementById('modal-title');
let modalText = document.getElementById('modal-text');
let modalClose = document.getElementById('modal-close');

// --- Map of Movie Titles to Trailer Embed URLs (Your manual links) ---
const TRAILER_URLS = {
    // 🎬 FIX: New, reliable embed ID for Barbie (Official Warner Bros. Trailer)
    "Barbie": "https://www.youtube.com/embed/GRyt364dn6c?rel=0&showinfo=0&autoplay=1", 
    
    // 🎬 FIX: New, reliable embed ID for It Ends With Us (Official Sony Pictures Trailer)
    "It Ends With Us": "https://www.youtube.com/embed/fKvsftE5qeQ?rel=0&showinfo=0&autoplay=1", 
    
    // 🎬 Verified link for IT (2017)
    "IT": "https://www.youtube.com/embed/PN8il_zxNWM?rel=0&showinfo=0&autoplay=1", 
    
    // 🎬 Verified link for Jurassic World Rebirth 
    "Jurassic World Rebirth": "https://www.youtube.com/embed/z01McjZmxLM?rel=0&showinfo=0&autoplay=1",
    
    // 🎬 Verified link for Split (Official Universal Pictures Trailer)
    "Split": "https://www.youtube.com/embed/Qsr6SgcKNiM?rel=0&showinfo=0&autoplay=1",
    
    // 🎬 Bonus: The final movie, 'White Chicks'
    "White Chicks": "https://www.youtube.com/embed/aeVvE_O9kYc?rel=0&showinfo=0&autoplay=1"
};

// Selecting all elements with the class 'movie-card'
let figure = document.querySelectorAll('.movie-card'); 

// --- Function to Close Modal ---
function closeModal() {
    if (modal) {
        modal.classList.remove('open');
    }
    document.body.style.overflow = '';
    
    // Stop the video by clearing the src
    if (modalTrailer) {
        modalTrailer.src = ''; 
    }
}

// --- Event Listener for Clicking Movie Cards ---
figure.forEach(function (cardEl) {
    cardEl.onclick = function () {
        let card = cardEl.closest('figure');
        
        if (!card) {
            console.error("Could not find parent <figure> element for the clicked .movie-card element.");
            return; 
        }
        
        let titleEl = card.querySelector('figcaption');
        
        let title = titleEl ? titleEl.textContent.trim() : card.getAttribute('data-title');
        let text = card.getAttribute('data-description') || 'No movie description available yet.'; 
        
        const youtubeEmbedUrl = TRAILER_URLS[title] || ''; 
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalText) modalText.textContent = text;
        
        if (youtubeEmbedUrl && modalTrailer) {
            modalTrailer.src = youtubeEmbedUrl;
            modalTrailer.style.display = 'block'; 
        } else if (modalTrailer) {
            modalTrailer.src = ''; 
            modalTrailer.style.display = 'none';
            console.warn(`No trailer link found for movie: ${title}. Displaying content only.`);
        }

        if (modal) { // Check before accessing modal properties
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };
});

// --- Event Listeners for Closing Modal (Original safety checks maintained) ---
if (modalClose) {
    modalClose.onclick = closeModal;
}

if (modal) {
    modal.onclick = function (event) {
        if (event.target === modal || event.target.hasAttribute('data-close-modal')) {
            closeModal();
        }
    };
}

