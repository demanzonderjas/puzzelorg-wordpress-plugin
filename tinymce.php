<?php

function puzzelorg_tinymce_button() {
     if ( current_user_can( 'edit_posts' ) && current_user_can( 'edit_pages' ) ) {
          add_filter( 'mce_buttons', 'puzzelorg_register_tinymce_button' );
          add_filter( 'mce_external_plugins', 'puzzelorg_add_tinymce_button' );
     }
}

function puzzelorg_register_tinymce_button( $buttons ) {
     array_push( $buttons, "puzzelorg_button");
     return $buttons;
}

function puzzelorg_add_tinymce_button( $plugin_array ) {
     $plugin_array['puzzelorg_button_script'] = plugins_url( '/js/tinymce.js', __FILE__ ) ;
     return $plugin_array;
}

add_action( 'admin_init', 'puzzelorg_tinymce_button' );
