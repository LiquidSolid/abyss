<template>
  <div class="the-intro">
    <transition
      appear
      name="the-intro__appear-transition"
    >
      <div class="the-intro__limit">
        <div class="the-intro__logo">
          AB<span class="y">Y</span>SS
        </div>

        <hr>

        <div class="the-intro__start-button-box">
          <div
            class="app-button the-intro__start-button"
            @click="$emit('start', { antialiasing, postprocessing, stats })"
          >
            Вход
          </div>
        </div>

        <hr>

        <tabs
          v-model="tab"
          :items="['controls', 'settings']"
          class="mt-4 mb-4"
        >
          <template #controls>
            Управление
          </template>

          <template #settings>
            Настройки
          </template>
        </tabs>

        <!-- {{ tab }} -->

        <transition
          name="the-intro__tabs-transition"
          @before-leave="beforeLeave"
        >
          <div :key="tab">
            <template v-if="tab === 'controls'">
              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Вернуться в меню
                </div>
                <span class="key">F5</span>
              </div>

              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Полноэкранный режим
                </div>
                <span class="key">F11</span>
              </div>

              <div class="mb-8 d-flex align-center">
                <div class="flex-grow-1">
                  Режим управления
                </div>
                <div class="d-flex align-center">
                  <span class="mr-2">
                    левый дабл-клик
                  </span>
                  <icon :path="mdiMouse" />
                </div>
              </div>

              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Движение камерой
                </div>
                <div class="d-flex align-center">
                  <span class="mr-2">
                    движение мышью
                  </span>
                  <icon :path="mdiMouseVariant" />
                </div>
              </div>

              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Вперёд
                </div>
                <span class="key">W</span>
              </div>

              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Назад
                </div>
                <span class="key">S</span>
              </div>

              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Остановиться
                </div>
                <span class="key">Space</span>
              </div>

              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Ускориться
                </div>
                <div class="key d-flex align-center">
                  <icon
                    :path="mdiArrowUpBold"
                    color="background"
                    size="16"
                  />
                  Shift
                </div>
              </div>

              <div class="mb-2 d-flex align-center">
                <div class="flex-grow-1">
                  Выход из режима управления
                </div>
                <span class="key">ESC</span>
              </div>
            </template>

            <template v-else-if="tab === 'settings'">
              <switcher
                v-model="antialiasing"
                class="mb-4"
              >
                Сглаживание
              </switcher>

              <!-- <switcher
                v-model="postprocessing"
                class="mb-4"
                disabled
              >
                Постобработка
              </switcher> -->

              <switcher
                v-model="stats"
              >
                Статистика
              </switcher>
            </template>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { mdiMouse, mdiMouseVariant, mdiArrowUpBold } from '@mdi/js';
import Switcher from './Switcher';
import Tabs from './Tabs';
import Icon from './Icon';

export default {
  name: 'TheIntro',
  components: {
    Switcher,
    Icon,
    Tabs,
  },
  data: () => ({
    antialiasing: false,
    postprocessing: false,
    stats: false,

    tab: 'controls',
    mdiMouse,
    mdiMouseVariant,
    mdiArrowUpBold,
  }),
  created() {
    ['stats', 'antialiasing', 'postprocessing'].forEach((key) => {
      this[key] = !!+window.localStorage.getItem(key);
      this.$watch(key, (val) => window.localStorage.setItem(key, +val));
    });
  },
  methods: {
    beforeLeave(el) {
      el.style.position = 'absolute';
      el.style.width = '100%';
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/assets/styles'

.alt1--text
  color: $alt1

.key
  background: $primary
  color: $background
  min-width: 25px
  padding: 2px 5px
  display: flex
  align-items: center
  justify-content: center
  border-radius: 4px

.the-intro
  padding: 16px
  height: 100vh
  overflow: auto
  background: $background
  display: flex
  // align-items: center
  justify-content: center
  perspective: 1000px
  &__limit
    width: 100%
    max-width: 650px
    padding-bottom: 24px
    position: relative
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
    padding: 20px 40px
    display: flex
    align-items: center
    justify-content: center
    font-size: 30px

  &__appear-transition
    &-enter-active
      transition: all 0.45s $ease-out-cubic
    &-enter
      opacity: 0
      transform: translateZ(-30px)

  &__tabs-transition
    &-leave-active, &-enter-active
      transition: all .3s $ease-out-expo
    &-leave-to
      opacity: 0
      transform: translateX(30px)
    &-enter
      opacity: 0
      transform: translateX(-30px)

  hr
    border: none
    height: 2px
    background: $primary
    border-radius: 2px
</style>
