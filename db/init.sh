cd /docker-entrypoint-initdb.d

echo "CREATE USER '$DB_USER'@'$API_HOST' IDENTIFIED BY '$DB_PASSWORD';";

mysql -u root -pok -e "CREATE USER '$DB_USER'@'$API_HOST' IDENTIFIED BY '$DB_PASSWORD';";
mysql -u root -pok -e "GRANT SELECT ON *.* TO '$DB_USER'@'$API_HOST';"
mysql -u root -pok < init.sql;