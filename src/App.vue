<template>
  <div id="app">
    <transition
      name="intro-abyss-transition"
      mode="out-in"
    >
      <the-intro
        v-if="!started"
        @start="abyssParams = $event, started = true"
      />
      <the-abyss
        v-else
        v-bind="abyssParams"
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
    abyssParams: null,
    started: false,
  }),
};
</script>

<style lang="sass">
@import './assets/styles'

#app
  perspective: 1000px

.intro-abyss-transition
  &-leave-active
    transition: all .3s $ease-in-out-quart
  &-enter-active
    transition: all 2.3s $ease-in-out-quart
  &-enter,
  &-leave-to
    opacity: 0
    transform: translateZ(-30px)
</style>
