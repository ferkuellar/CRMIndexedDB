(function() {

    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        
        formulario.addEventListener('submit', validarCliente);

        conectarDB();        
    });

    function conectarDB(){
        // abrir conexion en la bd

        let abrirConexion = window.indexedDB.open('crm', 1);

        //  si hay un error, lanzarlo
        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        };

        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function() {
            // guardamos el resultado
            DB = abrirConexion.result;
        };
    };

    function validarCliente(e) {
        e.prventDefault();
        
        // leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        };

        // crear un objeto con la informacion

        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }
        
        cliente.id = Date.now();
        crearNuevoCliente(cliente);
    };

    function crearNuevoCliente(cliente) {
        // nuevo cliente
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        // console.log(objecStore);

        objectStore.add(cliente);
        
        transaction.oncomplete = () => {
            console.log('Cliente Agergado');

            // mostrar mensaje que todo esta bien
            imprimirAlerta('Se agergo correctamente');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = () => {
            // console.log('Hubo un error');
            imprimirAlerta('Hubo un Error', 'error');
        };
    }

    function imprimirAlerta(mensaje, tipo) {

        const alerta = document.querySelector('.alerta');

        if(!alerta){
            // crear la alerta
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

            if(tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            };
            
            divMensaje.textContent = mensaje;

            formulario.appendChild(divMensaje);

            setTimeout(()=>{
                divMensaje.remove();
            }, 3000);

        };
        
    };

})();