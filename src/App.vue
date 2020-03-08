<template>
  <div id="app">
    <transition
      appear
      name="root-transition"
      appear-active-class="root-transition-appear-active"
      appear-class="root-transition-appear"
    >
      <the-intro />
    </transition>
  </div>
</template>

<script>
import TheIntro from './components/TheIntro';

export default {
  name: 'App',
  components: {
    TheIntro,
  },
};
</script>

<style lang="sass">
@import './assets/styles'

#app
  perspective: 1000px

.root-transition
  &-appear-active
    transition: all .25s ease
  &-appear
    transform: translateZ(-20px)
    opacity: 0
</style>
