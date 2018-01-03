"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn("job", "status", Sequelize.STRING);
  },

  down: function() {}
};
