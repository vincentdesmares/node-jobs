"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Jobs", "batchId", {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.addConstraint("Jobs", ["batchId"], {
        type: "FOREIGN KEY",
        references: {
          table: "batch",
          field: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      })
    ]);
  },

  down: function() {}
};
