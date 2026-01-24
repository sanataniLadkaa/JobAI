import json
import os

DATA_FILE = "data.json"

def load_db():
    """Loads the database from the local JSON file."""
    if not os.path.exists(DATA_FILE):
        # Initialize with empty structure if file doesn't exist
        initial_data = {
            "users": [],
            "jobs": [],
            "applications": [],
            "calls": [],
            "sessions": []
        }
        save_db(initial_data)
        return initial_data
    
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_db(data):
    """Saves the database to the local JSON file."""
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

def get_next_id(items):
    """Simple helper to get the next available ID."""
    if not items:
        return 1
    return max(item["id"] for item in items) + 1