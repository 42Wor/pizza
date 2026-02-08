import folium

# --- CONFIGURATION: CHANGE THIS TO YOUR SHOP LOCATION ---
SHOP_LAT = 30.241993

SHOP_LNG = 71.889235
SHOP_NAME = "Jee Bhai Cafe"
RADIUS_KM = 20

def create_custom_map():
    print(f"Generating map for {SHOP_NAME}...")

    # 1. Create Map with a Dark Theme (Custom Look)
    m = folium.Map(
        location=[SHOP_LAT, SHOP_LNG], 
        zoom_start=11,
        tiles='CartoDB dark_matter' # This gives the cool dark look
    )

    # 2. Add Delivery Radius Circle (Orange)
    folium.Circle(
        location=[SHOP_LAT, SHOP_LNG],
        radius=RADIUS_KM * 1000, # Convert to meters
        color='#FF9F1C',
        fill=True,
        fill_color='#FF9F1C',
        fill_opacity=0.2,
        popup=f"{RADIUS_KM}km Delivery Zone"
    ).add_to(m)

    # 3. Add Shop Marker
    folium.Marker(
        [SHOP_LAT, SHOP_LNG],
        popup=f"<b>{SHOP_NAME}</b>",
        icon=folium.Icon(color="orange", icon="cutlery", prefix='fa')
    ).add_to(m)

    # 4. Save to file
    output_file = "shop_location_map.html"
    m.save(output_file)
    print(f"✅ Map saved as '{output_file}'. Open this file in your browser to see your custom map!")

if __name__ == "__main__":
    create_custom_map()