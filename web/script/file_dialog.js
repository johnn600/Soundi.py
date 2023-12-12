

//global variables
var csv;

async function filePicker() {
    await eel.filePicker()();

    const getFileDetails = async () => {
        return await eel.returnFileDetails()();
    };
    
    const selectedFile = await getFileDetails();
    const csvFileLabel = document.getElementById('csvFileLabel');
    const inputField = document.getElementById('csvFile');

    const fileName = selectedFile[0];
    const filePath = selectedFile[1];
    
    if (fileName != "") {
        csvFileLabel.innerHTML = fileName;
        inputField.value = filePath;
    }
}

function loadFile(){
    input = document.getElementById('csvFile');
    alertMessage = document.getElementById('alertMessage');
    fileInput = document.getElementById('fileInput');
    sidebar = document.getElementById('sidebar');
    mainContents = document.getElementById('mainContents');

    //if no csv file is selected
    if (input.value == "") {
        alertMessage.classList.remove("d-none");
        return;
    } 
    else {
        //show the main contents and the sidebar
        sidebar.classList.remove("d-none");
        mainContents.classList.remove("d-none");

        //assign value to the global variable
        csv = input.value;
        console.log(csv);

        //hide the file input
        fileInput.classList.remove("d-flex");
        fileInput.classList.add("d-none");

        //analyze the dataset
        analyzeDataset();

    }
}



/* 
    MAIN CODES FOR DATA VISUALIZATION
*/

async function plotSongsPerYear(){
    const temp = async () => {
        return await eel.plot_songs_per_year()();
    };
    const data = await temp();
    const details = {
        index: data[0],
        values: data[1]
    }

    //plot the graph
    plot(details, 'songsPerYearChart')
}



function plot(data, element) {
    const ctx = document.getElementById(element).getContext('2d');
  
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.index,
        datasets: [{
          label: 'Number of Songs Released Per Year',
          data: data.values,
          backgroundColor: 'skyblue',
        }]
      },
      options: {
        scales: {
          x: { type: 'linear', position: 'bottom' },
          y: { beginAtZero: true }
        },
        plugins: {
          title: {
            display: true,
            text: 'Released songs:'
          }
        }
      }
    });
  }
  





//call the functions at once
function analyzeDataset(){
    plotSongsPerYear();
}