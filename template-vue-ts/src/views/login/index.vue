<template>
    <div
        class="relative flex-center h-screen login-bg login-bg-decoration min-w-1320px"
        :class="{ dark: theme.darkMode }"
        :style="{ backgroundColor: bgColor }"
    >
        <dark-mode-switch
            :dark="theme.darkMode"
            class="absolute right-48px top-24px z-99 text-20px w-30px h-30px"
            :class="{
                'text-white': theme.darkMode,
                'text-black-500': !theme.darkMode
            }"
            @update:dark="theme.setDarkMode"
        />
        <div class="card-container" ref="cardRef">
            <div class="circle"></div>
            <div class="circle-1"></div>
            <div
                class="login-banner"
                :style="{
                    width: `${width - 30}px`,
                    height: `${height - 60}px`
                }"
            >
                <n-h1
                    class="dark:text-orange-200 text-[#333] tracking-widest mb-0"
                    >{{ title }}</n-h1
                >
                <n-h3
                    class="dark:text-orange-200 text-[#666] tracking-widest uppercase mt-0"
                    >{{ pinyinTitle }}</n-h3
                >
            </div>

            <div class="login-container">
                <svg
                    :viewbox="`0 0 ${width} ${height}`"
                    :width="width"
                    :height="height"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            id="orange_red"
                            x1="0"
                            y1="1"
                            x2="0"
                            y2="0"
                        >
                            <stop offset="5%" :stop-color="gradientColor[0]" />
                            <stop offset="95%" :stop-color="gradientColor[1]" />
                        </linearGradient>
                    </defs>
                    <polygon
                        :points="`${
                            width * 0.55
                        },0 ${width},0 ${width},${height} ${
                            width * 0.45
                        },${height}`"
                        style="
                            fill: url(#orange_red);
                            filter: drop-shadow(-5px 0 10px rgba(0, 0, 0, 0.3));
                        "
                    />
                </svg>
                <div
                    class="absolute left-75% ml-[-180px] top-50% mt-[-180px] w-360px"
                >
                    <n-h2
                        class="text-30px text-white text-shadow-lg tracking-wider text-right md:mb-0 uppercase"
                        >Sign In</n-h2
                    >
                    <login-form />
                </div>
            </div>
        </div>
        <!-- <login-bg :theme-color="bgThemeColor" /> -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useThemeStore } from '@/store'
import { getColorPalette, mixColor } from '@/utils'
import LoginForm from './components/LoginForm/index.vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { pinyin } from 'pinyin-pro'

defineOptions({ name: 'LoginPage' })

const cardRef = ref<HTMLElement>()
const { width, height } = useElementSize(cardRef)

const theme = useThemeStore()

const title = import.meta.env.VITE_APP_TITLE

const pinyinTitle = computed(() => {
    return pinyin(title, {
        toneType: 'none'
    })
})

const bgThemeColor = computed(() =>
    theme.darkMode ? getColorPalette(theme.themeColor, 7) : theme.themeColor
)

const bgColor = computed(() => {
    const COLOR_WHITE = '#ffffff'
    const ratio = theme.darkMode ? 0.99 : 0
    return mixColor(COLOR_WHITE, '#000000', ratio)
})

// const gradientColor = ref(['#ffffff', '#234ac8'])

const gradientColor = computed(() => {
    if (theme.darkMode) {
        return ['#000000', '#234ac8']
    } else {
        return ['#ffffff', '#234ac8']
    }
})
</script>

<style scoped lang="scss">
@mixin bgColor($opacity: 1, $color: #ffffff) {
    background-image: linear-gradient(
        to bottom,
        rgba($color, $opacity),
        rgba(#234ac8, $opacity)
    );
}

@mixin ReBgColor($opacity: 1, $color: #ffffff) {
    background-image: linear-gradient(
        to bottom,
        rgba(#234ac8, $opacity),
        rgba($color, $opacity)
    );
}

@keyframes transform-circle {
    0% {
        transform: translate(0px, 0px) scale(0.6);
    }
    50% {
        transform: translate(-60px, -60px);
    }
    100% {
        transform: translate(0px, 0px) scale(0.6);
    }
}
@keyframes transform-circle-1 {
    0% {
        left: 0px;
        bottom: 60px;
    }
    50% {
        left: 60px;
        bottom: 0px;
    }
    100% {
        left: 0px;
        bottom: 60px;
    }
}

.card-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1020px;
    height: 600px;
    box-shadow: 0 0 10px rgba(#000, 0.3);
    backdrop-filter: blur(10px);
    /* @include bgColor(0.075); */
    background: rgba(#fff, 0.075);
    /* overflow: hidden; */
    border-radius: 2px;
    /* padding: 60px; */
    /* box-sizing: border-box; */
    .circle {
        position: absolute;
        bottom: -60px;
        left: -60px;
        width: 360px;
        height: 360px;
        z-index: 2;
        /* transform-origin: center center; */
        background: radial-gradient(
            circle at 100px 100px,
            #234ac888 10%,
            #ffffff33 80%,
            #234ac8 100%
        );
        box-shadow: 0 0 60px rgba(#000, 0.3);
        border-radius: 50%;
        transition: all ease-out 0.3s;
        animation: transform-circle 15s linear infinite;
    }
    .circle-1 {
        position: absolute;
        bottom: 60px;
        left: 0px;
        width: 200px;
        height: 200px;
        z-index: 2;
        /* transform-origin: center center; */
        background: radial-gradient(
            circle at 0 200px,
            #ffc400cc 0%,
            #ffffff00 100%
        );
        backdrop-filter: blur(8px);
        border-radius: 50%;
        box-shadow: 0 0 30px 0 rgba(#000, 0.3);
        transition: all ease-out 0.3s;
        animation: transform-circle-1 10s 0.3s linear infinite;
    }
    .login-banner {
        width: 100%;
        /* background: rgba(#000, 0.75); */
        border-radius: 2px;
        padding: 40px;
        box-sizing: border-box;
        /* box-shadow: inset 0 0 20px rgba(#000, 0.3); */
    }
}

.login-container {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: end;
    /* @include ReBgColor(); */
    /* box-shadow: -5px 0 5px rgba(0, 0, 0, 0.2); */
}

.login-bg {
    @include bgColor(1);
    transition: all 0.5s ease-in-out;
    &.dark {
        @include bgColor(1, #000000);
    }
}

/* .login-bg-decoration {
    background: url("@/assets/images/decoration01.png") no-repeat -60px 0px,
      url("@/assets/images/decoration01.png") no-repeat 97% 98%,
      url("@/assets/images/decoration02.png") no-repeat 90% 10%,
      url("@/assets/images/decoration02.png") no-repeat 10% 88%;
  } */

@media screen and (max-width: 640px) {
    .login-bg-decoration {
        background:
            url('@/assets/images/decoration01.png') no-repeat -60px 0px,
            url('@/assets/images/decoration01.png') no-repeat 97% 98%,
            url('@/assets/images/decoration02.png') no-repeat 90% 10%,
            url('@/assets/images/decoration02.png') no-repeat 10% 88%;
    }
}

.absolute-y-center {
    top: 50%;
    transform: translateY(-50%);
}
</style>
