
SHOP_LAT = 30.241993

SHOP_LNG = 71.889235

import folium
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import os

# --- CONFIGURATION ---

DELIVERY_RADIUS_METERS = 20000  # 20km
MAP_ZOOM_START = 10

# --- FILE PATHS ---
# This will save the final map image inside your 'image' folder.
OUTPUT_IMAGE_PATH = os.path.join('image', 'delivery_map.png')
TEMP_HTML_PATH = 'temp_map.html'

def create_map_image():
    """
    Generates a Folium map, saves it as HTML, and takes a screenshot.
    """
    print("1. Creating map object...")
    # Create a map centered on your shop
    m = folium.Map(location=[SHOP_LAT, SHOP_LNG], zoom_start=MAP_ZOOM_START)

    # Add a marker for the shop
    folium.Marker(
        [SHOP_LAT, SHOP_LNG], 
        popup='<b>Jee Bhai Cafe</b><br>We are here!',
        tooltip='Click for info',
        icon=folium.Icon(color='orange', icon='cutlery', prefix='fa')
    ).add_to(m)

    # Add the delivery radius circle
    folium.Circle(
        location=[SHOP_LAT, SHOP_LNG],
        radius=DELIVERY_RADIUS_METERS,
        color='#FF9F1C',
        fill=True,
        fill_color='#FF9F1C',
        fill_opacity=0.2
    ).add_to(m)

    # Save map to a temporary HTML file
    m.save(TEMP_HTML_PATH)
    print(f"2. Temporary map saved to {TEMP_HTML_PATH}")

    # --- Screenshot Logic ---
    print("3. Taking screenshot of the map...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in background
    chrome_options.add_argument("--window-size=800,600") # Set a window size

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Open the local HTML file
    driver.get(f"file:///{os.path.abspath(TEMP_HTML_PATH)}")
    
    # Give the map tiles time to load
    time.sleep(3) 
    
    # Save the screenshot
    driver.save_screenshot(OUTPUT_IMAGE_PATH)
    driver.quit()
    
    print(f"4. Screenshot saved successfully to '{OUTPUT_IMAGE_PATH}'")

    # Clean up the temporary HTML file
    os.remove(TEMP_HTML_PATH)
    print("5. Cleaned up temporary files. All done!")


if __name__ == '__main__':
    # Ensure the 'image' directory exists
    if not os.path.exists('image'):
        os.makedirs('image')
    create_map_image()