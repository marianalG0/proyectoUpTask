<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear') {
    //codigo para crear los administradores

    //Hashear passwords
    $opciones = array(
        'cost' => 12 //Para hash mas seguros pero consume mas en el servidor
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    //Importar la conexion
    include '../func/conexion.php';

    try {
        //Realizar la consulta a la base de datos 
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        } else{
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();

    } catch (Exception $e) {
        //En caso de un error, tomar la excepcion
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if ($accion === 'login') {
    //Escribir codigo que loguee a los administradores

    include '../func/conexion.php';

    try{
        //Seleccionar el administrador de la base de datos 
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        //loguear el usuario
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);// Va a traer los resultados
        $stmt->fetch();
        if($nombre_usuario){
            //El usuario existe, verificar el password
            if(password_verify($password, $pass_usuario)){
                //Iniciar la sesion
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                //Login correcto
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                ); 
            }else{
                //login incorrecto, enviar error
                $respuesta = array(
                    'resultado' => 'Password Incorrecto'
                );
            }   
        }else{
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();

    } catch (Exception $e) {
        //En caso de un error, tomar la excepcion
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
