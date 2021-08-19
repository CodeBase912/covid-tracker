import { formatNumber } from "../Util.js";

/**
 * Due to the data schema of this application, we need to export some variables that need to have global scope as they
   are used to update various elements in our mark up.

 * Variablea to export in this file are listed below:
   > @param {object} myChart
     - This variable is an instance of the chart.js object. It holds all the data of our chart in the UI
     - We need this as a global variable to make it easy to update the chart data

   > @param {object} countryTimeSeriesData
     - This variable holds the selected country's timeseries cases, recovered and deaths data
     - The data in this variable is crucial in updating the chart in the app.js module
     - This data is also used to update a child element of the #data-container-2 {DOM-element}. The element, update state and
       reason for doing it this way are listed below:
       o DOM-element: .data-info-data {DOM-element} -> child of: #data-container-info-2 {DOM-element} -> child of: #data-container-2 {DOM-element}
       o State: When the user has selected to view vaccination data (when #covid-data-type-selector {DOM-element}'s value is 
         "Vaccines"). The element in question should therefore display the avaerage daily vaccinations for the past 120 days.
       o REASON: The data this element needs to display is not available when the @function updateCovidDataContainer (in the
         dataContainer.js file) is called in the main app.js module. It is only available once we make an API call for 
         this data when updating the chart. Therefore we update this element in this file for this reason.

*/

export let myChart;
export let countryTimeSeriesData;

// Load chart function

export function loadChart() {

    /**About

     * @function updateChart

     * This function makes an API call for the global COVID-19 cases timeseries data for the past 120 days and lodas
       this data into an instance of the chart.js object/class to and places the chart into the UI. It is called once when
       the application is loaded for the first time.

    */

    const chartTitle = document.querySelector("#chart-title");
    const chartSubTitle = document.querySelector("#chart-subtitle");

    chartTitle.innerHTML = "Worldwide";
    chartSubTitle.innerHTML = "New Cases <span>(last 120 days)</span>";

    // Make an API call for the global COVID-19 cases timeseries data for the past 120 days
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://disease.sh/v3/covid-19/historical/all?lastdays=120", true);
    let data;
    let newData = [];
    let labels = [];
    xhr.onload = function() {
        if (this.status == 200) {
            data = JSON.parse(this.responseText);
            
            let tempData = [];
            for (let i in data) {
                let lastDayData;
                let index;
                let indexedData = [];
                for (let j in data[i]) {
                    if (lastDayData) {
                        indexedData.push({x: j, y: data[i][j] - lastDayData});
                        lastDayData = data[i][j];
                    }
                    else {
                        lastDayData = data[i][j];
                    }
                }
                tempData.push(indexedData);
            }

            // Set the countryTimeSeriesData variable for export into the main app.ja module
            countryTimeSeriesData = {cases: tempData[0], deaths: tempData[1], recovered: tempData[2]};

            const ctx = document.querySelector('#canvas').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Cases',
                        data: countryTimeSeriesData.cases,
                        backgroundColor: 'rgba(255, 166, 0, 0.568)',
                        borderColor: 'rgb(224, 146, 0)',
                        borderWidth: 2,
                        fill: true,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                      display: false,
                      text:'Chart.js Line Chart'
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                        mode: 'index',
                        intersect: false,
                        }
                    },
                    hover: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        x: {
                            grid: {
                                display: '',
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: '',
                            }
                        }
                    }
                }
            });

        }
    }

    xhr.send();
}




// Update chart function

export function updateChart(chart, countryCodeData, vaccinatingCountries) {

    /**About

     * @function updateChart

     * This function updates the chart's timeseries data to be displayed.

     * Input-Variables:
       > @param {object} chart
         - This is the chart this function will update. It is an instance of the chart.js object/class 

       > @param {object} countryCodeData
         - This variable holds the selected country's information data, e.g. country's iso2 code, popolatiion.

       > @param {object} vaccinatingCountries
         - This variable holds all the countries that have reported their vaccination data
         - It is set in the main app.js module

    * **IMPORTANT NOTES**
      > This function is also updates a child element of the #data-container-2 {DOM-element}. The element is listed below:
       o DOM-element: .data-info-data {DOM-element} -> child of: #data-container-info-2 {DOM-element} -> child of: #data-container-2 {DOM-element}

    */


    const covidDataType = document.querySelector("#covid-data-type-selector").value;
    const location = document.querySelector("#location-selector").value;

    if (covidDataType == "Vaccines") {
        // Get and display vaccines data
        if (location == "worldwide") {
            // Get and display worldwide vaccines data
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=120&fullData=false", true);

            let newVaccinationData = [];
            xhr.onload = function() {
                if (this.status == 200) {
                    const data = JSON.parse(this.responseText);
                    let lastDayData;
                    let index = 0;
                    let sumOfTotalVaccinations = 0;
                    for (let i in data) {
                        if (lastDayData) {
                            if (index == 119 && lastDayData == data[i]) {
                                // Do nothing
                            }
                            else {    
                                newVaccinationData.push({x: i, y: data[i] - lastDayData});
                                sumOfTotalVaccinations += (data[i] - lastDayData);
                                lastDayData = data[i];
                            }
                        }
                        else {
                            lastDayData = data[i]
                        }
                        index++;
                    }

                    const averageVaccinationsPerDay = Math.round(sumOfTotalVaccinations / (index - 1));

                    // Update the child element of the #data-container-2 {DOM-element}
                    const casesDataContainer = document.querySelector("#data-container-2");
                    casesDataContainer.querySelector(".data-container-info-1").querySelector(".data-info-data").innerHTML = formatNumber(averageVaccinationsPerDay);
                    
                    // Update the chart
                    const chartTitle = document.querySelector("#chart-title");
                    const chartSubTitle = document.querySelector("#chart-subtitle");

                    chartTitle.innerHTML = "Worldwide";
                    chartSubTitle.innerHTML = "New Vaccinations <span>(last 120 days)</span>";

                    chart.data.datasets[0].data = newVaccinationData;
                    chart.data.datasets[0].backgroundColor = "rgba(0, 0, 255, 0.568)";
                    chart.data.datasets[0].borderColor = "blue";
                    chart.data.datasets[0].label = "Vaccinations";
                    
                    chart.update();
                }
            }

            xhr.send();

        }
        else {
            // Get and display the specific country's vaccine data

            // First determine whether the selected country is vaccinating

            // countryData format: {country: South Africa, countryCode: ZAF}
            const countryData = countryCodeData.find(function(country) {
                if (country.countryCode == location) {
                    return true;
                }
            });

            const vaccinatingCountry = vaccinatingCountries.find(element => element == countryData.country);

            if (vaccinatingCountry) {
                // Get and display the vaccinating country's vaccination data

                const xhr = new XMLHttpRequest();
                xhr.open("GET", `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryData.countryCode}?lastdays=120&fullData=true`, true);

                let newVaccinationData = [];
                xhr.onload = function() {
                    if (this.status == 200) {
                        const data = JSON.parse(this.responseText);
                        // console.log(data.timeline);
                        
                        /**

                         * Ran into charting issues with map() here.
                         * The chart had no fill and was plotting negative values when using the map() method.
                         * The method below (for loop) works particularly when you use the @param lastDayData variable, i.e 
                         * when you leave out the first data point, otherwise you will run into the same problem that map() did.

                        */
                        let lastDayData;
                        let sumOfTotalVaccinations = 0;
                        let index = 119;
                        for (let i in data.timeline) {
                            if (lastDayData) {  
                                newVaccinationData.push({x: data.timeline[i].date, y: data.timeline[i].daily});
                                sumOfTotalVaccinations += data.timeline[i].daily;
                                lastDayData = data.timeline[i].daily;
                            }
                            else {
                                lastDayData = data.timeline[i].daily;
                            }
                        };

                        const averageVaccinationsPerDay = Math.round(sumOfTotalVaccinations / (index - 1));

                        // Update the child element of the #data-container-2 {DOM-element}
                        const casesDataContainer = document.querySelector("#data-container-2");
                        casesDataContainer.querySelector(".data-container-info-1").querySelector(".data-info-data").innerHTML = formatNumber(averageVaccinationsPerDay);

                        // Update the chart
                        const chartTitle = document.querySelector("#chart-title");
                        const chartSubTitle = document.querySelector("#chart-subtitle");

                        chartTitle.innerHTML = countryData.country;
                        chartSubTitle.innerHTML = "Daily Vaccinations <span>(last 120 days)</span>";

                        chart.data.datasets[0].data = newVaccinationData;
                        chart.data.datasets[0].backgroundColor = "rgba(0, 0, 255, 0.568)";
                        chart.data.datasets[0].borderColor = "blue";
                        chart.data.datasets[0].label = "Vaccinations";
                        chart.update();
                        
                    }
                }

                xhr.send();
            }
            else {
                // Let the user know that the particular country has not reported any vaccination data

            }


        }

    }
    else if (covidDataType == "Cases") {
        // Get and display cases data
        if (location == "worldwide") {
            // Get and display worldwide cases data
            
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://disease.sh/v3/covid-19/historical/all?lastdays=120");
            let data;
            let newData = [];
            let labels = [];
            xhr.onload = function() {
                if (this.status == 200) {
                    data = JSON.parse(this.responseText);

                    let tempData = [];
                    for (let i in data) {
                        let lastDayData;
                        let index;
                        let indexedData = [];
                        for (let j in data[i]) {
                            if (lastDayData) {
                                indexedData.push({x: j, y: data[i][j] - lastDayData});
                                lastDayData = data[i][j];
                            }
                            else {
                                lastDayData = data[i][j];
                            }
                        }
                        tempData.push(indexedData);
                    }

                    countryTimeSeriesData = {cases: tempData[0], deaths: tempData[1], recovered: tempData[2]};
                    
                    const chartTitle = document.querySelector("#chart-title");
                    const chartSubTitle = document.querySelector("#chart-subtitle");

                    chartTitle.innerHTML = "Worldwide";
                    chartSubTitle.innerHTML = "Daily Cases <span>(last 120 days)</span>";

                    chart.data.datasets[0].data = countryTimeSeriesData.cases;
                    chart.data.datasets[0].backgroundColor = "rgba(255, 166, 0, 0.568)";
                    chart.data.datasets[0].borderColor = "rgb(224, 146, 0)";
                    chart.data.datasets[0].label = "Cases";
                    chart.update();
                }
            }

            xhr.send();
        }
        else {
            // Get and display the specific country's cases data

            // First get the name of the country selected using its iso code
            // countryData format: {country: South Africa, countryCode: ZAF}
            const countryData = countryCodeData.find(function(country) {
                if (country.countryCode == location) {
                    return true;
                }
            });

            const xhr = new XMLHttpRequest();
            xhr.open("GET", `https://disease.sh/v3/covid-19/historical/${location}?lastdays=120`, true);

            xhr.onload = function() {
                if (this.status == 200) {
                    const data = JSON.parse(this.responseText);
                    
                    let tempData = [];
                    for (let i in data.timeline) {
                        let lastDayData;
                        let index;
                        let indexedData = [];
                        for (let j in data.timeline[i]) {
                            if (lastDayData) {
                                indexedData.push({x: j, y: data.timeline[i][j] - lastDayData});
                                lastDayData = data.timeline[i][j];
                            }
                            else {
                                lastDayData = data.timeline[i][j];
                            }
                        }
                        tempData.push(indexedData);
                    }

                    countryTimeSeriesData = {cases: tempData[0], deaths: tempData[1], recovered: tempData[2]};

                    const chartTitle = document.querySelector("#chart-title");
                    const chartSubTitle = document.querySelector("#chart-subtitle");

                    chartTitle.innerHTML = countryData.country;
                    chartSubTitle.innerHTML = "New Cases <span>(last 120 days)</span>";

                    chart.data.datasets[0].data = countryTimeSeriesData.cases;
                    chart.data.datasets[0].backgroundColor = "rgba(255, 166, 0, 0.568)";
                    chart.data.datasets[0].borderColor = "rgb(224, 146, 0)";
                    chart.data.datasets[0].label = "Cases";
                    chart.update();
                }
                else if (this.status == 404) {
                    const data = JSON.parse(this.responseText);
                    alert(data.message+". We therefore cannot plot any historical data for this country.");
                }
            }

            xhr.send();
            
        }
    }
}




// Switch chart data function

export function switchChartData(dataToDisplay, chart, countryTimeSeriesData) {

    /**About

     * @function switchChartData

     * This function updates the chart's timeseries data to be displayed determined by the @param dataToDisplay variable.

     * Input-Variables:
       > @param {string} dataToDisplay
         - This variable holds a string value that is either of the three: Cases, Recoveries or Deaths.

       > @param {object} chart
         - This is the chart this function will update. It is an instance of the chart.js object/class.

       > @param {object} countryTimeSeriesData
         - This variable holds the selected country's timeseries cases, recovered and deaths data.

     * **IMPORTANT NOTES**
      > This function is also updates a child element of the #data-container-2 {DOM-element}. The element is listed below:
       o DOM-element: .data-info-data {DOM-element} -> child of: #data-container-info-2 {DOM-element} -> child of: #data-container-2 {DOM-element}

    */

    if (dataToDisplay == "Cases") {
        const chartSubTitle = document.querySelector("#chart-subtitle");

        chartSubTitle.innerHTML = "New Cases <span>(last 120 days)</span>";

        chart.data.datasets[0].data = countryTimeSeriesData.cases;
        chart.data.datasets[0].backgroundColor = "rgba(255, 166, 0, 0.568)";
        chart.data.datasets[0].borderColor = "rgb(224, 146, 0)";
        chart.data.datasets[0].label = "Cases";
        chart.update();
    }
    else if (dataToDisplay == "Recoveries") {
        const chartSubTitle = document.querySelector("#chart-subtitle");

        chartSubTitle.innerHTML = "Daily Recoveries <span>(last 120 days)</span>";

        chart.data.datasets[0].data = countryTimeSeriesData.recovered;
        chart.data.datasets[0].backgroundColor = "rgba(0, 128, 0, 0.555)";
        chart.data.datasets[0].borderColor = "green";
        chart.data.datasets[0].label = "Recoveries";
        chart.update();
    }
    else if (dataToDisplay == "Deaths") {
        const chartSubTitle = document.querySelector("#chart-subtitle");

        chartSubTitle.innerHTML = "Daily Deaths <span>(last 120 days)</span>";

        chart.data.datasets[0].data = countryTimeSeriesData.deaths;
        chart.data.datasets[0].backgroundColor = "rgba(255, 0, 0, 0.568)";
        chart.data.datasets[0].borderColor = "red";
        chart.data.datasets[0].label = "Deaths";
        chart.update();
    }
}