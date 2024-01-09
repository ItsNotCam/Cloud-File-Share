cd /docker-entrypoint-initdb.d

mysql -u root -pok -e "CREATE DATABASE $MYSQL_ROOT_DATABASE;"

mysql -u root -pok -e "CREATE USER '$DB_USER'@'$API_HOST' IDENTIFIED WITH caching_sha2_password BY '$DB_PASS';";
mysql -u root -pok -e "CREATE USER '$DB_USER'@'172.0.0.1' IDENTIFIED WITH caching_sha2_password BY '$DB_PASS';";

mysql -u root -pok -e "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE $MYSQL_ROOT_DATABASE.* TO '$DB_USER'@'$API_HOST';"
mysql -u root -pok -e "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE $MYSQL_ROOT_DATABASE.* TO '$DB_USER'@'172.0.0.1';"
