# Fretex

Página única para pedir orçamento de frete em Sinop – MT. O pedido cai numa planilha do Google, e a equipe chama os motoristas.

## Stack
Vue 3 + Vite + Vuetify · Axios (API de bairros) · Google Apps Script + Google Sheets

## Como funciona
- **Bairros:** buscados do OpenStreetMap (Overpass API) e guardados em cache por 7 dias. Se não achar o bairro, é só digitar.
- **Pedido:** enviado para o Apps Script, que valida os dados e grava uma linha na planilha. O site só mostra "Pedido recebido" depois que a planilha confirma.

## Testar as integrações
`npm run testar` consulta a API de bairros e envia um pedido de teste para a planilha.

## Rodar localmente
```
npm install
cp .env.example .env     # no Windows: copy .env.example .env
# preencha VITE_APPS_SCRIPT_URL no .env
npm run dev
```

## Configurar a planilha (uma vez)
1. Crie uma planilha **Pedidos Fretex** e renomeie a aba para **Pedidos**.
2. Na linha 1, coloque: `Data | Nome | WhatsApp | Origem | Destino | Tipo de carga | Ajudante | Escada | Observações | Status`
3. **Extensões → Apps Script**, apague o conteúdo e cole `apps-script/Code.gs`. Salve.
4. **Implantar → Nova implantação → App da Web**: executar como **Eu**; acesso: **Qualquer pessoa**.
5. Autorize e copie a URL terminada em `/exec` para `VITE_APPS_SCRIPT_URL`.
6. Ao alterar o script depois, use **Implantar → Gerenciar implantações → Editar → Nova versão**, senão a URL continua com o código antigo.

Mantenha a planilha privada (não compartilhe o link).

## Publicar
1. Suba o projeto no GitHub (`.env` já está no `.gitignore`).
2. Importe o repositório na hospedagem (framework: Vite, build `npm run build`, saída `dist`).
3. Cadastre a variável de ambiente `VITE_APPS_SCRIPT_URL` com a URL do Apps Script e faça o deploy.

> O plano gratuito (Hobby) da Vercel é para uso pessoal e não comercial. Se o Fretex for um negócio, confira os termos ou use outra hospedagem estática.
