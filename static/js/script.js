let preguntas = [];
let indiceActual = 0;
let puntaje = 0;
let tiempoRestante = 10;
let timerInterval = null;

const preguntaDiv = document.getElementById("pregunta");
const opcionesDiv = document.getElementById("opciones");
const resultadoDiv = document.getElementById("resultado");
const contadorDiv = document.getElementById("contador");
const quizContainer = document.getElementById("quiz-container");
const pantallaFinal = document.getElementById("pantalla-final");
const puntuacionFinal = document.getElementById("puntuacion-final");

fetch('/preguntas')
    .then(res => res.json())
    .then(data => {
        preguntas = data;
        mostrarPregunta();
    });

function mostrarPregunta() {
    tiempoRestante = 20;
    resultadoDiv.textContent = "";
    opcionesDiv.innerHTML = "";
    contadorDiv.style.display = "block"; // Asegura que se vea el contador
    contadorDiv.textContent = `Tiempo: ${tiempoRestante}`;

    const actual = preguntas[indiceActual];
    preguntaDiv.textContent = `Pregunta ${indiceActual + 1}: ${actual.pregunta}`;

    const letras = ["A", "B", "C", "D"];

    actual.opciones.forEach((opcion, i) => {
        const btn = document.createElement("button");
        btn.textContent = `${letras[i]}) ${opcion}`;
        btn.dataset.letra = letras[i];
        btn.onclick = seleccionarOpcion;
        opcionesDiv.appendChild(btn);
    });

    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        tiempoRestante--;
        contadorDiv.textContent = `Tiempo: ${tiempoRestante}`;
        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            deshabilitarOpciones();
            // Enviar null porque no hubo respuesta seleccionada
            mostrarResultado(false, null, actual.respuesta_correcta);
            setTimeout(pasarSiguiente, 2500);
        }
    }, 1000);
}

function seleccionarOpcion(event) {
    clearInterval(timerInterval);

    const respuestaSeleccionada = event.target.dataset.letra;
    deshabilitarOpciones();

    fetch('/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: indiceActual, respuesta: respuestaSeleccionada })
    })
    .then(res => res.json())
    .then(data => {
        mostrarResultado(data.correcta, respuestaSeleccionada, data.respuesta_correcta);
        setTimeout(pasarSiguiente, 2500);
    });
}

function deshabilitarOpciones() {
    [...opcionesDiv.children].forEach(btn => btn.disabled = true);
}

function mostrarResultado(correcta, seleccion, correctaLetra = null) {
    [...opcionesDiv.children].forEach(btn => {
        if(correcta && btn.dataset.letra === seleccion) {
            btn.classList.add("correct");
        } else if(!correcta && btn.dataset.letra === seleccion) {
            btn.classList.add("incorrect");
        }
        if(correctaLetra && btn.dataset.letra === correctaLetra) {
            btn.classList.add("correct");
        }
    });

    if(correcta === true) {
        resultadoDiv.textContent = "¡Respuesta correcta!";
        puntaje++;
    } else if(correcta === false && seleccion !== null) {
        resultadoDiv.textContent = `Incorrecto. La respuesta correcta era ${correctaLetra}`;
    } else {
        resultadoDiv.textContent = `Se acabó el tiempo. La respuesta correcta era ${correctaLetra}`;
    }
}

function pasarSiguiente() {
    indiceActual++;
    if (indiceActual < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultadoFinal();
    }
}

function mostrarResultadoFinal() {
    quizContainer.style.display = "none";
    pantallaFinal.classList.remove("pantalla-oculta");

    const imgURL = "https://www.metro951.com/wp-content/uploads/2017/02/meme.png";

    const gifGameOver = document.getElementById("gif-gameover");
    gifGameOver.src = imgURL;
    gifGameOver.style.display = "block";

    puntuacionFinal.textContent = `Tu puntuación final es: ${puntaje} de ${preguntas.length}`;
    contadorDiv.style.display = "none";
}


document.getElementById("btnReiniciar").onclick = () => {
    indiceActual = 0;
    puntaje = 0;
    pantallaFinal.classList.add("pantalla-oculta");
    quizContainer.style.display = "block";
    mostrarPregunta();
};

