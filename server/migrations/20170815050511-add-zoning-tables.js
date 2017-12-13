"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query("CREATE EXTENSION IF NOT EXISTS postgis;")
      .then(
        queryInterface.sequelize
          .query(
            'CREATE TABLE "public"."zoning" ("id" serial PRIMARY KEY, "type" text)'
          )
          .then(
            queryInterface.sequelize.query(
              "SELECT AddGeometryColumn('zoning', 'area', 0, 'POLYGON', 2, true);"
            )
          )
      );
  },

  down: function(queryInterface, Sequelize) {}
};
