"use strict";
const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define("Project", {
    name: {
      type: Sequelize.STRING
    }
  });
  Project.associate = function(models) {
    this.hasMany(models.Scene, {
      as: "scenes",
      foreignKey: "projectId",
      sourceKey: "id"
    });
  };
  return Project;
};
