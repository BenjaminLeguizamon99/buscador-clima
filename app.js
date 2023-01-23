const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
});

function buscarClima (e) {
    e.preventDefault();
    
    // Validación
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;

    if (ciudad === "" || pais === ""){
        mostrarError("Ambos campos son obligatorios");
        return;
    }

    //Consulta a la API

    consultarAPI(ciudad, pais);
}


function mostrarError(mensaje) {
    const alerta = document.querySelector(".bg-red-100");
    if (!alerta) {
        const alerta = document.createElement("div");
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-md", "mx-auto", "mt-6", "text-center");
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
            `
        
        container.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }  
}

function consultarAPI(ciudad, pais) {
    const appId = "c2cbc7ad7ef951913e51b3347d5bca42";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner(); //Muestra un spinner de carga

    fetch (url)
        .then (respuesta => respuesta.json())
        .then (datos => {
            if (datos.cod === "404") {
                mostrarError("Ciudad no encontrada");
                limpiarHTML();
                return;
                
            }

            //Limpiar el html
            limpiarHTML();

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
            
        })
}

function mostrarClima(datos) {
    const {name, main: {temp, temp_max, temp_min}} = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement("p");
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add("font-bold", "text-2xl")
    
    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add("font-bold", "text-7xl", "mb-2");


    const tempMaxima = document.createElement("p");
    tempMaxima.innerHTML = `Máxima: ${max} &#8451;`
    tempMaxima.classList.add("text-xl");


    const tempMinima = document.createElement("p");
    tempMinima.innerHTML = `Mínima: ${min} &#8451`;
    tempMinima.classList.add("text-xl");


    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white", "gap-2");
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);




function limpiarHTML () {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner () {
    limpiarHTML();
    const divSpinner = document.createElement("div");
    divSpinner.classList.add("spinner");

    divSpinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

    resultado.appendChild(divSpinner);
}