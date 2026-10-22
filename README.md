# Fretex

Página única para pedir orçamento de frete em Sinop – MT. O pedido cai numa planilha do Google, e a equipe chama os motoristas.

## Stack
Vue 3 + Vite + Vuetify · Axios (API de bairros) · Google Apps Script + Google Sheets

## Como funciona
- **Bairros:** buscados do OpenStreetMap (Overpass API) e guardados em cache por 7 dias. Se não achar o bairro, é só digitar.
- **Pedido:** enviado para o Apps Script, que valida os dados e grava uma linha na planilha. O site só mostra "Pedido recebido" depois que a planilha confirma.

## Rodar localmente
```
npm install
cp .env.example .env     # no Windows: copy .env.example .env
# preencha VITE_APPS_SCRIPT_URL no .env
npm run dev
```

