import requests
import re

def get_wikipedia_intro(artist_name):
    print(f"Searching for {artist_name} on Wikipedia...")
    api_url = "https://en.wikipedia.org/w/api.php"
    params = {
        'action': 'query',
        'format': 'json',
        'titles': artist_name,
        'prop': 'extracts',
        'exintro': True,
        'explaintext': True,
    }

    response = requests.get(api_url, params=params)
    data = response.json()
    page_id = list(data['query']['pages'].keys())[0]
    intro = data['query']['pages'][page_id]['extract']

    #check if intro is empty
    if not intro:
        #try calling again the function, adding 'DJ' to the artist name
        #e.g. 'Mike Perry' -> 'Mike Perry (DJ)' (since the former query returns a disambiguation page)
        return get_wikipedia_intro(f'{artist_name} (DJ)')

    # Extract only the first paragraph
    first_paragraph = intro.split('\n')[0]

    #remove texts enclosed in parentheses
    first_paragraph = re.sub(r' \([^)]*\)', '', first_paragraph)

    # Split the first paragraph into sentences
    sentences = first_paragraph.split('. ')
    
    # Limit to the first two sentences if there are more than two sentences
    if len(sentences) > 1:
        first_paragraph = '. '.join(sentences[:1]) + '.'

    return first_paragraph


'''
#test
def wiki():
    # Example: Search for information about "Taylor Swift"
    artist_name = "K-391"
    intro_text = get_wikipedia_intro(artist_name)

    print(f"Introduction for {artist_name}:\n{intro_text}")

wiki()
'''