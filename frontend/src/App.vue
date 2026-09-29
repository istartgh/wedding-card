<template>
  <div class="min-h-screen font-pixel">
    <div ref="phaserContainer" class="fixed inset-0 z-0"></div>

    <DemoRibbon v-if="DEMO_MODE" />

    <!-- Top-right buttons -->
    <div class="fixed top-3 right-3 z-50 flex gap-1.5">
      <button
        class="w-9 h-9 rounded-full bg-wood-dark/50 backdrop-blur flex items-center justify-center text-parchment/80 hover:text-parchment cursor-pointer transition-colors"
        :aria-label="t('app.share')"
        @pointerdown.stop
        @click="shareInvitation"
      >
        <Share2 class="w-4 h-4" />
      </button>
      <button
        class="w-9 h-9 rounded-full bg-wood-dark/50 backdrop-blur flex items-center justify-center text-parchment/80 hover:text-parchment cursor-pointer transition-colors"
        :aria-label="hideUI ? t('app.showUi') : t('app.hideUi')"
        @pointerdown.stop
        @click="hideUI = !hideUI"
      >
        <EyeOff v-if="hideUI" class="w-4 h-4" />
        <Eye v-else class="w-4 h-4" />
      </button>
      <button
        class="w-9 h-9 rounded-full bg-wood-dark/50 backdrop-blur flex items-center justify-center text-parchment/80 hover:text-parchment cursor-pointer transition-colors"
        :aria-label="isDark ? t('app.dayMode') : t('app.nightMode')"
        :disabled="transitioning"
        @pointerdown.stop
        @click="toggle"
      >
        <Sun v-if="isDark" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
      </button>
      <button
        class="w-9 h-9 rounded-full bg-wood-dark/50 backdrop-blur flex items-center justify-center text-parchment/80 hover:text-parchment cursor-pointer transition-colors text-xs font-bold"
        :aria-label="t('app.switchLanguage')"
        @pointerdown.stop
        @click="cycleLocale"
      >
        {{ nextLocaleLabel }}
      </button>
    </div>

    <main
      v-show="!hideUI"
      class="relative z-10 pb-20"
      style="padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px))"
    >
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>

    <nav
      v-show="!hideUI"
      :aria-label="t('nav.menu')"
      class="fixed bottom-0 w-full z-50"
      style="padding-bottom: env(safe-area-inset-bottom, 0px)"
    >
      <div class="max-w-md mx-auto">
        <div class="wooden-panel flex items-stretch py-0 px-0" role="menubar">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :aria-current="isActive(item.path) ? 'page' : undefined"
            role="menuitem"
            class="flex-1 flex flex-col items-center justify-center py-2 transition-transform cursor-pointer"
            :class="
              isActive(item.path)
                ? 'text-parchment scale-110'
                : 'text-parchment/60 hover:text-parchment/80'
            "
          >
            <TwEmoji :emoji="item.icon" size="1.25rem" class="mb-0.5" />
            <span class="text-[10px] tracking-wider uppercase cursor-pointer">{{
              t(item.key)
            }}</span>
            <div
              v-if="isActive(item.path)"
              class="w-1.5 h-1.5 bg-parchment mt-0.5 cursor-pointer"
              style="clip-path: polygon(50% 0%, 100% 100%, 0% 100%)"
            ></div>
          </router-link>
        </div>
      </div>
    </nav>

    <PrivacyNotice v-show="!hideUI" />

    <!-- Share copy toast -->
    <Teleport to="body">
      <Transition name="achievement">
        <div
          v-if="shareToast"
          role="status"
          aria-live="polite"
          class="fixed top-14 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded bg-wood-dark/90 text-parchment text-sm whitespace-nowrap"
        >
          {{ t('app.linkCopied') }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Eye, EyeOff, Sun, Moon, Share2 } from 'lucide-vue-next';
import {
  GROOM_ENG_NAME,
  BRIDE_ENG_NAME,
  VENUE_NAME,
  DEMO_MODE,
} from './config/wedding';
import DemoRibbon from './components/DemoRibbon.vue';
import { useWeddingDate } from './composables/useWeddingDate';
import { useTheme } from './composables/useTheme';
import { useI18n } from 'vue-i18n';
import { messages, setLocale, type Locale } from './i18n';
import TwEmoji from './components/TwEmoji.vue';
import PrivacyNotice from './components/PrivacyNotice.vue';

const hideUI = ref(false);
const shareToast = ref(false);
let shareToastTimer: ReturnType<typeof setTimeout> | null = null;

const { t, locale } = useI18n();
const { date: weddingDate, day: weddingDay } = useWeddingDate();
const { isDark, toggle, transitioning } = useTheme();

async function shareInvitation() {
  const title = t('app.shareTitle', {
    groom: GROOM_ENG_NAME,
    bride: BRIDE_ENG_NAME,
  });
  const text = `${weddingDate.value} ${weddingDay.value} | ${VENUE_NAME}`;
  const url = location.origin;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Clipboard API not available
  }
  shareToast.value = true;
  if (shareToastTimer) clearTimeout(shareToastTimer);
  shareToastTimer = setTimeout(() => {
    shareToast.value = false;
  }, 2000);
}

const locales = Object.keys(messages) as Locale[];
const nextLocale = computed(
  () => locales[(locales.indexOf(locale.value as Locale) + 1) % locales.length],
);
const nextLocaleLabel = computed(
  () => messages[nextLocale.value].app.localeLabel,
);
function cycleLocale() {
  setLocale(nextLocale.value);
}

const route = useRoute();
const phaserContainer = ref<HTMLDivElement | null>(null);
let phaserGame: any = null;

onMounted(() => {
  if (!phaserContainer.value) return;
  const container = phaserContainer.value;
  const deferInit = async () => {
    const [Phaser, { default: BackgroundScene }] = await Promise.all([
      import('phaser'),
      import('./game/BackgroundScene'),
    ]);
    if (!container.isConnected) return;
    phaserGame = new Phaser.default.Game({
      type: Phaser.default.CANVAS,
      parent: container,
      width: 448,
      height: 960,
      scene: [BackgroundScene],
      transparent: false,
      backgroundColor: isDark.value ? '#0f1f0a' : '#3a7d22',
      banner: false,
      scale: {
        mode: Phaser.default.Scale.RESIZE,
        autoCenter: Phaser.default.Scale.CENTER_HORIZONTALLY,
      },
      audio: { noAudio: true },
      render: { pixelArt: true, antialias: false },
    });
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(deferInit);
  } else {
    setTimeout(deferInit, 1);
  }
});

onUnmounted(() => {
  phaserGame?.destroy(true);
  phaserGame = null;
});

const navItems = [
  { path: '/', icon: '🏠', key: 'nav.home' },
  { path: '/map', icon: '🗺️', key: 'nav.map' },
];

function isActive(path: string): boolean {
  return route.path === path;
}
</script>

<style>
:deep(canvas) {
  image-rendering: pixelated;
  width: 100% !important;
  height: 100% !important;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.achievement-enter-active {
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.achievement-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

.achievement-enter-from,
.achievement-leave-to {
  transform: translate(-50%, 40px);
  opacity: 0;
}
</style>
