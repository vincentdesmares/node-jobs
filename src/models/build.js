"use strict";
const Sequelize = require("sequelize");

module.exports = function(sequelize) {
  var Build = sequelize.define(
    "build",
    {
      status: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.TEXT
      },
      pipelineId: {
        type: Sequelize.INTEGER,
        references: {
          model: "project",
          key: "id"
        }
      }
    },
    {
      freezeTableName: true,
      tableName: "build"
    }
  );

  Build.associate = function(models) {
    models.build.belongsTo(models.pipeline, {
      foreignKey: "pipelineId",
      sourceKey: "id"
    });
    models.build.hasMany(models.batch, {
      as: "batches",
      foreignKey: "buildId",
      sourceKey: "id"
    });
  };
  return Build;
};
