# Produtos Úteis

Site estático de produtos afiliados hospedado no GitHub Pages.

## Como funciona

- **Página**: `index.html` — lê `products.json` e exibe os cards
- **Produtos**: editados direto no `products.json` + commit
- **Validação**: GitHub Actions toda segunda-feira verifica todos os links

## Como adicionar um produto

Edite `products.json` e adicione um objeto no array:

```json
{
  "id": 2,
  "number": "002",
  "name": "Nome do Produto",
  "description": "Descrição curta do produto.",
  "category": "triathlon",
  "price": 299.90,
  "image": "URL da imagem",
  "affiliate_url": "https://seu-link-afiliado.com",
  "source": "amazon",
  "status": "active",
  "last_checked": "2026-03-14",
  "created_at": "2026-03-14"
}
```

### Campos

| Campo | Descrição |
|---|---|
| `id` | Número inteiro único (auto-incremental) |
| `number` | Código exibido no card (ex: `"002"`) |
| `name` | Nome do produto |
| `description` | Descrição curta |
| `category` | Categoria (ex: `triathlon`, `tech`, `casa`, `nutricao`) |
| `price` | Preço em reais (número, sem R$) |
| `image` | URL da imagem do produto |
| `affiliate_url` | Link de afiliado |
| `source` | Marketplace (`amazon`, `shopee`, `hotmart`, etc.) |
| `status` | `active` ou `inactive` |
| `last_checked` | Data da última verificação (preenchido pelo bot) |
| `created_at` | Data de criação |

## Validação de links (GitHub Actions)

Roda toda **segunda-feira às 09:00 UTC** (ou manualmente via "Run workflow").

- Faz `HEAD` request em cada link
- Marca `status: "inactive"` se o link estiver quebrado
- Envia alerta no Telegram com a lista de links quebrados

### Configurar alerta Telegram

Adicione os secrets no repositório (Settings → Secrets → Actions):

- `TELEGRAM_BOT_TOKEN` — token do seu bot
- `TELEGRAM_CHAT_ID` — seu chat ID

## Deploy

GitHub Pages: habilitar em Settings → Pages → Branch `main` → pasta `/` (root).

A cada push no `main`, a página atualiza automaticamente.
