class WorkerAbstract {
  constructor() {}
  process(job) {
    throw "Implement process";
  }
}

module.exports = WorkerAbstract;
