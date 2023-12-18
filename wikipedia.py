import requests
import re

def get_wikipedia_intro(artist_name):
    #lowecase the name if all is uppercase
    if artist_name.isupper():
        artist_name = artist_name.lower()
    
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
    for word in ['musician', 'rapper', 'singer', 'band', 'DJ', 'group', 'duo', 'songwriter', 'artist']:
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
    #check if name is uppercase
    #e.g. `banners` is `BANNERS` in spotify
    if artist_name.isupper():
        artist_name = artist_name.lower()
    
    DJ = get_wikipedia_intro(artist_name+' (DJ)')

    if DJ != None:  
        return DJ
    else:
        band = get_wikipedia_intro(artist_name+' (band)')
    
    if band != None:
        return band
    else:
        musician = get_wikipedia_intro(artist_name+' (musician)')

    if musician != None:
        return musician
    else:
        rapper = get_wikipedia_intro(artist_name+' (rapper)')
    
    if rapper != None:
        return rapper
    else:
        singer = get_wikipedia_intro(artist_name+' (singer)')
    
    if singer != None:
        return singer
    else:
        #e.g. 'The Carpenters' is 'Carpenters' in spotify
        withThe = get_wikipedia_intro('The '+ artist_name)
    
    if withThe != None:
        return withThe
    else:
        return None

wiki('The Weeknd')