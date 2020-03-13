import { Clock } from 'three';
import setupScene from './setup-scene';
import setupKeyboard from './setup-keyboard';
import setupCamera from './setup-camera';
import setupRenderer from './setup-renderer';

const MAX_DISPATCH_LEVEL = 15;

// todo - Импортировать из THREE только нужное, threeshaking

export default class {
  constructor({ canvas, antialiasing }) {
    this._tick = false;
    this._listeners = new Map();
    this._dispatchLevel = 0;
    this._deferredEvents = [];

    this._clock = new Clock();
    this._keyboard = setupKeyboard(this);
    const camera = setupCamera(this);
    const scene = setupScene(this);
    this._renderer = setupRenderer(this, {
      canvas,
      antialiasing,
      scene,
      camera,
    });
  }

  listen(event, callback) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).push(callback);
    } else {
      this._listeners.set(event, [callback]);
    }
  }

  dispatch(event, payload) {
    if (!this._tick) {
      this._deferredEvents.push({ event, payload });
      return;
    }

    this._dispatchLevel += 1;
    if (this._dispatchLevel >= MAX_DISPATCH_LEVEL) {
      throw new Error('Max dispatch level overload');
    }

    for (const listener of (this._listeners.get(event) || [])) {
      listener(payload, { dispatch: this.dispatch });
    }
    this._dispatchLevel -= 1;
  }

  tick() {
    this._tick = true;

    // Сначала диспетчнуть отложенные события
    for (const { event, payload } of this._deferredEvents) {
      this.dispatch(event, payload);
    }
    this._deferredEvents = [];

    // Теперь формирую контекст тика
    const context = {
      keyboard: this._keyboard,
      // mouse: null,
      timeDelta: this._clock.getDelta(),
      // camera: this._camera,
    };
    // И произвожу сам тик
    this.dispatch('tick', context);

    // Рендерю
    this._renderer.render();

    this._tick = false;
  }
}
