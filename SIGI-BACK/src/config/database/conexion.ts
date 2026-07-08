import { Sequelize, database, username, password, host, dialect } from "./configDataBase.js";

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: dialect as "mysql",
    logging: false,
    dialectOptions: {
        connectTimeout: 60000,
        charset: "utf8mb4",
    },
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000,
    },
});

export default sequelize;