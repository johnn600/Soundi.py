//script by John Rey Vilbar
//ITD105 Big Data Analytics Project


//global variables
let myChart = null;



/* 
  --------------------------------------------
              UI RELATED FUNCTIONS
  --------------------------------------------
*/

//create a canvas element for chart js
function createCanvas(parent, canvasId) {
    const canvas = document.createElement('canvas');
    canvas.id = String(canvasId);
    canvas.width = 400;
    canvas.height = 120;
  
    // Get the reference to the div element
    const parentDiv = document.getElementById(parent);
  
    // Append the canvas element as a child to the div
    parentDiv.appendChild(canvas);

    console.log("canvas created");
}

// progress bar update function
function updateProgressBar(value) {
  document.getElementById("progressBar").value = value;
}



/*
  --------------------------------------------
              OVERVIEW SECTION
  --------------------------------------------
*/

// released songs per year
async function plotSongsPerYear(){
    const temp = async () => {
        return await eel.released_songs_per_year()();
    };
    const data = await temp();
    const details = {
        index: data[0].map(String),
        values: data[1]
    }

    //plot the graph
    plotLineGraph(details, 'songsPerYearChart', 'Songs released')
}

//musical key share
async function plotMusicalKeyShare(){
    const temp = async () => {
        return await eel.musical_key_share()();
    };
    const data = await temp();
    const details = {
        index: data[0],
        values: data[1]
    }

    //plot the graph
    plotPolarAreaGraph(details, 'musicalKeyShareChart', 'Musical Keys')

    //update mostCommonKey innerHTML
    document.getElementById("mostCommonKey").innerHTML = details.index[0];

    //update leastCommonKey innerHTML
    document.getElementById("leastCommonKey").innerHTML = details.index[details.index.length-1];
  }

  //top artist in key
  async function getTopArtistInKey(key){    
    const temp = async () => {
        return await eel.top_artist_in_key(key)();
    };
    const data = await temp();
    const info = JSON.parse(data)[0]['artists'];
    const name = info.replace(/\[|\]|'/g, '');
     
    //set innerHTML of topArtistInKey
    document.getElementById("topArtistInKey").innerHTML = name;
  }

  //onchange event for topArtistInKey
function updateTopArtistInKey(){
    //get the key
    const key = document.getElementById("selectKey").value;
    getTopArtistInKey(key);
  }

//explicit vs non-explicit comparison
async function plotExplicitNonexplicitComparison(){
    const temp = async () => {
        return await eel.explicit_vs_nonexplicit_comparison()();
    };
    const data = await temp();
    const details = {
        index: data[0],
        values: data[1]
    }

    //plot the graph
    plotDonutGraph(details, 'explicitNonexplicitComparison', 'Songs')
}

//top 5 explicit artists
async function plotTop5ExplicitArtists(year){
    const temp = async () => {
        return await eel.top_explicit_artists(year)();
    };
    const data = await temp();
    const details = {
        //convert the index to string
        index : data[0].map(String),
        values: data[1]
    }

    //plot the graph
    console.log(details);

    plotHorizontalBarGraph(details, 'topExplicitArtists', 'Songs released: ')
}

async function updateTop5ExplicitArtists(){
    //get the year
    const year = document.getElementById("topExplicitArtistsYear").value;
    console.log(year);
    
    //get the data
    const temp = async () => {
        return await eel.top_explicit_artists(year)();
    };
    const data = await temp();
    const details = {
        //convert the index to string
        index : data[0].map(String),
        values: data[1]
    }

    //destroy existing chart
    document.getElementById("topExplicitArtists").remove();
    createCanvas("topExplicitArtistsContainer", "topExplicitArtists");
    plotHorizontalBarGraph(details, 'topExplicitArtists', 'Songs released: ');

}

//linear regression average tempo
async function plotLinearRegressionAverageTempo(){
  //invoke python eel function
  const temp = async () => {
      return await eel.linear_regression_average_tempo()();
  };
  const data = JSON.parse(await temp());

  const labels  = data['labels'];
  const datasets = data['datasets'];
  const mse = data['mse'];

  //plot the graph
  plotMixedChart(labels, datasets, 'canvasAverageTempo');

  //update the mse value in mseTempo and round it to 2 decimal places
  document.getElementById("mseTempo").innerHTML = mse.toFixed(2);
}

//linear regression loudness
async function plotLinearRegressionAverageLoudness(){
  //invoke python eel function
  const temp = async () => {
      return await eel.linear_regression_average_loudness()();
  };
  const data = JSON.parse(await temp());

  const labels  = data['labels'];
  const datasets = data['datasets'];
  const mse = data['mse'];

  //plot the graph
  plotMixedChart(labels, datasets, 'canvasAverageLoudness');

  //update the mse value in mseTempo and round it to 2 decimal places
  document.getElementById("mseLoudness").innerHTML = mse.toFixed(2);
}

//linear regression acousticness
async function plotLinearRegressionAverageAcousticness(){
  //invoke python eel function
  const temp = async () => {
      return await eel.linear_regression_average_acousticness()();
  };
  const data = JSON.parse(await temp());

  const labels  = data['labels'];
  const datasets = data['datasets'];
  const mse = data['mse'];

  //plot the graph
  plotMixedChart(labels, datasets, 'canvasAverageAcousticness');

  //update the mse value in mseTempo and round it to 2 decimal places
  document.getElementById("mseAcousticness").innerHTML = mse.toFixed(2);
}

//linear regression danceability
async function plotLinearRegressionAverageDanceability(){
  //invoke python eel function
  const temp = async () => {
      return await eel.linear_regression_average_danceability()();
  };
  const data = JSON.parse(await temp());

  const labels  = data['labels'];
  const datasets = data['datasets'];
  const mse = data['mse'];

  //plot the graph
  plotMixedChart(labels, datasets, 'canvasAverageDanceability');

  //update the mse value in mseTempo and round it to 2 decimal places
  document.getElementById("mseDanceability").innerHTML = mse.toFixed(2);
}



/*
  --------------------------------------------
      ARTIST PROFILE SECTION
  --------------------------------------------
*/

//top 10 popular songs of an artist
async function plotTop10Songs(data){
    const details = {
        index: data[0],
        values: data[1]
    }

    //create a horizontal bar graph
    plotHorizontalBarGraph(details, 'artistTop10SongsChart', 'Popularity')

}

//predict song length of the artist
async function predictSongLength(artistName) {
  //invoke python eel function
  const temp = async () => {
      return await eel.predict_artist_song_duration(artistName)();
  };

  const data = await temp();

  // Convert time duration strings to total seconds
  const valuesInSeconds = data.map(point => convertToSeconds(point.y));

  const details = {
    index: data.map(point => point.x),
    values: valuesInSeconds
  };

  console.log(details);

  //check if canvasSongLengthContainer has a child canvas
  if(document.getElementById("canvasSongLengthContainer").querySelector('canvas') != null){
    //remove the canvas
    document.getElementById("canvasSongLengthContainer").querySelector('canvas').remove();
  }

  //create canvas
  createCanvas("canvasSongLengthContainer", "canvasSongLength");

  //plot the data
  plotLineGraphArtist(details, 'canvasSongLength', 'Song duration: ');

}

// Convert time duration string to total seconds
function convertToSeconds(durationString) {
  const [minutes, seconds] = durationString.split(':').map(Number);
  return minutes * 60 + seconds;
}

// Convert total seconds to time duration string (MM:SS)
function formatSecondsToTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}









/* 
  --------------------------------------------
    GRAPH CONSTRUCTOR FOR DATA VISUALIZATION
  --------------------------------------------
*/ 

//LINE GRAPH CONSTRUCTOR - OVERVIEW SECTION
function plotLineGraph(data, element, label) {
    const ctx = document.getElementById(element).getContext('2d');
  
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.index, // Convert to string without formatting
        datasets: [{
          label: label,
          data: data.values,
          backgroundColor: '#1DB954',
          pointHoverRadius: 8,
          tension: 0.4,
        }]
      },
      options: {
        locale: 'en-PH',
        animation: {
          duration: 0
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10, // Adjust the limit as needed
            },
          },
          y: { beginAtZero: true }
        },
        plugins: {
          legend: {
            display: false // Set display to false to hide the title
          }
        }
      }
    });
  }

//LINE GRAPH CONSTRUCTOR - ARTIST PROFILE SECTION
function plotLineGraphArtist(data, element, label) {
  const ctx = document.getElementById(element).getContext('2d');

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.index, 
      datasets: [{
        label: label,
        data: data.values,
        borderColor: '#1DB954',
        pointHoverRadius: 8,
      }]
    },
    options: {
      animation: {
        duration: 0
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          beginAtZero: true,
          // Use callback to format y-axis labels as time duration
          ticks: {
            callback: function (value, index, values) {
              return formatSecondsToTime(value);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false // Set display to false to hide the title
        }, 
        tooltip: {
          callbacks: {
            // Use callback to format tooltip label as time duration
            label: function (context) {
              const value = context.raw;
              return "Song duration: "+formatSecondsToTime(value);
            }
          }
        }
      }
    }
  });
}

// HORIZONTAL BAR GRAPH CONSTRUCTOR
function plotHorizontalBarGraph(data, element, label) {
  const ctx = document.getElementById(element).getContext('2d');

  // Find the index of the largest value in the data array
  const maxIndex = data.values.indexOf(Math.max(...data.values));

  // Colors for Spotify logo (green) and Bootstrap's dark theme (black)
  const spotifyGreen = '#1DB954';
  const bootstrapDark = '#343a40';

  // Create an array of background colors with Bootstrap's dark theme for all bars except the largest one (set to Spotify's green)
  const backgroundColors = data.values.map((value, index) => index === maxIndex ? spotifyGreen : bootstrapDark);

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.index.map(String),
      datasets: [{
        label: label,
        data: data.values,
        backgroundColor: backgroundColors,
      }]
    },
    options: {
      animation: {
        duration: 0,
      },
      options: {
        maintainAspectRatio: false,
      },
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true },
        y: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// DONUT GRAPH CONSTRUCTOR
function plotDonutGraph(data, element, label) {
  const ctx = document.getElementById(element).getContext('2d');

  // Find the index of the minimum value in the data array
  const minIndex = data.values.reduce((minIndex, currentValue, currentIndex, array) => currentValue < array[minIndex] ? currentIndex : minIndex, 0);

  // Colors for Spotify logo (green) and Bootstrap's dark theme (black)
  const spotifyGreen = '#1DB954';
  const bootstrapDark = '#343a40';

  // Create an array of background colors with Bootstrap's dark theme for all segments except the smallest one (set to Spotify's green)
  const backgroundColors = data.values.map((value, index) => index === minIndex ? spotifyGreen : bootstrapDark);

  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.index,
      datasets: [{
        label: label,
        data: data.values,
        backgroundColor: backgroundColors,
      }]
    },
    options: {
      animation: {
        duration: 0
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        }
      },
      cutout: '60%',
    }
  });
}

// MIXED CHART CONSTRUCTOR
function plotMixedChart(label, datasets, element) {
  const ctx = document.getElementById(element).getContext('2d');

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: label,
      datasets: [{
        type: 'scatter',
        label: datasets[0].label,
        data: datasets[0].data,
        backgroundColor: 'rgba(52, 58, 64, 0.5)',
        'pointHoverRadius': 8,
      }, {
        type: 'line',
        label: datasets[1].label,
        data: datasets[1].data,
        borderColor: '#1DB954',
        fill: false,
      }]
    },
    options: {
      animation: {
        duration: 0
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: { beginAtZero: false }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// POLAR AREA GRAPH CONSTRUCTOR - MUSIC KEYS
function plotPolarAreaGraph(data, element, label) {
  const ctx = document.getElementById(element).getContext('2d');

  const myChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: data.index,
      datasets: [{
        label: label,
        data: data.values,
        backgroundColor: [
          '#1DB954',
          '#050606',
          '#0a0c0d',
          '#101113',
          '#15171a',
          '#1a1d20',
          '#1f2326',
          '#24292d',
          '#2a2e33',
          '#2f343a',
          '#343a40',
          '#484e53',
        ],
      }]
    },
    options: {
      animation: {
        duration: 0
      },
      responsive: false,
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
        },
        tooltip: {
          mode: 'index',
          callbacks: {
            afterLabel: function (tooltipItem) {
              return 'tracks';
            }
          }
        }
      },
    }
  });
}


//execute on page load
async function analyzeDataset() {
  await plotSongsPerYear();
  updateProgressBar(10);
  await plotMusicalKeyShare();
  updateProgressBar(20);
  await getTopArtistInKey('C');
  updateProgressBar(30);
  await plotExplicitNonexplicitComparison();
  updateProgressBar(40);
  await plotTop5ExplicitArtists(2020);
  updateProgressBar(50);
  await plotLinearRegressionAverageTempo();
  updateProgressBar(60);
  await plotLinearRegressionAverageLoudness();
  updateProgressBar(70);
  await plotLinearRegressionAverageAcousticness();
  updateProgressBar(80);
  await plotLinearRegressionAverageDanceability();
  updateProgressBar(90);

  // Set progress to 100% when all functions are complete
  updateProgressBar(100);
  // Wait for 1 second before showing the overview section
  await new Promise(r => setTimeout(r, 1000));

  // Show the overview section
  document.getElementById("overviewSection").classList.remove("d-none");
  // Hide the spinner
  document.getElementById("loadingSpinnerOverview").classList.add("d-none");
  document.getElementById("loadingSpinnerOverview").classList.remove("d-flex");

}