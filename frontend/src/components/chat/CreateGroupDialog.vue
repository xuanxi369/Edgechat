<script setup>
import { Globe2, LockKeyhole } from '@lucide/vue';
import { ref, toRef } from 'vue';
import { useOverlayLifecycle } from '../../composables/useOverlayLifecycle.js';
import { t } from '../../i18n.js';
import UiAvatar from '../ui/Avatar.vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  users: { type: Array, default: () => [] },
  form: { type: Object, required: true },
  submitting: { type: Boolean, default: false },
  error: { type: String, default: '' }
});

const emit = defineEmits(['close', 'toggle-member', 'submit']);
const nameInputEl = ref(null);

useOverlayLifecycle({
  open: toRef(props, 'show'),
  onClose: () => emit('close'),
  focusTarget: nameInputEl
});
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="show" class="room-dialog-overlay" @click.self="emit('close')">
      <section class="room-dialog" role="dialog" aria-modal="true" aria-labelledby="create-group-title">
        <h2 id="create-group-title">{{ t('group.create') }}</h2>
        <label class="room-dialog__field">
          <span>{{ t('group.name') }}</span>
          <input ref="nameInputEl" v-model="form.name" type="text" class="room-dialog__input" autocomplete="off" />
        </label>

		<div class="room-dialog__type-field">
			  <span>{{ t('group.type') }}</span>
			  <div class="room-dialog__type-switch" role="radiogroup" :aria-label="t('group.type')">
			<label
			  :class="{ 'room-dialog__type-option--active': form.kind === 'public' }"
			  class="room-dialog__type-option"
			>
			  <input v-model="form.kind" type="radio" name="group-kind" value="public" />
			  <Globe2 :size="17" aria-hidden="true" />
				  <span>{{ t('chat.publicGroup') }}</span>
			</label>
			<label
			  :class="{ 'room-dialog__type-option--active': form.kind === 'private' }"
			  class="room-dialog__type-option"
			>
			  <input v-model="form.kind" type="radio" name="group-kind" value="private" />
			  <LockKeyhole :size="17" aria-hidden="true" />
				  <span>{{ t('chat.privateGroup') }}</span>
			</label>
		  </div>
		</div>

        <div class="room-dialog__members">
			  <label>{{ form.kind === 'public' ? t('group.inviteOptional') : t('group.selectMembers') }}</label>
          <div class="room-dialog__member-list">
            <button
              v-for="user in users"
              :key="user.id"
              type="button"
              class="room-dialog__member"
              :class="{ 'room-dialog__member--selected': form.memberUserIds.includes(user.id) }"
              @click="emit('toggle-member', user.id)"
            >
              <UiAvatar :src="user.avatarUrl" :fallback="user.displayName?.[0] || '?'" size="sm" />
              <span>{{ user.displayName }}</span>
            </button>
          </div>
        </div>

        <p v-if="error" class="room-dialog__error" role="alert">{{ error }}</p>

        <div class="room-dialog__actions">
          <button type="button" class="room-dialog__secondary" @click="emit('close')">{{ t('common.cancel') }}</button>
          <button
            type="button"
            class="room-dialog__primary"
            :disabled="!form.name.trim() || submitting"
            @click="emit('submit')"
          >
            {{ submitting ? t('common.creating') : t('common.create') }}
          </button>
        </div>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.room-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:
    max(16px, env(safe-area-inset-top))
    max(16px, env(safe-area-inset-right))
    max(16px, env(safe-area-inset-bottom))
    max(16px, env(safe-area-inset-left));
  background: var(--chat-scrim);
}

.room-dialog {
  width: min(420px, 100%);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 24px;
  border-radius: 24px;
  background: var(--chat-paper);
  box-shadow: var(--chat-shadow-panel);
}

.room-dialog h2 { margin: 0 0 20px; font-size: 18px; color: var(--chat-ink); }
.room-dialog__field { display: grid; gap: 8px; color: var(--chat-muted); font-size: 13px; }
.room-dialog__input { width: 100%; min-height: 44px; padding: 10px 14px; border: 1px solid var(--chat-line); border-radius: 8px; background: var(--chat-canvas); font-size: 16px; }
.room-dialog__type-field { display: grid; gap: 8px; margin-top: 20px; color: var(--chat-muted); font-size: 13px; }
.room-dialog__type-switch { position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 4px; border: 1px solid var(--chat-line); border-radius: 999px; background: var(--chat-hover); isolation: isolate; }
.room-dialog__type-switch::before { content: ''; position: absolute; inset: 4px auto 4px 4px; z-index: -1; width: calc((100% - 12px) / 2); border-radius: 999px; background: var(--chat-ink); transition: transform var(--motion-fluid); }
.room-dialog__type-switch:has(input[value="private"]:checked)::before { transform: translateX(calc(100% + 4px)); }
.room-dialog__type-option { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-width: 0; min-height: 40px; padding: 8px 10px; border: 0; border-radius: 999px; background: transparent; color: var(--chat-muted); font-size: 13px; cursor: pointer; }
.room-dialog__type-option input { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
.room-dialog__type-option:focus-within { outline: 3px solid rgba(var(--site-brand-rgb, 0, 128, 105), 0.24); outline-offset: 2px; }
.room-dialog__type-option--active { color: var(--chat-paper); }
.room-dialog__members { margin-top: 20px; }
.room-dialog__members > label { display: block; margin-bottom: 8px; font-size: 13px; color: var(--chat-muted); }
.room-dialog__member-list { display: flex; flex-wrap: wrap; gap: 8px; max-height: 180px; overflow-y: auto; }
.room-dialog__member { display: flex; align-items: center; gap: 8px; max-width: 100%; min-height: 44px; padding: 8px 12px; border: 1px solid var(--chat-line); border-radius: 20px; background: var(--chat-paper); cursor: pointer; touch-action: manipulation; }
.room-dialog__member span { min-width: 0; overflow-wrap: anywhere; }
.room-dialog__member--selected { border-color: var(--site-brand, #008069); background: var(--site-selected, #e8f0fe); }
.room-dialog__actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.room-dialog__error { margin: 16px 0 0; color: var(--chat-danger); font-size: 13px; overflow-wrap: anywhere; }
.room-dialog__secondary, .room-dialog__primary { min-height: 44px; padding: 10px 20px; border-radius: 8px; cursor: pointer; touch-action: manipulation; }
.room-dialog__secondary { border: 1px solid var(--chat-line); background: var(--chat-paper); }
.room-dialog__primary { border: 0; background: var(--site-action-bg, #008069); color: var(--site-on-action, var(--chat-paper)); }
.room-dialog__primary:disabled { cursor: not-allowed; opacity: 0.55; }
.room-dialog button:focus-visible { outline: 3px solid rgba(var(--site-brand-rgb, 0, 128, 105), 0.24); outline-offset: 2px; }
.modal-fade-enter-active { transition: opacity 200ms; }
.modal-fade-leave-active { transition: opacity 150ms; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .room-dialog-overlay {
    align-items: flex-end;
    padding: env(safe-area-inset-top) 0 0;
  }

  .room-dialog {
    width: 100%;
    max-height: calc(100dvh - env(safe-area-inset-top));
    padding: 20px 16px max(16px, env(safe-area-inset-bottom));
    border-radius: 24px 24px 0 0;
  }

  .room-dialog__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}
</style>
