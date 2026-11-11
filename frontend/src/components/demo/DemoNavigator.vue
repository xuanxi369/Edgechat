<script setup>
import { RotateCcw, Star } from '@lucide/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resetRuntime } from '../../runtime.js';
import { t } from '../../i18n.js';

const route = useRoute();
const router = useRouter();

const pages = [
  { labelKey: 'demo.chat', value: '/' },
  { labelKey: 'demo.contacts', value: '/contacts' },
  { labelKey: 'demo.settings', value: '/settings' },
  { labelKey: 'demo.dashboard', value: '/admin/dashboard' },
  { labelKey: 'demo.users', value: '/admin/users' },
  { labelKey: 'demo.invites', value: '/admin/invites' },
  { labelKey: 'demo.telegram', value: '/admin/telegram' },
  { labelKey: 'demo.site', value: '/admin/site' },
  { labelKey: 'admin.nav.maintenance', value: '/admin/maintenance' },
  { labelKey: 'demo.login', value: '/login' },
  { labelKey: 'demo.register', value: '/register/demo-invite' }
];

const currentPage = computed(() => {
  const match = pages.find((page) => page.value === route.path);
  return match?.value || '/';
});

function navigate(event) {
  void router.push(event.target.value);
}

function resetDemo() {
  resetRuntime();
  localStorage.removeItem('customBackground');
  window.location.assign('/');
}
</script>

<template>
  <aside
    class="demo-navigator"
    :class="{
      'demo-navigator--admin': route.path.startsWith('/admin'),
      'demo-navigator--contacts': route.path === '/contacts'
    }"
    :aria-label="t('demo.navigation')"
  >
    <span class="demo-navigator__badge">{{ t('demo.local') }}</span>
    <select :value="currentPage" :aria-label="t('demo.selectPage')" @change="navigate">
      <option v-for="page in pages" :key="page.value" :value="page.value">
        {{ t(page.labelKey) }}
      </option>
    </select>
    <button type="button" :title="t('demo.reset')" :aria-label="t('demo.reset')" @click="resetDemo">
      <RotateCcw :size="16" aria-hidden="true" />
    </button>
    <!-- 演示站访客刚体验完产品，是最可能点 Star 的人群；生产构建会静态删除整个 DemoNavigator。 -->
    <a
      class="demo-navigator__star"
      href="https://github.com/xuanxi369/IIeaoChat"
      target="_blank"
      rel="noopener noreferrer"
      :title="t('demo.star')"
      :aria-label="t('demo.star')"
    >
      <Star :size="15" aria-hidden="true" />
      <span>Star</span>
    </a>
  </aside>
</template>

<style scoped>
.demo-navigator {
  position: fixed;
  top: 68px;
  right: 12px;
  z-index: 35;
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  padding: 4px 6px 4px 10px;
  border: 1px solid var(--chat-line);
  border-radius: 12px;
  background: var(--chat-paper);
  box-shadow: var(--chat-shadow);
  color: var(--chat-muted);
}
.demo-navigator__badge { font-size: 12px; font-weight: 600; white-space: nowrap; }
.demo-navigator select {
  width: 138px;
  height: 36px;
  border: 1px solid var(--chat-line);
  border-radius: 8px;
  background: var(--chat-paper);
  color: var(--chat-ink);
  font: inherit;
  font-size: 12px;
  padding: 0 8px;
}
.demo-navigator button { display: grid; width: 36px; height: 36px; place-items: center; border: 0; border-radius: 8px; background: transparent; color: var(--chat-muted); cursor: pointer; }
.demo-navigator button:hover { background: var(--chat-hover); }
.demo-navigator button:focus-visible, .demo-navigator select:focus-visible { outline: 2px solid var(--chat-accent); outline-offset: 2px; }
.demo-navigator__star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 36px;
  padding: 0 9px;
  border: 1px solid var(--chat-line);
  border-radius: 8px;
  background: var(--chat-selected);
  color: var(--chat-accent);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}
.demo-navigator__star:hover { background: var(--chat-pressed); }
.demo-navigator__star:focus-visible { outline: 2px solid var(--chat-accent); outline-offset: 2px; }
@media (max-width: 960px) {
  .demo-navigator {
    top: var(--chat-viewport-offset-top, 0px);
    right: 0;
    left: 0;
    height: 56px;
    min-height: 56px;
    gap: 8px;
    padding: 6px max(12px, env(safe-area-inset-right)) 6px max(12px, env(safe-area-inset-left));
    border: 0;
    border-bottom: 1px solid var(--chat-line);
    border-radius: 0;
    box-shadow: none;
  }
  .demo-navigator__badge { display: none; }
  .demo-navigator select { flex: 1; width: 0; min-width: 0; height: 44px; font-size: 16px; }
  .demo-navigator button { flex-shrink: 0; width: 44px; height: 44px; }
  .demo-navigator__star { width: 44px; height: 44px; flex-shrink: 0; padding: 0; }
  .demo-navigator__star span { display: none; }
}
</style>

<style>
/* The toolbar stays below modal layers, including layers inside the fixed chat workspace. */
body:has(:is(.room-management-layer, .room-dialog-overlay, .add-conversation-overlay, .public-group-overlay, .user-profile-overlay, .mobile-navigation-overlay, .crop-modal)) .demo-navigator {
  visibility: hidden;
  pointer-events: none;
}
@media (max-width: 960px) {
  /* Reserve a dedicated toolbar row in the demo instead of covering messages or the composer. */
  body:has(.demo-navigator) .chat-layout {
    top: calc(var(--chat-viewport-offset-top, 0px) + 56px);
    height: calc(var(--chat-viewport-height, 100dvh) - 56px);
  }
  body:has(.demo-navigator) .chat-layout--calling {
    top: calc(var(--chat-viewport-offset-top, 0px) + 120px);
    height: calc(var(--chat-viewport-height, 100dvh) - 120px);
  }
  body:has(.demo-navigator) :is(.login-page, .settings-page) { padding-top: 76px; }
}
</style>
