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


/* =================================
   LIGHTBOX DE DEPOIMENTOS EM VÍDEO
================================= */

const testimonialVideos = [
    ...document.querySelectorAll(".video-card video")
];

const videoLightbox = document.getElementById("videoLightbox");
const expandedVideo = document.getElementById("expandedVideo");

const videoCaption = document.getElementById("videoLightboxCaption");
const videoCounter = document.getElementById("videoLightboxCounter");

const videoClose = document.getElementById("videoLightboxClose");
const videoPrev = document.getElementById("videoLightboxPrev");
const videoNext = document.getElementById("videoLightboxNext");

let currentVideoIndex = 0;
let lastVideoFocus = null;

function showExpandedVideo(index, autoplay = false) {
    if (!testimonialVideos.length) return;

    currentVideoIndex =
        (index + testimonialVideos.length) % testimonialVideos.length;

    const originalVideo = testimonialVideos[currentVideoIndex];

    const source = originalVideo.querySelector("source");

    const videoUrl = source
        ? source.src
        : originalVideo.currentSrc || originalVideo.src;

    // Para a reprodução anterior antes de trocar
    expandedVideo.pause();

    if (expandedVideo.src !== videoUrl) {
        expandedVideo.src = videoUrl;
        expandedVideo.load();
    }

    const card = originalVideo.closest(".video-card");
    const title = card?.querySelector("h3")?.textContent?.trim();

    videoCaption.textContent = title || `Depoimento ${currentVideoIndex + 1}`;

    videoCounter.textContent =
        `${currentVideoIndex + 1} / ${testimonialVideos.length}`;

    if (autoplay) {
        expandedVideo.play().catch(() => {
            // Se o navegador bloquear o autoplay,
            // a pessoa poderá iniciar pelo controle do vídeo.
        });
    }
}

function openVideoLightbox(index) {
    lastVideoFocus = document.activeElement;

    videoLightbox.classList.add("open");
    videoLightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    showExpandedVideo(index, true);

    videoClose.focus();
}

function closeVideoLightbox() {
    expandedVideo.pause();
    expandedVideo.removeAttribute("src");
    expandedVideo.load();

    videoLightbox.classList.remove("open");
    videoLightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (lastVideoFocus) {
        lastVideoFocus.focus();
    }
}

function nextExpandedVideo() {
    showExpandedVideo(currentVideoIndex + 1, true);
}

function previousExpandedVideo() {
    showExpandedVideo(currentVideoIndex - 1, true);
}

/* Clique no vídeo original para ampliar */
testimonialVideos.forEach((video, index) => {
    video.style.cursor = "pointer";

    video.addEventListener("click", () => {
        openVideoLightbox(index);
    });

    video.setAttribute("tabindex", "0");

    video.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openVideoLightbox(index);
        }
    });
});

/* Botões */
videoClose.addEventListener("click", closeVideoLightbox);
videoNext.addEventListener("click", nextExpandedVideo);
videoPrev.addEventListener("click", previousExpandedVideo);

/* Clique fora do vídeo fecha */
videoLightbox.addEventListener("click", (event) => {
    if (event.target === videoLightbox) {
        closeVideoLightbox();
    }
});

/* Teclado */
document.addEventListener("keydown", (event) => {
    if (!videoLightbox.classList.contains("open")) return;

    // Não intercepta setas enquanto a pessoa
    // estiver usando os controles do próprio vídeo.
    if (event.key === "Escape") {
        closeVideoLightbox();
    }
});

/* Garante que os vídeos não continuem tocando ao fechar */
videoLightbox.addEventListener("transitionend", () => {
    if (!videoLightbox.classList.contains("open")) {
        expandedVideo.pause();
    }
});
