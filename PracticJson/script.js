// Función para cargar y mostrar los vuelos (la tuve que buscar )
document.addEventListener("DOMContentLoaded", function() {
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {
            const vuelosContainer = document.getElementById('vuelos-container');
            
            data.vuelos.forEach(vuelo => {
                const vueloDiv = document.createElement('div');
                vueloDiv.classList.add('vuelo');

                // Título del vuelo
                const vueloTitle = document.createElement('h2');
                vueloTitle.textContent = `${vuelo.origen} - ${vuelo.destino} (${vuelo.fecha})`;
                vueloDiv.appendChild(vueloTitle);

                // Mostrar la disponibilidad de plazas
                const plazasDiv = document.createElement('p');
                plazasDiv.textContent = `Plazas disponibles: ${vuelo.plazas_disponibles}`;
                vueloDiv.appendChild(plazasDiv);

                // Crear una tabla para los pasajeros
                const tabla = document.createElement('tabla');
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
                vueloDiv.appendChild(tabla);

                // Agregar el vuelo al contenedor de vuelos
                vuelosContainer.appendChild(vueloDiv);
            });
        })
        .catch(error => console.log('Error cargando los datos:', error));
});

// Función para los bultos
function renderBultos(bultos) {
    return bultos.map(bulto => `
        <div class="bulto">
            <p>Peso: ${bulto.peso} kg</p>
            <p>Costo adicional: ${bulto.costo_adicional} ${bulto.moneda}</p>
        </div>
    `).join('');
}

