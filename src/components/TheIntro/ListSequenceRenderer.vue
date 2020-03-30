<script>
export default {
  name: 'ListSequenceRenderer',
  props: {
    duration: {
      type: Number,
      default: 0,
    },
    contentKey: {
      type: [String, Number, Boolean],
      default: null,
    },
  },
  data: () => ({
    timeElapsed: 0,
    // Это не должно быть реактивным, но чтобы было на виду
    frame: null,
  }),
  computed: {
    renderProgress() {
      return this.duration
        ? Math.min(1, this.timeElapsed / this.duration)
        : 1;
    },
  },
  watch: {
    contentKey: 'reset',
    duration: 'reset',
  },
  mounted() {
    this.reset();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.frame);
  },
  methods: {
    reset() {
      cancelAnimationFrame(this.frame);
      this.timeElapsed = 0;

      if (this.duration) {
        let lastTime = Date.now();
        const loop = () => {
          const time = Date.now();
          this.timeElapsed += time - lastTime;
          if (this.renderProgress < 1) {
            lastTime = time;
            this.frame = requestAnimationFrame(loop);
          }
        };

        loop();
      }
    },
  },
  render(h) {
    const defaultSlot = this.$slots.default;
    const children = defaultSlot.slice(0, ~~(defaultSlot.length * this.renderProgress));
    return h('div', children);
  },
};
</script>
