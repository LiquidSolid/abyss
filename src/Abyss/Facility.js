import * as THREE from 'three';
import config from './config';

const SECTION_VERTS_COUNT = config.geometry.sectionSegments * 6 * 3;
const BUFFER_SIZE = SECTION_VERTS_COUNT * 100;

// todo: избавиться от шифта, слишком затратно. Можно учитывать свободные зоны и заполнять их

/**
 * Класс, который управляет геометрией отображением
 * самого тоннеля, обновляет его состояние через геометрию и меш
 */
export default class {
  constructor() {
    this._geometry = new THREE.BufferGeometry();
    this._positions = new Float32Array(BUFFER_SIZE);

    this._geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this._positions, 3),
    );

    this._realSectionsCount = 0;
    this._needUpdate = false;

    /** @type {{ length: number, z: number }[]} */
    this._sections = [];
    /** @type {THREE.Vector3[]} */
    this._lastRing = null;

    const material = new THREE.MeshPhongMaterial({
      color: config.colors.tunnelMaterial,
      emissive: 0,
      side: THREE.DoubleSide,
    });
    this._mesh = new THREE.Mesh(this._geometry, material);

    this._fill();
    this._updateGeometry();
  }

  /**
   * Для добавления в сцену снаружи
   */
  getMesh() {
    return this._mesh;
  }

  /**
   * Обновляет меш и геометрию
   * @param {number} delta
   */
  update(delta) {
    this._mesh.position.z += delta * config.animation.meshSpeed;
    // this._mesh.rotation.z += delta * config.animation.meshRotationSpeed;

    this._fire();
    this._fill();
    this._updateGeometry();
  }

  /**
   * Сжигает секции, которые расположены ниже позволенного порога
   */
  _fire() {
    let firedSections = 0;

    while (this._sections[0] && this._sections[0].z > -this._mesh.position.z) {
      this._sections.shift();
      firedSections += 1;
    }

    if (firedSections > 0) {
      this._shift(firedSections);
    }
  }

  /**
   * Просчитывает длину конструкции и добавляет
   * новые секции к ней, если длина недостаточна.
   */
  _fill() {
    if (!this._lastRing) {
      this._lastRing = createRing();
    }

    // Длина всей конструкции
    let currentLength = this._sections.reduce((prev, { length }) => prev + length, 0);
    // Данные последней секции
    let {
      length: lastSectionLength = 0,
      z: lastSectionZ = 0,
    } = this._sections.length ? this._sections[this._sections.length - 1] : {};
    while (currentLength < config.geometry.length) {
      const newRing = createRing();
      const newSection = {
        length: config.geometry.sectionLength,
        z: lastSectionZ - lastSectionLength,
      };
      const sectionVerts = createSectionVerts(this._lastRing, newRing, newSection.length);

      this._addSection(sectionVerts, newSection.z - newSection.length / 2);
      this._sections.push(newSection);

      lastSectionZ = newSection.z;
      lastSectionLength = newSection.length;
      currentLength += newSection.length;
      this._lastRing = newRing;
    }
  }

  /**
   * Если произошли изменения в геометрии, то уведомляет
   * об этом THREE через обновление некоторых данных
   */
  _updateGeometry() {
    if (this._needUpdate) {
      this._geometry.computeBoundingSphere();
      this._geometry.computeVertexNormals();
      this._geometry.getAttribute('position').needsUpdate = true;
      const drawItemsCount = ~~((this._realSectionsCount * SECTION_VERTS_COUNT) / 3);
      this._geometry.setDrawRange(0, drawItemsCount);
      this._needUpdate = false;
    }
  }

  /**
   * Смещает все данные в позициях на заданное количество секций, удаляя их.
   *
   * @param {number} sectionsCount - количество удаляемых секторов
   */
  _shift(sectionsCount) {
    const positions = this._geometry.getAttribute('position').array;

    this._realSectionsCount -= sectionsCount;
    const shift = sectionsCount * SECTION_VERTS_COUNT;
    const length = this._realSectionsCount * SECTION_VERTS_COUNT;
    for (let i = 0; i < length; i += 1) {
      positions[i] = positions[i + shift];
      // if (i % 3 === 2) {
      //   positions[i] += zMove;
      // }
    }

    this._needUpdate = true;
  }

  /**
   * Добавляет в геометрию новые поверхности с указанным сдвигом
   *
   * @param {THREE.Vector3[][]} section - Массив `Vector3[n][3]` из `n` секторов
   * @param {number} zOffset - z, которое прибавится к каждому вектору
   */
  _addSection(section, zOffset = 0) {
    const positions = this._geometry.getAttribute('position').array;

    let index = this._realSectionsCount * SECTION_VERTS_COUNT;
    for (const face of section) {
      for (const vertice of face) {
        positions[index] = vertice.x;
        positions[index + 1] = vertice.y;
        positions[index + 2] = vertice.z + zOffset;
        index += 3;
      }
    }

    this._realSectionsCount += 1;
    this._needUpdate = true;
  }
}

/**
 * Генерирует массив из точек, образующих кривоватое кольцо
 *
 * @param {boolean?} alternative - нужно ли чуть сдвинуть точки на угол
 * @returns {THREE.Vector3[]}
 */
function createRing() {
  const deltaAngle = (Math.PI * 2) / config.geometry.sectionSegments;
  const startAngle = Math.random() * deltaAngle;
  const { sectionRadius, sectionRandomRadiusFactor, sectionRandomZFactor } = config.geometry;

  return new Array(config.geometry.sectionSegments)
    .fill(0)
    .map((x, index) => {
      const radius = sectionRadius * (1 + sectionRandomRadiusFactor * (1 - 2 * Math.random()));
      const angle = startAngle + index * deltaAngle;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (1 - Math.random() * 2) * sectionRandomZFactor,
      );
    });
}

/**
 * Создаёт массив поверхностей из трех точек из двух колец
 * по заданной длине между кольцами
 *
 * @param {THREE.Vector3[]} ring1
 * @param {THREE.Vector3[]} ring2
 * @param {number} length - длина секции, т.е. между кольцами
 * @returns {THREE.Vector3[][]}
 */
function createSectionVerts(ring1, ring2, length) {
  const faces = [];
  const { sectionSegments } = config.geometry;

  for (let i = 0; i < sectionSegments; i += 1) {
    const set = [
      [ring1[i], length / 2],
      [ring1[(i + 1) % sectionSegments], length / 2],
      [ring2[i], -length / 2],
      [ring2[(i + 1) % sectionSegments], -length / 2],
    ].map(([vert, dz]) => new THREE.Vector3(vert.x, vert.y, vert.z + dz));

    if (i % 2 === 0) {
      faces.push(
        [set[0], set[1], set[2]],
        [set[1], set[2], set[3]],
      );
    } else {
      faces.push(
        [set[0], set[2], set[3]],
        [set[0], set[1], set[3]],
      );
    }
  }

  return faces;
}
