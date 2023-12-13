/* 
    MAIN CODES FOR DATA VISUALIZATION
*/

async function plotSongsPerYear(){
    const temp = async () => {
        return await eel.plot_songs_per_year()();
    };
    const data = await temp();
    const details = {
        index: data[0].map(String),
        values: data[1]
    }

    console.log(details);

    //plot the graph
    plot(details, 'songsPerYearChart')
}



function plot(data, element) {
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
  
  





//call the functions at once
function analyzeDataset(){
    plotSongsPerYear();
}