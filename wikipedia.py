import requests
import re

def get_wikipedia_intro(artist_name):    
    print(artist_name)

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
    
    #-1 is the page id for the page not found
    if page_id != '-1':
        #check if 'extract' contains the word 'may refer to' (meaning the page is a disambiguation page)
        #e.g. 'Drake' may refer to many things
        if 'may refer to' in data['query']['pages'][page_id]['extract']:
            return None
        # Check if 'extract' is not equal to empty string
        elif data['query']['pages'][page_id]['extract'] != '':
            intro = data['query']['pages'][page_id]['extract']
        else:
            return None
    else:
        return None

    # Extract only the first paragraph
    first_paragraph = intro.split('\n')[0]

    # Remove texts enclosed in parentheses
    first_paragraph = re.sub(r' \([^)]*\)', '', first_paragraph)

    # Split the first paragraph into sentences
    sentences = first_paragraph.split('. ')
    
    # Limit to the first two sentences if there are more than two sentences
    if len(sentences) > 1:
        first_paragraph = '. '.join(sentences[:1]) + '.'

    #check if first_pagraph contains the words 'musician', 'rapper', 'singer', 'band', 'DJ', 'group', 'duo', 'songwriter', 'artist'
    #e.g. 'Train' may return information about the vehicle, not the band
    for word in ['musician', 'rapper', 'producer', 'singer', 'band', 'DJ', 'group', 'duo', 'songwriter', 'artist']:
        if word in first_paragraph:
            print(first_paragraph)
            return first_paragraph
        else:
            pass

    return None

#test
def wiki(query):
    intro_text = get_wikipedia_intro(query)

    if intro_text != None:
        return intro_text
    else:
        return alternative(query)

def alternative(artist_name):
    lower = artist_name.lower()
    upper = artist_name.upper()
    capitalized = artist_name.capitalize()

    #check for results based on lowercase/upercase/capitalized artist name
    artistUpper = get_wikipedia_intro(upper)

    if artistUpper != None:
        return artistUpper
    else:
        artistLower = get_wikipedia_intro(lower)
    
    if artistLower != None:
        return artistLower
    else: 
        artistCapitalized = get_wikipedia_intro(capitalized)
    
    if artistCapitalized != None:
        return artistCapitalized
    else:
        djUpper = get_wikipedia_intro(upper+' (DJ)')
    
    if djUpper != None:
        return djUpper
    else:
        djLower = get_wikipedia_intro(lower+' (DJ)')
    
    if djLower != None:
        return djLower
    else:
        djCapitalized = get_wikipedia_intro(capitalized+' (DJ)')
    
    if djCapitalized != None:
        return djCapitalized
    else:
        bandUpper = get_wikipedia_intro(upper+' (band)')

    if bandUpper != None:
        return bandUpper
    else:
        bandLower = get_wikipedia_intro(lower+' (band)')

    if bandLower != None:
        return bandLower
    else:
        bandCapitalized = get_wikipedia_intro(capitalized+' (band)')
    
    if bandCapitalized != None:
        return bandCapitalized
    else:
        musicianUpper = get_wikipedia_intro(upper+' (musician)')

    if musicianUpper != None:
        return musicianUpper
    else:
        musicianLower = get_wikipedia_intro(lower+' (musician)')

    if musicianLower != None:
        return musicianLower
    else:
        musicianCapitalized = get_wikipedia_intro(capitalized+' (musician)')

    if musicianCapitalized != None:
        return musicianCapitalized
    else:
        rapperUpper = get_wikipedia_intro(upper+' (rapper)')

    if rapperUpper != None:
        return rapperUpper
    else:
        rapperLower = get_wikipedia_intro(lower+' (rapper)')

    if rapperLower != None:
        return rapperLower
    else:
        rapperCapitalized = get_wikipedia_intro(capitalized+' (rapper)')

    if rapperCapitalized != None:
        return rapperCapitalized
    else:
        singerUpper = get_wikipedia_intro(upper+' (singer)')

    if singerUpper != None:
        return singerUpper
    else:
        singerLower = get_wikipedia_intro(lower+' (singer)')

    if singerLower != None:
        return singerLower
    else:
        singerCapitalized = get_wikipedia_intro(capitalized+' (singer)')

    if singerCapitalized != None:
        return singerCapitalized
    else:
        #e.g. 'The Carpenters' is 'Carpenters' in spotify
        withThe = get_wikipedia_intro('The '+ artist_name)
    
    if withThe != None:
        return withThe
    else:
        return None
