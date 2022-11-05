const apiWeather = 'https://api.open-meteo.com/v1/forecast?latitude=-54.82&longitude=-68.36&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m&timezone=America%2FSao_Paulo';

// Datos sin procesar
fetch(apiWeather)
    .then(response => response.json())
    .then(json => {
        console.log(json);
    });

function imprimir(idx, fecha, temperaturaAmbiente, sensacionTermica, precipitacion, velocidadViento) {
    let fila = `
        <!-- Podemos agregarle CSS -->
        <tr class="filaTabla">          
            <th scope="row">${idx}      </th>
            <td>${fecha}                </td>
            <td>${temperaturaAmbiente}  </td>
            <td>${sensacionTermica}     </td>
            <td>${precipitacion}        </td>
            <td>${velocidadViento}      </td>
        </tr>
    `;
    return fila;
}

function formatearPrecipitacion(precipitacion) {
    if (precipitacion == 0) return "despejado";
    else if (precipitacion < 2) return "lluvias débiles";
    else if (precipitacion <= 15) return "lluvia";
    else if (precipitacion <= 30) return "lluvias fuertes"; 
    else if (precipitacion <= 60) return "lluvias muy fuertes";
    else return "lluvias torrenciales";
    // + Ícono de referencia
}

// function obtenerFechaActual() {
    let fechaOrigen = new Date();
    fechaActual = moment(fechaOrigen).format('YYYY-MM-DD\THH:00');
    //
    let diaActual = moment(fechaOrigen).format('MM-DD');
    let horaActual = moment(fechaOrigen).format('HH:mm');

//     let horasDiaActual = [];
//     horasDiaActual.forEach(data => {
//         if ()
//         horasDiaActual.push(moment(fechaActual).format('MM-DD HH:mm'));
//     }) 
    
// }
    

function mismoDia(fecha) {
    let dia = moment(fecha).format('MM-DD');
    // if (dia == diaActual) return 1
    // else return -1;
    return (dia == diaActual? true: false);
}

function posteriores() {
    
    return posteriores;
}

function consultaAPI() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => {
        clima.hourly.time.forEach((fecha, idx) => {
            if (clima.hourly.time[idx] >= fechaActual) {
                // Obtener los datos útiles de la consulta
                // let fecha = clima.hourly.time[idx];
                let temperaturaAmbiente = clima.hourly.temperature_2m[idx];
                let sensacionTermica = clima.hourly.apparent_temperature[idx];
                let precipitacion = clima.hourly.precipitation[idx];
                let velocidadViento = clima.hourly.windspeed_10m[idx];
                
                // Formatearlos para la vista
                let fechaFormatted = moment(fecha).format('MM-DD HH:mm');
                let precipitacionFormatted = formatearPrecipitacion(precipitacion);

                // Impresión de resutlados
                if (fecha == fechaActual) climaActual.innerHTML += imprimir(0, horaActual, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento);
                else if (mismoDia(fecha) == true) climaHorasPosteriores.innerHTML += imprimir(idx, fechaFormatted, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento);
                else if (/* Es una fecha posterior, imprimir una sola vez el promedio de valores del clima */) {
                    // let climaPosterior = Posteriores();
                    climaDiasPosteriores.innerHTML += imprimir(idx, climaPosterior[0], climaPosterior[1], climaPosterior[2], climaPosterior[3], climaPosterior[4]);    
                }
            }
        }) 
    });
}


// Llamado a funciones
consultaAPI();