


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
    navbar = document.getElementById('navbar');
    fileInput = document.getElementById('fileInput');

    //if no csv file is selected
    if (input.value == "") {
        alertMessage.classList.remove("d-none");
        return;
    } 
    else {
        //show the dashboard
        navbar.classList.remove("d-none");
        //send the file to python eel
        const csv = input.value;
        console.log(csv);

        //hide the file input
        fileInput.classList.remove("d-flex");
        fileInput.classList.add("d-none");
    }
}