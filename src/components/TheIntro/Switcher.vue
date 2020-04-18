<template>
  <div
    class="the-intro-switcher app-button"
    :class="{ disabled, 'the-intro-switcher--active': value }"
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
  padding: 10px 20px
  display: flex
  width: 320px
  align-items: center

  color: $disabled

  &--active
    color: $primary

  &__spacer
    flex-grow: 1

  &__off
    color: $disabled

  &__transition
    &-enter-active
      transition: all .2s $ease-out-back

    &-enter
      opacity: 0
      transform: translateY(10px)
</style>
