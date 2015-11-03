<?php
// Simplified PHP functions
function query ($query_string) {
    $query = mysqli_query(connection(), $query_string);
    
    return $query;
}
function num_rows ($query_results) {
    $num_rows = mysqli_num_rows($query_results);
    
    return $num_rows;
}
function fetch_assoc ($query_results) {
    $results = mysqli_fetch_assoc($query_results);
    
    return $results;
}
?>