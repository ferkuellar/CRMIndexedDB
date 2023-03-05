(function(){
    let DB;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#fromulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        // actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);
        // verificar el ID de la URL
        const parametrosURL = new URLSearchParams(windows.location.search);
        const idCliente = parametrosURL.get('id');
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        };
    });

    function actualizarCliente(e) {
        e.prevent.default();

        if(nombreInput.value === '' || emailInput.value === '' || empresa.value === '' || telefonoInput === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        };
    };

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.opencursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                console.log(cursor.value);
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                };
                cursor.continue();
            };
        };
    };

    function llenarFormulario(datosCliente) {
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function conectarDB() {
        // abrir conexion en la bd
        const abrirConexion = window.indexedDB.open('crm', 1);
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



})();