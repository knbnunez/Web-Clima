// const moment = require("moment/moment");

const apiWeather = 'https://api.open-meteo.com/v1/forecast?latitude=-54.82&longitude=-68.36&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m&timezone=America%2FSao_Paulo';

//
fetch(apiWeather)
    .then(response => response.json())
    .then(json => {
        console.log('Data original: '+json);
    });


function listado(idx, hora, temp, precip) {
    let fila = `
        <tr class="filaTabla">              <!-- Puedo agregarle CSS a ésta clase de acá -->
            <th scope="row">${idx}</th>
            <td>${hora}</td>
            <td>${temp}</td>
            <td>${precip}</td>
        </tr>
    `;
    return fila;
}

// Obtiene la hora actual. 
// Formatea al mismo formato fecha de la API
// Filtra la hora de la API que coincida con la hora actual
// Muestra la data referente a la hora actual
var fechaActual = new Date();
fechaActual = moment(fechaActual).format('YYYY-MM-DD\THH:00');
// console.log(fechaActual);

function imprimirActual() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => {
        let fechaActualAPI = clima.hourly.time.filter(fechaActualAPI => fechaActualAPI == fechaActual);
        console.log(fechaActualAPI);
        let horaActual = moment(fechaActualAPI).format('MM-DD HH:mm');
        console.log(horaActual);
        let tempActual = clima.hourly.apparent_temperature.shift();
        let precipActual = clima.hourly.precipitation.shift();
        // console.log(horaActual, tempActual, precipActual);
        climaActual.innerHTML += listado(0, horaActual, tempActual, precipActual);
    });
}


// Imprime solo los datos posteriores a la hora y fecha actual
function imprimirPosteriores() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => { 
        clima.hourly.time.forEach((dato, idx) => {
            if (clima.hourly.time[idx] > fechaActual) {
                let horaPost = clima.hourly.time.shift();
                horaPost = moment(horaPost).format('MM-DD HH:mm');
                let tempPost = clima.hourly.apparent_temperature.shift();
                let precipPost = clima.hourly.precipitation.shift();
                // console.log(idx, horaPost, tempPost, precipPost);
                climasPosteriores.innerHTML += listado(idx, horaPost, tempPost, precipPost); 
            }
        });
    });
}



/////////////////////////////////////////////
// Todo junto

function recorrerAPI() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => {
        let fechaActualAPI = clima.hourly.time.filter(fechaActualAPI => fechaActualAPI == fechaActual);
        console.log(fechaActualAPI);
        let horaActual = moment(fechaActualAPI).format('MM-DD HH:mm');
        console.log(horaActual);
        let tempActual = clima.hourly.apparent_temperature.shift();
        let precipActual = clima.hourly.precipitation.shift();
        // console.log(horaActual, tempActual, precipActual);
        climaActual.innerHTML += listado(0, horaActual, tempActual, precipActual);
    });
}



// Llamado a funciones
imprimirActual();
imprimirPosteriores();