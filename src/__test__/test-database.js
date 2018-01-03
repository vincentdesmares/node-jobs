const path = require("path");
const fs = require("fs");
const Umzug = require("umzug");
const models = require("./../models");
const sequelize = models.sequelize; // sequelize is the instance of the db

/**
 * This file handles an im-memory SQLite database used for test purposes.
 * It exports three functions:
 * - migrateDatabase: generates the database from the migrations files
 * - seedDatabase: seeds the database from the seeders files
 * - deleteTables: delete all the tables
 * It also exports sequelize models.
 * - models
 */

/**
 * Generates options for umzug. `path` indicates where to find the migrations or seeders (either in ./migrations or ./seeders).
 * Returns a JS plain Object with the correct options, ready to feed `new Umzug(...)`.
 */
const umzugOptions = path => ({
  storage: "sequelize",
  storageOptions: {
    sequelize
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(), // queryInterface
      sequelize.constructor, // DataTypes
      function() {
        throw new Error(
          'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
        );
      }
    ],
    path,
    pattern: /\.js$/
  }
});

// Array containing the filenames of the migrations files without extensions, sorted chronologically.
const migrationFiles = fs
  .readdirSync("./migrations/")
  .sort()
  .map(f => path.basename(f, ".js"));

// Array containing the filenames of the seeders files without extensions, sorted chronologically.
const seederFiles = fs
  .readdirSync("./seeders/")
  .sort()
  .map(f => path.basename(f, ".js"));

// Instances of Umzug for migrations and seeders
const umzugMigrations = new Umzug(umzugOptions("./migrations"));
const umzugSeeders = new Umzug(umzugOptions("./seeders"));

/**
 * Migrates the database
 */
exports.migrateDatabase = async () =>
  await umzugMigrations.up({
    migrations: migrationFiles
  });

/**
 * Seeds the database with mockup data
 */
exports.seedDatabase = async () =>
  await umzugSeeders.up({
    migrations: seederFiles
  });

/**
 * Deletes all the tables
 */
exports.deleteTables = async () =>
  sequelize.getQueryInterface().dropAllTables();

exports.models = models;
