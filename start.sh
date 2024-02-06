sudo docker-compose up -d --build
mkdir -p app/data/files

cd app
npm i
npm run dev
