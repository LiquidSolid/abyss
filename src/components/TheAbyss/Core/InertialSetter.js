export default class {
  constructor(value, speed = 1) {
    this._current = value;
    this._target = value;
    this._speed = speed;
  }

  get value() {
    return this._current;
  }

  get target() {
    return this._target;
  }

  set target(value) {
    this._target = value;
  }

  set speed(value) {
    this._speed = value;
  }

  tick(timeDelta) {
    this._current += (this._target - this._current) * this._speed * timeDelta;
  }
}
