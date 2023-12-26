//global variable
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
    tabs = document.getElementById('myTabs');
    mainContents = document.getElementById('mainContents');

    //if no csv file is selected
    if (input.value == "") {
        alertMessage.classList.remove("d-none");
        return;
    } 
    else {
        //show the main contents and the sidebar
        tabs.classList.remove("d-none");
        mainContents.classList.remove("d-none");
        

        //assign value to the global variable
        csv = input.value;
        console.log(csv);

        //hide the file input
        fileInput.classList.remove("d-flex");
        fileInput.classList.add("d-none");

        //show the navbarTitle
        document.getElementById('navbarTitle').classList.remove("invisible");
        document.getElementById('navbarTitleInfo').classList.remove("invisible");

        //analyze the dataset
        analyzeDataset();

    }
}

//for testing
/*
function test(){
    fileInput = document.getElementById('fileInput');
    tabs = document.getElementById('myTabs');
    //show the main contents and the sidebar
    tabs.classList.remove("d-none");
    mainContents.classList.remove("d-none");
    

    //assign value to the global variable
    csv = "input.value";
    console.log(csv);

    //hide the file input
    fileInput.classList.remove("d-flex");
    fileInput.classList.add("d-none");

    //show the navbarTitle
    document.getElementById('navbarTitle').classList.remove("invisible");
    document.getElementById('navbarTitleInfo').classList.remove("invisible");

    //analyze the dataset
    analyzeDataset();
}
*/


