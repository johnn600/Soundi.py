

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

    plotHorizontalBarGraph(details, 'topExplicitArtists', 'Songs')
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
    plotHorizontalBarGraph(details, 'topExplicitArtists', 'Songs');

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












/* 
  --------------------------------------------
    GRAPH CONSTRUCTOR FOR DATA VISUALIZATION
  --------------------------------------------
*/ 

//LINE GRAPH CONSTRUCTOR
function plotLineGraph(data, element, label) {
    const ctx = document.getElementById(element).getContext('2d');
  
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.index.map(num => num.toLocaleString('en-US')), // Convert to string without formatting
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