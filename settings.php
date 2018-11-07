<?php
/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */

/**
 * custom option and settings
 */
function puzzelorg_settings_init()
{
    // register a new setting for "puzzelorg" page
    register_setting('puzzelorg', 'puzzelorg_options');

    // register a new section in the "puzzelorg" page

    add_settings_field(
        'puzzelorg_field_puzzles', // as of WP 4.6 this value is used only internally
        // use $args' label_for to populate the id inside the callback
        __('Puzzles', 'puzzelorg'),
        'puzzelorg_field_puzzles_cb',
        'puzzelorg',
        'puzzelorg_section_developers',
        [
            'label_for' => 'puzzelorg_field_puzzles',
            'class' => '',
            'puzzelorg_custom_data' => 'custom',
        ]
    );
}

/**
 * register our puzzelorg_settings_init to the admin_init action hook
 */
add_action('admin_init', 'puzzelorg_settings_init');

/**
 * custom option and settings:
 * callback functions
 */

// developers section cb

// section callbacks can accept an $args parameter, which is an array.
// $args have the following keys defined: title, id, callback.
// the values are defined at the add_settings_section() function.
function puzzelorg_section_developers_cb($args)
{
    ?>
 <p id="<?php echo esc_attr($args['id']); ?>"><?php esc_html_e('Authenticate to retrieve your API Key', 'puzzelorg');?></p>
 <?php
}

function puzzelorg_field_puzzles_cb($args) {
    ?>
    
    <?php
}

/**
 * top level menu
 */
function puzzelorg_options_page()
{
    // add top level menu page
    add_menu_page(
        'puzzelorg',
        'Puzzel.org Options',
        'manage_options',
        'puzzelorg',
        'puzzelorg_options_page_html'
    );
}

/**
 * register our puzzelorg_options_page to the admin_menu action hook
 */
add_action('admin_menu', 'puzzelorg_options_page');

/**
 * top level menu:
 * callback functions
 */
function puzzelorg_options_page_html()
{
    // check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // add error/update messages

    // check if the user have submitted the settings
    // wordpress will add the "settings-updated" $_GET parameter to the url
    if (isset($_GET['settings-updated'])) {
        // add settings saved message with the class of "updated"
        add_settings_error('puzzelorg_messages', 'puzzelorg_message', __('Settings Saved', 'puzzelorg'), 'updated');
    }

    // show error/update messages
    settings_errors('puzzelorg_messages');
    ?>
 <div class="wrap">
 <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
 <div id="auth-wrapper"></div>  
 <div id="puzzelorg-loader" class="hide">
     <img src="/wp-content/plugins/puzzel-org/images/loader.svg" />
 </div>
<p><?= __('Save the puzzles after they are loaded to use them in your posts/pages', 'puzzelorg') ?></p>
 <form id="puzzle-form" action="options.php" method="post">
 <div id="puzzle-container">
     <?php
        $puzzles = get_option('puzzelorg_options');
        if(!empty($puzzles)) {
            foreach($puzzles as $key => $puzzle) {
                echo '<div class="puzzle">';
                echo '<input type="text" value="' . $puzzle['name'] . '"name="puzzelorg_options[' . $key . '][name]" readonly />';
                echo '<input type="hidden" value="' . $puzzle['key'] . '"name="puzzelorg_options[' . $key . '][key]" />';
                echo '<input type="hidden" value="' . $puzzle['type'] . '"name="puzzelorg_options[' . $key . '][type]" />';
                echo '</div>';
            }
        }
     ?>
</div>
 <?php
    // output security fields for the registered setting "puzzelorg"
    settings_fields('puzzelorg');
    // // output setting sections and their fields
    // (sections are registered for "puzzelorg", each field is registered to a specific section)
    do_settings_sections('puzzelorg');
    // output save settings button
    submit_button('Save Puzzles');
    ?>
 </form>
 <script src="/wp-content/plugins/puzzel-org/dist/main.js"></script>
 </div>
 <?php
}