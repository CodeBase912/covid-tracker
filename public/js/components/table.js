import { formatNumber } from "../Util.js";

/**
 * Due to the data schema of this application, we need to export some variables that need to have global scope as they
   are used to update various elements in our mark up.

 * Variables to export in this file are listed below:
   > @param {object} dataContainerVaccinationData
     - This variable holds all the vaccination data of all the countries that have reported vacciantion data.

*/

export let dataContainerVaccinationData;



export function updateTable() {

    /**About

     * @function updateTable 
     
     * This function updates the table that lists the live cases data or vaccination data for all countrires depending on
       the state of the #covid-data-type-selector {DOM-element}.

     * **IMPORTANT NOTES**
       > This function sets the @param dataContainerVaccinationData variable that is needed for export into the main app.js module.

    */

    const tableTitle = document.querySelector("#table-title");
    const table = document.querySelector("#table");
    const covidDataType = document.querySelector("#covid-data-type-selector").value;

    if (covidDataType == "Cases") {
        // Get and Display the covid cases data
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://disease.sh/v3/covid-19/countries", true);
        let data;
        xhr.onload = function() {
            if (this.status == 200) {
                data = JSON.parse(this.responseText);
    
                let activeCases = [];
                data.map(countryData => {
                    activeCases.push({country: countryData.country, cases: countryData.active});
                });
    
                activeCases.sort(function(a, b){return b.cases - a.cases});
    
                let output = ``;
    
                activeCases.map(countryData => {
                    output += `
                        <tr>
                            <td class="table-country">${countryData.country}</td>
                            <td class="table-data">${formatNumber(countryData.cases)}</td>
                        </tr>
                    `;
                })

                tableTitle.innerHTML = "Active Cases by Country"
                table.innerHTML = output;
            }
        }
    
        xhr.send();
    }
    else if (covidDataType == "Vaccines") {
        // Get and Display the covid vaccination data
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1&fullData=true", true);
        let data;
        xhr.onload = function() {
            if (this.status == 200) {
                data = JSON.parse(this.responseText);

                let vaccinationData = [];
                data.map(countryData => {
                    vaccinationData.push({country: countryData.country, dosesAdministered: countryData.timeline[0].total});
                });

                vaccinationData.sort(function(a, b){return b.dosesAdministered - a.dosesAdministered});

                let output = ``;
    
                vaccinationData.map(countryData => {
                    output += `
                        <tr>
                            <td class="table-country">${countryData.country}</td>
                            <td class="table-data">${formatNumber(countryData.dosesAdministered)}</td>
                        </tr>
                    `;
                })

                tableTitle.innerHTML = "Vaccinations by Country"
                table.innerHTML = output;

                // We update this value here to avaoid making another API call to update the dataContainers
                dataContainerVaccinationData = data;

                const covidDataContainer = document.querySelector("#covid-data-container");
                const covidDataType = document.querySelector("#covid-data-type-selector").value;
                const location = document.querySelector("#location-selector").value;

                const casesDataContainer = covidDataContainer.querySelector("#data-container-1");
                const recoveriesDataContainer = covidDataContainer.querySelector("#data-container-2");

                if (location == "worldwide") {
                    let totalWorldwideVaccinations = 0;
                    let totalNewWorldwideVaccinations = 0;
                    dataContainerVaccinationData.map(country => {
                        totalWorldwideVaccinations += country.timeline[0].total;
                        totalNewWorldwideVaccinations += country.timeline[0].daily;
                    });

                    casesDataContainer.querySelector(".data-container-info-1").querySelector(".data-info-data").innerHTML = formatNumber(totalNewWorldwideVaccinations);
                    casesDataContainer.querySelector(".data-container-info-2").querySelector(".data-info-data").innerHTML = formatNumber(totalWorldwideVaccinations);
                }

            }
        }

        xhr.send();
    }
};