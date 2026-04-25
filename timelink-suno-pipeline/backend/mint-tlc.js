const fetch = globalThis.fetch;
const { TonClient, WalletContractV4, internal, toNano, Address, beginCell } = require("@ton/ton");
const { mnemonicToPrivateKey } = require("@ton/crypto");

const CONFIG = {
  mnemonic: process.env.TON_MNEMONIC || "hurt bacon already render transfer garlic wasp pole better picnic travel entire thought secret assume eager dust hold grunt law raw curious draft excess",
  apiKey: "cc70e713dd99c56ad4ba23ee1eae2f8545f2e71d774c35f7e2ece915e6ed9c55",
  apiUrl: "https://testnet.toncenter.com/api/v2/jsonRPC",
  minterAddress: "EQBliopwW-3NYXWW7bKO5oW2CGiyYJ4EDxke6KwqZs9cNy_h",
  backendUrl: process.env.BACKEND_URL || "https://api.timelink.digital",
  adminEmail: process.env.ADMIN_EMAIL || "mununglee@gmail.com",
  adminPassword: process.env.ADMIN_PASSWORD || "new30year!",
};

async function getToken() {
  const r = await fetch(CONFIG.backendUrl + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CONFIG.adminEmail, password: CONFIG.adminPassword })
  });
  const d = await r.json();
  if (!d.token) throw new Error("로그인 실패: " + JSON.stringify(d));
  return d.token;
}

async function getPendingWithdrawals(token) {
  try {
    const sql = "SELECT * FROM tlc_withdrawals WHERE status='pending' OR status='processing' OR status='queued' ORDER BY created_at ASC";
    const r = await fetch(CONFIG.backendUrl + "/api/admin/sql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ sql })
    });
    const d = await r.json();
    return d.results || [];
  } catch(e) {
    console.error("조회 오류:", e.message);
    return [];
  }
}

async function updateWithdrawal(token, id, status, txHash) {
  try {
    const sql = "UPDATE tlc_withdrawals SET status='" + status + "', tx_hash='" + txHash + "', processed_at=datetime('now') WHERE id=" + id;
    const r = await fetch(CONFIG.backendUrl + "/api/admin/sql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ sql })
    });
    return r.ok;
  } catch(e) {
    console.error("DB 오류:", e.message);
    return false;
  }
}

async function mintTLC(client, wallet, keyPair, toAddress, amount) {
  const minter = Address.parse(CONFIG.minterAddress);
  const recipient = Address.parse(toAddress);
  const jettonAmount = BigInt(Math.round(amount * 1e9));

  const forwardPayload = beginCell()
    .storeUint(0x178d4519, 32)
    .storeUint(Date.now(), 64)
    .storeCoins(jettonAmount)
    .storeAddress(null)
    .storeAddress(null)
    .storeCoins(0)
    .storeUint(0, 1)
    .endCell();

  const mintBody = beginCell()
    .storeUint(0x15, 32)
    .storeUint(Date.now(), 64)
    .storeAddress(recipient)
    .storeCoins(toNano("0.05"))
    .storeRef(forwardPayload)
    .endCell();

  const seqno = await wallet.getSeqno();
  await wallet.sendTransfer({
    secretKey: keyPair.secretKey,
    seqno,
    messages: [internal({ to: minter, value: toNano("0.1"), body: mintBody })]
  });

  return "minted_" + Date.now();
}

async function main() {
  console.log("TON 민팅 스크립트 시작...");

  const client = new TonClient({ endpoint: CONFIG.apiUrl, apiKey: CONFIG.apiKey });
  const keyPair = await mnemonicToPrivateKey(CONFIG.mnemonic.split(" "));
  const wallet = client.open(WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 }));

  console.log("Admin 지갑:", wallet.address.toString());

  const token = await getToken();
  console.log("로그인 완료");

  const withdrawals = await getPendingWithdrawals(token);
  console.log("처리할 출금:", withdrawals.length, "건");

  for (const wd of withdrawals) {
    console.log("처리 중: id=" + wd.id + ", 주소=" + wd.ton_address + ", 금액=" + wd.tlc_amount + " TLC");
    try {
      const txHash = await mintTLC(client, wallet, keyPair, wd.ton_address, wd.tlc_amount);
      await updateWithdrawal(token, wd.id, "done", txHash);
      console.log("완료:", txHash);
      await new Promise(r => setTimeout(r, 3000));
    } catch(e) {
      console.error("실패 id=" + wd.id + ":", e.message);
      await updateWithdrawal(token, wd.id, "failed", "error_" + Date.now());
    }
  }

  console.log("완료!");
}

main().catch(console.error);
