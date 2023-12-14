
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

//search for artist from imported csv file
async function search() {
    const file = csv;

    //check if search bar is empty
    if (getQuerry() == '') {
        document.getElementById('searchError').innerHTML = 'Please enter an artist name';
        document.getElementById('searchError').classList.remove('d-none');
        //hide artist info card
        document.getElementById('artistInfo').classList.add('d-none');
        return false;
    }

    if (file) {
        showLoadingSpinner();
        //hide existing canvas if present
        if(document.getElementById('artistTop10SongsChart') != null){
            document.getElementById('artistTop10SongsChart').classList.add('d-none');
        }

        //check if artist card has class d-none
        if (!document.getElementById('artistInfo').classList.contains('d-none')) {
            //hide artist info card
            document.getElementById('artistInfo').classList.add('d-none');
        }

        //check if searchError message is visible
        const msg = document.getElementById('searchError');
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
            const msg = document.getElementById('searchError');
            msg.classList.remove('d-none');
            msg.innerHTML = 'No results found';
            hideLoadingSpinner();
            return false;
        }
        else {
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

            //fetch data from Spotify API
            const spotifyData = await searchSpotify(getQuerry());

            //set variables
            const artistName = spotifyData[0]
            const artistImageURL = spotifyData[1]
            const artistPopularity = spotifyData[2]
            const spotifyLink = spotifyData[3]
            //add commas to followers count
            const artistFollowers = spotifyData[4].toLocaleString('en-US')
            const artistGenres = spotifyData[5]

            //display artist details
            document.getElementById('infoArtistName').innerHTML = artistName;
            document.getElementById('infoArtistImage').src = artistImageURL;
            document.getElementById('infoArtistPopularity').innerHTML = artistPopularity + '%';
            document.getElementById('infoArtistFollowers').innerHTML = artistFollowers;
            //clear existing pills
            document.getElementById('infoArtistGenres').innerHTML = '';
            //create bootstrap pill for each genre
            artistGenres.forEach(genre => {
                const pill = document.createElement('span');
                pill.classList.add('badge', 'badge-dark', 'p-1', 'mr-1');
                pill.innerHTML = genre;
                document.getElementById('infoArtistGenres').appendChild(pill);
            });
            document.getElementById('infoArtistSpotifyURL').href = spotifyLink;
            
            //visualize data
            plotTop10Songs(data);

            //check if songLengthWarning has class d-none
            if (!document.getElementById('songLengthWarning').classList.contains('d-none')) {
                //hide songLengthWarning
                document.getElementById('songLengthWarning').classList.add('d-none');
            }

            //predictions here
            try {
                await predictSongLength(artistName).catch(error => {
                    //this results when there is not enough data to make a prediction

                    //delete the canvas if present 
                    const parentDiv = document.getElementById('canvasSongLengthContainer');
                    if (parentDiv.querySelector('canvas') != null) {
                        parentDiv.removeChild(parentDiv.querySelector('canvas'));
                    }

                    //show the error message
                    document.getElementById('songLengthWarning').classList.remove('d-none');
                });
            } catch (error) {
                console.log("An error occurred outside the promise:", error);
            }

            //show artist card
            document.getElementById('artistInfo').classList.remove('d-none');
            
            //hide loading spinner after loading data
            hideLoadingSpinner();
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


