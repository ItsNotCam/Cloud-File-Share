import mysql from 'mysql2/promise'

declare module globalThis {
	var db: () => Promise<mysql.Connection>;
}