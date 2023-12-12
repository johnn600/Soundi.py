#Music data visualization project
#Members: Facurib, Feldan, Vilbar
#ITD105 Big Data Analytics 



#Importing libraries
import eel
import ctypes
import os


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
#@eel.expose




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
