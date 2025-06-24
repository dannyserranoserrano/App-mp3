const tituloCancion = document.querySelector('.reproductor-musica h1');
const nombreArtista = document.querySelector('.reproductor-musica p');
const listaReproduccion = document.getElementById('listaReproduccion');
const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const iconoControl = document.getElementById('iconoControl');
const botonReproducirPausar = document.getElementById('botonReproducirPausar');
const botonAtras = document.querySelector('.controles .atras');
const botonSiguiente = document.querySelector('.controles .siguiente');
const botonLimpiar = document.getElementById('.controles #limpiar');


let indiceCancionActual = 0;
// Carga de canciones
const inputMp3 = document.getElementById('inputMp3');
let canciones = [];

inputMp3.addEventListener('change', async function (e) {
    const files = Array.from(e.target.files);
    canciones = [];

    for (const file of files) {
        let titulo = file.name;
        let nombre = 'Desconocido';
        try {
            const metadata = await musicMetadata.parseBlob(file);
            if (metadata.common.title) titulo = metadata.common.title;
            if (metadata.common.artist) nombre = metadata.common.artist;
        } catch (error) {
            // Si falla la lectura de metadatos, se usan los valores por defecto
            console.warn(`El archivo ${file.name} no contiene metadatos válidos o no se pudo leer.`);
        }
        canciones.push({
            titulo: titulo,
            nombre: nombre,
            fuente: URL.createObjectURL(file)
        });

        // Añadir el título a la lista de reproducción
        const li = document.createElement('li');
        li.textContent = titulo;
        listaReproduccion.appendChild(li);
    }
    indiceCancionActual = 0; // Reiniciar al primer elemento
    actualizarInfoCancion();
});

function actualizarInfoCancion() {
    tituloCancion.textContent = canciones[indiceCancionActual]?.titulo;
    console.log(tituloCancion.textContent);
    nombreArtista.textContent = canciones[indiceCancionActual]?.nombre;
    console.log(nombreArtista.textContent);
    cancion.src = canciones[indiceCancionActual]?.fuente;
    console.log(cancion.src);
    cancion.addEventListener('loadeddata', function () { });
};

botonReproducirPausar.addEventListener('click', reproducirPausar);
// botonAtras.addEventListener('click', atrasCancion);
// botonSiguiente.addEventListener('click', siguienteCancion);

cancion.addEventListener('loadedmetadata', () => {
    progreso.max = cancion.duration;
    progreso.value = cancion.currentTime;
})

function reproducirPausar() {

    if (cancion.paused) {
        reproducirCancion();

    } else {
        pausarCancion();
    }
};

function reproducirCancion() {
    cancion.play();
    iconoControl.classList.add('bi-pause-fill')
    iconoControl.classList.remove('bi-play-fill')

};

function pausarCancion() {
    cancion.pause();
    iconoControl.classList.remove('bi-pause-fill')
    iconoControl.classList.add('bi-play-fill')
}

// function atrasCancion() {
//     if (indiceCancionActual > 0) {
//         indiceCancionActual--;
//     } else {
//         indiceCancionActual = canciones.length - 1;
//     }
//     actualizarInfoCancion();
//     iconoControl.classList.add('bi-play-fill')
// };

// function siguienteCancion() {
//     if (indiceCancionActual < canciones.length - 1) {
//         indiceCancionActual++;
//     } else {
//         indiceCancionActual = 0;
//     }
//     actualizarInfoCancion();
//     iconoControl.classList.add('bi-play-fill')
// };
botonSiguiente.addEventListener('click', () => {
    indiceCancionActual = (indiceCancionActual + 1) % canciones.length;
    actualizarInfoCancion();
    reproducirCancion();
});

botonAtras.addEventListener('click', () => {
    indiceCancionActual = (indiceCancionActual - 1 + canciones.length) % canciones.length;
    actualizarInfoCancion();
    reproducirCancion();
});

botonLimpiar.addEventListener('click', () => {
    listaReproduccion.innerHTML = ''; // Limpiar la lista de reproducción
});

// Movimiento de la barra de progreso al reproducir la cancion
cancion.addEventListener('timeupdate', function () {
    if (!cancion.paused) {
        progreso.value = cancion.currentTime;
    }
});

// Avanzar la canción al mover la barra de progreso
progreso.addEventListener('input', function () {
    cancion.currentTime = progreso.value;
});


// Inicio de cancion al desplazar la barra de progreso
// progreso.addEventListener('change', function () {
//     reproducirCancion();
// });



// const canciones = [
// {
//     titulo: "Cinematic Background Inspirational",
//     nombre: "MUSICA DE FONDO INSPIRADORA CINEMÁTICA",
//     fuente: "music/cinematic.mp3",
// },
// {
//     titulo: "Cold Sad Pianos",
//     nombre: "PIANOS TRISTES Y FRÍOS",
//     fuente: "music/cold-sad-pianos.mp3",
// },
// {
//     titulo: "Emotional Inspiring Piano & Violin",
//     nombre: "PIANO Y VIOLÍN INSPIRADORES Y EMOCIONALES",
//     fuente: "music/emotional.mp3",
// },
// {
//     titulo: "Uplifting Fairy Tale",
//     nombre: "CUENTO DE HADAS INSPIRADOR",
//     fuente: "music/uplifting.mp3",
// },
// {
//     titulo: "Dramatic Epic Cinema",
//     nombre: "CINE ÉPICO DRAMÁTICO",
//     fuente: "music/dramatic.mp3",
//     }
// ];
actualizarInfoCancion();