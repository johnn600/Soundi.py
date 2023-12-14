//these are my keys, please don't be inlove with someone else
const clientId = 'ede4783be3124ad6ae2bff3eae63a39c';
const clientSecret = 'f97b9ebeb490444f8b39d1f1126c99d5';

let accessToken;

async function getAccessToken(clientId, clientSecret) {
    const authUrl = 'https://accounts.spotify.com/api/token';
    const authData = {
        grant_type: 'client_credentials'
    };

    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(authData)
    });

    const authJson = await response.json();
    return authJson.access_token;
}

async function searchSpotify(query) {
    const searchUrl = 'https://api.spotify.com/v1/search';
    
    if (!accessToken) {
        accessToken = await getAccessToken(clientId, clientSecret);
    }

    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    const params = new URLSearchParams({
        q: query,
        type: 'artist',
        limit: '1',
        offset: '0'
    });

    const response = await fetch(`${searchUrl}?${params.toString()}`, {
        method: 'GET',
        headers: headers
    });

    if (response.status === 401) {
        accessToken = await getAccessToken(clientId, clientSecret);
        headers['Authorization'] = `Bearer ${accessToken}`;
        const retryResponse = await fetch(`${searchUrl}?${params.toString()}`, {
            method: 'GET',
            headers: headers
        });
        return await retryResponse.json();
    }

    const json = await response.json();

    console.log(json);

    const artistName = json.artists.items[0].name;
    const artistImageURL = json.artists.items[0].images[1].url;
    const artistPopularity = json.artists.items[0].popularity;
    const spotifyLink = json.artists.items[0].external_urls.spotify;
    const artistFollowers = json.artists.items[0].followers.total;
    const artistGenres = json.artists.items[0].genres;

    const artistInfo = [artistName, artistImageURL, artistPopularity, spotifyLink, artistFollowers, artistGenres];
    console.log(artistInfo);
    return artistInfo;
}

