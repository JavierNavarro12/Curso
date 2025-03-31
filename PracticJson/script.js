document.addEventListener("DOMContentLoaded", function() {
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {
            const vuelosContainer = document.getElementById('vuelos-container');
            
            data.vuelos.forEach(vuelo => {
                const vueloDiv = document.createElement('div');
                vueloDiv.classList.add('vuelo');

                // Contenedor principal para cada aeropuerto (título, tabla e imágenes)
                const aeropuertoDiv = document.createElement('div');
                aeropuertoDiv.classList.add('aeropuerto-contenedor');

                // Contenedor principal (tabla + imágenes)
                const contenidoDiv = document.createElement('div');
                contenidoDiv.classList.add('contenido-vuelo');

                // Contenedor de la tabla
                const tablaDiv = document.createElement('div');
                tablaDiv.classList.add('tabla-container');

                // Título del vuelo
                const vueloTitle = document.createElement('h2');
                vueloTitle.textContent = `${vuelo.origen} → ${vuelo.destino} (${vuelo.fecha})`;
                tablaDiv.appendChild(vueloTitle);

                // Mostrar la disponibilidad de plazas
                const plazasDiv = document.createElement('p');
                plazasDiv.textContent = `Plazas disponibles: ${vuelo.plazas_disponibles}`;
                tablaDiv.appendChild(plazasDiv);

                // Crear una tabla para los pasajeros
                const tabla = document.createElement('table');  
                tabla.classList.add('tabla');
                const tablaHeader = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = '<th>Nombre</th><th>Edad</th><th>Clase</th><th>Asiento</th><th>Bultos Facturados</th>';
                tablaHeader.appendChild(headerRow);
                tabla.appendChild(tablaHeader);

                const tablaBody = document.createElement('tbody');
                vuelo.pasajeros.forEach(pasajero => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${pasajero.nombre}</td>
                        <td>${pasajero.edad}</td>
                        <td>${pasajero.clase}</td>
                        <td>${pasajero.asiento}</td>
                        <td>${pasajero.bultos_facturados.length > 0 ? renderBultos(pasajero.bultos_facturados) : 'Ninguno'}</td>
                    `;
                    tablaBody.appendChild(row);
                });
                tabla.appendChild(tablaBody);
                tablaDiv.appendChild(tabla);

                // Contenedor de las imágenes
                const imagenesDiv = document.createElement('div');
                imagenesDiv.classList.add('imagenes-vuelo');

                // Contenedor para la imagen de origen
                const contenedorOrigen = document.createElement('div');
                contenedorOrigen.classList.add('contenedor-imagen');
                const imagenOrigen = document.createElement('img');
                imagenOrigen.classList.add('imagen-aeropuerto');
                imagenOrigen.src = vuelo.imagen_origen;
                imagenOrigen.alt = `Imagen de ${vuelo.origen}`;
                contenedorOrigen.appendChild(imagenOrigen);

                // Contenedor para la imagen de destino
                const contenedorDestino = document.createElement('div');
                contenedorDestino.classList.add('contenedor-imagen');
                const imagenDestino = document.createElement('img');
                imagenDestino.classList.add('imagen-aeropuerto');
                imagenDestino.src = vuelo.imagen_destino;
                imagenDestino.alt = `Imagen de ${vuelo.destino}`;
                contenedorDestino.appendChild(imagenDestino);

                // Agregar los contenedores a las imágenes
                imagenesDiv.appendChild(contenedorOrigen);
                imagenesDiv.appendChild(contenedorDestino);

                // Agregar los elementos al contenedor principal
                contenidoDiv.appendChild(tablaDiv);
                contenidoDiv.appendChild(imagenesDiv);
                aeropuertoDiv.appendChild(contenidoDiv);
                
                // Agregar el aeropuerto al contenedor de vuelos
                vuelosContainer.appendChild(aeropuertoDiv);
            });
        })
        .catch(error => console.log('Error cargando los datos:', error));
});

// Función para los bultos
function renderBultos(bultos) {
    return bultos.map(bulto => 
        `<div class="bulto">
            <p>Peso: ${bulto.peso_kg} kg</p>
            <p>Costo adicional: ${bulto.costo_adicional} ${bulto.moneda}</p>
        </div>`
    ).join('');
}
