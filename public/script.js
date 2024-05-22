document.addEventListener('DOMContentLoaded', function () {
  fetchReadings();
  setInterval(fetchReadings, 60000); // Refresh data every 60000 milliseconds (1 minute)
});

function fetchReadings() {
  axios
    .get('http://localhost:5000/weatherstation/reading')
    .then((response) => {
      const readings = response.data.data.slice(-20).reverse(); // Get the last 20 readings and reverse the order
      updateUI(readings);
    })
    .catch((error) => {
      console.error('Error fetching readings:', error);
      document.getElementById('readings-body').innerHTML =
        '<tr><td colspan="4">Error loading data!</td></tr>';
    });

  axios
    .get('http://localhost:5000/weatherstation/reading/latest')
    .then((response) => {
      const latestReading = response.data.data;
      updateLatestReading(latestReading);
    })
    .catch((error) => {
      console.error('Error fetching latest reading:', error);
      document.getElementById('last-reading-time').innerText = '--';
      document.getElementById('latest-temperature').innerText = '-- °C';
      document.getElementById('latest-humidity').innerText = '-- %';
    });
}

function updateUI(readings) {
  const readingsBody = document.getElementById('readings-body');
  readingsBody.innerHTML = readings
    .map((reading) => {
      const formattedDate = new Date(reading.date).toLocaleString(); // Correct date formatting
      return `
              <tr>
                  <td>${
                    reading.location || 'FEATI Univ'
                  }</td> <!-- Default location if not specified -->
                  <td>${reading.tempInCelsius} °C</td>
                  <td>${reading.humidity} %</td>
                  <td>${formattedDate}</td>
              </tr>
          `;
    })
    .join('');

  if (readings.length > 0) {
    updateStatistics(readings);
  }
}

function updateLatestReading(latestReading) {
  const lastReadingDate = new Date(latestReading.date).toLocaleString();
  document.getElementById('last-reading-time').innerText = lastReadingDate;

  document.getElementById(
    'latest-temperature'
  ).innerText = `${latestReading.tempInCelsius} °C`;
  document.getElementById(
    'latest-humidity'
  ).innerText = `${latestReading.humidity} %`;
}

function updateStatistics(readings) {
  const temperatures = readings.map((reading) => reading.tempInCelsius);
  const humidities = readings.map((reading) => reading.humidity);

  const tempStats = calculateStats(temperatures);
  const humidityStats = calculateStats(humidities);

  document.getElementById('temp-min').innerText = tempStats.min;
  document.getElementById('temp-max').innerText = tempStats.max;
  document.getElementById('temp-avg').innerText = tempStats.avg;

  document.getElementById('humidity-min').innerText = humidityStats.min;
  document.getElementById('humidity-max').innerText = humidityStats.max;
  document.getElementById('humidity-avg').innerText = humidityStats.avg;
}

function calculateStats(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = (
    values.reduce((sum, value) => sum + value, 0) / values.length
  ).toFixed(2);

  return { min, max, avg };
}
