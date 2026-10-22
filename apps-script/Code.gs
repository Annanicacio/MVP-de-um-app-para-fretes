// Cole este código em Extensões → Apps Script da planilha "Pedidos Fretex".
// A aba precisa se chamar "Pedidos" e ter, na linha 1:
// Data | Nome | WhatsApp | Origem | Destino | Tipo de carga | Ajudante | Escada | Observações | Status
const ABA = 'Pedidos';
const CARGAS = ['Pequena', 'Média', 'Grande'];

function limpar(valor, max) {
  const s = String(valor || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s; // evita fórmulas injetadas na planilha
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    if (d.website) return resposta({ ok: true }); // robô preencheu o campo isca

    const nome = limpar(d.nome, 80);
    const whats = String(d.whatsapp || '').replace(/\D/g, '');
    const origem = limpar(d.origem, 200);
    const destino = limpar(d.destino, 200);
    const carga = limpar(d.carga, 20);
    const obs = limpar(d.obs, 300);

    if (!nome || whats.length < 10 || whats.length > 11 || !origem || !destino || CARGAS.indexOf(carga) < 0) {
      return resposta({ ok: false, erro: 'Dados inválidos. Revise o formulário.' });
    }

    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
    aba.appendRow([new Date(), nome, "'" + whats, origem, destino, carga,
      d.ajudante ? 'Sim' : 'Não', d.escada ? 'Sim' : 'Não', obs, 'Novo pedido']);
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: 'Erro ao salvar o pedido. Tente novamente.' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
