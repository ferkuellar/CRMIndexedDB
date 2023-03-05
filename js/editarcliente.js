(function(){
    let DB;
    const nombreInput = document.querySelector('#nombre');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        // verificar el ID de la url
        const parametrosURL = new URLSearchParams(windows.location.search);
        const idCliente = parametrosURL.get('id');
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        };
    });

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
        const {} = datosCliente;

        nombreInput.value = nombre;
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