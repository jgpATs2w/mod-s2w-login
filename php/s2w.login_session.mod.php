<?
namespace s2w\login;
/**
 * Functions required to control sessions. In some cases, the web browser 
 * can handle this functionality (with persistent storage) but this is not 
 * globally supported.
 */
/**
 * Check if user is logged, if not die.
 */
function logOrDie(){
	$s = "no esta autorizad@ para ver el contenido";
	session_start();
		if(!array_key_exists("id", $_SESSION)) die($s);
		if(!(strcmp($_SESSION['id'],md5("wellcome to tijuana")) == 0)) die($s);
	session_write_close();
	
}
/**
 * First session start when the user is logged
 */
function loadSession($uname){
	session_start();
		$_SESSION['id'] = md5("wellcome to tijuana");
		$_SESSION['uname'] = $uname;
		$_ENV['uname'] = $uname;
	session_write_close();
}
/**
 * @return user name
 */
function getUser(){
	session_start();
	return $_SESSION['uname'];
}

?>