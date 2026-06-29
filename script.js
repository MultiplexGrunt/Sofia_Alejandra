/* ==========================================================================
   CONFIGURACIÓN DE LA INVITACIÓN
   (Puedes cambiar estos valores fácilmente)
   ========================================================================== */
const CONFIG = {
    // Fecha del evento para la cuenta regresiva (Formato: AAAA-MM-DDTHH:MM:SS)
    eventDate: "2026-07-11T16:00:00",
    
    // Zona horaria local del evento (ej. -06:00 para México Centro/CST)
    timezoneOffset: "-06:00",
    
    // Teléfono de WhatsApp para recibir confirmaciones (ej: "5215512345678")
    // Deja el código de país al inicio (52 para México, 1 para USA, etc.)
    rsvpPhone: "521234567890",
    
    // Detalles para Google Calendar
    calendar: {
        title: "Baby Shower - Sofía Alejandra",
        details: "¡Te invitamos a celebrar con nosotros el Baby Shower de Sofía Alejandra! Acompáñanos en este momento tan especial.",
        location: "Quinta San Judas Tadeo",
        // Duración estimada (3 horas) en UTC: Sábado 11 Julio 2026 16:00 a 19:00 CST
        // 16:00 CST + 6 horas = 22:00 UTC
        startUTC: "20260711T220000Z",
        endUTC: "20260712T010000Z"
    }
};

/* ==========================================================================
   LÓGICA DE INICIO (PANTALLA DE BIENVENIDA Y AUDIO)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const btnOpenEnvelope = document.getElementById("btn-open-envelope");
    const envelope = document.querySelector(".envelope");
    const bgMusic = document.getElementById("bg-music");
    const musicControl = document.getElementById("music-control");
    const btnMusicToggle = document.getElementById("btn-music-toggle");
    const btnSaveDate = document.getElementById("btn-save-date");
    
    // Intentar reducir volumen para que sea agradable
    bgMusic.volume = 0.5;

    // Al hacer clic en el sobre para abrirlo
    if (btnOpenEnvelope) {
        btnOpenEnvelope.addEventListener("click", () => {
            // 1. Iniciar la reproducción de la música de fondo (consintiendo el audio en el navegador)
            bgMusic.play().then(() => {
                btnMusicToggle.classList.add("playing");
            }).catch(err => {
                console.log("Auto-play bloqueado por el navegador o error al reproducir:", err);
            });

            // 2. Añadir la clase 'opened' al sobre para iniciar la rotación de solapa y el efecto zoom-in
            welcomeScreen.classList.add("opened");

            // 3. Mostrar el control de música y disparar efectos visuales un poco después (600ms)
            setTimeout(() => {
                musicControl.classList.remove("hidden");
                startParticles();
                initScrollReveal();
            }, 600);

            // 4. Ocultar físicamente la pantalla del sobre una vez terminada la transición de zoom (2100ms)
            setTimeout(() => {
                welcomeScreen.style.display = "none";
            }, 2100);
        });
    }

    // Control del botón de reproducción/pausa de música
    btnMusicToggle.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            btnMusicToggle.classList.add("playing");
        } else {
            bgMusic.pause();
            btnMusicToggle.classList.remove("playing");
        }
    });

    // Iniciar temporizador
    initCountdown();

    // Evento Añadir al Calendario
    if (btnSaveDate) {
        btnSaveDate.addEventListener("click", () => {
            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.calendar.title)}&dates=${CONFIG.calendar.startUTC}/${CONFIG.calendar.endUTC}&details=${encodeURIComponent(CONFIG.calendar.details)}&location=${encodeURIComponent(CONFIG.calendar.location)}`;
            window.open(url, "_blank");
        });
    }


});

/* ==========================================================================
   TEMPORIZADOR (CUENTA REGRESIVA)
   ========================================================================== */
function initCountdown() {
    const targetDate = new Date(`${CONFIG.eventDate}${CONFIG.timezoneOffset}`).getTime();
    
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const timerEl = document.getElementById("countdown-timer");

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            if (timerEl) {
                timerEl.innerHTML = "<div class='countdown-finished'>¡Llegó el gran día! Te esperamos.</div>";
            }
            return;
        }

        // Cálculos de tiempo
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Renderizar con dos dígitos
        if (daysEl) daysEl.innerText = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, "0");
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, "0");
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, "0");
    };

    // Actualizar de inmediato y luego cada segundo
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}


/* ==========================================================================
   ANIMACIÓN DE PARTÍCULAS (PÉTALOS DE ROSA Y DESTELLOS)
   ========================================================================== */
function startParticles() {
    const container = document.getElementById("particles-container");
    if (!container) return;

    // Función para crear una partícula
    const createParticle = () => {
        const isPetal = Math.random() > 0.4; // 60% pétalos, 40% destellos dorados
        const particle = document.createElement("div");
        
        // Asignar clase de estilo correspondiente
        if (isPetal) {
            particle.className = "petal";
            // Variación de colores para los pétalos (tonos rosas)
            const hue = Math.floor(Math.random() * 20) + 340; // 340-360 en HSL es rosa
            const lightness = Math.floor(Math.random() * 15) + 75; // 75-90% de luminosidad
            particle.style.backgroundColor = `hsl(${hue}, 90%, ${lightness}%)`;
            
            // Tamaño aleatorio para el pétalo
            const size = Math.random() * 12 + 8; // de 8px a 20px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
        } else {
            particle.className = "sparkle";
            // Tamaño aleatorio para el destello
            const size = Math.random() * 6 + 3; // de 3px a 9px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = Math.random() > 0.5 ? "#dfb15b" : "#fff8e3"; // Oro o brillo blanco
        }

        // Posición inicial aleatoria a lo ancho
        particle.style.left = `${Math.random() * 100}%`;
        
        // Duración de caída aleatoria para dar naturalidad
        const duration = Math.random() * 6 + 6; // entre 6 y 12 segundos
        particle.style.animationDuration = `${duration}s`;
        
        // Rotación inicial aleatoria
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;

        container.appendChild(particle);

        // Eliminar del DOM después de que termine la animación para no sobrecargar
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    };

    // Crear un flujo continuo de partículas
    // Spawnea una partícula cada 600ms
    setInterval(createParticle, 600);
}

/* ==========================================================================
   SCROLL REVEAL (REVELADO SUAVE AL HACER SCROLL)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    // Opcional: dejar de observar una vez que ya apareció
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15, // Porcentaje de visibilidad requerido para disparar
            rootMargin: "0px 0px -50px 0px" // Dispara un poco antes de que entre del todo
        });

        revealElements.forEach((el) => {
            observer.observe(el);
        });
    } else {
        // Fallback para navegadores antiguos
        revealElements.forEach((el) => {
            el.classList.add("visible");
        });
    }
}
