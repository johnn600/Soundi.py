import pandas as pd

file1 = r"path to data.csv"
file2 = r'path to data_w_genres.csv'

# Load the datasets
df = pd.read_csv(file1)
data_w_genres_df = pd.read_csv(file2)

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

# Extract the first artist from the lists in 'artists' column
df['artists'] = df['artists'].apply(lambda x: x.strip("[]").split(",")[0].strip("'") if pd.notna(x) else x)

# Merge the datasets based on the 'artists' column
merged_df = pd.merge(df, data_w_genres_df[['artists', 'genres']], on='artists', how='left')

# Extract the first genre from the lists in 'genres' column
merged_df['genres'] = merged_df['genres'].apply(lambda x: x.strip("[]").split(",")[0].strip("'") if pd.notna(x) else x)

# Rename the 'genres' column to 'genre'
merged_df = merged_df.rename(columns={'genres': 'genre'})

# Optionally, you can sort the dataframe based on a specific column
merged_df = merged_df.sort_values(by=['year', 'popularity'], ascending=[True, False])

# Save the cleaned and merged dataset to a new CSV file
merged_df.to_csv(r"path to cleaned_and_merged_data.csv", index=False)