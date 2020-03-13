import { PointLight } from 'three';
import config from './config';

// Сделать мерцание света? Сделать перемещающийся огонёк?

export default function (core) {
  const conf = config.lights;

  const [back, front] = [0, 1].map(
    () => new PointLight(config.colors.primary, conf.intensity, conf.distance, conf.decay),
  );

  core.listen('camera-position-updated', (position) => {
    back.position.z = position.z - conf.distanceFromCamera;
    front.position.z = position.z + conf.distanceFromCamera;
  });

  return [front, back];
}
