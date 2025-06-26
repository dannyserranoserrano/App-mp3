const tituloCancion = document.querySelector('.reproductor-musica h1');
const nombreArtista = document.querySelector('.reproductor-musica p');
const listaReproduccion = document.getElementById('listaReproduccion');
const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const iconoControl = document.getElementById('iconoControl');
const botonReproducirPausar = document.getElementById('botonReproducirPausar');
const botonAtras = document.querySelector('.controles .atras');
const botonSiguiente = document.querySelector('.controles .siguiente');
const botonLimpiar = document.getElementById('limpiar');


let indiceCancionActual = 0;
// Carga de canciones
const inputMp3 = document.getElementById('inputMp3');
let canciones = [];


// Inicializar la lista de reproducción con canciones predeterminadas
function actualizarInfoCancion() {
    tituloCancion.textContent = canciones[indiceCancionActual].titulo ? canciones[indiceCancionActual]?.titulo : 'Sin título';
    nombreArtista.textContent = canciones[indiceCancionActual]?.nombre;
    cancion.src = canciones[indiceCancionActual]?.fuente;
    cancion.addEventListener('loadeddata', function () { });
};

// Actualizar la lista de reproducción en el DOM
function actualizarListaReproduccion() {
    listaReproduccion.innerHTML = '';
    canciones.forEach((cancionObj, index) => {
        const li = document.createElement('li');
        li.classList.add('item-cancion');
        //Nombre de la cancion
        const spanNombre = document.createElement('span');
        spanNombre.className = 'nombre-cancion';
        spanNombre.textContent = cancionObj.titulo;
        spanNombre.addEventListener('click', () => {
            indiceCancionActual = index;
            actualizarInfoCancion();
            reproducirCancion();
        });

        // Crear icono de eliminar (puedes usar una X o un icono de fontawesome/Bootstrap)
        const btnEliminar = document.createElement('span');
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>`


        btnEliminar.addEventListener('click', (e) => {
            e.stopPropagation();
            canciones.splice(index, 1);
            pausarCancion()
            // Elimina la canción del array
            // Si la canción eliminada es la actual, ajusta el índice
            if (indiceCancionActual >= canciones.length) {
                indiceCancionActual = canciones.length - 1;
            }
            actualizarListaReproduccion();
            actualizarInfoCancion();
            inputMp3.value = ''; // Resetea el input file
        });
        li.appendChild(spanNombre);
        li.appendChild(btnEliminar);
        listaReproduccion.appendChild(li);
    });
}

// Función para reproducir o pausar la canción actual. Actualizar el estado del boton play/pause
function reproducirPausar() {

    if (canciones.length === 0) {
        return; // No hacer nada si no hay canciones
    }
    if (cancion.paused) {
        reproducirCancion();

    } else {
        pausarCancion();
    }
};

// Funciones para reproducir y pausar la canción
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

// Evento para cargar las canciones desde el input
inputMp3.addEventListener('change', async function (e) {
    const files = Array.from(e.target.files);
    //canciones = [];

    for (const file of files) {
        let titulo = file.name //.replace(/\.[^/.]+$/, ""); // Quitar la extensión del nombre del archivo
        let nombre = 'Desconocido';
        try {
            const metadata = await musicMetadata.parseBlob(file);
            if (metadata.common.title) { titulo = metadata.common.title }
            if (metadata.common.artist) { nombre = metadata.common.artist }
        } catch (error) {
            // Si falla la lectura de metadatos, se usan los valores por defecto
            console.warn(`No se pudieron leer metadatos de ${file.name}`);
        }

        canciones.push({
            titulo: titulo,
            nombre: nombre,
            fuente: URL.createObjectURL(file)
        });

    }
    indiceCancionActual = 0; // Reiniciar al primer elemento
    actualizarListaReproduccion();
    actualizarInfoCancion();
});

// Eventos para los botones de la lista de reproducción
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
botonReproducirPausar.addEventListener('click', reproducirPausar);
botonLimpiar.addEventListener('click', () => {
    pausarCancion(); // Asegura que la canción esté en pausa
    canciones = []; // Vacía el array
    listaReproduccion.innerHTML = ''; // Limpia la lista en el DOM
    cancion.src = ''; // Detiene la reproducción
    tituloCancion.textContent = '';
    nombreArtista.textContent = '';
    progreso.value = 0;
    inputMp3.value = ''; // Resetea el input file
    indiceCancionActual = 0; // Reinicia el índice de la canción actual

});

// Actualizar la barra de progreso mientras se reproduce la canción
cancion.addEventListener('timeupdate', function () {
    if (!cancion.paused) {
        progreso.value = cancion.currentTime;
    }
});

// Actualizar el máximo de la barra de progreso al cargar los metadatos de la canción
cancion.addEventListener('loadedmetadata', () => {
    progreso.max = cancion.duration;
    progreso.value = cancion.currentTime;
});

// Avanzar la canción al mover la barra de progreso
progreso.addEventListener('input', function () {
    cancion.currentTime = progreso.value;
});

// Inicio de cancion al desplazar la barra de progreso
// progreso.addEventListener('change', function () {
//     reproducirCancion();
// });

actualizarInfoCancion();

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
