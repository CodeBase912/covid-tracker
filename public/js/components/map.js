import { formatNumber } from "../Util.js";

/**
 * Due to the data schema of this application, we need to export some variables that need to have global scope as they
   are used to update various elements in our mark up.

 * Variables to export in this file are listed below:
   > @param {object} myMap
     - This variable holds the map data which is an instance of the leaflet map.

   > @param {object} circles
     - This variable holds a list of the specific country data for each country to be displayed on the map and is also 
       an instance of the leaflet map.

*/

export let myMap;

export let circles = [];


// Load map function

export function loadMap(data, countryCodeData) {

    /**About

     * @function loadMap
       - This functions loads the map into the UI when the application is loaded the first time

     * Input-Variables:
       > @param {object} data
        - This variable holds all the COVID-19 data of all the countries that have reported their COVID-19 data.

       > @param {object} countryCodeData
        - This variable holds the selected country's information data, e.g. country's iso2 code, popolatiion.

    */

    // let totalGlobalCases = 0;
    // let totalGlobalRecoveries = 0;
    // let totalGlobalDeaths = 0;
    // data.map(country => {
    //     totalGlobalCases += country.cases;
    //     totalGlobalRecoveries += country.recovered;
    //     totalGlobalDeaths += country.deaths;
    // });

    // Seeting up the map
    myMap = L.map('map').setView([10, 10], 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/tshepo9099/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'ckrhmtx696i2v17nrv3xlpf32',  // Style ID
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoidHNoZXBvOTA5OSIsImEiOiJja241eHB6angwMHdxMm5wNDhrN2x3NmsyIn0.hMWAGonGLalHbmqJwzqEAA'
    }).addTo(myMap);

    // Setting Up the popups
    countryCodeData.map(country => {
        circles.push(L.circle([country.latitude, country.longitude], {
            color: 'rgb(224, 146, 0)',
            fillColor: 'rgba(255, 166, 0, 0.568)',
            fillOpacity: 0.5,
            radius: 200 * (Math.sqrt(country.cases))
        }).addTo(myMap).bindPopup(`
        <div class="popUp-flag-wrapper"><img src="${country.flagURL}" alt="${country.country}'s flag" class="popUp-flag" /></div>
        <div class="popUp-details-wrapper">
            <h3 class="popUp-title">${country.country}</h3>
            <div class="popUp-info"><b>Cases:</b> ${formatNumber(country.cases)}</div>
            <div class="popUp-info"><b>Recoveries:</b> ${formatNumber(country.recoveries)}</div>
            <div class="popUp-info"><b>Deaths:</b> ${formatNumber(country.deaths)}</div>
        </div>
        `, {
            'maxWidth': '400',
            'width': '200',
            'className' : 'popupCustom'
          }
          ));
        })

}



// Set map view function

export function setMapView(myMap, circles, countryCodeData) {

  /**About

   * @function setMapView
     - This function sets the map view to the location of the selected country or the center of the world map if worldwide
       is selected

   * Input-Variables:
    > @param {object} myMap
     - This variable holds the map data which is an instance of the leaflet map.

    > @param {object} countryCodeData
      - This variable holds the selected country's information data, e.g. country's iso2 code, popolatiion.

  */

  const covidDataType = document.querySelector("#covid-data-type-selector").value;
  const location = document.querySelector("#location-selector").value;

  if (covidDataType == "Cases") {
    if (location == "worldwide") {

      myMap.setView([10, 10], 2);
      myMap.closePopup();

      circles.map(circle => {
        circle.setStyle({color: 'rgb(224, 146, 0)', fillColor: 'rgba(255, 166, 0, 0.568)'});
      });

    }
    else {
      // Determine which country was selected and set the map view to it

      let selectedCountry;
      const selectedCountryIndex = countryCodeData.findIndex(function(country) {
        if (country.countryCode == location) {
          selectedCountry = country;
          return true;
        }
      });

      myMap.setView([selectedCountry.latitude, selectedCountry.longitude], 5);

      circles[selectedCountryIndex].openPopup();

      circles.map(circle => {
        circle.setStyle({color: 'rgb(224, 146, 0)', fillColor: 'rgba(255, 166, 0, 0.568)'});
      });
    }
  }
  else if (covidDataType == "Vaccines") {
    if (location == "worldwide") {

      myMap.setView([10, 10], 2);
      myMap.closePopup();

    }
    else {
      // Determine which country was selected and set the map view to it

      let selectedCountry;
      const selectedCountryIndex = countryCodeData.findIndex(function(country) {
        if (country.countryCode == location) {
          selectedCountry = country;
          return true;
        }
      });

      myMap.setView([selectedCountry.latitude, selectedCountry.longitude], 5);

      circles[selectedCountryIndex].openPopup();
    }
  }
}



// Switch map display data function

export function switchMapData(myMap, circles, dataToDisplay, countryCodeData) {

  /**About

   * @function setMapView
     - This function sets the map view to the location of the selected country or the center of the world map if worldwide
       is selected

   * Input-Variables:
    > @param {object} myMap
     - This variable holds the map data which is an instance of the leaflet map.

    > @param {object} circles
     - This variable holds a list of the specific country data for each country to be displayed on the map and is also 
       an instance of the leaflet map.

    > @param {string} dataToDisplay
         - This variable holds a string value that is either of the three: Cases, Recoveries or Deaths.

    > @param {object} countryCodeData
      - This variable holds the selected country's information data, e.g. country's iso2 code, popolatiion.

  */

  const covidDataType = document.querySelector("#covid-data-type-selector").value;
  const location = document.querySelector("#location-selector").value;

  if (covidDataType == "Cases") {
    if (dataToDisplay == "Cases") {
      // Set the corresponding color to the map circles

      for (let i in countryCodeData) {
        circles[i].setStyle({color: 'rgb(224, 146, 0)', fillColor: 'rgba(255, 166, 0, 0.568)', radius: 200 * (Math.sqrt(countryCodeData[i].recoveries))});
      };
    }
    else if (dataToDisplay == "Recoveries") {
      // Set the corresponding color to the map circles

      for (let i in countryCodeData) {
        circles[i].setStyle({color: 'green', fillColor: 'rgba(0, 128, 0, 0.555)', radius: 200 * (Math.sqrt(countryCodeData[i].recoveries))});
      };

      // circles.map(circle => {
      //   circle.setStyle({color: 'green', fillColor: 'rgba(0, 128, 0, 0.555)'});
      // });
    }
    else if (dataToDisplay == "Deaths") {
      // Set the corresponding color to the map circles

      for (let i in countryCodeData) {
        circles[i].setStyle({color: 'red', fillColor: 'rgba(255, 0, 0, 0.568)', radius: 200 * (Math.sqrt(countryCodeData[i].deaths))});
      };

      // circles.map(circle => {
      //   circle.setStyle({color: 'red', fillColor: 'rgba(255, 0, 0, 0.568)'});
      // });
    }
  }
  else if (covidDataType == "Vaccines") {
    // Set the corresponding color to the map circles+

    for (let i in countryCodeData) {
      circles[i].setStyle({color: 'blue', fillColor: 'rgba(0, 0, 255, 0.568)', radius: 200 * (Math.sqrt(countryCodeData[i].deaths))});
    };
  }
}