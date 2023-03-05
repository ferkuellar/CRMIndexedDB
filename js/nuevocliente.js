(function() {
    let DB;

    function conectarDB() { 
        const openConn = window.indexedDB.open('crm', 1);

        openConn.onerror = function(e) {
            console.log("Error occurred while opening IndexedDB: ", e);
        };
        
        openConn.onupgradeneeded = function(e) {
            let db = e.target.result;
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('IndexedDB created');
        };

        openConn.onsuccess = function() {
            DB = openConn.result;
            
            console.log('IndexedDB loaded successfully');
        }
    }

    function validarCliente(e) {
        e.preventDefault();
        
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
            console.log('Cliente Agregado');

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

    function imprimirAlerta(msg, tipo) {
        const alerta = document.createElement('div');
        alerta.textContent = msg;
        alerta.classList.add('alerta');
        if (tipo === 'error') {
            alerta.classList.add('error');
        } else {
            alerta.classList.add('correcto');
    }

    formulario.appendChild(alerta);

    setTimeout(() => alerta.remove(), 3000);
    }

    conectarDB();

    const formulario = document.querySelector('#formulario');

    formulario.addEventListener('submit', validarCliente);
})();