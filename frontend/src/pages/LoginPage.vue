<script setup>
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../store.js';
import { useI18n } from '../i18n.js';
import LanguageSwitch from '../components/ui/LanguageSwitch.vue';
import ThemeToggle from '../components/ui/ThemeToggle.vue';
import { ArrowUpRight, MessageCircle, Sparkles } from '@lucide/vue';
import { getStoredNativeServerOrigin, isCapacitorAndroid } from '../capacitor-platform.ts';
import { readLoginSubmission } from '../login-submission.ts';
import api from '../api.js';
import LoginVerification from '../components/LoginVerification.vue';


const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const verification = ref(null);
const form = reactive({
  serverOrigin: getStoredNativeServerOrigin(),
  username: '',
  password: ''
});
const registered = computed(() => route.query.registered === '1');

const usernameInput = ref(null);
const passwordInput = ref(null);
const serverInput = ref(null);


async function submit(event) {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    // Android WebView 的自动填充不一定触发 input 事件，提交时以输入框当前值为准。
    const submitted = new FormData(event.currentTarget);
    const { serverOrigin, credentials } = readLoginSubmission(submitted);
    if (isCapacitorAndroid) {
      await store.configureNativeServer(serverOrigin);
    }
    const configuration = await api.loginVerification();
    if (configuration.enabled) credentials.turnstileToken = await verification.value.verify(configuration.siteKey);
    await store.login(credentials);
    router.push('/');
  } catch (currentError) {
    error.value = currentError.message.startsWith('turnstile_') ? t('verification.failed') : currentError.message === 'native_server_https_required'
      ? t('auth.serverHttpsRequired')
      : currentError.message === 'native_server_unavailable'
        ? t('auth.serverUnavailable')
        : currentError.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-theme"><ThemeToggle /></div>
    <LanguageSwitch class="login-language-switch" />
    <aside class="login-art" aria-hidden="true">
      <div class="login-art__brand"><span class="login-art__mark"><MessageCircle :size="24" /></span>{{ store.site.siteName }}</div>
      <div class="login-art__scene">
        <div class="login-art__orbit"></div>
        <div class="login-art__note login-art__note--first"><span class="login-art__avatar">E</span><div><small>{{ t('interface.aLittleHello') }}</small><strong>{{ t('interface.ideasStartHere') }} <Sparkles :size="17" /></strong></div></div>
        <div class="login-art__note login-art__note--reply"><span>{{ t('interface.keepTalking') }}</span><ArrowUpRight :size="20" /></div>
        <div class="login-art__typing"><i></i><i></i><i></i></div>
      </div>
      <div class="login-art__caption"><span>{{ t('interface.yourSpace') }}</span><h2>{{ t('interface.closeTogether') }}</h2><p>{{ t('interface.spaceDescription') }}</p></div>
    </aside>
    <div class="login-container">
      <div class="title-group">
        <span class="login-mark"><MessageCircle :size="27" aria-hidden="true" /></span>
        <h1 class="welcome-text">{{ t('auth.welcomeBack') }}</h1>
        <h2 class="brand-name">{{ store.site.siteName }}</h2>
        <p class="login-description">{{ t('interface.loginDescription') }}</p>
      </div>

      <p v-if="registered" class="success-hint">{{ t('auth.registerSuccess') }}</p>

      <form class="login-form" @submit.prevent="submit">
        <div v-if="isCapacitorAndroid" class="input-wrapper">
          <input
            ref="serverInput"
            v-model.trim="form.serverOrigin"
            class="login-input"
            :placeholder="t('auth.serverOrigin')"
            autocomplete="url"
            inputmode="url"
            name="serverOrigin"
            required
            type="url"
          />
        </div>
        <div class="input-wrapper">
          <input
            ref="usernameInput"
            v-model.trim="form.username"
            class="login-input"
            :placeholder="t('auth.account')"
            :aria-label="t('auth.account')"
            autocomplete="username"
            name="username"
            required
            type="text"
          />
        </div>
        <div class="input-wrapper">
          <input
            ref="passwordInput"
            v-model="form.password"
            class="login-input"
            :placeholder="t('auth.password')"
            :aria-label="t('auth.password')"
            autocomplete="current-password"
            name="password"
            required
            type="password"
          />
        </div>

        <LoginVerification ref="verification" />
        <button class="login-btn" :disabled="loading" type="submit">
          {{ loading ? t('auth.signingIn') : t('auth.signIn') }}
          <ArrowUpRight :size="19" aria-hidden="true" />
        </button>

        <p v-if="error" class="error-text">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped src="../styles/auth.css"></style>
