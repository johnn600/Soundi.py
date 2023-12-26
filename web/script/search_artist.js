//ITD105 Big Data Analytics project
//coder: John Rey Vilbar

/*
---------------------------------------------
            MAIN FUNCTIONS
---------------------------------------------
*/

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
            await plotTop10Songs(data);

            //search wikipedia
            const wikiData = await searchWikipedia(artistName);
            //append to #infoArtistWiki innerHTML
            document.getElementById('infoArtistWiki').innerHTML = wikiData;

            //average tempo
            await artistAverageTempo(artistName);
            //explicit ratio
            await artistExplicity(artistName);
            //track count
            await artistTrackCount(artistName);
            //genre contribution
            await artistGenreContribution(artistName);
            //popularity over time
            await artistPopularityOverTime(artistName);

            //show artist card
            document.getElementById('artistInfo').classList.remove('d-none');
            
            //hide loading spinner after loading data
            hideLoadingSpinner();
        }
    }
}



/*
---------------------------------------------
                other functions
---------------------------------------------
*/


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

//search some additional info from Wikipedia
async function searchWikipedia(artistName) {
    const temp = async () => {
        return await eel.wikiSearch(artistName)();
    };
    const details = await temp();
    console.log(details);
    return details;
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

//average tempo of an artist
async function artistAverageTempo(name){
    const temp = async () => {
        return await eel.artist_average_tempo(name)();
    };
    const details = JSON.parse(await temp());

    //round off tempo to integer
    const tempo = Math.round(details);

    //append to #infoArtistTempo innerHTML
    document.getElementById('infoArtistTempo').innerHTML = tempo;
  }

//explicity of an artist
async function artistExplicity(name){
    const temp = async () => {
        return await eel.artist_explicit_ratio(name)();
    };
    const details = await temp();
    const explicity = details['explicit'];

    //convert to percentage
    const explicitRatio = Math.round(explicity * 100);

    //append to #infoArtistExplicitRatio innerHTML
    document.getElementById('infoArtistExplicitValue').innerHTML = explicitRatio;

    //note on the explicit ratio
    const note = document.getElementById('infoArtistExplicitNote');
    const textColor = document.getElementById('infoArtistExplicitValueTextColor');

    if (explicitRatio < 25) {
        note.innerHTML = 'This artist writes mostly clean songs';
        textColor.className = '';
        textColor.classList.add('text-success', 'font-weight-bold', 'text-center');
    }
    else if (explicitRatio < 60) {
        note.innerHTML = 'Some songs contain explicit lyrics';
        textColor.className = '';
        textColor.classList.add('text-warning', 'font-weight-bold', 'text-center');
    }
    else if (explicitRatio < 85) {
        note.innerHTML = 'Explicit lyrics are common in songs';
        textColor.className = '';
        textColor.classList.add('text-danger', 'font-weight-bold', 'text-center');
    }
    else {
        note.innerHTML = 'Songs are not family-friendly';
        textColor.className = '';
        textColor.classList.add('text-danger', 'font-weight-bold', 'text-center');
    }
}

//count the tracks of an artist
async function artistTrackCount(name){
    const temp = async () => {
        return await eel.artist_track_count(name)();
    };
    const details = await temp();
    
    //append to #infoArtistTrackCount innerHTML
    if (details == 1) {
        document.getElementById('infoArtistTrackCount').innerHTML = details + ' track';
    }
    else {
        document.getElementById('infoArtistTrackCount').innerHTML = details + ' tracks';
    }
}

//artist's contribution to their respective genres
async function artistGenreContribution(name){
    const temp = async () => {
        return await eel.artist_genre_contribution(name)();
    };
    const data = await temp();

    const labels = [`Artist: ${data[1][0]}`, `Others: ${data[1][1]-data[1][0]}`]
    const ratio = data[0];
    const genre = data[2];
    
    const details = {
        index: labels,
        values: ratio
    }

    //check if #artistGenreContributionChartContainer has a canvas child
    if (document.getElementById('artistGenreContributionChartContainer').querySelector('canvas') != null) {
        //remove all child elements
        document.getElementById('artistGenreContributionChartContainer').innerHTML = '';
    } 
    
    //create a canvas
    createCanvas('artistGenreContributionChartContainer', 'artistGenreContributionChart');

    //set artistGenre innerHTML
    document.getElementById('artistGenre').innerHTML = `'${genre}'`;

    //plot the data
    plotDonutGraph(details, 'artistGenreContributionChart', genre, true, true);
}

//artist popularity over time
async function artistPopularityOverTime(name){
    const temp = async () => {
        return await eel.artist_popularity_over_time(name)();
    };
    const data = JSON.parse(await temp());
    const years = data['year'];
    const popularity = data['average_popularity'];

    console.log(years);
    console.log(popularity);

    const details = {
        index: years,
        values: popularity
    }

    
    //check for a canvas child
    if (document.getElementById('artistPopularityContainer').querySelector('canvas') != null) {
        //remove all child elements
        document.getElementById('artistPopularityContainer').innerHTML = '';
    } 
    
    //create a canvas
    createCanvas('artistPopularityContainer', 'artistPopularity');

    //plot the data
    plotLineGraph(details, 'artistPopularity');
    
}