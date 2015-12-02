<?php
// Simplified PHP functions
function query ($query_string) {
    $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
	$dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
	$dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    try {
        $queryResults = $dbconnection->prepare($query_string);
        $queryResults->execute();
        return $queryResults;
    }
    catch (PDOException $ex) {
        return false;
    }
}
function num_rows ($query_results) {
    try {
        $rowcount = $query_results->rowcount();
        return $rowcount;
    }
    catch (PDOException $ex) {
        return false;
    }
}
function fetch ($query_results) {
    try {
        $fetchassoc = $query_results->fetch();
        return $fetchassoc;
    }
    catch (PDOException $ex) {
        return false;
    }
}

function ordinal($number) {
    // Retrieved from http://stackoverflow.com/a/3110033/3508346
    $ends = array('th','st','nd','rd','th','th','th','th','th','th');
    if ((($number % 100) >= 11) && (($number%100) <= 13))
        return $number. 'th';
    else
        return $number. $ends[$number % 10];
}

function time_elapsed($secs){
    // Retrieved from http://php.net/manual/en/function.time.php#108581
    $bit = array(
        // ' year'        => $secs / 31556926 % 12,
        // ' week'        => $secs / 604800 % 52,
        // ' day'        => $secs / 86400 % 7,
        // ' hour'        => $secs / 3600 % 24,
        ' minute'    => $secs / 60 % 60,
        ' second'    => $secs % 60
        );
        
    foreach($bit as $k => $v){
        if($v > 1 || $v < 1)$ret[] = $v . $k . 's';
        if($v == 1)$ret[] = $v . $k;
        }
    array_splice($ret, count($ret)-1, 0, 'and');
    //$ret[] = 'ago.';
    
    return join(' ', $ret);
}
?>