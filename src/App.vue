<script setup>
import { ref, reactive, onMounted } from 'vue'
import BairroSelect from './components/BairroSelect.vue'
import CargaSelector from './components/CargaSelector.vue'
import { carregarBairros } from './services/bairros'
import { enviarPedido } from './services/pedido'

const vazio = () => ({ carga: null, ajudante: false, origem: '', destino: '', nome: '', telefone: '', obs: '', website: '' })
const f = reactive(vazio())
const formRef = ref(null)
const bairros = ref([])
const carregandoBairros = ref(false)
const falhouBairros = ref(false)
const enviando = ref(false)
const enviado = ref(false)
const erroCarga = ref('')
const snack = reactive({ aberto: false, texto: '', cor: 'error' })

onMounted(async () => {
  carregandoBairros.value = true
  try { bairros.value = await carregarBairros() } catch { falhouBairros.value = true } finally { carregandoBairros.value = false }
})

const obrigatorio = (v) => !!(v && String(v).trim()) || 'Campo obrigatório.'
const regraTelefone = (v) => { const n = (v || '').replace(/\D/g, ''); return (n.length === 10 || n.length === 11) || 'Informe DDD + número.' }
const mascara = (v) => {
  const n = v.replace(/\D/g, '').slice(0, 11)
  if (n.length <= 2) return n
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`
  const corte = n.length === 11 ? 7 : 6
  return `(${n.slice(0, 2)}) ${n.slice(2, corte)}-${n.slice(corte)}`
}

async function solicitar() {
  erroCarga.value = f.carga ? '' : 'Escolha o tamanho da carga.'
  const { valid } = await formRef.value.validate()
  if (!valid || !f.carga) return
  enviando.value = true
  try {
    await enviarPedido({
      nome: f.nome.trim(), whatsapp: f.telefone, carga: f.carga,
      origem: f.origem.trim(), destino: f.destino.trim(),
      ajudante: f.ajudante, escada: false, obs: f.obs.trim(), website: f.website
    })
    enviado.value = true
  } catch (e) {
    Object.assign(snack, { aberto: true, texto: e.message, cor: 'error' })
  } finally {
    enviando.value = false
  }
}

function novoPedido() { Object.assign(f, vazio()); enviado.value = false }
</script>

<template>
  <v-app>
    <v-app-bar color="secondary" flat>
      <v-icon class="ml-4 mr-2" color="accent" icon="mdi-truck-fast" size="28" />
      <v-app-bar-title class="font-weight-black" style="letter-spacing: .5px">FRETEX</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container style="max-width: 760px">
        <h1 class="text-h4 text-sm-h3 font-weight-black text-secondary mb-6">
          Precisa de frete? <span class="text-primary">Fretex te ajuda!</span>
        </h1>

        <v-card v-if="enviado" class="pa-8 text-center" rounded="xl" elevation="2">
          <v-avatar color="primary" size="84"><v-icon icon="mdi-check-bold" size="48" color="white" /></v-avatar>
          <h2 class="text-h5 font-weight-bold mt-4">Pedido recebido!</h2>
          <p class="text-h6 text-primary font-weight-bold mt-2">Muito Obrigada Pelo Interesse!</p>
          <p class="mt-1">Em breve nossa plataforma estará disponível e entraremos em contato.</p>
          <v-btn class="mt-5" color="primary" size="large" @click="novoPedido">Fazer outro pedido</v-btn>
        </v-card>

        <v-form v-else ref="formRef" @submit.prevent="solicitar">
          <v-card class="pa-5" rounded="xl" elevation="2">
            <h2 class="titulo">Qual carga você quer levar?</h2>
            <CargaSelector v-model="f.carga" :erro="erroCarga" />
            <v-switch v-model="f.ajudante" class="mt-2" color="primary" label="Preciso de ajudante" hide-details />

            <h2 class="titulo mt-8">Saída e destino</h2>
            <BairroSelect v-model="f.origem" label="Saída" :bairros="bairros" :carregando="carregandoBairros" :falhou="falhouBairros" :regras="[obrigatorio]" />
            <div class="mt-4">
              <BairroSelect v-model="f.destino" label="Destino" :bairros="bairros" :carregando="carregandoBairros" :falhou="falhouBairros" :regras="[obrigatorio]" />
              <small>Neste momento, estamos verificando a distância para calcular o valor. Não é necessário enviar o número da localidade ainda.</small>
            </div>

            <h2 class="titulo mt-8">Seus dados para contato</h2>
            <v-text-field v-model="f.nome" label="Seu nome" maxlength="80" prepend-inner-icon="mdi-account-outline" :rules="[obrigatorio]" />
            <v-text-field v-model="f.telefone" label="Telefone / WhatsApp" placeholder="(66) 99999-9999" inputmode="tel"
              prepend-inner-icon="mdi-phone-outline" :rules="[regraTelefone]" @update:model-value="f.telefone = mascara($event || '')" />
            <v-textarea v-model="f.obs" label="Observações (opcional)" rows="2" auto-grow maxlength="300" counter
              placeholder="Ex.: sofá de 3 lugares, preciso para sábado de manhã" />
            <input v-model="f.website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" />

            <v-btn type="submit" class="mt-4 font-weight-black" color="primary" size="x-large" block rounded="xl" :loading="enviando" prepend-icon="mdi-truck-fast">
              Solicitar frete
            </v-btn>
            <p class="text-caption titulo text-center mt-3">
              Ao solicitar, você concorda em compartilhar seus dados com os motoristas para receber propostas.
            </p>
          </v-card>
        </v-form>
      </v-container>
    </v-main>

    <v-snackbar v-model="snack.aberto" :color="snack.cor" timeout="5000">{{ snack.texto }}</v-snackbar>
  </v-app>
</template>

<style>
.titulo { font-size: 1.2rem; font-weight: 700; margin-bottom: 14px; color: #293B14; }
</style>
