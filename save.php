<?php

require_once 'constants.php';

if( isset( $_POST ) ) {

    // Create an empty array. This is the one we'll eventually store.
    $arr_store_me = array();

    // Create a "whitelist" of posted values (field names) you'd like in your array.
    // The $_POST array may contain all kinds of junk you don't want to store in
    // your option, so this helps sort that out.
    // Note that these should be the names of the fields in your form.
    // Loop through the $_POST array, and look for items that match our whitelist
    foreach( $_POST as $key => $value ) {

        // If this $_POST key is in our whitelist, add it to the arr_store_me array
        if( preg_match("/puzzle/", $key) ) {
            $arr_store_me[$key] = $value;
        }
    }

    // Now we have a final array we can store (or use however you want)!
    // Update option accepts arrays--no need
    // to do any other formatting here. The values will be automatically serialized.
    update_option('puzzelorg_puzzles', "test");
}
