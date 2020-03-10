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
    near: 0,
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
    length: 52,
  },
};

/**
 * @param {string} cssString
 * @returns {number}
 */
function parseColor(cssString) {
  let color = cssString.slice(1);
  if (color.length === 3) {
    // f4f -> ff44ff
    color = [...color].map((x) => `${x}${x}`).join('');
  }
  return parseInt(color, 16);
}
