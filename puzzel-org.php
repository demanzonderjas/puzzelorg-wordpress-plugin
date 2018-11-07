<?php
/*
Plugin Name: Crossword Puzzle - Puzzel.org
Plugin URI:   https://puzzel.org/en/features/create-crossword/wordpress
Description:  Embed puzzles of Puzzel.org
Version:      20180711
Author:       Puzzel.org
Author URI:   https://puzzel.org
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  puzzel.org
*/

require_once 'constants.php';
require_once 'settings.php';

function setup_options() {
    add_option(PUZZLE_UID_OPTION, 'fone');
    add_option(PUZZLE_PUZZLES, 'test');
}

function remove_options() {
    delete_option(PUZZLE_UID_OPTION);
    delete_option(PUZZLE_PUZZLES);
}

function puzzelorg_shortcodes_init()
{
    function puzzelorg_shortcode($atts = [], $content = null)
    {
        // do something to $content
        $content = "<div><iframe src='https://puzzel.org/nl/crossword/embed?p=" . $atts["key"] . "' width='750' height='800' frameborder='0'></iframe></div>";
        // always return
        return $content;
    }
    add_shortcode('puzzelorg', 'puzzelorg_shortcode');
}
add_action('init', 'puzzelorg_shortcodes_init');

/**
 * Add the TinyMCE VisualBlocks Plugin.
 *
 * @param array $plugins An array of all plugins.
 * @return array
 */
function puzzelorg_plugin( $plugins ) {
    $plugins['puzzelorg'] = plugins_url( 'tinymce/', __FILE__ ) . '/editor_plugin.js';
    return $plugins;
}

add_action( 'admin_init', 'puzzelorg_tinymce_button' );

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
     $plugin_array['puzzelorg_button_script'] = plugins_url( '/tinymce.js', __FILE__ ) ;
     return $plugin_array;
}

foreach ( array('post.php','post-new.php') as $hook ) {
    add_action( "admin_head-$hook", 'my_admin_head' );
}

/**
* Localize Script
*/
function my_admin_head() {
   $puzzles = get_option("puzzelorg_options");
   ?>
    <!-- TinyMCE Shortcode Plugin -->
    <script type='text/javascript'>
    var my_plugin = {
    'puzzles': '<?= wp_slash(json_encode($puzzles, true)) ?>',
    };
    </script>
    <!-- TinyMCE Shortcode Plugin -->
   <?php
}

add_action('admin_enqueue_scripts', 'add_stylesheet');
function add_stylesheet() {
    wp_enqueue_style( 'puzzelorg', plugins_url('/css/main.css', __FILE__ ));
}


add_filter( 'mce_external_plugins', 'puzzelorg_plugin' );

register_activation_hook( __FILE__, 'setup_options' );

register_deactivation_hook( __FILE__, 'remove_options' );

register_uninstall_hook(__FILE__, 'remove_options' );