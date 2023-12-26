# Soundi.py 

![Soundi.py Logo](./web/images/logo.png)

<div align="center">
  <strong>Spotify Dataset Analyzer</strong><br>
  <strong>John Rey Vilbar | Zach Jacob Feldan | Ruby Jane Facurib</strong><br>
  <strong>ITD105 Big Data Analytics</strong>
</div>


### Overview
Soundi.py is a web app designed for doing simple data visualizations of Spotify datasets. This application focuses on providing insights into the music details contained in the database, offering valuable information on the number of songs released each year and highlighting the top songs of each artist.

### Dependencies
* [Python Eel](https://github.com/python-eel/Eel)
* Pandas
* sklearn
* Tkinter


### Dataset
This project uses the Kaggle dataset by Vatsal Mavani, which can be found [here](https://www.kaggle.com/datasets/vatsalmavani/spotify-dataset/data). 

### Setting up
1. Install the needed dependencies
2. Use the datasets (especially `data.csv` and `data_w_genres.csv`) provided in the Kaggle link above
2. Before loading to the web app, clean the csv file first busing the `clean.py` file
3. Execute the `app.py` file


### Instructions
1. Upon launching the application, you will be prompted to upload your dataset.
2. Select your file and click the "Analyze" button.
3. Once your dataset is successfully loaded, the application will automatically initiate the analysis process, presenting an overview of the dataset selected.
4. Another feature of the application is the "artist profile", wherein you can look for the detailed information of a specific artist. To do this, click the "Artist Profile" button on the menu bar.

### Features
1. Dataset Upload: Users are prompted to upload their dataset upon launching the application.
2. File Compatibility: The application recommends uploading a CSV file for optimal compatibility.
3. Automatic Analysis: Once the dataset is successfully loaded, the application automatically initiates the analysis process.
4. Dataset Overview: Presents a comprehensive overview of the dataset information extracted from the uploaded CSV file.
5. Yearly Song Analysis: Generates a graph illustrating the number of songs released each year based on the dataset.
6. Musical Key Share: Provides insights into the distribution of musical keys in the analyzed dataset.
7. Artist Profile: Navigating to the "Artist Profile" section allows users to explore both "Overview" and "Artist Profile" options.
8. Top 10 Songs Dashboard: Users can search for a specific artist and view a detailed dashboard showcasing the artist's top 10 songs over the years.
9. Popularity Rating: Displays the popularity rating of the selected artist.
10. Number of Followers: Presents information on the total number of followers for the selected artist.
11. Music Genre: Indicates the predominant music genre associated with the selected artist.
12. Average Tempo: Provides the average tempo of the released tracks by the selected artist.
13. Catalog Information: Offers a catalog section showing the total tracks recorded in the dataset.
14. Explicit Percentage: Displays the percentage of explicit tracks within the dataset for the selected artist.
15. Average Tempo across the years: Generates a graph illustrating the average tempo of the selected artist's songs over the years.
16. Average Loudness: Presents the average loudness of the songs over the years.
17. Acousticness: Displays the acousticness of the songs over the years.
18. Danceability: Presents the danceability or how suitable songs are for dancing over the years.

Feel free to explore the diverse functionalities of Soundi.py to enhance your understanding of Spotify dataset analytics. 

