<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue']);
const buttons = ref([]);
const selectedIndex = computed(() => Math.max(0, props.options.findIndex(option => option.value === props.modelValue)));
const indicatorStyle = computed(() => ({
  width: `calc((100% - 8px) / ${Math.max(1, props.options.length)})`,
  transform: `translateX(${selectedIndex.value * 100}%)`
}));

function navigate(event, index) {
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % props.options.length;
  else if (event.key === 'ArrowLeft') next = (index - 1 + props.options.length) % props.options.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = props.options.length - 1;
  else return;
  event.preventDefault();
  emit('update:modelValue', props.options[next].value);
  buttons.value[next]?.focus();
}
</script>

<template>
  <div class="segmented-control" role="group" :aria-label="label">
    <span class="segmented-control__indicator" :style="indicatorStyle" aria-hidden="true"></span>
    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="element => buttons[index] = element"
      type="button"
      class="segmented-control__option"
      :class="{ 'segmented-control__option--selected': modelValue === option.value }"
      :aria-pressed="modelValue === option.value"
      :disabled="disabled"
      @click="emit('update:modelValue', option.value)"
      @keydown="navigate($event, index)"
    >
      {{ option.label }}
      <span v-if="option.count" class="segmented-control__count">{{ option.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.segmented-control {
  position: relative;
  display: flex;
  padding: 4px;
  border: 1px solid var(--chat-line);
  border-radius: 999px;
  background: var(--chat-hover);
  isolation: isolate;
}
.segmented-control__indicator {
  position: absolute;
  inset: 4px auto 4px 4px;
  z-index: -1;
  border-radius: inherit;
  background: var(--chat-ink);
  box-shadow: 0 2px 5px rgb(0 0 0 / 12%);
  transition: transform var(--motion-fluid);
}
.segmented-control__option {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  min-height: 36px;
  padding: 6px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--chat-muted);
  font-size: 12px;
  font-weight: 550;
  white-space: nowrap;
  cursor: pointer;
  transition: color 180ms ease, transform var(--motion-press);
}
.segmented-control__option:hover { color: var(--chat-ink); }
.segmented-control__option--selected,
.segmented-control__option--selected:hover { color: var(--chat-paper); }
.segmented-control__option:active { transform: scale(0.96); }
.segmented-control__option:disabled { opacity: 0.6; cursor: wait; }
.segmented-control__option:focus-visible { outline: 2px solid var(--chat-accent); outline-offset: 2px; }
.segmented-control__count {
  display: inline-grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 14%, transparent);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 960px) { .segmented-control__option { min-height: 40px; } }
@media (prefers-reduced-motion: reduce) {
  .segmented-control__indicator, .segmented-control__option { transition: none; }
}
</style>
