<?php

/**
 * Setup hook to remove the options / puzzles from the database on deactivation/uninstall
 *
 * @return void
 */
function remove_options() {
    delete_option(PUZZELORG_OPTIONS);
}

register_deactivation_hook( __FILE__, 'remove_options' );

register_uninstall_hook(__FILE__, 'remove_options' );