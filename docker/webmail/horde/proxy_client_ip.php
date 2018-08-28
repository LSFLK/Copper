<?php

if( isset( $_SERVER[ 'HTTP_X_FORWARDED_FOR' ] ) ) {
    $_SERVER[ 'REMOTE_ADDR' ] = $_SERVER[ 'HTTP_X_FORWARDED_FOR' ];
}

if ( isset($_SERVER[ 'HTTP_X_FORWARDED_PROTO' ])) {
    $_SERVER['HTTPS']='on';
}

?>