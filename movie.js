let Toggle = document.getElementById("menuToggle");
let header=document.querySelector("header");
let gallery=document.querySelector(".gallery");

Toggle.addEventListener("click",()=>{
    header.classList.toggle("header-nav-open");
});
let modal        = document.getElementById('card-modal');
let modalTrailer = document.getElementById('modal-trailer'); 
let modalTitle   = document.getElementById('modal-title');
let modalText    = document.getElementById('modal-text');
let modalClose   = document.getElementById('modal-close');


let buttons = document.querySelectorAll('.bbbb'); 


function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    
    
    if (modalTrailer) {
        modalTrailer.src = ''; 
    }
}


buttons.forEach(function (btn) {
     btn.onclick = function () {
         let card   = btn.closest('figure');
        
        if (!card) {
            console.error("Could not find parent <figure> element for the button.");
            return; 
        }
      let titleEl   = card.querySelector('figcaption');
        
        let title     = titleEl ? titleEl.textContent.trim() : card.getAttribute('data-title');
        let text      = card.getAttribute('data-description') || 'No movie description available yet.'; 
        let trailerId = card.getAttribute('data-trailer-id');
        
        
        modalTitle.textContent = title;
        modalText.textContent  = text;

        
        if (trailerId && modalTrailer) {
           let youtubeEmbedUrl = `https://www.youtube.com/embed/${trailerId}?rel=0&showinfo=0&autoplay=1`;
            
            modalTrailer.src = youtubeEmbedUrl;
            modalTrailer.style.display = 'block'; 
        } else if (modalTrailer) {
             modalTrailer.src = '';
            modalTrailer.style.display = 'none';
            console.warn(`No trailer ID found for movie: ${title}. Displaying content only.`);
        }

        
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
});


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

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}