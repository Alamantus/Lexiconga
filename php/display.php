<?php
function Show_Dictionary_Function($prevent_edit) {
    // Used to determine which JavaScript display function to use.
    // $prevent_edit is a boolean value.
    if ($prevent_edit) {
        echo "ShowPublicDictionary()";
    } else { 
        echo "ShowDictionary()";
    }
}
?>