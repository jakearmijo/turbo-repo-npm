export const dbConfig = {
  host: "enter_host_here",
  database: "floradb",
  port: 5432,
  username: "enter_username_here",
  password: "enter_password_here",
  dialect: "postgres",
  dialectOptions: {
    connectTimeout: 60000,
  },
  ssl: true,
  params: {
    define: {
      underscored: true,
    },
  },
};
