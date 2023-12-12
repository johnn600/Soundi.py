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


#python link to js (BACKEND CODES HERE)
@eel.expose
def filePicker():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)

    file_path = filedialog.askopenfilename(
        title="Select CSV file",
        filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
    )

    global filePath
    global fileName
    filePath = file_path
    fileName = os.path.basename(filePath)

@eel.expose
def returnFileDetails():
    return fileName, filePath

@eel.expose
def plot_songs_per_year(file):
    # Load the dataset
    df = pd.read_csv(file)

    # Count the number of songs per year
    songs_per_year = df['year'].value_counts().sort_index()

    # Plotting the number of songs per year
    plt.figure(figsize=(10, 6))
    plt.bar(songs_per_year.index, songs_per_year.values, color='skyblue')
    plt.title('Number of Songs Released Per Year')
    plt.xlabel('Year')
    plt.ylabel('Number of Songs')
    plt.grid(axis='y')
    plt.show()
    













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
