<?php

function obtenerPaginaActual() {
    $archivo = basename($_SERVER['PHP_SELF']);//Accede a los archivos a los que esta hospedado y nos da el archivo actual
    $pagina = str_replace(".php","",$archivo);
    return $pagina;
}

obtenerPaginaActual();