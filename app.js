const tituloCancion = document.querySelector('.reproductor-musica h1');
console.log(tituloCancion);
const nombreArtista = document.querySelector('.reproductor-musica p');
console.log(nombreArtista);

const progreso = document.getElementById('progreso');
console.log(progreso)
const cancion = document.getElementById('cancion');
console.log(cancion);

const iconoControl = document.getElementById('iconoControl');
console.log(iconoControl);
const botonReproducirPausar = document.getElementById('botonReproducirPausar');
console.log(botonReproducirPausar);

const botonAtras = document.querySelector('.controles button .atras');
const botonsiguiente = document.querySelector('.controles button .siguiente');

const canciones = [
    {
        titulo: "Cinematic Background Inspirational",
        nombre: "MUSICA DE FONDO INSPIRADORA CINEMÁTICA",
        fuente: "music/cinematic.mp3",
    },
    {
        titulo: "Cold Sad Pianos",
        nombre: "PIANOS TRISTES Y FRÍOS",
        fuente: "music/cold-sad-pianos.mp3",
    },
    {
        titulo: "Emotional Inspiring Piano & Violin",
        nombre: "PIANO Y VIOLÍN INSPIRADORES Y EMOCIONALES",
        fuente: "music/emotional.mp3",
    },
    {
        titulo: "Uplifting Fairy Tale",
        nombre: "CUENTO DE HADAS INSPIRADOR",
        fuente: "music/uplifting.mp3",
    },
    {
        titulo: "Dramatic Epic Cinema",
        nombre: "CINE ÉPICO DRAMÁTICO",
        fuente: "music/dramatic.mp3",
    }
];

let indiceCancionActual = 0;

function actualizarInfoCancion() {
    tituloCancion.textContent = canciones[indiceCancionActual].titulo;
    console.log(tituloCancion.textContent);
    nombreArtista.textContent = canciones[indiceCancionActual].nombre;
    console.log(nombreArtista.textContent);
    cancion.src = canciones[indiceCancionActual].fuente;
    console.log(cancion.src);
    cancion.addEventListener('loadeddata', function () { });
};

botonReproducirPausar.addEventListener('click', reproducirPausar);

function reproducirPausar() {

    if (cancion.paused) {
        reproducirCancion();
        iconoControl.classList.add('bi-pause-fill')
        iconoControl.classList.remove('bi-play-fill')

    } else {
        pausarCancion();
        iconoControl.classList.remove('bi-pause-fill')
        iconoControl.classList.add('bi-play-fill')
    }
};

function reproducirCancion() {
    cancion.play();

};

function pausarCancion() {
    cancion.pause();
}

actualizarInfoCancion();