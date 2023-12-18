#Music data visualization project
#Members: Facurib, Feldan, Vilbar
#ITD105 Big Data Analytics 



#Import libraries
import eel
import ctypes
import os
from tkinter import Tk, filedialog
import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error
import json
from wikipedia import wiki


#for testing
filePath = r'C:\Users\Admin\Desktop\Spotify viz\Dataset\cleaned_and_merged_data.csv'


# exclude all plugins and assets else mag-hang ang app
def list_files_in_folder(folder_path):
    file_list = []
    
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            file_list.append(file)
    return file_list

folder_path = os.getcwd()
print(folder_path)
excluded = list_files_in_folder(folder_path)


eel.init('web', allowed_extensions=['.js', '.html'],
         excluded_prefixes=excluded)





'''
    --------------------------------------
    python link to js (BACKEND CODES HERE)
    --------------------------------------
'''

@eel.expose
def filePicker():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)

    file_path = filedialog.askopenfilename(
        title="Select file...",
        filetypes=[("CSV files", "*.csv")]
    )

    global filePath
    global fileName
    filePath = file_path
    fileName = os.path.basename(filePath)

@eel.expose
def returnFileDetails():
    return fileName, filePath

# --------------------------------------
# OVERVIEW SECTION

@eel.expose
def dataset_total_records():
    # Load the dataset
    df = pd.read_csv(filePath)

    # Get the total number of records (rows) in the dataset
    total_records = len(df)

    return total_records

@eel.expose
def dataset_file_size():
    # Get the file size in bytes
    file_size = os.path.getsize(filePath)

    # Convert the file size to MB
    file_size_mb = file_size / 1000000

    return file_size_mb

@eel.expose
def dataset_time_range():
    # Load the dataset
    df = pd.read_csv(filePath)

    # Get the minimum and maximum years
    data = {
        'min_year': df['year'].min().item(),
        'max_year': df['year'].max().item()
    }

    return json.dumps(data)


@eel.expose
def released_songs_per_year():
    # Load the dataset
    df = pd.read_csv(filePath)

    # Count the number of songs per year
    songs_per_year = df['year'].value_counts().sort_index()

    # Create separate lists for years and values
    list_of_years = songs_per_year.index.tolist()
    list_of_values = songs_per_year.values.tolist()

    # Combine the lists into a single list
    result_list = [list_of_years, list_of_values]
    return result_list

@eel.expose
def musical_key_share():
    # Load the dataset
    df = pd.read_csv(filePath)

    # Count the number of songs per key
    key_counts = df['key'].value_counts()

    # Create separate lists for labels and values
    list_of_labels = key_counts.index.tolist()
    list_of_values = key_counts.values.tolist()

    # Combine the lists into a single list
    result_list = [list_of_labels, list_of_values]
    return result_list

@eel.expose
def top_artist_in_key(key):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Filter the dataset for songs with the key of C and records after 1945
    key_of_C_songs_after_1945 = df[(df['key'] == key) & (df['year'] >= 1950)]

    # Group by artists and count the number of songs in the key of C after 1945
    artists_key_of_C_count_after_1945 = key_of_C_songs_after_1945.groupby('artists').size().reset_index(name='count')

    # Sort the artists by the count in descending order
    top_artists_key_of_C_after_1945 = artists_key_of_C_count_after_1945.sort_values(by='count', ascending=False).head(1)

    # Create a JSON object encoded in utf-8
    json_object = top_artists_key_of_C_after_1945.to_json(orient='records', force_ascii=False)
    return json_object
    
@eel.expose
def explicit_vs_nonexplicit_comparison():
    # Load the dataset
    df = pd.read_csv(filePath)

    # Count the number of non-explicit and explicit songs
    explicit_counts = df['explicit'].value_counts()

    # Create separate lists for labels and values
    list_of_labels = explicit_counts.index.tolist()
    list_of_values = explicit_counts.values.tolist()

    # change the labels from 'true' and 'false' to 'explicit' and 'non-explicit'
    list_of_labels = ['Explicit' if x == True else 'Non-Explicit' for x in list_of_labels]

    # Combine the lists into a single list
    result_list = [list_of_labels, list_of_values]
    return result_list

@eel.expose
def top_explicit_artists(year):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Filter songs for the given year
    year_songs = df[df['year'] == int(year)]

    # Count the number of explicit songs released by each artist
    explicit_artist_counts = year_songs[year_songs['explicit'] == 1]['artists'].explode().value_counts()

    # Select the top 5 artists
    top_explicit_artists = explicit_artist_counts.head(5)

    # Create separate lists for labels and values
    list_of_labels = top_explicit_artists.index.tolist()
    list_of_values = top_explicit_artists.values.tolist()

    # Combine the lists into a single list
    result_list = [list_of_labels, list_of_values]
    return result_list

@eel.expose
def genre_distribution():
    # Load the dataset
    df = pd.read_csv(filePath)

    # Drop rows with blank or empty values in the 'genre' column
    df = df[df['genre'].apply(lambda x: isinstance(x, str) and x.strip() != '')]

    # Create a new DataFrame with separate rows for each genre
    genre_df = pd.DataFrame(df['genre'].tolist(), index=df.index).stack().reset_index(level=1, drop=True).reset_index(name='genre')

    # Count the occurrences of each genre
    genre_counts = genre_df['genre'].value_counts()


    # Select the top 5 genres
    top_5_genres = genre_counts.head(10)

    # Create a new column 'category' based on the top genres
    df['category'] = df['genre'].apply(lambda x: 'others' if x not in top_5_genres.index else x)

    # Count the occurrences of each category
    category_counts = df['category'].value_counts()

    # Convert the dataframe to a JSON object
    result_json = {
        'genres': category_counts[1:].index.tolist(),
        'values': category_counts[1:].values.tolist(),
    }

    return result_json
    


# --------------------------------------
# ARTIST SECTION

#search artist information from Wikipedia
@eel.expose
def wikiSearch(name):
    data = wiki(name)
    return data

@eel.expose
def artist_top_songs_by_popularity(artist_name):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Check for NaN values in the 'artists' column and replace them with an empty string
    df['artists'] = df['artists'].fillna('')

    # Filter songs by the given artist
    artist_songs = df[df['artists'].str.contains(artist_name, case=False)]

    # Sort songs by popularity in descending order
    top_songs = artist_songs.sort_values(by='popularity', ascending=False).head(10)

    # Create separate lists for song names and popularity values
    list_of_songs = top_songs['name'].tolist()
    list_of_popularity = top_songs['popularity'].tolist()

    # Combine the lists into a single list
    result_list = [list_of_songs, list_of_popularity]
    return result_list

@eel.expose
def artist_average_tempo(artist_name):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Drop rows with NaN values in the 'artists' or 'tempo' columns
    df = df.dropna(subset=['artists', 'tempo'])

    # Check for NaN values in the 'artists' column and replace them with an empty string
    df['artists'] = df['artists'].fillna('')

    # Filter songs by the given artist
    artist_songs = df[df['artists'].str.contains(artist_name, case=False)]

    # Check if there are tempo values available for the specified artist
    if artist_songs.empty:
        return "No tempo information available for the specified artist."

    # Calculate the average tempo for the artist
    average_tempo = artist_songs['tempo'].mean()

    return average_tempo

@eel.expose
def artist_explicit_ratio(artist_name):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Drop rows with missing values in the 'artists' and 'explicit' columns
    df = df.dropna(subset=['artists', 'explicit'])

    # Filter songs by the given artist
    artist_songs = df[df['artists'].str.contains(artist_name, case=False)]

    # Check if there are songs available for the specified artist
    if artist_songs.empty:
        return f"No information available for the artist: {artist_name}"

    # Calculate the ratio of explicit and non-explicit songs
    total_songs = len(artist_songs)
    explicit_songs = artist_songs['explicit'].sum()
    non_explicit_songs = total_songs - explicit_songs

    # Check for division by zero
    if total_songs == 0:
        return f"No songs available for the artist: {artist_name}"

    # Calculate the ratio
    explicit_ratio = explicit_songs / total_songs
    non_explicit_ratio = non_explicit_songs / total_songs

    return {
        'explicit': explicit_ratio,
        'non_explicit': non_explicit_ratio
    }

@eel.expose
def artist_track_count(artist_name):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Drop rows with NaN values in the 'artists' column
    df = df.dropna(subset=['artists'])

    # Check for NaN values in the 'artists' column and replace them with an empty string
    df['artists'] = df['artists'].fillna('')

    # Filter songs by the given artist
    artist_tracks = df[df['artists'].str.contains(artist_name, case=False)]

    # Check if there are tracks available for the specified artist
    if artist_tracks.empty:
        return f"No tracks found for the artist: {artist_name}"

    # Count the number of tracks
    tracks_count = len(artist_tracks)

    return tracks_count

@eel.expose
def artist_genre_contribution(artist_name):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Drop rows with NaN values in the 'artists' or 'genre' columns
    df = df.dropna(subset=['artists', 'genre'])

    # Check for NaN values in the 'artists' column and replace them with an empty string
    df['artists'] = df['artists'].fillna('')

# Filter songs by the given artist (search for the exact name)
    artist_songs = df[df['artists'].str.lower() == artist_name.lower()]

    #genre of the artist
    artist_genre = artist_songs['genre'].iloc[0]

    #count all the songs of the artist
    artist_songs_count = len(artist_songs)

    #count all the songs in the genre that the artist is in
    genre_songs_count = len(df[df['genre'] == artist_songs['genre'].iloc[0]])

    #labels - artist contribution and overall count
    labels = ['Artist Contribution', 'Overall Count']

    #combine the two counts into a single list
    result_list = [labels, [artist_songs_count, genre_songs_count], artist_genre]

    return result_list



#song length prediction for an artist
def format_duration(milliseconds):
    seconds = milliseconds / 1000
    minutes, seconds = divmod(seconds, 60)
    return f'{int(minutes):02d}:{int(seconds):02d}'





'''
    --------------------------------------
            LINEAR REGRESSION CODES
    --------------------------------------    
'''

# linear regression for average tempo
@eel.expose
def linear_regression_average_tempo():
    # Read the dataset into a pandas DataFrame
    df = pd.read_csv(filePath)

    # Group by 'year' and calculate the average tempo for each year
    average_tempo_by_year = df.groupby('year')['tempo'].mean().reset_index()

    # Extract features and target variable
    X = average_tempo_by_year[['year']]
    y = average_tempo_by_year['tempo']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.35, random_state=42)

    # Initialize the linear regression model
    model = LinearRegression()

    # Fit the model on the training data
    model.fit(X_train, y_train)

    # Make predictions on the test data
    y_pred = model.predict(X_test)

    # Calculate the Mean Squared Error
    mse = mean_squared_error(y_test, y_pred)

    # Create Chart JS data format
    chart_data = {
        'labels': X_test['year'].tolist(),
        'datasets': [
            {
                'data': y_test.tolist(),
            },
            {
                'data': y_pred.tolist(),
            },
        ],
        'mse': mse
    }
    return json.dumps(chart_data)

# linear regression for loudness
@eel.expose
def linear_regression_average_loudness():
    # Read the dataset into a pandas DataFrame
    df = pd.read_csv(filePath)

    # Group by 'year' and calculate the average loudness for each year
    average_loudness_by_year = df.groupby('year')['loudness'].mean().reset_index()

    # Extract features and target variable
    X = average_loudness_by_year[['year']]
    y = average_loudness_by_year['loudness']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.35, random_state=42)

    # Initialize the linear regression model
    model = LinearRegression()

    # Fit the model on the training data
    model.fit(X_train, y_train)

    # Make predictions on the test data
    y_pred = model.predict(X_test)

    # Calculate the Mean Squared Error
    mse = mean_squared_error(y_test, y_pred)

    # Create Chart JS data format
    chart_data = {
        'labels': X_test['year'].tolist(),
        'datasets': [
            {
                'data': y_test.tolist(),
            },
            {
                'data': y_pred.tolist(),
            },
        ],
        'mse': mse
    }
    return json.dumps(chart_data)

# linear regression for acousticness
@eel.expose
def linear_regression_average_acousticness():
    # Read the dataset into a pandas DataFrame
    df = pd.read_csv(filePath)

    # Group by 'year' and calculate the average acousticness for each year
    average_acousticness_by_year = df.groupby('year')['acousticness'].mean().reset_index()

    # Extract features and target variable
    X = average_acousticness_by_year[['year']]
    y = average_acousticness_by_year['acousticness']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.35, random_state=42)

    # Initialize the linear regression model
    model = LinearRegression()

    # Fit the model on the training data
    model.fit(X_train, y_train)

    # Make predictions on the test data
    y_pred = model.predict(X_test)

    # Calculate the Mean Squared Error
    mse = mean_squared_error(y_test, y_pred)

    # Create Chart JS data format
    chart_data = {
        'labels': X_test['year'].tolist(),
        'datasets': [
            {
                'data': y_test.tolist(),
            },
            {
                'data': y_pred.tolist(),
            },
        ],
        'mse': mse
    }
    return json.dumps(chart_data)

# linear regression for danceability with Ridge regularization
# gidagdagan nako'g regularization kay basi nag-overfit ang model
# since 0.00 iyang MSE. But it turns out na perfect fit daw ang model
@eel.expose
def linear_regression_average_danceability():
    # Read the dataset into a pandas DataFrame
    df = pd.read_csv(filePath)

    # Group by 'year' and calculate the average danceability for each year
    average_danceability_by_year = df.groupby('year')['danceability'].mean().reset_index()

    # Extract features and target variable
    X = average_danceability_by_year[['year']]
    y = average_danceability_by_year['danceability']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.35, random_state=42)

    # Initialize the linear regression model with Ridge regularization
    alpha = 2.0  # You can adjust the regularization strength (alpha) as needed
    model = Ridge(alpha=alpha)

    # Fit the model on the training data
    model.fit(X_train, y_train)

    # Make predictions on the test data
    y_pred = model.predict(X_test)

    # Calculate the Mean Squared Error
    mse = mean_squared_error(y_test, y_pred)

    # Create Chart JS data format
    chart_data = {
        'labels': X_test['year'].tolist(),
        'datasets': [
            {
                'data': y_test.tolist(),
            },
            {
                'data': y_pred.tolist(),
            },
        ],
        'mse': mse
    }
    return json.dumps(chart_data)








#hide the python console when clicking the app.py
#Windows OS specific solution
print("Starting...")
kernel32 = ctypes.WinDLL('kernel32')
user32 = ctypes.WinDLL('user32')
SW_HIDE = 0
hWnd = kernel32.GetConsoleWindow()
user32.ShowWindow(hWnd, SW_HIDE)


#launch the webpage
if __name__ == '__main__':
    try:
        x = eel.start('index.html', mode='chrome', host='localhost', port=8000, cmdline_args=['--start-maximized', '--disable-web-security'], shutdown_delay=1)

        #for testing purposes
        #artist_genre_contribution('Frank Sinatra')
    except OSError:
        pass
