function inputCSV(event) {
    fileName = event.target.files[0].name;
    element = event.srcElement.id;
    csvFileLabel = document.getElementById('csvFileLabel');

    if (fileName != "") {
        csvFileLabel.innerHTML = fileName;
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
        //hide the file input
        fileInput.classList.remove("d-flex");
        fileInput.classList.add("d-none");
    }
}