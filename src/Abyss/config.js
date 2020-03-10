import styles from '@/assets/styles.sass';

export default {
  animation: {
    meshSpeed: 5,
    meshRotationSpeed: 0.2,
  },
  colors: {
    primary: parseColor(styles.primaryColor),
    alt1: parseColor(styles.altColor1),
    alt2: parseColor(styles.altColor2),
    tunnelMaterial: parseColor(styles.tunnelMaterialColor),
  },
  fog: {
    near: 30,
    far: 50,
  },
  camera: {
    positionZ: -50,
    lookZ: 5,
  },
  geometry: {
    sectionSegments: 70,
    sectionRadius: 2,
    sectionRandomRadiusFactor: 0.1,
    sectionRandomZFactor: 0.8,
    sectionLength: 1,
    length: 65,
  },
};

function parseColor(cssString) {
  return parseInt(cssString.slice(1), 16);
}
