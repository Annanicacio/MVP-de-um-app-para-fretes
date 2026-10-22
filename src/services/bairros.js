import axios from 'axios'

// Bairros de Sinop – MT a partir do OpenStreetMap (Overpass API, pública e sem chave).
const CHAVE = 'fretex:bairros'
const VALIDADE = 7 * 24 * 60 * 60 * 1000 // cache de 7 dias
const AREA = '(-11.98,-55.70,-11.70,-55.35)' // caixa ao redor de Sinop
const TIPOS = '["place"~"^(suburb|neighbourhood|quarter)$"]'
export const CONSULTA = `[out:json][timeout:25];(node${TIPOS}${AREA};way${TIPOS}${AREA};relation${TIPOS}${AREA};);out tags;`

export async function carregarBairros() {
  try {
    const c = JSON.parse(localStorage.getItem(CHAVE))
    if (c && Date.now() - c.em < VALIDADE && c.lista.length) return c.lista
  } catch { /* sem cache válido */ }

  const { data } = await axios.get('https://overpass-api.de/api/interpreter', {
    params: { data: CONSULTA },
    timeout: 30000
  })
  const lista = [...new Set(data.elements.map((e) => e.tags?.name).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  )
  if (!lista.length) throw new Error('Nenhum bairro retornado')
  try { localStorage.setItem(CHAVE, JSON.stringify({ em: Date.now(), lista })) } catch { /* ignora */ }
  return lista
}
