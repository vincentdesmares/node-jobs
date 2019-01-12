'use strict'
const Sequelize = require('sequelize')

module.exports = function(sequelize) {
  var Batch = sequelize.define(
    'batch',
    {
      status: {
        type: Sequelize.STRING
      },
      pipelineId: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true,
      tableName: 'batch'
    }
  )

  Batch.associate = function(models) {
    models.batch.belongsTo(models.pipeline, {
      foreignKey: 'pipelineId',
      sourceKey: 'id'
    })
    models.batch.hasMany(models.job, {
      as: 'jobs',
      foreignKey: 'batchId',
      sourceKey: 'id'
    })
  }
  return Batch
}
