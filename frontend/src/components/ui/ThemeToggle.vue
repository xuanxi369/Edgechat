<script setup>
import { Moon, Sun } from '@lucide/vue';
import { useInterfaceTheme } from '../../composables/useInterfaceTheme.js';
import { t } from '../../i18n.js';

const { dark, toggleTheme } = useInterfaceTheme();
</script>

<template>
  <!-- biome-ignore lint/a11y/useAriaPropsForRole: Vue supplies the required aria-checked through its reactive binding. -->
  <button type="button" class="theme-toggle" :class="{ 'theme-toggle--dark': dark }" role="switch"
    :aria-checked="dark" :aria-label="t('interface.darkMode')" :title="t(dark ? 'interface.switchLight' : 'interface.switchDark')"
    @click="toggleTheme">
    <span class="theme-toggle__track" aria-hidden="true">
      <Sun :size="14" class="theme-toggle__sun" />
      <Moon :size="14" class="theme-toggle__moon" />
      <span class="theme-toggle__thumb"><Sun v-if="!dark" :size="13" /><Moon v-else :size="13" /></span>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 60px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
}
.theme-toggle__track {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 54px;
  height: 30px;
  padding: 0 7px;
  border: 1px solid var(--chat-line);
  border-radius: 999px;
  background: var(--chat-hover);
  color: var(--chat-muted);
  box-shadow: inset 0 2px 3px rgb(0 0 0 / 4%);
}
.theme-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--chat-paper);
  color: var(--chat-ink);
  box-shadow: 0 2px 4px rgb(0 0 0 / 16%);
  transition: transform var(--motion-fluid);
}
.theme-toggle--dark .theme-toggle__thumb { transform: translateX(24px) rotate(15deg); }
.theme-toggle:hover .theme-toggle__track { border-color: var(--chat-subtle); }
.theme-toggle:active .theme-toggle__thumb { scale: 0.9; }
.theme-toggle:focus-visible { outline: 2px solid var(--chat-accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .theme-toggle__thumb { transition: none; } }
</style>
