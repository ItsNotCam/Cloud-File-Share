cd /docker-entrypoint-initdb.d

mysql -u root -pok -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"

mysql -u root -pok -e "CREATE USER '$DB_USER'@'$API_HOST' IDENTIFIED WITH caching_sha2_password BY '$DB_PASS';";
mysql -u root -pok -e "CREATE USER '$DB_USER'@'$BACKEND_GATEWAY' IDENTIFIED WITH caching_sha2_password BY '$DB_PASS';";

mysql -u root -pok -e "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE $MYSQL_DATABASE.* TO '$DB_USER'@'$API_HOST';"
mysql -u root -pok -e "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE $MYSQL_DATABASE.* TO '$DB_USER'@'$BACKEND_GATEWAY';"
