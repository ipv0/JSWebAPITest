/* eslint-disable no-unused-vars */

/* Object with URI's for accessing various parts of the Helium network API */
const heliumAPI = {

    hotspotsByName: "https://api.helium.io/v1/hotspots/name/",
    hotspotsNameSearch: "https://api.helium.io/v1/hotspots/name?search=",
    
    rewardsForHotspot: (addr, time) => {
        return "https://api.helium.io/v1/hotspots/" + addr + "/rewards/sum?min_time=" + time;
    }

}


/* Helium Hotspots and their addresses */
const heliumHotspots = {
    "fancy-malachite-finch" : "112eWDcZZGYGyzuTYBnfD727KnFknDhkNZAr3rU8sQHG2oqpVfps"
}


let p = (text) => { 
    console.log(text);
}

/* --- JQuery animations and stuff --- */
$(document).ready(function() {
    console.log('jQuery: document ready event')
    $('#navbar').hide().fadeIn(300);

    $('#navbar a').click(function() {
        $(this).fadeOut(60).fadeIn(40);
    })

    assignEventListeners();

});

/* --- Event listeners assignment --- */
let assignEventListeners = function () {
    p('assignEventListeners func called');

    const link2Button = document.querySelector('#link-2');
    const apiButton   = document.querySelector('#link-3');
    const link4Button = document.querySelector('#link-4');
    const link5Button = document.querySelector('#link-5');
    const loadWeatherButton = document.querySelector('#loadWeatherButton');

    apiButton.addEventListener('click', function () {
        apiButtonclick();
    });

    // when assigning event listener callbacks like that, remember
    // not to put brackets after the  funcktion name, like below
    link2Button.addEventListener('click', link2Click);

    link4Button.addEventListener('click', link4Click);

    link5Button.addEventListener('click', link5Click);

}

function testButtonClick () {
    p('testButton Click');
   
    getWeatherData();
    //$("#dialog").dialog();
}

/* Weather Button / Menu Link */ 
function link2Click() {
    getWeatherData();
    p(heliumAPI.rewardsForHotspot("test","-1 week"));
    let sampleText = `
    <br />
    <button id = 'loadWeatherButton' class = 'button'>
    Load Weather Data
    </button>
    <p id = "stuffText">  </p>
    `;
    createBox("Weather", sampleText);

    // creates the container for data boxes, then adds individual boxes 
    // createDataBox(Box CSS Id, box FadeIn Time, Box Content)
    createDataBoxesDiv(function() {
        createDataBox('temperatureBox', 500, 'Temp.');
        createDataBox('feelsLikeBox', 800, 'Feels File');
        createDataBox('tempMinBox', 1100, 'Temp. Min.');
        createDataBox('humidityBox', 1400, 'Humidity');
        createDataBox('humidityBox2', 1700, 'Test1 <br /> data');
        createDataBox('humidityBox3', 2000, 'Test2 <br /> data');
    });

    // assign event listener to the load weather button that appears on the weather page
    if (loadWeatherButton)
        loadWeatherButton.addEventListener("click", testButtonClick);
}


/* ------------------------------------------- */
function apiButtonclick() {
    p('API Button clicked');
    /* write the rest here... */

    getHeliumAPIData();

    let sampleText = '';
    createBox("Helium API", sampleText);

    createDataBoxesDiv(function() {
        createDataBox('apiBox1', 1200, 'Test1 <br /> data');
        createDataBox('apiBox2', 1400, 'Test2 <br /> data');
        createDataBox('apiBox3', 1600, 'Test3 <br /> data');
        createDataBox('apiBox4', 1800, 'Test3 <br /> data');
        createDataBox('apiBox5', 2000, 'Test3 <br /> data');
    });

}
/* -------------------------------------------- */

function link4Click() {
    p('link4 click');

    createBox("Other", "Sample Other Text.");

    createDataBox('asd', 600, 'Feels File');
    
}

function link5Click() {
    createBox("Google", "<a href='#'> Google </a>");
}

let createBox = function(boxTitle, BoxContentHTML) {

    $('#box').remove();

    /* creating the box element where my content will be displayed */
    let box = document.createElement('div'); //creating the actual element
    box.classList.add('box-class'); //adding class
    box.id = 'box'; // adding an id
    box.style.display = 'none'; //making it hidden, so it can later be shown via jQuery
    
    /* creating box title */
    let boxTitleElement = document.createElement('p');
    boxTitleElement.classList.add('box-title-class');
    boxTitleElement.innerText = boxTitle;
    
    document.getElementById('content').append(box); //add the box to the DOM
    box.append(boxTitleElement);//add the box title element to the box

    /* the box that contains the actual thing we need to display */
    let boxContent = document.createElement('div');
    boxContent.id = "boxContent";
    boxContent.classList.add('box-content');
    boxContent.innerHTML = BoxContentHTML;
    box.append(boxContent);

    $('#box').fadeIn(200);

}

/* 
    PASS THE INDIVIDUAL DATA BOX CREATION FUNCTIONS INTO THE
    CREATEDATABOXESDIV() FUNCTION BELOW.
*/
function createDataBoxesDiv(func) {
    let boxContent = document.querySelector('#boxContent');
    let dataBoxesDiv = document.createElement('div');
   
    dataBoxesDiv.id = 'dataBoxesDiv';

    boxContent.append(dataBoxesDiv);

    func();
}


// --- creates little boxes with given parameters and data ---
function createDataBox(boxId, boxFadeTime, boxContentHTML) {

    // the container box created by cerateDataBoxesDiv(), where the little boxes will be added. 
    let dataBoxesDiv = document.querySelector('#dataBoxesDiv');

    let dataBox = document.createElement('div');
    dataBox.id = boxId;
    dataBox.classList.add('dataBox');
    dataBox.innerHTML = boxContentHTML;

    dataBoxesDiv.append(dataBox);

    $("#" + boxId).hide();
    $("#" + boxId).fadeIn(boxFadeTime);
}


// Converts temperature from K to C
function convertTemperature(kelvins) {
    return (kelvins - 273).toFixed(2);
}

function getWeatherData() {
    let temp = 0;
    let apik = "3045dd712ffe6e702e3245525ac7fa38"
    let query = 'https://api.openweathermap.org/data/2.5/weather?q=Toronto'+'&appid='+apik;

    fetch(query)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        temp = convertTemperature(data.main.temp);
        document.querySelector('#temperatureBox').innerHTML = 
        "Temp. <br />" + temp + " &#176;C";

        temp = convertTemperature(data.main.temp_min);
        document.querySelector('#tempMinBox').innerHTML = 
        "Temp. Min.<br />" + temp + " &#176;C";

        document.querySelector('#humidityBox').innerHTML = 
        "Humidity <br />" + data.main.humidity + "%";

        temp = convertTemperature(data.main.feels_like);
        document.querySelector('#feelsLikeBox').innerHTML = 
        "Feels Like <br />" + temp + " &#176;C";
        
    });
}

/* Get data for Helium hotspot(s) */
function getHeliumAPIData() {

    let query_name = heliumAPI.hotspotsByName + 'fancy-malachite-finch'
    let query_rewards = heliumAPI.rewardsForHotspot(heliumHotspots["fancy-malachite-finch"], "-1%20week")

    p(query_rewards);

    // fetch(query)
    //     .then(res => res.json()).then(function(data) {p(data)});

    fetch(query_name)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        p(data.data[0].name);
        document.querySelector('#apiBox1').innerHTML = 
        "Hotspot: <br /> <p class=\'small-text\'>" + data.data[0].name + "</p>";
        
    });

    fetch(query_rewards)
    .then(response => response.json())
    .then(data => {
        p(data);
        document.querySelector('#apiBox2').innerHTML = 
        "Rewards Per Week: <br /> <p class=\'small-text\'>" + data.data.total + "</p>";
        
    });


}

