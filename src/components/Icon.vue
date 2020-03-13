<script>
export default {
  functional: true,
  render(h, context) {
    const { path, size = 24 } = context.props;

    const svgPath = h('path', { attrs: { d: path } });
    return h('svg', {
      staticClass: 'icon',
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: size,
        height: size,
      },
    }, [svgPath]);
  },
};
</script>

<style lang="sass">
@import '@/assets/styles'

svg.icon path
  fill: $primary
</style>
