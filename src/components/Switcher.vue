<template>
  <div
    class="the-intro-switcher"
    :class="{ disabled }"
    @click="$emit('input', !value)"
  >
    <slot />

    <div class="the-intro-switcher__spacer" />

    <transition
      name="the-intro-switcher__transition"
      mode="out-in"
    >
      <div
        v-if="!value"
        key="off"
        class="the-intro-switcher__off"
      >
        офф
      </div>
      <div
        v-else
        key="on"
        class="the-intro-switcher__on"
      >
        он
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Switcher',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/assets/styles'

.the-intro-switcher
  border: 2px solid $primary
  color: $primary
  background: transparent
  padding: 10px 20px
  display: flex
  width: 320px
  align-items: center
  // justify-content: center
  cursor: pointer
  user-select: none
  font-size: 24px
  $x: 3px
  box-shadow: $x $x 0 black
  // transform: translate(-$x / 2, -$x / 2)
  &:active
    transform: translate($x, $x)
    box-shadow: none

  &.disabled
    pointer-events: none
    border-color: $disabled
    color: $disabled

  &__spacer
    flex-grow: 1

  &__off
    color: $disabled

  &__transition
    &-enter-active
      transition: $bounce-transition

    &-enter
      opacity: 0
      transform: translateY(10px)
</style>
