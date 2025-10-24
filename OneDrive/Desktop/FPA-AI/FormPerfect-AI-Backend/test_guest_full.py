import requests
import json

url = "http://localhost:8000/api/auth/guest"

try:
    response = requests.post(url, headers={"Content-Type": "application/json"})
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {response.headers}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Success!")
        print(f"Access Token: {data.get('access_token', '')[:50]}...")
        print(f"User: {data.get('user')}")
    else:
        print(f"\n❌ Error: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
