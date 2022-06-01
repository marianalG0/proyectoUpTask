eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault(); //Hace que un formulario no se envie -si esta vacio-

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;
    if (usuario === '' || password === '') {
        //La validacion fallo
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios!'
        })
    } else {
        //Ambos campos son correctos, mandar a ejecutar Ajax
        //datos que se envian al servidor
        var datos = new FormData(); //Nos permite estructurar nuestro llamado a Ajax(darle llave y valor) y enviarlos
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //crear el llamado a ajax
        var xhr = new XMLHttpRequest();
        //abrir la conexion.
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
        //Retorno de datos
        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);
                //Si la respuesta es correcta 
                if (respuesta.respuesta === 'correcto') {
                    //si es un nuevo usuario 
                    if (respuesta.tipo === 'crear') {
                        swal({
                            title: 'Usuario Creado',
                            text: 'El usuario se creó correctamente',
                            type: 'success'
                        });
                    }else if(respuesta.tipo === 'login'){
                        swal({
                            title: 'Login Correcto',
                            text: 'Presiona OK para abrir el dashboard',
                            type: 'success'
                        })
                        .then(resultado =>{
                            if(resultado.value){
                                window.location.href = 'index.php';
                            }
                        })
                    }
                } else {
                    //hubo un error 
                    swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'
                    })
                }
            }
        }
            //Enviar la peticion
            xhr.send(datos); //todo lo que esta en el formData

        }
    }
