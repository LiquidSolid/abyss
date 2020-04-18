<script>
export default {
  functional: true,
  props: {
    /**
     * Путь в <path :d="value" />
     */
    path: {
      type: String,
      required: true,
    },
    /**
     * Размер иконки
     */
    size: {
      type: [String, Number],
      default: 24,
    },
    /**
     * Цвет. Может быть primary и background
     */
    color: {
      type: String,
      default: 'primary',
    },
  },
  render(h, context) {
    const svgPath = h('path', { attrs: { d: context.props.path } });

    return h('svg', {
      ...context.data,
      staticClass: `icon--${context.props.color}`,
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: context.props.size,
        height: context.props.size,
      },
    }, [svgPath]);
  },
};
</script>

<style lang="sass">
@import '@/assets/styles'

svg.icon
  &--primary path
    fill: $primary
  &--background path
    fill: $background
</style>
