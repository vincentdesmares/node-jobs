class WorkerAbstract {
  process() {
    throw new Error('Implement process')
  }
}

module.exports = WorkerAbstract
