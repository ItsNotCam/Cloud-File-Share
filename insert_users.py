import requests, sys, os
from dotenv import load_dotenv

load_dotenv()
api_host = os.getenv("API_HOST")
api_port = os.getenv("API_PORT")

headers = { 'User-Agent': 'Mozilla/5.0' }

for i in range(0, int(sys.argv[1])):
    resp = requests.get('https://random-data-api.com/api/bank/random_bank?size=3')
    
    pas = resp.json()[0]['routing_number']
    bank_name = resp.json()[0]['bank_name']
    bic = resp.json()[0]['swift_bic']
    name = f"{bank_name}@{bic}.com"

    payload = { 'email': name.replace(' ', '_'), 'password': pas }
    print(payload)

    session = requests.session()
    resp = session.post(f"http://{api_host}:{api_port}/api/user", headers=headers, data=payload)
