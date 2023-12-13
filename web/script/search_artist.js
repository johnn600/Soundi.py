

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.add('d-flex');
    document.getElementById('loadingSpinner').classList.remove('d-none');
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').classList.add('d-none');
    document.getElementById('loadingSpinner').classList.remove('d-flex');
}


function getQuerry() {
    const artistName = document.getElementById('artistName').value;
    return artistName;
}

//search for artist
async function search() {
    const file = csv;

    if (file) {
        showLoadingSpinner();
        //hide existing canvas if present
        if(document.getElementById('artistTop10SongsChart') != null){
            document.getElementById('artistTop10SongsChart').classList.add('d-none');
        }

        //check if searchNoResults message is visible
        const msg = document.getElementById('searchNoResults');
        if (!msg.classList.contains('d-none')) {
            msg.classList.add('d-none');
        }

        //invoke python eel function
        const temp = async () => {
            return await eel.artist_top_songs_by_popularity(getQuerry())();
        };

        const data = await temp();

        //show no results message when data is empty
        if (data[0].length == 0) {
            const msg = document.getElementById('searchNoResults');
            msg.classList.remove('d-none');
            hideLoadingSpinner();
            return false;
        }
        else {
            //hide loading spinner after loading data
            hideLoadingSpinner();

            const parentDiv = document.getElementById('canvasTop10Songs');

            //check if div has no child canvas
            if (parentDiv.querySelector('canvas') == null) {
                //create a canvas
                createCanvas('canvasTop10Songs', 'artistTop10SongsChart');
            } 
            else {
                //hide the canvas
                parentDiv.querySelector('canvas').style.display = 'none';
                //clear the canvas
                parentDiv.removeChild(parentDiv.querySelector('canvas'));
                //create a canvas
                createCanvas('canvasTop10Songs', 'artistTop10SongsChart');
                //show the canvas
                parentDiv.querySelector('canvas').style.display = 'flex';
            }

            //visualize data
            plotTop10Songs(data).then(() => {
            });
        }
    }
}

function extractData(data) {
    const header = data[0];
    const nameIndex = header.indexOf("name");
    const yearIndex = header.indexOf("year");
    const artistsIndex = header.indexOf("artists");

    const extractedData = data.slice(1)
        .filter(entry => entry[artistsIndex] && entry[artistsIndex].includes(getItem()))
        .map(entry => ({
            name: entry[nameIndex],
            year: entry[yearIndex],
            artists: entry[artistsIndex]
        }));

    return extractedData;
}

function displayData(data) {
    if (!data.length) {
        const outputElement = document.getElementById('output');
        outputElement.textContent = 'No results found';
    }
    else {
        const outputElement = document.getElementById('output');
        outputElement.textContent = JSON.stringify(data, null, 2);
    }
}