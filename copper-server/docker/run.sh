docker network create front
docker-compose build
docker-compose up -d
// crontab -l | { cat; echo "57 23 * * * freshclam --quiet";} | crontab -
