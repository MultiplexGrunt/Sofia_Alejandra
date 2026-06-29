# Invitación Digital: Baby Shower - Sofía Alejandra

Esta es una invitación web digital interactiva, moderna y premium diseñada específicamente para dispositivos móviles. Está optimizada para ser compartida fácilmente y visualizarse de forma óptima en teléfonos inteligentes.

## Características principales

- **Pantalla de Bienvenida:** Botón interactivo para abrir la invitación que habilita la música de fondo instrumental, esquivando el bloqueo de autoplay de los navegadores móviles.
- **Música de Fondo:** Botón flotante para pausar/reproducir la melodía (*Gymnopédie No. 1* de Erik Satie).
- **Efectos Visuales:** Pétalos de rosa flotantes y destellos en el fondo generados de forma dinámica y efímera (cuidado de rendimiento de memoria).
- **Cuenta Regresiva:** Contador en tiempo real hacia la fecha del evento (Sábado 11 de Julio de 2026 a las 16:00 hrs).
- **Calendario:** Botón integrado para añadir el evento directamente a Google Calendar.
- **Ubicación:** Botones interactivos con enlaces directos a Google Maps y Waze para llegar a la *Quinta San Judas Tadeo*.
- **Mesa de Regalos:** Información y enlaces rápidos para regalos de Liverpool, Amazon y Lluvia de Sobres.
- **Confirmación por WhatsApp (RSVP):** Formulario donde el invitado ingresa su nombre y cantidad de acompañantes, redactando un mensaje predefinido automático al enviar.

## Personalización

Los valores de la invitación se pueden configurar en el archivo `script.js` dentro del objeto `CONFIG` al inicio del archivo:

```javascript
const CONFIG = {
    eventDate: "2026-07-11T16:00:00", // Fecha del evento (AAAA-MM-DDTHH:MM:SS)
    timezoneOffset: "-06:00",        // Huso horario local (ej. -06:00)
    rsvpPhone: "521234567890",       // Teléfono de confirmación (WhatsApp)
    // ...
};
```

## Despliegue en Vercel

Este es un proyecto web estático puro (HTML, CSS, JS). Para desplegarlo en Vercel:

1. Importa este repositorio en tu cuenta de Vercel.
2. Selecciona la configuración por defecto para proyectos estáticos (no requiere comandos de compilación ni configuración especial).
3. ¡Listo! Vercel te dará un enlace público que podrás compartir con tus invitados.
