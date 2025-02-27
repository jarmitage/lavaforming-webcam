import requests
from bs4 import BeautifulSoup
import re
import json
import pandas as pd
from datetime import datetime

def scrape_iceland_earthquake_data():
    """
    Scrapes earthquake data from the Icelandic Meteorological Office website.
    
    Returns:
        pandas.DataFrame: A DataFrame containing the earthquake data.
    """
    # URL of the earthquake data page
    url = "https://en.vedur.is/earthquakes-and-volcanism/earthquakes/reykjanespeninsula/"
    
    # Send a GET request to the URL
    response = requests.get(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    })
    
    # Check if request was successful
    if response.status_code != 200:
        raise Exception(f"Failed to fetch webpage: Status code {response.status_code}")
    
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract the JavaScript content containing the earthquake data
    # Looking for the VI.quakeInfo array
    script_content = soup.find_all('script')
    quake_data_js = None
    
    for script in script_content:
        if script.string and 'VI.quakeInfo' in script.string:
            quake_data_js = script.string
            break
    
    if not quake_data_js:
        raise Exception("Could not find earthquake data in the page")
    
    # Extract the JavaScript array using regex
    pattern = r"VI\.quakeInfo\s*=\s*(\[.*?\]);"
    match = re.search(pattern, quake_data_js, re.DOTALL)
    
    if not match:
        raise Exception("Could not extract earthquake data from JavaScript")
    
    # Get the array content
    array_content = match.group(1)
    
    # Convert JavaScript objects to Python dictionaries
    # We need to clean up the JavaScript syntax to make it JSON-compatible
    # Replace JavaScript date objects
    array_content = re.sub(r"new Date\((\d+),(\d+)-1,(\d+),(\d+),(\d+),(\d+)\)", 
                          r'"\1-\2-\3T\4:\5:\6Z"', 
                          array_content)
    
    # Replace single quotes with double quotes for JSON parsing
    array_content = array_content.replace("'", '"')
    
    # Parse as JSON
    try:
        earthquake_list = json.loads(array_content)
    except json.JSONDecodeError as e:
        # If parsing fails, print the problematic content for debugging
        print(f"JSON parsing error: {e}")
        print(f"Content that couldn't be parsed: {array_content[:200]}...")  # Print first 200 chars
        raise
    
    # Convert to DataFrame
    df = pd.DataFrame(earthquake_list)
    
    # Clean and convert data types
    df['t'] = pd.to_datetime(df['t'])
    df['lat'] = df['lat'].astype(float)
    df['lon'] = df['lon'].astype(float)
    df['dep'] = df['dep'].astype(float)  # Depth
    df['s'] = df['s'].astype(float)      # Magnitude
    
    # Rename columns for clarity
    df = df.rename(columns={
        't': 'timestamp',
        'lat': 'latitude',
        'lon': 'longitude',
        'dep': 'depth_km',
        's': 'magnitude',
        'dR': 'location',
        'dD': 'direction',
        'dL': 'distance',
        'q': 'quality',
        'a': 'age_hours'
    })
    
    return df

def save_to_csv(df, filename="iceland_earthquakes.csv"):
    """Save the DataFrame to a CSV file."""
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def main():
    try:
        # Scrape earthquake data
        print("Scraping earthquake data from the Icelandic Meteorological Office website...")
        earthquake_df = scrape_iceland_earthquake_data()
        
        # Display information about the data
        print(f"\nSuccessfully scraped data for {len(earthquake_df)} earthquakes.")
        print("\nMost recent earthquakes:")
        print(earthquake_df.sort_values('timestamp', ascending=False).head(5)[['timestamp', 'magnitude', 'depth_km', 'location']])
        
        # Save to CSV
        save_to_csv(earthquake_df)
        
        # Optionally, perform some basic analysis
        print("\nEarthquake statistics:")
        print(f"Average magnitude: {earthquake_df['magnitude'].mean():.2f}")
        print(f"Maximum magnitude: {earthquake_df['magnitude'].max():.2f}")
        print(f"Average depth: {earthquake_df['depth_km'].mean():.2f} km")
        
        # Count earthquakes by location
        location_counts = earthquake_df['location'].value_counts().head(5)
        print("\nMost active areas:")
        for location, count in location_counts.items():
            print(f"{location}: {count} earthquakes")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
