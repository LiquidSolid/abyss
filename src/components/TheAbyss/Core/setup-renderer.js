import { WebGLRenderer } from 'three';
import config from './config';

export default function (core, {
  canvas,
  antialiasing: antialias,
  camera,
  scene,
}) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias,
  });
  renderer.setClearColor(config.colors.primary);

  core.listen('resize', ({ width, height }) => {
    renderer.setSize(width, height);
  });

  return {
    render() {
      renderer.render(scene, camera);
    },
  };
}
