import { PointLight } from 'three';
import config from './config';
// import InertialSetter from './InertialSetter';
// import LeapValue from './LeapValue';

// Сделать мерцание света? Сделать перемещающийся огонёк?

export default function (core) {
  const conf = config.lights;

  const [back, front] = [0, 1].map(
    () => new PointLight(config.colors.primary, conf.intensity[0], conf.distance[0], conf.decay),
  );

  // const controllers = [
  //   new LightController(back),
  //   new LightController(front),
  // ];

  core.listen('camera-position-updated', (position) => {
    back.position.z = position.z - conf.distanceFromCamera;
    front.position.z = position.z + conf.distanceFromCamera;
  });

  // core.listen('tick', ({ timeDelta }) => {
  //   controllers.forEach((x) => x.tick(timeDelta));
  // });

  return [front, back];
}

// class LightController {
//   /** @param {PointLight} light */
//   constructor(light) {
//     this._light = light;

//     this._intensityTarget = new LeapValue(config.lights.intensity, [0.1, 0.4]);
//     this._intensity = new InertialSetter(this._intensityTarget.value, 1);

//     this._distanceTarget = new LeapValue(config.lights.distance, [5, 15]);
//     this._distance = new InertialSetter(this._distanceTarget.value, 0.1);
//   }

//   tick(dt) {
//     this._distanceTarget.tick(dt);
//     this._distance.target = this._distanceTarget.value;
//     this._distance.tick(dt);
//     this._light.distance = this._distance.value;

//     this._intensityTarget.tick(dt);
//     this._intensity.target = this._intensityTarget.value;
//     this._intensity.tick(dt);
//     this._light.intensity = this._intensity.value;
//   }
// }
