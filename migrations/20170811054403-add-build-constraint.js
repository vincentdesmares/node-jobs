"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addConstraint("build", ["pipelineId"], {
      type: "FOREIGN KEY",
      references: {
        table: "pipeline",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    });
  },

  down: function() {}
};
