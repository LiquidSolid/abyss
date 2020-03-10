<template>
  <div class="the-abyss">
    <canvas
      v-show="!resizing"
      ref="canv"
      :width="width"
      :height="height"
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
import Abyss from '@/Abyss';

export default {
  name: 'TheAbyss',
  props: {
    params: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    resizing: false,
  }),
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.abyss = new Abyss(this.$refs.canv, this.params);
    this.updateSize();
    this.loop();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    loop() {
      this.frame = requestAnimationFrame(this.loop);
      if (!this.resizing) {
        this.abyss.animate();
      }
    },
    onResize() {
      this.resizing = true;
      this.debouncedResizeDone();
    },
    debouncedResizeDone: debounce(500, function a() {
      this.resizing = false;
      this.updateSize();
    }),
    updateSize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      const { width, height } = this;
      this.abyss.resize({ width, height });
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
