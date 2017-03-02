<?php
/*
Ioane "Tavi" Tenari
HW6 - bestreads.php
CSE 154 AK
Courtney Dowell

bestreads.php
This is a webservice which provides information about books to use for a 
book review website (bestreads.html). This information is going to be 
requested via bestreads.js.
*/

$mode = $_GET["mode"]; #mode
$category = $_GET["title"]; #title

if ($mode == "books"){
	createXML();
}
if ($mode == "info"){
	createJSON($category);
}
if ($mode == "description"){
	createText($category);
}
if ($mode == "reviews"){
	createHTML($category);
}

/*
createHTML takes the book title as a parameter and creates HTML out of each 
existing review.
*/
function createHTML($category){
	$revs = glob("books/" . $category . "/review*.txt");
	
	#looping through each review and creating elements using DOMDocument.
	$dom = new DOMDocument();
	$htmltag = $dom->createElement("html");
	foreach($revs as $rev){
		$data = file($rev);
		list($auth, $stars, $text) = $data;
		$head = $dom->createElement("h3");
		$txt1 = $dom->createTextNode($auth);
		$head->appendChild($txt1);
		$star = $dom->createElement("span");
		$txt2 = $dom->createTextNode($stars);
		$star->appendChild($txt2);
		$head->appendChild($star);
		$para = $dom->createElement("p");
		$txt3 = $dom->createTextNode($text);
		$para->appendChild($txt3);
		$htmltag->appendChild($head);
		$htmltag->appendChild($para);
	}
	$dom->appendChild($htmltag);
	header("Content-type: text/html");
	print($dom->saveHTML());
}

/*
createText takes the book title as a parameter and outputs the book's description 
as plain text.
*/
function createText($category){
	$data = "books/" . $category . "/description.txt";
	$out = file_get_contents($data);
	print $out;
}

/*
createJSON takes the book title as a parameter and outputs the book's info as JSON.
*/
function createJSON($category){
	$info = "books/" . $category . "/info.txt";
	$data = file($info);
	list($titl, $auth, $stars) = $data;
	$out = array(
		"title" => $titl,
		"author" => $auth,
		"stars" => $stars
	);
	header("Content-type: application/json");
	print (json_encode($out));
}

/*
createXML outputs each title as XML to use for the main page.
*/
function createXML(){
	$dirs = glob("books/*");
	$folders = array();
	$titles = array();
	foreach($dirs as $dir){
		array_push($folders, (substr($dir, 6)));
		$txt = $dir . "/info.txt";
		array_push($titles, (file($txt)[0]));
	}
	$combined = array_combine($titles, $folders);
	
	#looping through each title and folder pair and creates elements using DOMDocument.
	$dom = new DOMDocument();
	$booksX = $dom->createElement("books");
	foreach($combined as $title => $folder){
		$bookX = $dom->createElement("book");
		$titleX = $dom->createElement("title");
		$textT = $dom->createTextNode($title);
		$titleX->appendChild($textT);
		$bookX->appendChild($titleX);
		$folderX = $dom->createElement("folder");
		$textF = $dom->createTextNode($folder);
		$folderX->appendChild($textF);
		$bookX->appendChild($folderX);
		$booksX->appendChild($bookX);
		$dom->appendChild($booksX);
	}
	header("Content-type: text/xml");
	print($dom->saveXML());
}
?>