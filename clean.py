import pandas as pd
import numpy as np



#file_path = r"C:\Users\Admin\Desktop\Spotify viz\Dataset 1\data.csv"
file_path = r"FILE PATH OF YOUR DATASET"

# Load the dataset
df = pd.read_csv(file_path)

# Display basic information about the dataset
print(df.info())

# Convert explicit to boolean
df['explicit'] = df['explicit'].astype(bool)

# Drop duplicate rows based on 'artists' and 'name'
df = df.drop_duplicates(subset=['artists', 'name'])

# Drop the release_date column
df = df.drop(columns=['release_date'])

# Map integer values in 'key' column to corresponding keys
key_mapping = {
    0: 'C', 1: 'C♯/D♭', 2: 'D', 3: 'D♯/E♭', 4: 'E', 5: 'F', 6: 'F♯/G♭', 7: 'G', 8: 'G♯/A♭', 9: 'A', 10: 'A♯/B♭', 11: 'B'
}
df['key'] = df['key'].map(key_mapping)

# Round values in 'tempo' column to the nearest integer
df['tempo'] = df['tempo'].round().astype(int)

# Optionally, you can sort the dataframe based on a specific column
df = df.sort_values(by=['year', 'popularity'], ascending=[True, False])

# Save the cleaned dataset to a new CSV file
df.to_csv(r"C:\Users\Admin\Desktop\Spotify viz\Dataset 1\cleaned_data.csv", index=False)

