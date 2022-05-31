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
        if ($stmt->affected_rows) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
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
    //Escribir codifo que loguee a los administradores
}
