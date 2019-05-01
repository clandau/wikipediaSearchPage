
const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="
const urlEnd = "&srprop=snippet&origin=*";
const searchEntered = document.getElementById("searchbox");
const clearButton = document.getElementById('clrBtn');
const resultsList = document.getElementById('output');
const errorDiv = document.getElementById('error');
const searchbox = document.getElementById('searchbox-div');
const parentDiv = document.getElementById('parent-div');
const mainWrapper = document.getElementById('mainWrapper');
let resultsExist = false;  
let clearButtonVisible = false;

searchEntered.addEventListener("keyup", function(e){
    if (e.which === 13 && searchEntered.value) { 
        resultsExist = true;
        hideElements(searchbox);
        let completeUrl = url + searchEntered.value + urlEnd;
        let request = new XMLHttpRequest();
        request.open("GET", completeUrl, true);
        request.onload = function() {
            if (request.status >= 200 && request.status<400) {
                let returnData = JSON.parse(request.responseText);
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
    let resultsNum = data.query.search.length;
    if(resultsNum === 0) {
        console.log('no results found');
        errorDiv.innerHTML="<h3>No results found.</h3>";
        }
    else {
        let url = "https://en.wikipedia.org/wiki/";
        for (let i=0; i<resultsNum; i++) {
            let newLi = document.createElement("li");
            newLi.id = "item" + i;
            let title = data.query.search[i].title;
            newLi.innerHTML += "<h3><a href='" + url + title + "'target='_blank'>" + title + "</a></h3>";
            newLi.innerHTML += '<p>' + data.query.search[i].snippet;
            resultsList.appendChild(newLi);
        }
    }
    
}

function hideElements(loc) {
    loc.style.display === 'none' ? loc.style.display = 'block' : loc.style.display = 'none';
}

clearButton.addEventListener('click', function() {
    errorDiv.innerHTML="";
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