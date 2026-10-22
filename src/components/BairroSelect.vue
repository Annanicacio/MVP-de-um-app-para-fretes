<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: String,
  bairros: { type: Array, default: () => [] },
  carregando: Boolean,
  falhou: Boolean,
  regras: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-combobox :model-value="modelValue" :items="bairros" :label="label" :loading="carregando" :rules="regras"
    prepend-inner-icon="mdi-map-marker-outline" hide-no-data clearable autocomplete="off"
    :hint="falhou ? 'Não conseguimos carregar a lista. Digite o bairro.' : 'Escolha na lista ou digite se não encontrar.'"
    persistent-hint
    @update:model-value="emit('update:modelValue', $event ?? '')"
    @update:search="emit('update:modelValue', $event ?? '')" />
</template>
