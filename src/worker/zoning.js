//require("@std/esm");
const WorkerAbstract = require('./abstract')
const FastSimplexNoise = require('fast-simplex-noise').default
const seedrandom = require('seedrandom')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
var fs = require('fs')
const { sequelize } = require('../models')

class Zoning extends WorkerAbstract {
  async process(job) {
    const type = 'water'
    const zoneDefinition = '0-500]:0, (500-1024]:1, (1025-2600:0'
    // What raster we should use?
    // How can we work on slope raster instead of height rasters?
    // Should the worker create a new raster for slops ? Should we created dedicated worker for that purpose ?

    // Create an alternative rast where all the values are either 1 or 0
    await sequelize
      .query(
        // Insert jobId, batchId, sceneId, projectId ?
        `INSERT INTO terrain (rast) (SELECT ST_Reclass(rast,'${zoneDefinition}', '16BUI') AS rast FROM public.terrain)`
      )
      .spread((results, metadata) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        console.log(metadata)
      })

    // Test query :  "SELECT val, ST_AsGeoJSON(ST_ForceRHR(geom)) As geomwkt FROM (SELECT (ST_DumpAsPolygons(rast)).* FROM waterVSground ) As foo WHERE val = 0 ORDER BY val"
    await sequelize
      .query(
        `INSERT INTO zoning (area, type) (SELECT geom, '${type}' FROM (SELECT (ST_DumpAsPolygons(rast)).* FROM zoning_raster ) As foo WHERE val = 1)`
      )
      .spread((results, metadata) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        console.log(results)
        console.log(metadata)
      })
    console.log('Saved!')
    return job
  }
}

var zoning = new Zoning()
zoning.process({ test: 'test' })

//module.exports = zoning;
