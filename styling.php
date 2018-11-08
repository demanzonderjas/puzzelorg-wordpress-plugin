<?php

function add_stylesheet() {
    wp_enqueue_style( 'puzzelorg', plugins_url('/css/main.css', __FILE__ ));
}

add_action('admin_enqueue_scripts', 'add_stylesheet');