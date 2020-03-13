<template>
  <div
    v-render-stats="$stats"
    class="the-abyss"
  >
    <canvas
      v-show="!resizing"
      ref="canv"
      v-pointer-lock="lockPointer"
      :width="width"
      :height="height"
      @dblclick="lockPointer = true"
      @mousemove="onMouseMove"
      @contextmenu.prevent
    />

    <div
      v-show="resizing"
      class="the-abyss__resizing"
    >
      Resizing
    </div>
  </div>
</template>

<script>
import Stats from 'three/examples/jsm/libs/stats.module';
import Core from './Core';
import { RenderStats, PointerLock } from './directives';

/** @type {Core} */
let core = null;

export default {
  name: 'TheAbyss',
  directives: {
    RenderStats,
    PointerLock,
  },
  props: {
    stats: {
      type: Boolean,
      default: false,
    },
    antialiasing: {
      type: Boolean,
      default: false,
    },
    postprocessing: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    resizing: false,
    lockPointer: false,
  }),
  created() {
    this.$stats = this.stats ? new Stats() : null;
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);

    if (!core) {
      core = new Core({
        canvas: this.$refs.canv,
        antialiasing: this.antialiasing,
      });
    }
    this.updateSize();
    this.tick();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.frame);

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
  },
  methods: {
    tick() {
      if (!this.resizing) {
        core.tick();
        if (this.$stats) {
          this.$stats.update();
        }
      }
      this.frame = requestAnimationFrame(this.tick);
    },
    onResize() {
      this.resizing = true;
      this.debouncedResizeDone();
    },
    onKeyDown(e) {
      if (!e.repeat && this.lockPointer) {
        core.dispatch('keydown', e.code);
      }
    },
    onKeyUp(e) {
      if (this.lockPointer) {
        core.dispatch('keyup', e.code);
      }
    },
    onPointerLockChange() {
      this.lockPointer = !!(
        document.pointerLockElement
        || document.mozPointerLockElement
        || document.webkitPointerLockElement
      );

      if (!this.lockPointer) {
        core.dispatch('controls-released');
      }
    },
    onMouseMove(e) {
      if (this.lockPointer) {
        const { movementX: dx, movementY: dy } = e;
        core.dispatch('mousemove', { dx, dy });
      }
    },
    debouncedResizeDone: debounce(500, function a() {
      this.resizing = false;
      this.updateSize();
    }),
    updateSize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      const { width, height } = this;
      core.dispatch('resize', { width, height });
    },
  },
};

function debounce(delay, func) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.call(this, args);
    }, delay);
  };
}
</script>

<style lang="sass" scoped>
.the-abyss
  overflow: hidden
  width: 100vw
  height: 100vh
  &__resizing
    position: fixed
    @each $i in 'top', 'left', 'right', 'bottom'
      #{$i}: 0
    display: flex
    align-items: center
    justify-content: center
    font-size: 35px
    background: black
</style>
