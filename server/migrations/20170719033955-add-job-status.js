"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn("Jobs", "status", Sequelize.STRING);
  },

  down: function(queryInterface, Sequelize) {}
};
