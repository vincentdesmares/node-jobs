"use strict";
const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  var Scene = sequelize.define(
    "Scene",
    {
      name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.TEXT
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Project",
          key: "id"
        }
      }
    },
    {
      freezeTableName: true,
      tableName: "scene"
    }
  );

  Scene.associate = function(models) {
    this.belongsTo(models.Project, {
      foreignKey: "projectId",
      sourceKey: "id"
    });
    this.hasMany(models.Batch, {
      as: "batches",
      foreignKey: "sceneId",
      sourceKey: "id"
    });
  };
  return Scene;
};
