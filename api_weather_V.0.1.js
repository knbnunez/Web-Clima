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
    // return fila;
}

// Obtiene la hora actual. 
// Formatea al mismo formato fecha de la API
// Filtra la hora de la API que coincida con la hora actual
// Muestra la data referente a la hora actual
function imprimirActual() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => {
        var fechaActual = new Date();
        fechaActual = moment(fechaActual).format('YYYY-MM-DD\THH:mm');
        // console.log(fechaActual);
        let horaActual = clima.hourly.time.filter(fechaActualAPI => fechaActualAPI == fechaActual);
        horaActual = moment(horaActual).format('HH:mm');
        let tempActual = clima.hourly.apparent_temperature.shift();
        let precipActual = clima.hourly.precipitation.shift();
        climaActual.innerHTML += listado(0, horaActual, tempActual, precipActual);
    });
}

// Imprime solo los datos posteriores a la hora y fecha actual
function imprimirPosteriores() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => { 
        clima.hourly.time.forEach((dato, idx) => {
            if (clima.hourly.time > fechaActual) {
                let horaPost = clima.hourly.time.shift();
                let tempPost = clima.hourly.apparent_temperature.shift();
                let precipPost = clima.hourly.precipitation.shift();
                climasPosteriores.innerHTML += listado(idx, horaPost, tempPost, precipPost); 
            }
        });
    });
}

// Llamado a funciones
imprimirActual();
imprimirPosteriores();