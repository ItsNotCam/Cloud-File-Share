import requests, sys, os
from dotenv import load_dotenv

if len(sys.argv) != 2:
    print("This script requires one positional argument denoting the number of users to generate")
    print("Usage: python3 insert_users.py <number here>")
    exit()

load_dotenv()
api_host = os.getenv("API_HOST")
api_port = os.getenv("API_PORT")

for i in range(0, int(sys.argv[1])):
    resp = requests.get('https://random-data-api.com/api/bank/random_bank?size=1')
    
    passwd = resp.json()[0]['routing_number']
    bank_name = resp.json()[0]['bank_name']
    bic = resp.json()[0]['swift_bic']
    name = f"{bank_name}@{bic}.com"

    payload = { 'email': name.replace(' ', '_'), 'password': passwd }

    session = requests.session()
    resp = session.post(
        url=f"http://{api_host}:{api_port}/api/user", 
        headers={ "User-Agent": "Mozilla/5.0" }, 
        data=payload
    )

    if resp.status_code != 200:
        print("Failed")
    else:
        print(payload)