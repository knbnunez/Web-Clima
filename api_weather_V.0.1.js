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

function formatearPrecipitacion(precipConsulta) {
    if (precipConsulta < 2) return "lluvias débiles";
    else if (precipConsulta <= 15) return "lluvia";
    else if (precipConsulta <= 30) return "lluvias fuertes"; 
    else if (precipConsulta <= 60) return "lluvias muy fuertes";
    else return "lluvias torrenciales";
}


var fechaActual = new Date();
fechaActual = moment(fechaActual).format('YYYY-MM-DD\THH:00');

function recorrerAPI() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => {
        clima.hourly.time.forEach((dato, idx) => {
            if (clima.hourly.time[idx] >= fechaActual) {
                // Obtener los datos útiles de la consulta
                let fechaConsulta = clima.hourly.time[idx];
                // Esta es la sesación térmica
                let sensacionTConsulta = clima.hourly.apparent_temperature[idx];
                let precipConsulta = clima.hourly.precipitation[idx];
                // Falta velocidad del viento
                let velovidadVConsulta = clima.hourly.windspeed_10m[idx];
                // Falta la temperatura ambiente
                let temperaturaAConsulta = clima.hourly.temperature_2m[idx];

                // Formatearlos para la vista
                fechaConsulta = moment(fechaConsulta).format('MM-DD HH:mm');
                precipitacion = formatearPrecipitacion(precipConsulta);

                // 1° caso
                if (clima.hourly.time[idx] == fechaActual) {
                    // Formateo
                    let fechaActual = new Date();
                    let horaActual = moment(fechaActual).format('HH:mm');
                    
                    // Impresion
                    climaActual.innerHTML += imprimir(0, horaActual, tempConsulta, precipitacion);
                }
                else climasPosteriores.innerHTML += imprimir(idx, fechaConsulta, tempConsulta, precipitacion);
            }
        }) 
    });
}


// Llamado a funciones
recorrerAPI();