<template>
  <div class="the-intro">
    <div class="the-intro__limit">
      <div class="the-intro__logo">
        AB<span class="y">Y</span>SS
      </div>

      <hr>

      <div class="the-intro__start-button-box">
        <div
          class="the-intro__start-button"
          role="button"
          @click="$emit('start', { antialiasing, postprocessing, stats })"
        >
          СТАРТ
        </div>
      </div>

      <hr>

      <div class="the-intro__list">
        <div class="the-intro__info">
          <div class="headline">
            Управление
          </div>

          <div class="item">
            <span class="key">F5</span> - вернуться в меню
          </div>

          <div class="item">
            <span class="key">F11</span> - полноэкранный режим
          </div>
        </div>

        <div class="the-intro__settings">
          <div class="headline">
            Настройки
          </div>

          <switcher
            v-model="antialiasing"
            class="item"
          >
            Сглаживание
          </switcher>

          <switcher
            v-model="postprocessing"
            class="item"
          >
            Постобработка
          </switcher>

          <switcher
            v-model="stats"
            class="item"
          >
            Статистика
          </switcher>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Switcher from './Switcher';

export default {
  name: 'TheIntro',
  components: { Switcher },
  data: () => ({
    antialiasing: false,
    postprocessing: false,
    stats: false,
  }),
  created() {
    Object.keys(this.$data).forEach((key) => {
      this[key] = !!+window.localStorage.getItem(key);
      this.$watch(key, (val) => window.localStorage.setItem(key, +val));
    });
  },
};
</script>

<style lang="sass" scoped>
@import '@/assets/styles'

.the-intro
  padding: 16px
  height: 100vh
  background: $background
  display: flex
  // align-items: center
  justify-content: center
  &__limit
    width: 100%
    max-width: 650px
  &__logo
    display: flex
    align-items: center
    justify-content: center
    font-size: 140px
    .y
      font-size: 1.35em

  &__start-button-box
    display: flex
    align-items: center
    justify-content: center
    padding: 50px 0

  &__start-button
    border: 2px solid $primary
    padding: 20px 40px
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    background: $background
    user-select: none
    font-size: 30px
    $x: 3px
    box-shadow: $x $x 0 black
    transform: translate(-$x / 2, -$x / 2)
    &:active
      transform: translate($x / 2, $x / 2)
      box-shadow: none

  &__list
    margin-top: 24px
    display: grid
    gap: 16px
    grid-template-columns: repeat(auto-fit, (650px - 16px) / 2)

  &__info
    .headline
      margin-bottom: 16px
    .item + .item
      margin-top: 16px
    .key
      background: $primary
      color: $background
      padding: 5px

  &__settings
    color: $alt1
    .headline
      margin-bottom: 16px
    .item + .item
      margin-top: 16px

  hr
    border: none
    height: 2px
    background: $primary
    border-radius: 2px
</style>
