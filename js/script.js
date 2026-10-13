/* =========================================
   SLIDER
========================================= */

let currentSlide = 0;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");


function showSlide(index) {

    if (index >= slides.length) {

        currentSlide = 0;

    } else if (index < 0) {

        currentSlide = slides.length - 1;

    } else {

        currentSlide = index;

    }


    slides.forEach((slide) => {

        slide.classList.remove("active");

    });


    dots.forEach((dot) => {

        dot.classList.remove("active");

    });


    slides[currentSlide].classList.add("active");

    dots[currentSlide].classList.add("active");
}


function nextSlide() {

    showSlide(currentSlide + 1);

}


function previousSlide() {

    showSlide(currentSlide - 1);

}


function goToSlide(index) {

    showSlide(index);

}


/* =========================================
   TROCA AUTOMÁTICA
========================================= */

setInterval(() => {

    nextSlide();

}, 6000);


/* =========================================
   ACESSIBILIDADE - TAMANHO DO TEXTO
========================================= */

let fontSize = 100;


function increaseFont() {

    if (fontSize < 140) {

        fontSize += 10;

        document.documentElement.style.fontSize =
            fontSize + "%";

    }

}


function decreaseFont() {

    if (fontSize > 80) {

        fontSize -= 10;

        document.documentElement.style.fontSize =
            fontSize + "%";

    }

}


/* =========================================
   ALTO CONTRASTE
========================================= */

function toggleContrast() {

    document.body.classList.toggle("high-contrast");

}


/* =========================================
   RESET
========================================= */

function resetAccessibility() {

    fontSize = 100;

    document.documentElement.style.fontSize = "100%";

    document.body.classList.remove("high-contrast");

}


/* =========================================
   PAUSAR SLIDER QUANDO O MOUSE ESTÁ SOBRE
========================================= */

const slider = document.querySelector(".slider");

let sliderInterval = setInterval(nextSlide, 6000);

slider.addEventListener("mouseenter", () => {

    clearInterval(sliderInterval);

});


slider.addEventListener("mouseleave", () => {

    sliderInterval = setInterval(nextSlide, 6000);

});


/* =================================
   LIGHTBOX INTERATIVO
================================= */

const galleryImages = [...document.querySelectorAll(".gallery img")];

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCounter = document.getElementById("lightboxCounter");

const closeButton = document.getElementById("lightboxClose");
const prevButton = document.getElementById("lightboxPrev");
const nextButton = document.getElementById("lightboxNext");

let activeImageIndex = 0;
let lastFocusedElement = null;

function showLightboxImage(index) {
    activeImageIndex =
        (index + galleryImages.length) % galleryImages.length;

    const image = galleryImages[activeImageIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || "Foto do evento";

    lightboxCaption.textContent =
        image.dataset.caption || image.alt || "";

    lightboxCounter.textContent =
        `${activeImageIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(index) {
    if (!galleryImages.length) return;

    lastFocusedElement = document.activeElement;

    showLightboxImage(index);

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeButton.focus();
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    lightboxImage.removeAttribute("src");

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function nextLightboxImage() {
    showLightboxImage(activeImageIndex + 1);
}

function previousLightboxImage() {
    showLightboxImage(activeImageIndex - 1);
}

/* Abrir clicando nas fotos */
galleryImages.forEach((image, index) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute(
        "aria-label",
        `Ampliar foto ${index + 1}: ${image.alt}`
    );

    image.addEventListener("click", () => {
        openLightbox(index);
    });

    image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(index);
        }
    });
});

/* Controles */
closeButton.addEventListener("click", closeLightbox);
nextButton.addEventListener("click", nextLightboxImage);
prevButton.addEventListener("click", previousLightboxImage);

/* Clicar no fundo escuro fecha a galeria */
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

/* Navegação por teclado */
document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        nextLightboxImage();
    }

    if (event.key === "ArrowLeft") {
        previousLightboxImage();
    }
});

/* Navegação por gesto no celular */
let touchStartX = 0;
let touchStartY = 0;

lightboxImage.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

lightboxImage.addEventListener("touchend", (event) => {
    const deltaX =
        event.changedTouches[0].clientX - touchStartX;

    const deltaY =
        event.changedTouches[0].clientY - touchStartY;

    if (
        Math.abs(deltaX) < 50 ||
        Math.abs(deltaX) < Math.abs(deltaY)
    ) {
        return;
    }

    if (deltaX < 0) {
        nextLightboxImage();
    } else {
        previousLightboxImage();
    }
}, { passive: true });
