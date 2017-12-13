"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addConstraint("scene", ["projectId"], {
      type: "FOREIGN KEY",
      references: {
        table: "Projects",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    });
  },

  down: function(queryInterface, Sequelize) {}
};
