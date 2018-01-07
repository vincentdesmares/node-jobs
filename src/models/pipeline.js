"use strict";
const Sequelize = require("sequelize");

module.exports = function(sequelize) {
  var Pipeline = sequelize.define(
    "pipeline",
    {
      name: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true,
      tableName: "pipeline"
    }
  );
  Pipeline.associate = function(models) {
    models.pipeline.hasMany(models.build, {
      as: "builds",
      foreignKey: "pipelineId",
      sourceKey: "id"
    });
  };
  return Pipeline;
};
