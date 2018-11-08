<?php

/**
* Localize Script
*/
function puzzelorg_js_vars() {
    $puzzles = get_option(PUZZELORG_OPTIONS);

?>
     <script type='text/javascript'>
        var puzzelorg = {
            'puzzles': '<?= wp_slash(json_encode($puzzles, true)) ?>',
            'plugin_url': '<?= plugins_url('', __FILE__) ?>'
        };
     </script>
<?php 
} 

foreach ( array('post.php','post-new.php') as $hook ) {
    add_action( "admin_head-$hook", 'puzzelorg_js_vars' );
}

?>
