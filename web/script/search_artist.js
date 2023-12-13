

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

        //invoke python eel function
        const temp = async () => {
            return await eel.artist_top_songs_by_popularity(getQuerry())();
        };
        const data = await temp();

        //visualize data
        plotTop10Songs(data).then(() => {
            //hide loading spinner after loading data
            hideLoadingSpinner();
        });
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