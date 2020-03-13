import { Vector3, PerspectiveCamera } from 'three';
import config from './config';
import InertialSetter from './InertialSetter';

export default function (core) {
  const camera = new PerspectiveCamera();

  const lon = new InertialSetter(0, config.player.lookInertialSpeed);
  const lat = new InertialSetter(-Math.PI / 2, config.player.lookInertialSpeed);
  const moveSpeed = new InertialSetter(0);

  let mouseMoveAccumulator = { x: 0, y: 0 };
  let moveZ = camera.position.z;

  core.listen('mousemove', mousemove);
  core.listen('tick', tick);
  core.listen('resize', resize);

  return camera;

  function mousemove({ dx, dy }) {
    mouseMoveAccumulator.x += dx;
    mouseMoveAccumulator.y += dy;
  }

  function resize({ width, height }) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function tick({ timeDelta, keyboard }) {
    lon.target -= mouseMoveAccumulator.x * config.player.lookMouseFactor * timeDelta;
    lat.target -= mouseMoveAccumulator.y * config.player.lookMouseFactor * timeDelta;
    lat.target = Math.max(-Math.PI * 0.95, Math.min(-Math.PI * 0.05, lat.target));
    lon.tick(timeDelta);
    lat.tick(timeDelta);
    mouseMoveAccumulator = { x: 0, y: 0 };

    const view = new Vector3().setFromSphericalCoords(1, lat.value, lon.value);

    camera.lookAt(new Vector3().copy(view).add(camera.position));
    camera.position.x = -view.x * 4;
    camera.position.y = -view.y * 4;
    const camZ = -view.z * 4;

    const forward = keyboard.isPressed('KeyW');
    const backward = keyboard.isPressed('KeyS');
    // const left = keyboard.isPressed('KeyA');
    // const right = keyboard.isPressed('KeyD');
    const stop = keyboard.isPressed('Space');
    // const down = keyboard.isPressed('KeyC');

    // let positionUpdated = false;

    if (stop) {
      moveSpeed.target = 0;
      moveSpeed.speed = config.player.moveStopSpeed;
    } else if (forward ? !backward : backward) {
      const moveDir = new Vector3().setFromSphericalCoords(
        config.player.moveSpeed, lat.value, lon.value,
      );
      moveSpeed.target = (forward ? 1 : -1) * moveDir.z;
      moveSpeed.speed = config.player.moveInertialSpeed;
    } else {
      moveSpeed.target = 0;
      moveSpeed.speed = config.player.moveRelaxationSpeed;
    }
    moveSpeed.tick(timeDelta);

    moveZ += moveSpeed.value * timeDelta;

    camera.position.z = moveZ + camZ;

    core.dispatch('camera-position-updated', camera.position);
  }
}
