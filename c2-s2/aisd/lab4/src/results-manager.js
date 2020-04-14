// суть менеджера - уменьшить визуальный мусор в главном файле
export default class ResultsManager {
  constructor() {
    this._results = {};
  }

  add(prop, value) {
    if (this._results[prop]) {
      this._results[prop].push(value);
    } else {
      this._results[prop] = [value];
    }
  }

  clear() {
    this._results = {};
  }

  get() {
    return this._results;
  }
}
