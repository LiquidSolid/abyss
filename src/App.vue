<template>
  <div id="app">
    <transition
      appear
      name="root-transition"
      appear-active-class="root-transition-appear-active"
      appear-class="root-transition-appear"
      mode="out-in"
    >
      <the-intro
        v-if="!started"
        @start="params = $event, started = true"
      />
      <the-abyss
        v-else
        :params="params"
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
  &-appear-active
    transition: all .25s ease
  &-appear
    transform: translateZ(-20px)
    opacity: 0

  &-leave-active
    transition: all 0.3s ease
  &-leave-to
    opacity: 0
    transform: translateZ(-20px)

  &-enter-active
    transition: all 3s ease
  &-enter
    transform: translateZ(200px)
    opacity: 0
</style>
