
function imprimirCards(diaHoraActual, temperaturaAmbiente, sensacionTermica, precipitacionFormatted, velocidadViento) {
    precipitacionActualIconoID.innerHTML = `<img src="${precipitacionFormatted[0]}" style="width: 60%; margin-top: 15px">`;
    temperaturaAmbienteActualID.innerHTML = `${temperaturaAmbiente} °C`;
    precipitacionActualTextoID.innerHTML = `${precipitacionFormatted[1]}`;
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
            <th scope="row"><h5>${fechaFormatted}</h5></th>
            <td><img src="${precipitacionFormatted[0]}" style="width: 20%"></td>
            <td><h5>${temperaturaAmbiente} °C</h5></td>
            <td><h5>${precipitacionFormatted[1]}</h6></td>
            <td><h5>${sensacionTermica} °C</h5></td>
            <td><h5>${velocidadViento} Km/h</h5></td>
        </tr>
    `;
}

function imprimirDiasSiguientes(avgPrecipitacion, avgTemperaturaAmbiente, avgSensacionTermica, avgVelocidadViento, dia) {
    ult_row.innerHTML += `
        <div class="col col-siguientes">
            <div><img src="${avgPrecipitacion[0]}" style="width: 40%"></div>
            <div><p>${avgTemperaturaAmbiente} °C</p></div>
            <div><p>${avgPrecipitacion[1]}</p></div>
            <div><img src="sources/sensacion-termica.png" style="width: 40%"><span>${avgSensacionTermica} °C</span></div>
            <div><p>Sensación térmica</p></div>
            <div><img src="sources/velocidad-viento.png" style="width: 40%"><span>${avgVelocidadViento} Km/h</span></div>
            <div><p>Velocidad del viento</p></div>
            <div><img src="sources/ubicacion.png" style="width: 5%">  Ushuaia, TDF</div>
            <div><img src="sources/reloj.png" style="width: 5%"> ${dia}</div>
        </div>
    `;
}


let fechaOrigen = new Date();
fechaActual = moment(fechaOrigen).format('YYYY-MM-DD\THH:00');
//
let diaActual = moment(fechaOrigen).format('MM-DD');
let horaActual = moment(fechaOrigen).format('HH:mm');
let diaHoraActual = moment(fechaOrigen).format('YYYY-MM-DD HH:mm');

const apiWeather = 'https://api.open-meteo.com/v1/forecast?latitude=-54.82&longitude=-68.36&hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m&timezone=America%2FSao_Paulo';


function formatearPrecipitacion(precipitacion) {
    if (precipitacion == 0) return ["sources/despejado.png", "Despejado"];
    else if (precipitacion < 2) return ["sources/lluvias-debiles.png", "Lluvias débiles"];
    else if (precipitacion <= 15) return ["sources/lluvia.png", "Lluvia"];
    else if (precipitacion <= 30) return ["sources/lluvias-fuertes.png", "Lluvias fuertes"]; 
    else if (precipitacion <= 60) return ["sources/lluvias-muy-fuertes.png", "Lluvias muy fuertes"];
    else return ["sources/lluvias-torrenciales.png", "Lluvias torrenciales"];
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
                
                else if (mismoDia(fecha) == true) imprimirTabla(fechaFormatted, precipitacionFormatted, temperaturaAmbiente, sensacionTermica, velocidadViento);
                
                else {
                    horaDiaPosterior = {
                        time: clima.hourly.time[idx],
                        temperature_2m: clima.hourly.temperature_2m[idx],
                        apparent_temperature: clima.hourly.apparent_temperature[idx],
                        precipitation: clima.hourly.precipitation[idx],
                        windspeed_10m: clima.hourly.windspeed_10m[idx]
                    }
                    posteriores.push(horaDiaPosterior);
                }
            }
        }); 

        // Promediar valores posteriores
        for (let i = 0; i < 6; i++) {
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
            avgPrecipitacion = formatearPrecipitacion(avgPrecipitacion);
            imprimirDiasSiguientes(avgPrecipitacion, avgTemperaturaAmbiente, avgSensacionTermica, avgVelocidadViento, dia);
        }
        
    });
}


// Llamado a funciones
consultaAPI();