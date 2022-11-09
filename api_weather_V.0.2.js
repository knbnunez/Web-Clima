// const imprimir = require('imprimir.js');




function imprimirCards(diaHoraActual, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento) {
    precipitacionActualIconoID.innerHTML = `<img src="${precipitacionFormatted[0]}">`;
    temperaturaAmbienteActualID.innerHTML = `<h3>${temperaturaAmbiente} °C</h3>`;
    precipitacionActualTextoID.innerHTML = `<h4>${precipitacionFormatted[1]}</h4>`;
    diaHoraActualID.innerHTML = `${diaHoraActual}`;
    // 
    sensacionTermicaActualID.innerHTML = `<h4>${sensacionTermica} °C</h4>`;
    //
    velocidadVientoActualID.innerHTML = `<h4>${velocidadViento} Km/h</h4>`;
}

function imprimirTabla(fechaFormatted, precipitacionFormatted, temperaturaAmbiente, sensacionTermica, velocidadViento) {
    console.log('Entré a imripmir tabla');
    tabla.innerHTML += `
        <tr> 
            <td><h6>${fechaFormatted}</h6><td>
            <td><img src="${precipitacionFormatted[0]}" style=""><td>
            <td><h6>${temperaturaAmbiente} °C</h6><td>
            <td><h6>${precipitacionFormatted[1]}</h6><td>
            <td><h6>${sensacionTermica} °C</h6><td>
            <td><h6>${velocidadViento} Km/h</h6><td>
        </tr>
    `;
}

function imprimirDiasSiguientes(avgPrecipitacion, avgTemperaturaAmbiente, avgSensacionTermica, avgVelocidadViento, dia) {
    console.log('Entré a imprimir días siguientes');
    cardSiguientes.innerHTML += `
        <div class="col-4">
            <div class="card">
                <div><img src="${avgPrecipitacion[0]}" style=""></div>
                <div><h3>${avgTemperaturaAmbiente} °C</h3></div>
                <div><h4>${avgPrecipitacion[1]}</h4></div>
                <!-- Linea divisora -->
                <div><img src="sources/sensacion-termica.png" style="width: 5%"><span>${avgSensacionTermica} °C</span></div>
                <div><h4>Sensación térmica</h4></div>
                <!-- Linea divisora -->
                <div><img src="sources/velocidad-viento.png" style="width: 5%"><span>${avgVelocidadViento} Km/h</span></div>
                <div><h4>Velocidad del viento</h4></div>
                <!-- Linea divisora -->
                <div><img src="sources/ubicacion.png" style="width: 4%">  Ushuaia, TDF</div>
                <div><img src="sources/reloj.png" style="width: 4%">${dia}</div>
            </div>
        </div>
    `;
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

function mismoDia(fecha, idx) {
    // console.log('Estoy entrando a mismoDia'+idx);
    let dia = moment(fecha).format('MM-DD');
    // console.log('Fecha: '+fecha+'; Dia: '+dia+'; Dia actual: '+diaActual);
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
                // Trae texto y una imágen
                let precipitacionFormatted = formatearPrecipitacion(precipitacion);

                // Impresión de resutlados
                if (fecha == fechaActual) imprimirCards(diaHoraActual, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento);
                else if (mismoDia(fecha, idx) == true) {
                    // console.log('Cuantas veces entro acá?: '+idx);
                    imprimirTabla(fechaFormatted, precipitacionFormatted, temperaturaAmbiente, sensacionTermica, velocidadViento);
                }//climaHorasPosteriores.innerHTML += imprimir(idx, fechaFormatted, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento);
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
                    var dia = moment(dataHora.time).format('YYYY-MM-DD');
                    avgTemperaturaAmbiente = (avgTemperaturaAmbiente/24).toFixed(2);
                    avgSensacionTermica =  (avgSensacionTermica/24).toFixed(2);
                    avgPrecipitacion =  (avgPrecipitacion/24).toFixed(2);
                    avgVelocidadViento =  (avgVelocidadViento/24).toFixed(2);
                }
            }
            // climaDiasPosteriores.innerHTML += imprimir(i, dia, avgTemperaturaAmbiente, avgSensacionTermica, avgPrecipitacion, avgVelocidadViento);    
            avgPrecipitacion = formatearPrecipitacion(avgPrecipitacion);
            imprimirDiasSiguientes(avgPrecipitacion, avgTemperaturaAmbiente, avgSensacionTermica, avgVelocidadViento, dia);
        }
        
    });
}


// Llamado a funciones
consultaAPI();