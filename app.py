#Music data visualization project
#Members: Facurib, Feldan, Vilbar
#ITD105 Big Data Analytics 



#Importing libraries
import eel
import ctypes
import os
from tkinter import Tk, filedialog
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import json



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
        filetypes=[("CSV files", "*.csv"), ("DBF files", "*.dbf"), ("All files", "*.*")]
    )

    global filePath
    global fileName
    filePath = file_path
    fileName = os.path.basename(filePath)

@eel.expose
def returnFileDetails():
    return fileName, filePath

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
def artist_top_songs_by_popularity(artist_name):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Filter songs by the given artist
    artist_songs = df[df['artists'].apply(lambda x: artist_name in x)]

    # Sort songs by popularity in descending order
    top_songs = artist_songs.sort_values(by='popularity', ascending=False).head(10)

    # Create separate lists for song names and popularity values
    list_of_songs = top_songs['name'].tolist()
    list_of_popularity = top_songs['popularity'].tolist()

    # Combine the lists into a single list
    result_list = [list_of_songs, list_of_popularity]
    return result_list
    
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

    print(filePath)
    print(year)

    # Filter songs for the given year
    year_songs = df[df['year'] == int(year)]

    print(year_songs)

    # Count the number of explicit songs released by each artist
    explicit_artist_counts = year_songs[year_songs['explicit'] == 1]['artists'].explode().value_counts()

    # Select the top 5 artists
    top_explicit_artists = explicit_artist_counts.head(5)

    # Create separate lists for labels and values
    list_of_labels = top_explicit_artists.index.tolist()
    list_of_values = top_explicit_artists.values.tolist()

    # Combine the lists into a single list
    result_list = [list_of_labels, list_of_values]

    print(result_list)
    return result_list

#song length prediction for an artist
def format_duration(milliseconds):
    seconds = milliseconds / 1000
    minutes, seconds = divmod(seconds, 60)
    return f'{int(minutes):02d}:{int(seconds):02d}'

@eel.expose
def predict_artist_song_duration(artist_name):
    # Load the dataset
    df = pd.read_csv(filePath)

    # Filter data for the specific artist
    artist_songs = df[df['artists'].apply(lambda x: artist_name in x)]

    if artist_songs.empty:
        print(f"No data found for {artist_name}")
        return None

    # Extract relevant columns for the model (year and duration_ms)
    data = artist_songs[['year', 'duration_ms']]

    # Split the data into training and testing sets
    train_data, test_data = train_test_split(data, test_size=0.2, random_state=42)

    # Separate features (X) and target variable (y)
    X_train, y_train = train_data[['year']], train_data['duration_ms']

    # Create a linear regression model
    model = LinearRegression()

    # Train the model
    model.fit(X_train, y_train)

    # Make predictions for the years since the first release up to 2023
    first_release_year = artist_songs['year'].min()
    prediction_years = range(first_release_year, 2024)  # Adjusted range up to 2023
    prediction_years_np = np.array(prediction_years).reshape(-1, 1)
    predictions = model.predict(prediction_years_np)

    # Convert the predictions from milliseconds to minutes and seconds
    predictions = [format_duration(prediction) for prediction in predictions]

    # Prepare data for Chart.js
    chart_data = [{'x': int(year), 'y': prediction} for year, prediction in zip(prediction_years, predictions)]
    print(chart_data)
    return chart_data
    

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
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

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
                'type': 'scatter',
                'label': 'Actual Tempo',
                'data': y_test.tolist(),
                'backgroundColor': 'rgba(255, 99, 132, 0.2)',
                'borderColor': 'rgb(255, 99, 132)',
                'pointRadius': 5,
                'pointHoverRadius': 8,
            },
            {
                'type': 'line',
                'label': 'Linear Regression Prediction',
                'data': y_pred.tolist(),
                'fill': False,
                'borderColor': 'rgb(54, 162, 235)',
            },
        ],
        'coefficients': model.coef_.tolist(),
        'mean_squared_error': mse,
    }

    print(chart_data)
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
    except OSError:
        pass
