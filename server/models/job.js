"use strict";
const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  var Job = sequelize.define("Job", {
    type: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    input: {
      type: Sequelize.STRING
    },
    output: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    batchId: {
      type: Sequelize.INTEGER
    }
  });
  Job.associate = function(models) {
    this.belongsTo(models.Batch, {
      foreignKey: "batchId",
      sourceKey: "id"
    });
  };
  return Job;
};
