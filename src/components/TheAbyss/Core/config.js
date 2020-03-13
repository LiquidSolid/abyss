import styles from '@/assets/styles.sass';

export default {
  colors: {
    primary: parseColor(styles.primaryColor),
    alt1: parseColor(styles.altColor1),
    alt2: parseColor(styles.altColor2),
    tunnelMaterial: parseColor(styles.tunnelMaterialColor),
  },
  fog: {
    near: 0,
    far: 65,
  },
  lights: {
    distanceFromCamera: 70,
    distance: 50,
    intensity: 1,
    decay: 1,
  },
  player: {
    lookMouseFactor: 0.1,
    lookInertialSpeed: 10,
    moveSpeed: 30,
    moveInertialSpeed: 2,
    moveRelaxationSpeed: 0.95,
    moveStopSpeed: 10,
  },
  formation: {
    // Длина одной секции абсолютная
    sectionLength: 1,
    // В каждую сторону
    visibleSectionsCount: 70,
    sectionRadius: 5,
    sectionPointsCount: 40,
    sectionPointRandomRadius: 1.5,
  },
};

/**
 * Парсит цвет из '#f1a2f2' ('#fff') в число 0xf1a2f2 (0xffffff)
 *
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
