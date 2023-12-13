/* 
    MAIN CODES FOR DATA VISUALIZATION
*/

//global variables
let myChart = null;

//create a canvas element for chart js
function createCanvas(parent, canvasId) {
    const canvas = document.createElement('canvas');
    canvas.id = String(canvasId);
    canvas.width = 400;
    canvas.height = 150;
  
    // Get the reference to the div element
    const parentDiv = document.getElementById(parent);
  
    // Append the canvas element as a child to the div
    parentDiv.appendChild(canvas);
}


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

    console.log(details);

    //plot the graph
    plotLineGraph(details, 'songsPerYearChart')
}

//top 10 popular songs of an artist
async function plotTop10Songs(data){
    const details = {
        index: data[0],
        values: data[1]
    }

    console.log("cxgfgh"+ details);

    //create a canvas
    createCanvas('canvasTop10Songs', 'artistTop10SongsChart');

    //create a horizontal bar graph
    plotHorizontalBarGraph(details, 'artistTop10SongsChart')

}


//LINE GRAPH CONSTRUCTOR
function plotLineGraph(data, element) {
    const ctx = document.getElementById(element).getContext('2d');
  
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.index.map(String),
        datasets: [{
          label: 'Number of Songs Released Per Year',
          data: data.values,
          backgroundColor: 'skyblue',
        }]
      },
      options: {
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
  
//HORIZONTAL BAR GRAPH CONSTRUCTOR
function plotHorizontalBarGraph(data, element) {
  const ctx = document.getElementById(element).getContext('2d');



  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.index.map(String),
      datasets: [{
        label: 'Number of Songs Released Per Year',
        data: data.values,
        backgroundColor: 'skyblue',
      }]
    },
    options: {
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

  // Function to update the chart with new data
  const updateHorizontalBarGraph = newData => {
    myChart.data.labels = newData.index.map(String);
    myChart.data.datasets[0].data = newData.values;
    myChart.update();
  };

  // Return the updateChart function so it can be used externally
  return updateHorizontalBarGraph;
}

  





//call the functions at once
function analyzeDataset(){
    plotSongsPerYear();
    //plotTop10Songs();
}