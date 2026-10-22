const URL_SCRIPT = import.meta.env.VITE_APPS_SCRIPT_URL

// Envia o pedido ao Apps Script. Content-Type text/plain evita o preflight CORS,
// que o Apps Script não suporta. Só resolve se a planilha confirmou o salvamento.
export async function enviarPedido(dados) {
  if (!URL_SCRIPT) throw new Error('Envio ainda não configurado (VITE_APPS_SCRIPT_URL).')
  let resposta
  try {
    resposta = await fetch(URL_SCRIPT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(dados)
    })
  } catch {
    throw new Error('Sem conexão. Verifique a internet e tente de novo.')
  }
  let corpo
  try { corpo = await resposta.json() } catch { throw new Error('Resposta inesperada do servidor.') }
  if (!corpo.ok) throw new Error(corpo.erro || 'Não foi possível registrar o pedido.')
  return corpo
}
