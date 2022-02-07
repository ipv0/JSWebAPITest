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

let heliumHotspots = [
    {
        name: "fancy-malachite-finch",
        addr: "112eWDcZZGYGyzuTYBnfD727KnFknDhkNZAr3rU8sQHG2oqpVfps"
    },
    {
        name: "Test-box-two",
        addr: "randomaddrdasdasd"
    },
    {
        name: "Test-Box-Three",
        addr: "randomaddr2"
    }
]


const p = (text) => console.log(text);


/* --- JQuery animations and stuff --- */
$(document).ready(function() {
    console.log('jQuery: document ready event')
    $('#navbar').hide().fadeIn(300);

    $('#navbar a').click(function() {
        $(this).fadeOut(60).fadeIn(40);
    })

    // If nothing is saved in localstorage, put default values in there
    if( !window.localStorage.getItem('hotspots') ) {
        window.localStorage.setItem('hotspots', JSON.stringify(heliumHotspots));
    }

    assignEventListeners();

});

/* --- Event listeners assignment --- */
let assignEventListeners = function () {
    p('assignEventListeners func called');

    const weatherLink = document.querySelector('#link-2');
    const apiLink     = document.querySelector('#link-3');
    const setupLink   = document.querySelector('#link-4');
    
    const loadWeatherButton = document.querySelector('#loadWeatherButton');
    

    apiLink.addEventListener('click', function () {
        apiLinkClick();
    });

    // when assigning event listener callbacks like that, remember
    // not to put brackets after the  funcktion name, like below
    weatherLink.addEventListener('click', weatherLinkClick);

    setupLink.addEventListener('click', setupLinkClick);

    }

function testButtonClick () {
    p('testButton Click');
   
    getWeatherData();
    //$("#dialog").dialog();

    getAddrByName('fancy-malachite-finch');
}

function reloadHeliumAPIButtonClick() {
    getHeliumAPIData();
    p('reload helium api button clicked');
}

/* Weather Button / Menu Link */ 
function weatherLinkClick() {
   
 
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

    getWeatherData();
}


/* ------------------------------------------- */
function apiLinkClick() {
    p('API Button clicked');
    /* write the rest here... */

    // load the list of hotspots (array of objects) from localStorage
    let fromLocalStorage = JSON.parse(window.localStorage.getItem('hotspots'));

    let sampleText = `
    <br />
    <button id = 'reloadHeliumAPIButton' class = 'button'>
    Reload Helium API Data
    </button>
    <p id = "stuffText">  </p>
    `;
    createBox("Helium API", sampleText);

    // create a div that contains individual data boxes
    createDataBoxesDiv(function() {

        // create databoxes for each ently in the list of hotspots, give them
        // ID's accordingly, number them from 1 to n
        let counter = 1;
        for (let hotspot of fromLocalStorage) {
            createDataBox('apiBox'+counter, 200, hotspot.name);
            counter++;
        }

    });

    /* Assign the click event listener to the helium reload button */
    let reloadHeliumAPIbutton = document.querySelector('#reloadHeliumAPIButton');
    reloadHeliumAPIButton.addEventListener('click', reloadHeliumAPIButtonClick);

    getHeliumAPIData();

}
/* -------------------------------------------- */

function setupLinkClick() {
    p('link4 click');

    createBox("Setup", "Configure which hotspots to keep track of.");

    // take that array from local storage
    let fromLocalStorage = JSON.parse(window.localStorage.getItem('hotspots'));

    // iterate thru that array of objects creating databoxes for each one
    createDataBoxesDiv(function() {
        let counter = 1;

        for (let item of fromLocalStorage) {

            let formHTML = `
            <label for=\'hotspotName${counter}\' class=\'input-label\'>
            Hotspot # ${counter}
            </label>
            <input type=\'text\' name=\'hotspotName${counter}\' class=\'input-field-name\' 
            id=\'hotspotName${counter}\' 
            value=\'${item.name}\'>
            <label for=\'hotspotAddr${counter}\' class=\'input-label\' id = \'blockchainAddrLabel\'>
            Blockchain Address:
            </label>
            <input type=\'text\' name=\'hotspotAddr${counter}\' class=\'input-field-addr\' 
            id=\'hotspotName${counter}\' value=\'${item.addr}\'>
            <a href = \'#\' id='inputFieldGetAddrLink${counter}' class = \'input-field-get-addr-link\'
            title=\'Click here to retrieve the blockchain addres of the hotspot by name.\'> Get address from name </a>
            `;

            createDataBox('setupBox'+counter, 100, formHTML);

            document.querySelector(`#inputFieldGetAddrLink${counter}`)
            .addEventListener('click', getAddrLinkClick);


            counter++;
        }

        let addHotspotButtonHTML = `
        <button class='button add-hotspot-button'>+ </button>
        `;

        createDataBox('addHotspotButton', 100, addHotspotButtonHTML);


    }); 

    /* Create a button to update the heliumHotspots array of objects. Assign function to it. */
    let updateButton = document.createElement("button");
    updateButton.className = "button";
    updateButton.innerHTML = "Update Settings";
    updateButton.addEventListener("click", updateInputFields)
    
    let boxContent = document.querySelector("#boxContent");     
    boxContent.appendChild(updateButton);

     
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
    return (kelvins - 273).toFixed(1); // round to one decimal space
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
/* TODO !!! Iterate thru helium hotspots requesting data for each one !!!*/
async function getHeliumAPIData() {

    let fromLocalStorage = JSON.parse(window.localStorage.getItem('hotspots'));
    heliumHotspots = fromLocalStorage;

    p("heliumHotspots array: " + heliumHotspots);

    let counter = 1;
    for (item of heliumHotspots) {

       // p(item)

        let query_name = heliumAPI.hotspotsByName + item.name;
        let query_rewards_week = heliumAPI.rewardsForHotspot(item.addr, "-1%20week")
        let query_rewards_month = heliumAPI.rewardsForHotspot(item.addr, "-4%20week")
        let query_rewards_day = heliumAPI.rewardsForHotspot(item.addr, "-1%20day")

        p(query_rewards_week);

        await fetch(query_name)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            p(data.data[0].name);
            document.querySelector('#apiBox'+counter).innerHTML = 
            "<h5 class=\'data-box-header\'>Hotspot: </h5>" + 
            "<p class=\'small-text\'>" + data.data[0].name + "</p>";     
        });

        await fetch(query_rewards_day)
        .then(response => response.json())
        .then(data => {
            p(data);
            document.querySelector('#apiBox'+counter).innerHTML += 
            "<h6 class=\'data-box-header\'>Rewards Per Day: </h6>" + 
            "<p class=\'small-text\'>" + Number(data.data.total).toFixed(3) + 
            " HNT </p>";
            
        }).then(

        await fetch(query_rewards_week)
        .then(response => response.json())
        .then(data => {
            p(data);
            document.querySelector('#apiBox'+counter).innerHTML += 
            "<h6 class=\'data-box-header\'>Rewards Per Week: </h6>" + 
            "<p class=\'small-text\'>" + Number(data.data.total).toFixed(3) + 
            " HNT </p>";
            
        })).then(

        await fetch(query_rewards_month)
        .then(response => response.json())
        .then(data => {
            p(data);
            document.querySelector('#apiBox'+counter).innerHTML += 
            "<h6 class=\'data-box-header\'>Rewards Per Month: </h6>" + 
            "<p class=\'small-text\'>" + Number(data.data.total).toFixed(3) + 
            " HNT </p>";
            
        }));

        counter++;
    }

}

/* Read input fields from the Setup page, update heliumHotspots array accordingly */

function updateInputFields() {
    let fields = document.getElementsByClassName("input-field-name");
    let addrFields = document.getElementsByClassName("input-field-addr");
    p(fields);

    heliumHotspots = [];

    let counter = 0;
    for (let field of fields) {
        heliumHotspots.push({
            name: field.value,
            addr: addrFields[counter].value
        });
        counter++;
    }

    p(heliumHotspots)

    // put the hotspots array of objects into local storage
    window.localStorage.setItem('hotspots', JSON.stringify(heliumHotspots));

}


// Get hotspot's blockchain address by its name
async function getAddrByName(name) {
    let addr;

    query_name = heliumAPI.hotspotsByName + name;

    await fetch(query_name)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        addr = result.data[0].address
       // p(addr);   
    });

    return addr;
}

/* IMPLEMENT THIS ONE */
/* Actions to perform after clickin the "Get Addr From Name" link */
function getAddrLinkClick() {

    // find parent node and get values from the input fields
    let currentBoxName = this.parentNode.children[1].value;
    let currentBoxAddr = this.parentNode.children[3].value

    p(`${currentBoxName} - ${currentBoxAddr}`);

    // request a Promise, and when fullfilled, change the value of the input box for Addr
    getAddrByName(currentBoxName).then(val => {
        this.parentNode.children[3].value = val;
    });

}
