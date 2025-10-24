import requests

# Test the guest endpoint
url = "http://localhost:8000/api/auth/guest"
response = requests.post(url)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
