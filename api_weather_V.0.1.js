const apiWeather = 'https://api.open-meteo.com/v1/forecast?latitude=-54.82&longitude=-68.36&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m&timezone=America%2FSao_Paulo';

// Datos sin procesar
fetch(apiWeather)
    .then(response => response.json())
    .then(json => {
        console.log(json);
    });

function imprimir(idx, hora, temp, precip) {
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

var fechaActual = new Date();
fechaActual = moment(fechaActual).format('YYYY-MM-DD\THH:00');

function recorrerAPI() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => {
        clima.hourly.time.forEach((dato, idx) => {
            if (clima.hourly.time[idx] >= fechaActual) {
                    let fechaActualAPI = clima.hourly.time[idx];
                    // let horaActual = moment(fechaActualAPI).format('MM-DD HH:mm');
                    let tempActualAPI = clima.hourly.apparent_temperature[idx];
                    let precipActualAPI = clima.hourly.precipitation[idx];
                // 1° caso
                if (clima.hourly.time[idx] == fechaActual) climaActual.innerHTML += imprimir(0, fechaActualAPI, tempActualAPI, precipActualAPI);
                else climasPosteriores.innerHTML += imprimir(0, fechaActualAPI, tempActualAPI, precipActualAPI);
            }
        }) 
    });
}



// Llamado a funciones
recorrerAPI();