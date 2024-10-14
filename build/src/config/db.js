"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbName = process.env.DB_DATABASE || 'senior_backend_test';
const dbUser = process.env.DB_USERNAME || 'postgres';
const dbHost = process.env.DB_HOST || 'postgres'; // Changed to 'postgres' to match service name
const dbDriver = process.env.DB_DIALECT || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbPort = parseInt(process.env.DB_PORT || '5432');
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDriver,
    logging: false,
});
exports.default = sequelize;
