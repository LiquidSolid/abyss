import {
  Scene,
  // AxesHelper,
  // AmbientLight,
  Fog,
} from 'three';
import config from './config';

import setupFormation from './setup-formation';
import setupLights from './setup-lights';

export default function (core) {
  // Сцена
  const scene = new Scene();
  scene.fog = new Fog(
    // 0,
    config.colors.primary,
    config.fog.near,
    config.fog.far,
  );

  // Свет
  // this._light = new THREE.PointLight(config.colors.primary, 3, 150, 2);
  // this._light.position.set(0, 0, config.light.z);
  // this._scene.add(this._light);

  // Объект
  scene.add(setupFormation(core));
  setupLights(core).forEach((l) => scene.add(l));

  // scene.add(new AxesHelper(10));
  // scene.add(new AmbientLight(0x404040));

  return scene;
}
