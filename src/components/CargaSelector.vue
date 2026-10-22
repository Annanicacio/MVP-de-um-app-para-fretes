<script setup>
import pequena from '../assets/carga-pequena.jpg'
import media from '../assets/carga-media.jpg'
import grande from '../assets/carga-grande.jpg'
defineProps({ modelValue: { type: String, default: null }, erro: String })
const emit = defineEmits(['update:modelValue'])
// Para mudar textos, ícones ou exemplos, edite esta lista.
const opcoes = [
  { valor: 'Pequena', titulo: 'Carga pequena', img: pequena, icone: 'mdi-car-pickup', veiculo: 'Picape', exemplos: 'Caixas, malas, compras, encomendas' },
  { valor: 'Média', titulo: 'Carga média', img: media, icone: 'mdi-van-utility', veiculo: 'Fiorino, camionete', exemplos: 'Sofá, mesa, colchão, fogão' },
  { valor: 'Grande', titulo: 'Carga grande', img: grande, icone: 'mdi-truck', veiculo: 'Caminhão baú', exemplos: 'Geladeira, guarda-roupa, mudança' }
]
</script>

<template>
  <div role="radiogroup" aria-label="Tamanho da carga">
    <v-row dense>
      <v-col v-for="o in opcoes" :key="o.valor" cols="12" sm="4">
        <div class="carga" :class="{ ativa: modelValue === o.valor }" role="radio" :aria-checked="modelValue === o.valor" tabindex="0"
          @click="emit('update:modelValue', o.valor)" @keyup.enter="emit('update:modelValue', o.valor)" @keyup.space.prevent="emit('update:modelValue', o.valor)">
          <v-icon v-if="modelValue === o.valor" class="check" icon="mdi-check-circle" color="primary" size="20" />
          <img :src="o.img" :alt="`Foto: ${o.exemplos}`" />
          <div class="d-flex align-center justify-center ga-2 mt-2">
            <v-icon :icon="o.icone" color="primary" size="28" />
            <span class="text-subtitle-1 font-weight-bold">{{ o.titulo }}</span>
          </div>
          <div class="text-body-2 font-weight-medium text-primary">{{ o.veiculo }}</div>
          <div class="text-caption text-medium-emphasis mt-1">{{ o.exemplos }}</div>
        </div>
      </v-col>
    </v-row>
    <p v-if="erro" class="text-caption text-error mt-1">{{ erro }}</p>
  </div>
</template>

<style scoped>
.carga { position: relative; height: 100%; padding: 14px 12px; text-align: center; cursor: pointer; border-radius: 18px;
  border: 2px solid #DCE5CB; background: #fff; transition: transform .2s, box-shadow .2s, border-color .2s; }
.carga:hover, .carga:focus-visible { transform: translateY(-3px); box-shadow: 0 8px 18px rgba(34, 48, 11, .15); outline: none; }
.carga.ativa { border-color: #76993D; background: #F0F5E4; box-shadow: 0 6px 16px rgba(118, 153, 61, .3); }
/* Foto pequena e suave. Para mudar o tamanho, altere width/height abaixo. */
.carga img { width: 72px; height: 72px; object-fit: cover; border-radius: 16px; display: block; margin: 0 auto;
  opacity: .88; filter: saturate(.8); }
.check { position: absolute; top: 8px; right: 8px; }
</style>