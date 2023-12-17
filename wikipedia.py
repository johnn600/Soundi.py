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
        # Check if 'extract' is not equal to empty string
        if data['query']['pages'][page_id]['extract'] != '':
            intro = data['query']['pages'][page_id]['extract']
            #print(intro)
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

    return first_paragraph

#test
def wiki(query):
    intro_text = get_wikipedia_intro(query)

    if intro_text != None:
        return intro_text
    else:
        return alternative(query)

def alternative(artist_name):
    #check if name is uppercase
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
        print("data:" + musician)
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
        return None
