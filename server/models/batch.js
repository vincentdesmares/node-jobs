"use strict";
const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  var Batch = sequelize.define(
    "Batch",
    {
      status: {
        type: Sequelize.STRING
      },
      projectId: {
        type: Sequelize.INTEGER
      },
      sceneId: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true,
      tableName: "batch"
    }
  );

  Batch.associate = function(models) {
    this.belongsTo(models.Project, {
      foreignKey: "projectId",
      sourceKey: "id"
    });
    this.belongsTo(models.Scene, {
      foreignKey: "sceneId",
      sourceKey: "id"
    });
    this.hasMany(models.Job, {
      as: "jobs",
      foreignKey: "batchId",
      sourceKey: "id"
    });
  };
  return Batch;
};
