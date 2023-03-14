import mysql from "mysql2";

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  socketPath?: string;
}

// if environment is DEVELOPMENT use config without socketPath property
let config: DatabaseConfig = {
  host: process.env.MY_SQL_DB_HOST!,
  user: process.env.MY_SQL_DB_USER!,
  password: process.env.MY_SQL_DB_PASSWORD!,
  database: process.env.MY_SQL_DB_DATABASE!,
  port: parseInt(process.env.MY_SQL_DB_PORT!),
};

if (process.env.NODE_ENV === "production") {
  // required for the connection to the production MySQL database.
  config = { ...config, socketPath: process.env.INSTANCE_UNIX_SOCKET };
}

const pool = mysql.createPool(config);

export const db = pool.promise();
