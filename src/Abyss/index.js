import * as THREE from 'three';
import config from './config';
import Facility from './Facility';

export default class {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} params
   */
  constructor(canvas, params) {
    // Парсинг параметров
    const {
      antialiasing = false,
      postprocessing = false,
      stats = false,
    } = params || {};
    this._params = { antialiasing, postprocessing, stats };

    // Рендер
    this._renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: this._params.antialiasing,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    // this._renderer.setClearColor(0xffffff);
    this._renderer.setClearColor(config.colors.primary, 1);

    // Сцена
    this._scene = new THREE.Scene();
    this._scene.fog = new THREE.Fog(
      config.colors.primary,
      config.fog.near,
      config.fog.far,
    );

    // Камера
    const aspect = canvas.width / canvas.height;
    this._camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 50);
    this._camera.position.set(0, 0, config.camera.positionZ);
    this._camera.lookAt(0, 0, config.camera.lookZ);

    // Часы
    this._clock = new THREE.Clock();

    // Свет
    this._light = new THREE.PointLight(config.colors.primary, 3, 150, 2);
    this._light.position.set(0, 0, 5);
    this._scene.add(this._light);

    // Объект
    this._facility = new Facility();
    this._scene.add(this._facility.getMesh());

    this._scene.add(new THREE.AxesHelper(10));

    this._renderer.render(this._scene, this._camera);
  }

  resize({ width, height }) {
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }

  animate() {
    const delta = this._clock.getDelta();
    if (delta > 0.5) return;
    this._facility.update(delta);

    this._renderer.render(this._scene, this._camera);
  }
}
