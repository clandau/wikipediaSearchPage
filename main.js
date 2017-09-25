var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="
var urlEnd = "&srprop=snippet&origin=*";
var searchEntered = document.getElementById("searchbox");
var resultsExist = false;  //identifies whether results are already on page for button handler
var clearButtonVisible = false;
var clearButton = document.getElementById('clrBtn');
var resultsList = document.getElementById('output');
var searchbox = document.getElementById('searchbox-div');
var parentDiv = document.getElementById('parent-div');
var mainWrapper = document.getElementById('mainWrapper');

searchEntered.addEventListener("keyup", function(e){
    if (e.which === 13 && searchEntered.value) {  //checks whether key was enter key
        resultsExist = true;
        hideElements(searchbox);
        var completeUrl = url + searchEntered.value + urlEnd;
        var request = new XMLHttpRequest();
        request.open("GET", completeUrl, true);
        request.onload = function() {
            if (request.status >= 200 && request.status<400) {
                var returnData = JSON.parse(request.responseText);
                renderHTML(returnData);  //output results
                mainWrapper.style.marginTop = '0px';
                clearButton.style.display = null;
                clearButtonVisible = true;
            }
            else {
                console.log("we connected to the server but it returned an error");
            }
        }   

/*handling connection errors */
request.onerror = function() {
    console.log("connection error");
}
request.send();
    }
});

//handle data from API and display search results
function renderHTML(data) {
    var resultsNum = data.query.search.length;
    var url = "https://en.wikipedia.org/wiki/";
    var getListElem = document.getElementById("output");
    for (var i=0; i<resultsNum; i++) {
        var newLi = document.createElement("li");
        newLi.id = "item" + i;
        var title = data.query.search[i].title;
        newLi.innerHTML += "<h3><a href='" + url + title + "'target='_blank'>" + title + "</a></h3>";
        newLi.innerHTML += '<p>' + data.query.search[i].snippet;
        getListElem.appendChild(newLi);
    }
}

function hideElements(loc) {
    if (loc.style.display === 'none') {
        loc.style.display = 'block';
        console.log("this was called " + loc);
    }
        loc.style.display = 'none';
}

clearButton.addEventListener('click', function() {
        if (resultsExist) {
            //take out list elems
            resultsList.innerHTML = ' ';
            resultsExist = false;
            hideElements(clearButton);     //hide clear button
            searchbox.style.display = 'block';   //put the search box back on the page
            searchEntered.value = null;          //clear the contents of the search box
            mainWrapper.style.marginTop = '100px';
            //move the position down
        }
});