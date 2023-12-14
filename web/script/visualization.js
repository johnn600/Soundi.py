

//global variables
let myChart = null;




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



//--------------------------------------------

/*
      OVERVIEW SECTION
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



/*
      ARTIST PROFILE SECTION
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
  plotLineGraph(details, 'canvasSongLength', 'Song duration: ');

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
            maxTicksLimit: 10, // Adjust the limit as needed
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
          display: false
        }
      },
      cutout: '60%',
    }
  });
}




//call the functions at once
async function analyzeDataset(){
    await plotSongsPerYear();
    await plotExplicitNonexplicitComparison();
    await plotTop5ExplicitArtists(2020);

    //show the overview section
    document.getElementById("overviewSection").classList.remove("d-none");
    //hide the spinner
    document.getElementById("loadingSpinnerOverview").classList.add("d-none");
    document.getElementById("loadingSpinnerOverview").classList.remove("d-flex");
}