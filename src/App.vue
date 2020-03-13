<template>
  <div id="app">
    <transition
      name="root-transition"
      mode="out-in"
    >
      <the-intro
        v-if="!started"
        @start="params = $event, started = true"
      />
      <the-abyss
        v-else
        v-bind="params"
      />
    </transition>
  </div>
</template>

<script>
import TheIntro from './components/TheIntro';

export default {
  name: 'App',
  components: {
    TheIntro,
    TheAbyss: () => import(/* webpackChunkName: "abyss" */ './components/TheAbyss'),
  },
  data: () => ({
    params: null,
    started: false,
  }),
};
</script>

<style lang="sass">
@import './assets/styles'

#app
  perspective: 1000px
  overflow: hidden

.root-transition
  &-leave-active
    transition: all 0.3s ease
  &-leave-to
    opacity: 0

  &-enter-active
    transition: all 3s ease
  &-enter
    transform: translateZ(200px)
    opacity: 0
</style>
