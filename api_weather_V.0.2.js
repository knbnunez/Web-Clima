// const imprimir = require('imprimir.js');




function imprimirCard1(diaHoraActual, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento) {
    precipitacionActualIconoID.innerHTML = `<img src="${precipitacionFormatted[0]}">`;
    temperaturaAmbienteActualID.innerHTML = `<h3>${temperaturaAmbiente} °C</h3>`;
    precipitacionActualTextoID.innerHTML = `<h4>${precipitacionFormatted[1]}</h4>`;
    diaHoraActualID.innerHTML = `${diaHoraActual}`;
    // 
    sensacionTermicaActualID = `<h3>${sensacionTermica} °C</h3>`;
    //
    velocidadVientoActualID = `<h3>${velocidadViento} Km/h</h3>`;
}























let fechaOrigen = new Date();
fechaActual = moment(fechaOrigen).format('YYYY-MM-DD\THH:00');
//
let diaActual = moment(fechaOrigen).format('MM-DD');
let horaActual = moment(fechaOrigen).format('HH:mm');
let diaHoraActual = moment(fechaOrigen).format('YYYY-MM-DD HH:mm');
console.log(diaHoraActual);

const apiWeather = 'https://api.open-meteo.com/v1/forecast?latitude=-54.82&longitude=-68.36&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m&timezone=America%2FSao_Paulo';

// Datos sin procesar
fetch(apiWeather)
    .then(response => response.json())
    .then(json => {
        console.log(json);
    });


function formatearPrecipitacion(precipitacion) {
    if (precipitacion == 0) return ["sources/despejado.png", "despejado"];
    else if (precipitacion < 2) return ["sources/lluvias-debiles.png", "lluvias débiles"];
    else if (precipitacion <= 15) return ["sources/lluvia.png", "lluvia"];
    else if (precipitacion <= 30) return ["sources/lluvias-fuertes.png", "lluvias fuertes"]; 
    else if (precipitacion <= 60) return ["sources/lluvias-muy-fuertes.png", "lluvias muy fuertes"];
    else return ["sources/lluvias-torrenciales.png", "lluvias torrenciales"];
}

function mismoDia(fecha) {
    let dia = moment(fecha).format('MM-DD');
    return (dia == diaActual? true: false);
}

function consultaAPI() {
    fetch(apiWeather)
    .then(response => response.json()) 
    .then(clima => {
        let posteriores = [];
        // Imprimir actuales
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
                if (fecha == fechaActual) imprimirCard1(diaHoraActual, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento);
                else if (mismoDia(fecha) == true) {}//climaHorasPosteriores.innerHTML += imprimir(idx, fechaFormatted, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento);
                else {
                    diaPosterior = {
                        time: clima.hourly.time[idx],
                        temperature_2m: clima.hourly.temperature_2m[idx],
                        apparent_temperature: clima.hourly.apparent_temperature[idx],
                        precipitation: clima.hourly.precipitation[idx],
                        windspeed_10m: clima.hourly.windspeed_10m[idx]
                    }
                    posteriores.push(diaPosterior);
                }
            }
        }) 

        // Imprimir posteriores
        for (let i = 0; i < 6; i++) {
            let fecha = "";
            let avgTemperaturaAmbiente = new Number();
            let avgSensacionTermica = new Number();
            let avgPrecipitacion = new Number();
            let avgVelocidadViento = new Number();
            for (let j = 0; j < 24; j++) {
                let dataHora = posteriores.shift();
                avgTemperaturaAmbiente += dataHora.temperature_2m;
                avgSensacionTermica += dataHora.apparent_temperature;
                avgPrecipitacion += dataHora.precipitation;
                avgVelocidadViento += dataHora.windspeed_10m;
                if (j == 23) {
                    var dia = moment(dataHora.time).format('MM-DD');
                    avgTemperaturaAmbiente = (avgTemperaturaAmbiente/24).toFixed(2);
                    avgSensacionTermica =  (avgSensacionTermica/24).toFixed(2);
                    avgPrecipitacion =  (avgPrecipitacion/24).toFixed(2);
                    avgVelocidadViento =  (avgVelocidadViento/24).toFixed(2);
                }
            }
            // climaDiasPosteriores.innerHTML += imprimir(i, dia, avgTemperaturaAmbiente, avgSensacionTermica, avgPrecipitacion, avgVelocidadViento);    
        }
        
    });
}


// Llamado a funciones
consultaAPI();