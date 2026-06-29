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
    const btnEnter = document.getElementById("btn-enter");
    const bgMusic = document.getElementById("bg-music");
    const musicControl = document.getElementById("music-control");
    const btnMusicToggle = document.getElementById("btn-music-toggle");
    const btnSaveDate = document.getElementById("btn-save-date");
    const btnRSVP = document.getElementById("btn-rsvp");
    
    // Intentar reducir volumen para que sea agradable
    bgMusic.volume = 0.5;

    // Al presionar el botón "Abrir Invitación"
    btnEnter.addEventListener("click", () => {
        // 1. Reproducir música de fondo
        bgMusic.play().then(() => {
            btnMusicToggle.classList.add("playing");
        }).catch(err => {
            console.log("Auto-play bloqueado por el navegador o error al reproducir:", err);
        });

        // 2. Ocultar la pantalla de bienvenida con desvanecimiento
        welcomeScreen.classList.add("fade-out");
        
        // 3. Mostrar el botón flotante de música
        musicControl.classList.remove("hidden");
        
        // 4. Iniciar la generación de partículas en segundo plano
        startParticles();
        
        // 5. Iniciar la lógica de Scroll Reveal
        initScrollReveal();

        // Limpiar el DOM después de terminar la animación de desvanecimiento
        setTimeout(() => {
            welcomeScreen.style.display = "none";
        }, 800);
    });

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

    // Evento RSVP por WhatsApp
    if (btnRSVP) {
        btnRSVP.addEventListener("click", () => {
            const guestName = document.getElementById("guest-name").value.trim();
            const guestCount = document.getElementById("guest-count").value;

            if (!guestName) {
                alert("Por favor, introduce tu nombre para confirmar.");
                document.getElementById("guest-name").focus();
                return;
            }

            // Crear el mensaje personalizado
            const message = `¡Hola! Confirmo mi asistencia al Baby Shower de *Sofía Alejandra*.\n\n` + 
                            `👤 *Nombre:* ${guestName}\n` + 
                            `👥 *Personas:* ${guestCount} ${guestCount === "1" ? "persona" : "personas"}\n\n` + 
                            `¡Nos vemos el 11 de Julio!`;

            // Generar enlace API de WhatsApp
            const whatsappURL = `https://api.whatsapp.com/send?phone=${CONFIG.rsvpPhone}&text=${encodeURIComponent(message)}`;
            
            // Abrir en nueva pestaña
            window.open(whatsappURL, "_blank");
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
