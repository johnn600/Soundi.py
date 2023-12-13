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
        title="Select CSV/DBF file",
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
