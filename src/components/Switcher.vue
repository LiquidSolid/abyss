<template>
  <div
    class="the-intro-switcher"
    :class="{ pushed: value }"
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
  name: 'TheIntroSwitcher',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/assets/styles'

.the-intro-switcher
  border: 2px solid $alt1
  color: $alt1
  background: transparent
  padding: 10px 20px
  display: flex
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

  &__spacer
    flex-grow: 1

  &__off
    color: lighten($background, 20)

  &__transition
    &-enter-active
      transition: all .15s cubic-bezier(.12,1.22,.45,1.36)

    &-enter
      opacity: 0
      transform: translateY(10px)
</style>
