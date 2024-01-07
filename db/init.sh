cd /docker-entrypoint-initdb.d

mysql -u root -pok -e "CREATE USER '$DB_USER'@'$API_HOST' IDENTIFIED WITH caching_sha2_password BY '$DB_PASS';";
mysql -u root -pok -e "GRANT SELECT ON *.* TO '$DB_USER'@'$API_HOST';"