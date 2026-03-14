const fs = require('fs');
const https = require('https');
const http = require('http');

const PRODUCTS_FILE = 'products.json';
const TIMEOUT_MS = 10000;
const today = new Date().toISOString().split('T')[0];

function checkUrl(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, { method: 'HEAD', timeout: TIMEOUT_MS }, (res) => {
      const status = res.statusCode;
      // 2xx e 3xx = OK
      resolve({ ok: status >= 200 && status < 400, status });
    });
    req.on('error', () => resolve({ ok: false, status: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: -1 }); });
    req.end();
  });
}

async function main() {
  const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  const products = JSON.parse(raw);
  const broken = [];

  for (const p of products) {
    if (!p.affiliate_url || p.affiliate_url.includes('exemplo.com')) {
      p.last_checked = today;
      continue;
    }

    const { ok, status } = await checkUrl(p.affiliate_url);
    p.status = ok ? 'active' : 'inactive';
    p.last_checked = today;

    if (!ok) {
      broken.push(`• #${p.number} ${p.name} (HTTP ${status})`);
      console.log(`❌ BROKEN  #${p.number} ${p.name} — HTTP ${status}`);
    } else {
      console.log(`✅ OK      #${p.number} ${p.name}`);
    }

    // Pequeno delay para não sobrecarregar
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  console.log(`\nValidação concluída. ${broken.length} link(s) quebrado(s).`);

  if (broken.length > 0) {
    const msg = broken.join('%0A');
    // Exporta para o env do GitHub Actions
    const envFile = process.env.GITHUB_ENV;
    if (envFile) {
      fs.appendFileSync(envFile, `BROKEN_LINKS=${msg}\n`);
    }
  }
}

main().catch(console.error);
