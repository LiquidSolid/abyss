import {
  Vector3,
  BufferAttribute,
  Mesh,
  // MeshNormalMaterial,
  MeshPhongMaterial,
  BufferGeometry,
} from 'three';
import config from './config';
// import InertialSetter from './InertialSetter';

const SECTION_POSITIONS_COUNT = config.formation.sectionPointsCount * 6 * 3;
const POSITIONS_SIZE = SECTION_POSITIONS_COUNT * config.formation.visibleSectionsCount * 2;

// todo: Отрисовывать только то, что видно на камеру
// Случайное вращение конструкции?

/**
 * @typedef {{
 * alt: boolean,
 * back: THREE.Vector3[],
 * front: THREE.Vector3[],
 * offset: number,
 * bufferOffset: number,
 * }} Section
 * Секция, соединение двух колец, совокупность всех поверхностей
 *
 * `alt` - является ли сдвинутой немного,
 * `back` - задняя поверхность
 * `front` - передняя поверхность
 * `offset` - z координата задней поверхности
 * `bufferOffset` - индекс, на котором находятся точки секции в буффере
 */

export default function (core) {
  const geometry = new BufferGeometry()
    .setAttribute(
      'position',
      new BufferAttribute(new Float32Array(POSITIONS_SIZE), 3),
    );

  // const rotation = new InertialSetter(0, 0.5);
  // let updateRotationElapsedTime = 0;

  // Формирую первую секцию, от неё все остальные
  /**
   * @type {Section[]}
   */
  const sections = [
    {
      back: buildSlice(true),
      front: buildSlice(false),
      offset: -config.formation.sectionLength * config.formation.visibleSectionsCount,
      alt: true,
      bufferOffset: 0,
    },
  ];

  // Формирую все остальные секции
  for (let i = 1; i < config.formation.visibleSectionsCount * 2; i += 1) {
    const last = sections[i - 1];
    const alt = !last.alt;

    sections.push({
      back: last.front,
      front: buildSlice(!alt),
      alt,
      offset: last.offset + config.formation.sectionLength,
      bufferOffset: i * SECTION_POSITIONS_COUNT,
    });
  }

  // Заполняю буффер начальными данными
  {
    const positions = geometry.getAttribute('position').array;
    for (const section of sections) {
      fillSection(positions, section);
    }
  }

  // Инициирую
  updateGeometry();

  core.listen('camera-position-updated', (position) => {
    const { sectionLength, visibleSectionsCount } = config.formation;
    const currentFormationCenter = sections[visibleSectionsCount].offset;
    const delta = position.z - currentFormationCenter;
    const steps = ~~(delta / sectionLength);
    go(steps);
  });

  // core.listen('tick', ({ timeDelta }) => {
  //   // console.log('tick', timeDelta);
  //   updateRotationElapsedTime -= timeDelta;
  //   if (updateRotationElapsedTime <= 0) {
  //     const [min, max] = config.formation.rotationSpeed;
  //     // console.log('update', rotation.target);
  //     rotation.target = min + (max - min) * Math.random();
  //     // rotation.target *= Math.random() > 0.5 ? 1 : -1;
  //     // console.log(rotation.target);
  //     updateRotationElapsedTime = 5 + Math.random() * 20;
  //   }

  //   rotation.tick(timeDelta);
  //   mesh.rotation.z += rotation.value * timeDelta;
  // });

  // Создаю сам объект на сцену и возвращаю
  const mesh = new Mesh(
    geometry,
    new MeshPhongMaterial({
      color: config.colors.tunnelMaterial,
      emissive: 0,
      // wireframe: true,
    }),
    // new MeshNormalMaterial({ wireframe: false }),
  );

  return mesh;

  function go(steps) {
    if (!steps) {
      return;
    }

    const positions = geometry.getAttribute('position').array;
    const newSectionsCount = Math.min(sections.length, Math.abs(steps));
    const { sectionLength } = config.formation;
    if (steps > 0) {
      for (let i = 0; i < newSectionsCount; i += 1) {
        const last = sections[sections.length - 1];
        const alt = !last.alt;
        const next = {
          alt,
          back: last.front,
          front: buildSlice(!alt),
          offset: last.offset + sectionLength,
          // Перезаписываю соответствующий задний слайс
          bufferOffset: sections[i].bufferOffset,
        };

        sections.push(next);
        fillSection(positions, next);
      }

      sections.splice(0, newSectionsCount);
    } else {
      for (let i = 0; i < newSectionsCount; i += 1) {
        const last = sections[0];
        const alt = !last.alt;
        const next = {
          alt,
          back: buildSlice(alt),
          front: last.back,
          offset: last.offset - sectionLength,
          bufferOffset: sections[sections.length - 1 - i].bufferOffset,
        };

        sections.unshift(next);
        fillSection(positions, next);
      }

      sections.splice(-newSectionsCount, newSectionsCount);
    }

    updateGeometry();
  }

  function updateGeometry() {
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
    geometry.getAttribute('position').needsUpdate = true;
  }
}

/**
 * Создаёт массив поверхностей из трех точек из двух колец
 * по заданной длине между кольцами
 *
 * @param {ArrayLike<number>} positions
 * @param {Section} section
 */
function fillSection(positions, section) {
  let positionsIndex = section.bufferOffset;
  const order = [2, 1, 0, 2, 3, 1];
  const altShift = section.alt ? 1 : 0;
  const sliceLength = section.back.length;
  const z1 = section.offset;
  const z2 = section.offset + config.formation.sectionLength;

  for (let i = 0; i < sliceLength; i += 1) {
    const set = [
      [section.back[i], z1],
      [section.back[(i + 1) % sliceLength], z1],
      [section.front[(i + altShift) % sliceLength], z2],
      [section.front[(i + altShift + 1) % sliceLength], z2],
    ].map(([{ x, y, z: dz }, z]) => [x, y, z + dz]);

    for (const index of order) {
      const [x, y, z] = set[index];
      positions[positionsIndex] = x;
      positions[positionsIndex + 1] = y;
      positions[positionsIndex + 2] = z;
      positionsIndex += 3;
    }
  }
}

/**
 * @param {boolean} alt
 * @returns {THREE.Vector3[]}
 */
function buildSlice(alt = false) {
  const pointsCount = config.formation.sectionPointsCount;
  const radius = config.formation.sectionRadius;

  const deltaAngle = (Math.PI * 2) / pointsCount;
  let angle = alt ? 0 : -deltaAngle / 2;
  const res = [];

  for (let i = 0; i < pointsCount; i += 1) {
    const vec = new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);

    const randRadius = Math.random() * config.formation.sectionPointRandomRadius;
    const randVec = new Vector3(Math.random(), Math.random(), Math.random());
    randVec.multiplyScalar(randRadius / randVec.length());
    vec.add(randVec);
    res.push(vec);

    angle += deltaAngle;
  }

  return res;
}
