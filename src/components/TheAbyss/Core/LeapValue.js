export default class {
  constructor(valuesRange, updateTimeRange) {
    this._valuesRange = valuesRange;
    this._timeRange = updateTimeRange;
    this._value = 0;
    this._timeLeft = 0;

    this._set();
  }

  get value() {
    return this._value;
  }

  tick(timeDelta) {
    this._timeLeft -= timeDelta;
    if (this._timeLeft <= 0) {
      this._set();
    }
  }

  _set() {
    let [min, max] = this._valuesRange;
    this._value = min + Math.random() * (max - min);

    [min, max] = this._timeRange;
    this._timeLeft = min + Math.random() * (max - min);
  }
}
