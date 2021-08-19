import { updateCovidDataContainer } from "./components/dataContainer.js";
import { dataContainerVaccinationData, updateTable } from "./components/table.js";
import { myChart, countryTimeSeriesData, loadChart, updateChart, switchChartData } from "./components/chart.js";
import { myMap, circles, loadMap, setMapView, switchMapData } from "./components/map.js";

/**About

 * Global variables in this file are listed below:
   > @param {object} countryCodeData
     - This variable holds the selected country's information data, e.g. country's iso2 code, popolatiion.

   > @param {object} vaccinatingCountries
     - This variable holds all the countries that have reported their vaccination data.

   > @param {object} dataContainerVaccinationData {import}
     - This variable holds all the vaccination data of all the countries that have reported vacciantion data.

   > @param {object} myChart {import}
     - This variable is an instance of the chart.js object. It holds all the data of our chart in the UI
     - We need this as a global variable to make it easy to update the chart data

   > @param {object} countryTimeSeriesData {import}
     - This variable holds the selected country's timeseries cases, recovered and deaths data
     - The data in this variable is crucial in updating the chart


 * Global Functions in this file are listed below:
   > @function showSelection
     - This variable holds the selected country's information data, e.g. country's iso2 code, popolatiion.

   > @function removeSelection
     - This variable holds all the countries that have reported their vaccination data.

*/

let countryCodeData = [];
let vaccinatingCountries = [];
window.addEventListener("DOMContentLoaded", () => {
    // Run ajax call to the api for the covid cases data
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://disease.sh/v3/covid-19/countries", true);
    let data;
    xhr.onload = function() {
        if (this.status == 200) {
            data = JSON.parse(this.responseText);
            
            data.map(country => {
                countryCodeData.push({country: country.country, countryCode: country.countryInfo.iso2, population: country.population, flagURL: country.countryInfo.flag, latitude: country.countryInfo.lat, longitude: country.countryInfo.long, cases: country.cases, recoveries: country.recovered, deaths: country.deaths});
            });
            
            // How to find the country code of a particular country
            // console.log(countryCodeData.find(function(country) {
            //     if (country.countryCode == "ZA") {
            //         return true;
            //     }
            // }));

            addCountriesToSelector(data);
            updateCovidDataContainer();
            updateTable();
            loadChart();
            loadMap(data, countryCodeData);

            showSelection(dataContainer1, dataContainer2, dataContainer3, "orange");
        }
    }

    xhr.send();

    const xhrVaccine = new XMLHttpRequest();
    xhrVaccine.open("GET", "https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1&fullData=false", true);

    xhrVaccine.onload = function() {
        if (this.status == 200) {
            data = JSON.parse(this.responseText);

            data.map(country => {
                vaccinatingCountries.push(country.country);
            })
        }
    }

    xhrVaccine.send();
});


const dataTypeSelector = document.querySelector("#covid-data-type-selector");
const locationSelector = document.querySelector("#location-selector");
const dataContainer1 = document.querySelector("#data-container-1");
const dataContainer2 = document.querySelector("#data-container-2");
const dataContainer3 = document.querySelector("#data-container-3");


dataTypeSelector.addEventListener("change", () => {
    const dataTypeToDisplay = dataTypeSelector.value;

    
    const dataToDisplay = dataContainer1.querySelector(".data-container-title").innerHTML;

    
    switchMapData(myMap, circles, dataToDisplay, countryCodeData);
    
    if (dataTypeSelector.value == "Cases") {
        updateCovidDataContainer();
        updateTable();
        updateChart(myChart, countryCodeData, vaccinatingCountries);
        switchMapData(myMap, circles, "Cases", countryCodeData);
        
        showSelection(dataContainer1, dataContainer2, dataContainer3, "orange");
    }
    else if (dataTypeSelector.value == "Vaccines") {
        updateTable();
        updateCovidDataContainer(dataContainerVaccinationData, countryCodeData);
        updateChart(myChart, countryCodeData, vaccinatingCountries);

        removeSelection(dataContainer1, dataContainer2, dataContainer3);
    }
});

locationSelector.addEventListener("change", () => {
    updateCovidDataContainer(dataContainerVaccinationData, countryCodeData);
    
    updateChart(myChart, countryCodeData, vaccinatingCountries);

    setMapView(myMap, circles, countryCodeData);
        
    if (dataTypeSelector.value == "Cases") {   
        showSelection(dataContainer1, dataContainer2, dataContainer3, "orange");
    }
})


dataContainer1.addEventListener("click", () => {
    if (dataTypeSelector.value == "Cases") {
        const dataToDisplay = dataContainer1.querySelector(".data-container-title").innerHTML;

        switchChartData(dataToDisplay, myChart, countryTimeSeriesData);
        switchMapData(myMap, circles, dataToDisplay, countryCodeData);

        showSelection(dataContainer1, dataContainer2, dataContainer3, "orange");
    }
});


dataContainer2.addEventListener("click", () => {
    if (dataTypeSelector.value == "Cases") {
        const dataToDisplay = dataContainer2.querySelector(".data-container-title").innerHTML;

        switchChartData(dataToDisplay, myChart, countryTimeSeriesData);
        switchMapData(myMap, circles, dataToDisplay, countryCodeData);

        showSelection(dataContainer2, dataContainer1, dataContainer3, "green");
    }
});


dataContainer3.addEventListener("click", () => {
    if (dataTypeSelector.value == "Cases") {
        const dataToDisplay = dataContainer3.querySelector(".data-container-title").innerHTML;

        switchChartData(dataToDisplay, myChart, countryTimeSeriesData);
        switchMapData(myMap, circles, dataToDisplay, countryCodeData);

        showSelection(dataContainer3, dataContainer1, dataContainer2, "red");
    }
});





// app.js Global Functions

function addCountriesToSelector(data) {

    /**About
     * @function addCountriesToSelector

     * This function ,as the name states, adds countries to the #location-selector component in our mark up

     * Input-Varibles:
       > @param {object} data
         - This variable holds all the COVID-19 cases data of all the countries tha that have reported their data
         - It contains the current cases data for each country

    */

    const locationSelector = document.querySelector("#location-selector");
    let output = `<option value="worldwide" class="country-option" selected>Worldwide</option>`;
    data.map(country => {
        output += `<option value="${country.countryInfo.iso2}" class="country-option">${country.country}</option>`;
    });

    locationSelector.innerHTML = output;
}


function showSelection(selectedDataContainer, otherContainer1, otherContainer2, color) {

    /**About 

     * @function showSelection

     * This function will change the styling of the #covid-data-container {DOM-element's child elements to reflected
       the active state of the selected cheld element.

     * Input-Variables:
       > @param {DOM} selectedDataContainer
         - This is the selected container (child element) that is active.

       > @param {DOM} otherContainer1
         - This is the container (child element) that is inactive/not selected. Will have a default style.

       > @param {DOM} otherContainer1
         - This is the container (child element) that is inactive/not selected. Will have a default style.

       > @param {string} color
         - This variable is a string value that is either of the three: orange, green or red. Each color reflects which
           data is displayed in the UI.
         - Orange: Cases data; Green: Recoveries data; Red: Deaths data.

    */

    selectedDataContainer.querySelector(".selection-indicator").style.width = "30px";
    selectedDataContainer.querySelector(".selection-indicator").style.background = color;
    selectedDataContainer.style.border = "2px solid " + color;

    otherContainer1.querySelector(".selection-indicator").style.width = "0px";
    otherContainer1.style.border = "2px solid white";

    otherContainer2.querySelector(".selection-indicator").style.width = "0px";
    otherContainer2.style.border = "2px solid white";
}

function removeSelection(dataContainer1, dataContainer2, dataContainer3) {

    /**About

     * @function removeSelection

     * This function will change the styling of the #covid-data-container {DOM-element}'s child elements to restore them to 
       their default (unselected) state. This is useful when diaplaying the vaccination data. To ensure that the UI is not 
       confusing to the user.

     * Input-Variables:
       > @param {DOM} dataContainer1
         - This is the first container (child element) in the #covid-data-container {DOM-element}.

       > @param {DOM} dataContainer2
         - This is the second container (child element) in the #covid-data-container {DOM-element}.

       > @param {DOM} dataContainer3
         - This is the third container (child element) in the #covid-data-container {DOM-element}.

    */

    dataContainer1.querySelector(".selection-indicator").style.width = "0px";
    dataContainer2.querySelector(".selection-indicator").style.width = "0px";
    dataContainer3.querySelector(".selection-indicator").style.width = "0px";

    
    dataContainer1.style.border = "2px solid white";
    dataContainer2.style.border = "2px solid white";
    dataContainer3.style.border = "2px solid white";
}