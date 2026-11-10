import { ref } from 'vue';

const preferenceKey = 'edgechat.interface-theme';
const dark = ref(false);
let initialized = false;

export function initializeInterfaceTheme() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  try { dark.value = localStorage.getItem(preferenceKey) === 'dark'; } catch { /* Storage can be unavailable in private webviews. */ }
  applyTheme();
  window.addEventListener('storage', event => {
    if (event.key === preferenceKey || event.key === null) {
      dark.value = event.newValue === 'dark';
      applyTheme();
    }
  });
}

function applyTheme() {
  document.documentElement.dataset.interfaceTheme = dark.value ? 'dark' : 'light';
}

export function useInterfaceTheme() {
  initializeInterfaceTheme();
  function toggleTheme() {
    dark.value = !dark.value;
    applyTheme();
    try { localStorage.setItem(preferenceKey, dark.value ? 'dark' : 'light'); } catch { /* Keep the current-session preference. */ }
  }
  return { dark, toggleTheme };
}
