(function() {

    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        
        formulario.addEventListener('submit', validarCliente);

        conectarDB();        
    });


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

})();