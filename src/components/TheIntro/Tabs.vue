<script>
export default {
  functional: true,
  render(h, context) {
    const { items, value } = context.props;
    const slots = context.slots();

    return h('div', {
      ...context.data,
      class: 'the-intro-tabs',
    }, items.map((tab) => h('div', {
      staticClass: 'the-intro-tabs__tab headline',
      class: { active: value === tab },
      on: {
        click: () => context.listeners.input(tab),
      },
    }, tab in slots ? slots[tab] : tab)));
  },
};
</script>

<style lang="sass">
@import '@/assets/styles'

.the-intro-tabs
  &__tab + &__tab
    margin-left: 16px
  &__tab
    display: inline-block
    &:not(.active)
      cursor: pointer
      color: $disabled
      &:active
        transform: translateY(3px)
</style>
