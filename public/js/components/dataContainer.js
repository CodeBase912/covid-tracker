import { formatNumber } from '../Util.js';

export function updateCovidDataContainer(
  dataContainerVaccinationData,
  countryCodeData
) {
  /**About

     * @function updateCovidDataContainer

     * This function updates the #covid-data-container container in our markup. It does this depending on the state of the
       #covid-data-type-selector and #location-selector elements in our mark up


     * Input-Varibles:
       > @param {object} dataContainerVaccinationData
         - This variable holds all the vaccination data of all the countries that have reported vacciantion data.
         - It holds vaccination data for previous day.

       > @param {object} countryCodeData
         - This variable holds the selected country's information data, e.g. country's iso2 code, popolatiion.
    

     * **IMPORTANT NOTES**
       > There are some instances where some elements in the #covid-data-container container are not updated in this 
         function. This is done in order to reduce the number of API calls made each time the state of the UI changes.

       > These elements are listed below with their state and reason why the above is done:
         - .data-info-data {DOM-element} -> child of: #data-container-info-2 {DOM-element} -> child of: #data-container-2 {DOM-element}
           o STATE: When the user has selected to view vaccination data (when #covid-data-type-selector {DOM-element}'s value is 
             "Vaccines"). The element in question should therefore display the avaerage daily vaccinations for the past 
             120 days.
           o REASON: The data this element needs to display is not available when this function is called in the main 
             app.js module. It is only available once we make the API call for this data when updating the 
             chart (in the chart.js file). Therefore we update this element in the chart.js file for this reason.

    */

  const covidDataContainer = document.querySelector('#covid-data-container');
  const covidDataType = document.querySelector(
    '#covid-data-type-selector'
  ).value;
  const location = document.querySelector('#location-selector').value;

  if (covidDataType == 'Cases') {
    // Display Covid Cases Data
    const casesDataContainer =
      covidDataContainer.querySelector('#data-container-1');
    const recoveriesDataContainer =
      covidDataContainer.querySelector('#data-container-2');
    const deathsDataContainer =
      covidDataContainer.querySelector('#data-container-3');

    deathsDataContainer.hidden = false;
    recoveriesDataContainer.style.marginRight = '30px';

    if (location == 'worldwide') {
      // Get and display Worldwide COvid Cases Data
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://disease.sh/v3/covid-19/all', true);
      let data;
      xhr.onload = function () {
        if (this.status == 200) {
          data = JSON.parse(this.responseText);

          // Set Data Container titles
          casesDataContainer.querySelector('.data-container-title').innerHTML =
            'Cases';
          recoveriesDataContainer.querySelector(
            '.data-container-title'
          ).innerHTML = 'Recoveries';
          deathsDataContainer.querySelector('.data-container-title').innerHTML =
            'Deaths';

          // Set Data Container Info-1 titles and data
          casesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-title').innerHTML = 'New';
          casesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.todayCases
          );
          recoveriesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-title').innerHTML = 'New';
          recoveriesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.todayRecovered
          );
          deathsDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-title').innerHTML = 'New';
          deathsDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.todayDeaths
          );

          // Set Data Container Info-2 titles and data
          casesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-title').innerHTML = 'Total';
          casesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.cases
          );
          recoveriesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-title').innerHTML = 'Total';
          recoveriesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.recovered
          );
          deathsDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-title').innerHTML = 'Total';
          deathsDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.deaths
          );
        }
      };

      xhr.send();
    } else {
      // Get and Display the particular country's data
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        `https://disease.sh/v3/covid-19/countries/${location}?strict=true`,
        true
      );
      let data;
      xhr.onload = function () {
        if (this.status == 200) {
          data = JSON.parse(this.responseText);

          // Set Data Container titles
          casesDataContainer.querySelector('.data-container-title').innerHTML =
            'Cases';
          recoveriesDataContainer.querySelector(
            '.data-container-title'
          ).innerHTML = 'Recoveries';
          deathsDataContainer.querySelector('.data-container-title').innerHTML =
            'Deaths';

          // Set Data Container Info-1 titles and data
          casesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-title').innerHTML = 'New';
          casesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.todayCases
          );
          recoveriesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-title').innerHTML = 'New';
          recoveriesDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.todayRecovered
          );
          deathsDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-title').innerHTML = 'New';
          deathsDataContainer
            .querySelector('.data-container-info-1')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.todayDeaths
          );

          // Set Data Container Info-2 titles and data
          casesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-title').innerHTML = 'Total';
          casesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.cases
          );
          recoveriesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-title').innerHTML = 'Total';
          recoveriesDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.recovered
          );
          deathsDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-title').innerHTML = 'Total';
          deathsDataContainer
            .querySelector('.data-container-info-2')
            .querySelector('.data-info-data').innerHTML = formatNumber(
            data.deaths
          );
        }
      };

      xhr.send();
    }
  } else if (covidDataType == 'Vaccines') {
    // Display Covid Vaccination Data
    const casesDataContainer =
      covidDataContainer.querySelector('#data-container-1');
    const recoveriesDataContainer =
      covidDataContainer.querySelector('#data-container-2');
    const deathsDataContainer =
      covidDataContainer.querySelector('#data-container-3');

    deathsDataContainer.hidden = true;
    recoveriesDataContainer.style.marginRight = '0px';

    casesDataContainer.querySelector('.data-container-title').innerHTML =
      'Vaccinations';
    casesDataContainer
      .querySelector('.data-container-info-1')
      .querySelector('.data-info-title').innerHTML = 'Today';

    recoveriesDataContainer.querySelector('.data-container-title').innerHTML =
      'Stats';
    recoveriesDataContainer
      .querySelector('.data-container-info-1')
      .querySelector('.data-info-title').innerHTML =
      'Average (vaccinations per day)';
    recoveriesDataContainer
      .querySelector('.data-container-info-2')
      .querySelector('.data-info-title').innerHTML = 'Vaccination Rate (%)';

    if (location == 'worldwide') {
      /** 
  
             * When the dataContainerVaccinationData variable is not yet defined we fetch the data when updating 
               the table (in table.js) and then set the dataContainerVaccinationData variable and then update the dataContainers from
               there. This is done to minimize the number of API calls.

             * The Avarage vaccinations data is updated from the data collected when updating then chart (in chart.js file) since we 
               need to get the total number of vaccinations from the past 120 days. We update this DOM element from there. This is 
               done to minimize the number API calls.

            */

      if (dataContainerVaccinationData) {
        let totalWorldwideVaccinations = 0;
        let totalNewWorldwideVaccinations = 0;
        dataContainerVaccinationData.map((country) => {
          totalWorldwideVaccinations += country.timeline[0].total;
          totalNewWorldwideVaccinations += country.timeline[0].daily;
        });

        casesDataContainer
          .querySelector('.data-container-info-1')
          .querySelector('.data-info-data').innerHTML = formatNumber(
          totalNewWorldwideVaccinations
        );
        casesDataContainer
          .querySelector('.data-container-info-2')
          .querySelector('.data-info-data').innerHTML = formatNumber(
          totalWorldwideVaccinations
        );
      }
    } else {
      // Display the specific countries vaccination data

      /**

             * The Avarage vaccinations data is updated from the data collected when updating then chart (in chart.js file) since we 
               need to get the total number of vaccinations from the past 120 days. We update this DOM element from there. This is 
               done to minimize the number API calls.

            */

      if (dataContainerVaccinationData) {
        // Format of countryData = {country: "South Africa", countryCode: "ZA"}
        const countryData = countryCodeData.find(function (country) {
          if (country.countryCode == location) {
            return true;
          }
        });

        const countryVaccinationData = dataContainerVaccinationData.find(
          function (country) {
            if (country.country == countryData.country) {
              return true;
            }
          }
        );

        const todaysVaccinations = countryVaccinationData.timeline[0].daily;
        const totalVaccinations = countryVaccinationData.timeline[0].total;
        let vaccinationRate =
          (
            countryVaccinationData.timeline[0].total / countryData.population
          ).toPrecision(4) * 100;

        /**

                 * to.Precision() gave me an issue when dealling with a ratio of eg. 1.045.
                 * Multiplying this by 100 seems to give an precision of something like toPrecision(100) for example.
                 * The if statement below is, therefore, meant to solve this issue.
                 * You definetly have to look into why this is an issue.

                */
        if (vaccinationRate.toString().length >= 5) {
          vaccinationRate = vaccinationRate.toString().slice(0, 5);
        }

        casesDataContainer
          .querySelector('.data-container-info-1')
          .querySelector('.data-info-data').innerHTML =
          formatNumber(todaysVaccinations);
        casesDataContainer
          .querySelector('.data-container-info-2')
          .querySelector('.data-info-data').innerHTML =
          formatNumber(totalVaccinations);

        // recoveriesDataContainer.querySelector(".data-container-info-1").querySelector(".data-info-data").innerHTML = todaysVaccinations;
        recoveriesDataContainer
          .querySelector('.data-container-info-2')
          .querySelector('.data-info-data').innerHTML = vaccinationRate + '%';
      } else {
        // Format of countryData = {country: "South Africa", countryCode: "ZA"}
        const countryData = countryCodeData.find(function (country) {
          if (country.countryCode == location) {
            return true;
          }
        });

        // Get the vaccination data for the dataContainers
        const xhr = new XMLHttpRequest();
        xhr.open(
          'GET',
          'https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1&fullData=true',
          true
        );
        let data;
        xhr.onload = function () {
          if (this.status == 200) {
            data = JSON.parse(this.responseText);

            const countryVaccinationData = data.find(function (country) {
              if (country.country == countryData.country) {
                return true;
              }
            });

            console.log(countryVaccinationData);

            const todaysVaccinations = countryVaccinationData.timeline[0].daily;
            const totalVaccinations = countryVaccinationData.timeline[0].total;
            let vaccinationRate =
              (
                countryVaccinationData.timeline[0].total /
                countryData.population
              ).toPrecision(4) * 100;

            /**

                         * to.Precision() gave me an issue when dealling with a ratio of eg. 1.045.
                         * Multiplying this by 100 seems to give an precision of something like toPrecision(100) for example.
                         * The if statement below is, therefore, meant to solve this issue.
                         * You definetly have to look into why this is an issue.

                        */
            if (vaccinationRate.toString().length >= 5) {
              vaccinationRate = vaccinationRate.toString().slice(0, 5);
            }

            casesDataContainer
              .querySelector('.data-container-info-1')
              .querySelector('.data-info-data').innerHTML =
              formatNumber(todaysVaccinations);
            casesDataContainer
              .querySelector('.data-container-info-2')
              .querySelector('.data-info-data').innerHTML =
              formatNumber(totalVaccinations);

            // recoveriesDataContainer.querySelector(".data-container-info-1").querySelector(".data-info-data").innerHTML = todaysVaccinations;
            recoveriesDataContainer
              .querySelector('.data-container-info-2')
              .querySelector('.data-info-data').innerHTML =
              vaccinationRate + '%';
          }
        };

        xhr.send();
      }
    }
  }
}
