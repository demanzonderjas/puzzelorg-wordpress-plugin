<?php
/**
 * Create shortcode parsing for the Wordpress frontend
 *
 * @return string
 */
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