import os
import uuid  # <--- ADD THIS IMPORT
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

print("Linking existing users to Supabase Auth...")

users = supabase.table("users").select("*").execute().data

for user in users:
    if not user.get("auth_id"):
        # FIX: Use uuid.uuid4() to generate a valid UUID
        dummy_uuid = str(uuid.uuid4())
        
        print(f"Updating {user['name']} with auth_id: {dummy_uuid}")
        
        supabase.table("users").update({
            "auth_id": dummy_uuid
        }).eq("id", user['id']).execute()

print("Done. Users now linked with valid UUIDs.")