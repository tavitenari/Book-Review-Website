/*
Ioane "Tavi" Tenari
HW6 - bestreads.js
CSE 154 AK
Courtney Dowell

bestreads.js
This javascript file requests information from bestreads.php in order
to create a book review website (bestreads.html). 
*/

(function(){
	"use strict";
	
	var URL = "https://webster.cs.washington.edu/students/tenarii/hw6/bestreads.php?mode=";
	
	window.onload = function(){
		document.getElementById("singlebook").style.display = "none";
		document.getElementById("back").onclick = showBooks;
		makeReq(URL + "books", allBooks);
	};
	
	/*
	makeReq - helper function used to make php requests.
	*/
	function makeReq(site, func){
		var request = new XMLHttpRequest();
		request.onload = func;
		request.open("GET", site, true);
		request.send();
	}
	
	/*
	allBooks - this is called initially and creates the main page of
	the review site via an XML request.
	*/
	function allBooks(){
		var bookLog = this.responseXML;
		var titles = bookLog.getElementsByTagName("title");
		var folders = bookLog.getElementsByTagName("folder");
		for (var i = 0; i < titles.length; i++){
			var book = document.createElement("div");
			book.id = folders[i].innerHTML;
			book.onclick = singleBook;
			var pict = document.createElement("img");
			var paragr = document.createElement("p");
			pict.setAttribute("src", "books/" + folders[i].innerHTML + "/cover.jpg");
			pict.setAttribute("alt", "book");
			book.appendChild(pict);
			paragr.innerHTML += titles[i].innerHTML;
			book.appendChild(paragr);
			document.getElementById("allbooks").appendChild(book);
		}
	}
	
	/*
	singleBook - this is called after a book/title is clicked on from the main page.
	It builds the inidividual book's page.
	*/
	function singleBook(){
		makeReq(URL + "info&title=" + (this.id), info);
		makeReq(URL + "description&title=" + (this.id), description);
		makeReq(URL + "reviews&title=" + (this.id), reviews);
		document.getElementById("allbooks").innerHTML = "";
		document.getElementById("singlebook").style.display = "";
		document.getElementById("cover").setAttribute("src", "books/" + this.id + "/cover.jpg");
		document.getElementById("cover").setAttribute("alt", "book");
	}
	
	/*
	info - this loads when requesting info of a book's title.
	It puts the JSON data into bestreads.html.
	*/
	function info(){
		var data =  JSON.parse(this.responseText);
		document.getElementById("title").innerHTML  = data.title;
		document.getElementById("author").innerHTML = data.author;
		document.getElementById("stars").innerHTML = data.stars;
	}
	
	/*
	description - this loads when requesting a title's description.
	It adds plain text to bestreads.html.
	*/
	function description(){
		var data = this.responseText;
		document.getElementById("description").innerHTML = data;
	}
	
	/*
	reviews - this loads when requesting a title's reviews.
	It adds HTML data to bestreads.html.\.
	*/
	function reviews(){
		var data = this.responseText;
		document.getElementById("reviews").innerHTML = data;
	}
	
	/*
	showBooks - this is used to rebuild the main page after 
	clicking "back". It clears the singlepage elements so that
	when a new page is clicked, you won't see the old information
	while waiting for the php request to send back the new data.
	*/
	function showBooks(){
		document.getElementById("allbooks").innerHTML = "";
		document.getElementById("singlebook").style.display = "none";
		makeReq(URL + "books", allBooks);
		var clearList = ["cover", "title", "author", "stars", "reviews", "description"];
		for (var i = 0; i < clearList.length; i++){
			document.getElementById(clearList[i]).innerHTML = "";
		}
	}

})();