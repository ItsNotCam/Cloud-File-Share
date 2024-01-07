cd /docker-entrypoint-initdb.d

mysql -u root -pok -e "CREATE USER '$DB_USER'@'%' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';";
mysql -u root -pok -e "GRANT SELECT ON *.* TO '$DB_USER'@'%';"
mysql -u root -pok -e "CREATE DATABASE OK;"
mysql -u root -pok < init.sql;