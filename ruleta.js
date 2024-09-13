const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
const boton = document.getElementById('boton-girar');
const cuponGanadorDiv = document.getElementById('cupon-ganador');

// Premios (cupones)
const premios = ['Cupón 10%', 'Cupón 20%', 'Cupón 30%', 'Cupón 50%', 'Cupón 5%', 'Cupón 15%', 'Cupón 25%', 'Cupón 35%'];
const codigosCupones = ['RULETA10', 'RULETA20', 'RULETA30', 'RULETA50', 'RULETA5', 'RULETA15', 'RULETA25', 'RULETA35'];
const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#8C1EFF', '#FF3D68', '#FFB86F', '#FFD700'];

let anguloActual = 0;
let girando = false;
let contadorGiros = 0;  // Contador para el número de giros
const maxGiros = 1;     // Límite de giros permitidos

const anguloPorSeccion = (2 * Math.PI) / premios.length;

// Dibujar la ruleta
function dibujarRuleta() {
    const radio = canvas.width / 2;

    for (let i = 0; i < premios.length; i++) {
        const anguloInicio = anguloActual + i * anguloPorSeccion;
        ctx.beginPath();
        ctx.moveTo(radio, radio);
        ctx.arc(radio, radio, radio, anguloInicio, anguloInicio + anguloPorSeccion);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.save();

        // Dibujar el texto del premio
        ctx.translate(radio, radio);
        ctx.rotate(anguloInicio + anguloPorSeccion / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = 'bold 16px Arial';
        ctx.fillText(premios[i], radio - 10, 10);
        ctx.restore();
    }

    // Dibujar marcador en la derecha (90 grados)
    ctx.beginPath();
    ctx.moveTo(canvas.width, radio - 10);  
    ctx.lineTo(canvas.width, radio + 10);
    ctx.lineTo(canvas.width - 30, radio);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
}

// Función para girar la ruleta
function girarRuleta() {
    if (girando) return;

    if (contadorGiros >= maxGiros) {
        cuponGanadorDiv.innerHTML = '¡Has alcanzado el límite de giros permitidos!';
        return;
    }

    girando = true;
    cuponGanadorDiv.innerHTML = ''; // Limpiar el contenido del cupón anterior
    const tiempoGiro = Math.random() * 5000 + 3000; // De 3 a 8 segundos
    let velocidadActual = Math.random() * 0.05 + 0.1; // Velocidad inicial aleatoria

    const animacion = setInterval(() => {
        anguloActual += velocidadActual; // Actualizar ángulo de giro
        velocidadActual *= 0.98; // Desaceleración

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        dibujarRuleta();

        // Detener la ruleta si la velocidad es muy baja
        if (velocidadActual <= 0.001) {
            clearInterval(animacion);
            girando = false;
            contadorGiros++;  // Incrementar el contador de giros

            // Ajustar el ángulo para alinearlo con la flecha en la derecha
            const anguloGanador = anguloActual % (2 * Math.PI); // El ángulo en el que se detiene
            const seccionGanadora = Math.floor((premios.length + (2 * Math.PI - anguloGanador) / (2 * Math.PI)) * premios.length) % premios.length;

            // Mostrar el cupón ganador debajo de la ruleta
            cuponGanadorDiv.innerHTML = '¡Has ganado el cupón: ' + codigosCupones[seccionGanadora] + '!';

            // Si alcanzamos el límite de giros, deshabilitar el botón
            if (contadorGiros >= maxGiros) {
                boton.disabled = true;
                cuponGanadorDiv.innerHTML += ' ¡Ya no puedes girar más la ruleta!';
            }
        }
    }, 16); // 16 ms para un movimiento fluido (aprox. 60 FPS)
}

// Dibujar ruleta inicialmente
dibujarRuleta();

// Agregar evento al botón de girar
boton.addEventListener('click', girarRuleta);
