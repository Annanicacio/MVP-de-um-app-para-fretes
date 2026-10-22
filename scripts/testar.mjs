// Testa as duas integrações a partir do seu computador: npm run testar
import { readFileSync, existsSync } from 'node:fs'
import { CONSULTA } from '../src/services/bairros.js'

const env = existsSync('.env') ? readFileSync('.env', 'utf8') : ''
const url = process.argv[2] || env.match(/^VITE_APPS_SCRIPT_URL=(.+)$/m)?.[1]?.trim()
const ok = (m) => console.log('✅', m)
const falha = (m) => console.log('❌', m)

console.log('1) API de bairros (Overpass / OpenStreetMap)')
try {
  const r = await fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(CONSULTA))
  const j = await r.json()
  const nomes = [...new Set(j.elements.map((e) => e.tags?.name).filter(Boolean))].sort()
  nomes.length ? ok(`${nomes.length} bairros encontrados: ${nomes.slice(0, 10).join(', ')}...`) : falha('A API respondeu, mas não veio nenhum bairro (digitação livre cobre).')
} catch (e) { falha('Falha ao consultar: ' + e.message) }

console.log('\n2) Planilha (Google Apps Script)')
if (!url) falha('URL não encontrada. Preencha VITE_APPS_SCRIPT_URL no .env ou rode: npm run testar -- SUA_URL')
else {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ nome: 'TESTE Fretex', whatsapp: '66999999999', origem: 'Centro', destino: 'Centro', carga: 'Pequena', ajudante: false, escada: false, obs: 'Pedido de teste, pode apagar' })
    })
    const j = await r.json()
    j.ok ? ok('O script respondeu OK. Abra a planilha e confira se entrou a linha "TESTE Fretex".') : falha('O script respondeu com erro: ' + j.erro)
  } catch (e) { falha('Não foi possível chamar o script (URL errada ou acesso não está como "Qualquer pessoa"): ' + e.message) }
}
