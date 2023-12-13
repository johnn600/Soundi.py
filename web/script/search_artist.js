

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function getQuerry() {
    const artistName = document.getElementById('artistName').value;
    return artistName;
}

async function search() {
    const file = csv;

    if (file) {
        showLoadingSpinner();

        //invoke python eel function
        const temp = async () => {
            return await eel.artist_top_songs_by_popularity(getQuerry())();
        };

        const data = await temp();

        console.log(data);

        //check if canvas is


        //visualize data
        plotTop10Songs(data)




        /*
        Papa.parse(file, {
            complete: function(results) {
                hideLoadingSpinner();
                const extractedData = extractData(results.data);
                displayData(extractedData);
            }
        });
        */
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