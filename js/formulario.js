eventListeners();

function eventListeners(){
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
    e.preventDefault(); //Hace que un formulario no se envie -si esta vacio-

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;
    if(usuario === '' || password === ''){
        //La validacion fallo
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios!'
          })
        }else{
            //Ambos campos son correctos, mandar a ejecutar Ajax
            //datos que se envian al servidor
            var datos = new FormData();//Nos permite estructurar nuestro llamado a Ajax(darle llave y valor) y enviarlos
            datos.append('usuario', usuario); 
            datos.append('password', password); 
            datos.append('accion', tipo); 
            
            //crear el llamado a ajax
            var xhr = new XMLHttpRequest();
            //abrir la conexion.
            xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
            //Retorno de datos
            xhr.onload = function(){
                if(this.status === 200){
                    console.log(JSON.parse(xhr.responseText));//Lo que enviamos como dato que se imprime //EL JSON parse convierte el string en objeto
                }
            }
            //Enviar la peticion
            xhr.send(datos); //todo lo que esta en el formData
            Swal.fire({
                type: 'success',
                title: 'Correcto!',
                text: 'Escribiste ambos campos!'
              })
        }
} 
