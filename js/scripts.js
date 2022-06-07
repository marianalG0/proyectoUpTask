eventListeners();
//Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    //Document Ready
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    } );

    //boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // Boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    // Botones para las acciones de las tareas (Agregado por ASCC video29)
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log('Presionaste un nuevo proyecto');

    //crea un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    //seleccionar el ID con el nuevoProyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
    //Al presionar enter crear el proyecto

    inputNuevoProyecto.addEventListener('keypress', function (e) {
        var tecla = e.which || e.keyCode;

        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    // Crear llamado ajax
    var xhr = new XMLHttpRequest();

    // Enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // En la carga
    xhr.onload = function() {
        if(this.status === 200) { // verificar que el llamado de la funcion sea correcta y encontro su lugar
            // Obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            // Comprobar la inserccion
            if(resultado === 'correcto') {
                // fue exitoso
                if(tipo === 'crear') {
                    // se creo un nuevo proyecto
                    // inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                    <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                    ${proyecto}
                    </a>
                    `;
                    //Agregar al html
                    listaProyectos.appendChild(nuevoProyecto);

                    // enviar alerta
                    swal({
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' se creo correctamente',
                        type: 'success'
                    })
                    .then(resultado => {
                        // redireccionar a la nueva URL
                        if(resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    })
                } else {
                    // se actualiazo o se elimino
                }
            } else {
                // hubo un error
                swal({
                    type: 'error',
                    title: 'Error!',
                    text: 'Hubo un error!'
                })
            }
        }

    }

    // Enviar el Request
    xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;

    // Validar que el campo tenga algo escrito
    if(nombreTarea === '') {
        swal({
            title: 'Error',
            text: 'Una tarea no puede ir vacia',
            type: 'error'
        })
    } else {
        // la tarea tiene algo, insertar en PHP

        // Crear llamado a ajax
        var xhr = new XMLHttpRequest();

        // Crear formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value );

        // Abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // Ejecutarlo y respuesta
        xhr.onload = function() {
            if(this.status === 200) {
                // todo correcto
                var respuesta = JSON.parse(xhr.responseText);
                // asignar valores
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if(respuesta.respuesta === 'correcto') {
                    // se agrego correctamente
                    if(tipo === 'crear') {
                        // lanzar la alerta
                        swal({
                            type: 'success',
                            title: 'Tarea Creada',
                            text: 'La tarea: ' + resultado + ' se creo correctamente'
                        });

                        // Seleccionar el parrafo con la lista vacia (Parte anexada por ASCC video35) Vamos yo puedo ya mero termino, si se puede no falta mucho!
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if(parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // Construir el template
                        var nuevaTarea = document.createElement('li');

                        // Agregamos el ID
                        nuevaTarea.id = 'tarea:'+id_insertado;

                        // Agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        // Construir en el HTML
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                            <i class="far fa-check-circle"></i>
                            <i class="fas fa-trash"></i>
                            </div>
                        `;
                        // Agregarlo al HTML (NUEVAMENTE SUBIENDO)
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        // Actualizar el progreso (video36, ya esoty terminando si puedo)
                        actualizarProgreso();

                    }
                } else {
                    // hubo un error
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error!'
                    })
                }
            }
        }
        // Enviar la consulta
        xhr.send(datos);
    }
}

// Cambia el estado de las tareas o las elimina (Agregado por ASCC video 29 min1:20+)
function accionesTareas(e){
    e.preventDefault();

    if(e.target.classList.contains('fa-check-circle')) {
        if(e.target.classList.contains('completo')){
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    if(e.target.classList.contains('fa-trash')){
        swal.fire({
            title: 'Seguro(a)?',
            text: "Esta acción no de puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;

                //Borrar de la BD (VIDEO33 ASCC)
                eliminarTareaBD(tareaEliminar);

                //Borrar del HTML(VIDEO33 ASCC)
                tareaEliminar.remove();

              swal.fire(
                'Eliminado!',
                'La tarea fue eliminada.',
                'success'
              )
            }
          })
    }
}

// Completa o descompleta una tareas (Agregado por ASCC video30)
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    
    //Crear llamado a ajax
    var xhr = new XMLHttpRequest();

    //Information
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);


    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // on load
    xhr.onload = function(){
        if(this.status === 200){
            // console.log(JSON(xhr.responseText));
            // console.log(JSON)
            console.log(xhr.responseText);
          // Actualizar el progreso (video36, ya esoty terminando si puedo)
            actualizarProgreso();
        }
    }
    //Enviar la peticion
    xhr.send(datos);
    //subiendo 
}

// Elimina las tareas de la base de datos (SE CREA LA FUNCIÓN eliminarTareaBD VIDEO33 ASCC)

function eliminarTareaBD(tarea){
    var idTarea = tarea.id.split(':');
    
    //Crear llamado a ajax
    var xhr = new XMLHttpRequest();

    //Information
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    
    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // on load
    xhr.onload = function(){
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));
            // console.log(JSON)
            // console.log(xhr.responseText);

            //Comprobar que haya tareas restantes (Parte anexada por ASCC video35)
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if(listaTareasRestantes.length === 0 ){
                document.querySelectorAll('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }
            // Actualizar el progreso (video36, ya esoty terminando si puedo)
            actualizarProgreso();

        }
    }
    //Enviar la peticion
    xhr.send(datos);
}

// Actualiza el avance del proyecto (Ya último video, ya video 36, ya estoy terminando y me voy por mi lechita que ya me lo merezco de escribir code con dolor en la muñeca)
function actualizarProgreso(){
    //Obtener todas las tares
    const tareas = document.querySelectorAll('li.tarea');

    //Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //Determinar avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    //Asignar el avance de la barra 
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    //Mostrar una alerta al completar el 100%
    if ( avance===100 ){
        swal({
            type: 'success',
            title: 'Proyecto Terminado',
            text: 'Ya no tienes tareas pendientes!'
        });
    }
}