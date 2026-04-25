const { TonClient, WalletContractV4, internal, toNano, Cell, beginCell, contractAddress } = require("@ton/ton");
const { mnemonicToPrivateKey } = require("@ton/crypto");

const CONFIG = {
  mnemonic: "hurt bacon already render transfer garlic wasp pole better picnic travel entire thought secret assume eager dust hold grunt law raw curious draft excess",
  apiKey: "cc70e713dd99c56ad4ba23ee1eae2f8545f2e71d774c35f7e2ece915e6ed9c55",
  apiUrl: "https://testnet.toncenter.com/api/v2/jsonRPC",
};

const MINTER_CODE_B64 = "te6cckECDQEAApwAART/APSkE/S88sgLAQIBYgIDAgLMBAUCA3pgCwwC8dkGOASS+B8ADoaYGAuNhJL4HwfSB9IBj9ABi465D9ABj9ABgBaY/pn/aiaH0AfSBqahhACqk4XUcZmpqbGyiaY4L5cCSBfSB9AGoYEGhAMGuQ/QAYEogaKCF4BQpQKBnkKAJ9ASxni2ZmZPaqcEEIPe7L7yk4XXGBQGBwCTtfBQiAbgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBkkHyAODpkZYFlA+X/5Og7wAxkZYKsZ4soAn0BCeW1iWZmZLj9gEBwDY3NwH6APpA+ChUEgZwVCATVBQDyFAE+gJYzxYBzxbMySLIywES9AD0AMsAyfkAcHTIywLKB8v/ydBQBscF8uBKoQNFRchQBPoCWM8WzMzJ7VQB+kAwINcLAcMAkVvjDQgBpoIQLHa5c1JwuuMCNTc3I8ADjhozUDXHBfLgSQP6QDBZyFAE+gJYzxbMzMntVOA1AsAEjhhRJMcF8uBJ1DBDAMhQBPoCWM8WzMzJ7VTgXwWED/LwCQA+ghDVMnbbcIAQyMsFUAPPFiL6AhLLassfyz/JgEL7AAH+Nl8DggiYloAVoBW88uBLAvpA0wAwlcghzxbJkW3ighDRc1QAcIAYyMsFUAXPFiT6AhTLahPLHxTLPyP6RDBwuo4z+ChEA3BUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJ+QBwdMjLAsoHy//J0M8WlmwicAHLAeL0AAoACsmAQPsAAH2tvPaiaH0AfSBqahg2GPwUALgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBk/IA4OmRlgWUD5f/k6EAAH68W9qJofQB9IGpqGD+qkEDvfJl9";

async function main() {
  const client = new TonClient({ endpoint: CONFIG.apiUrl, apiKey: CONFIG.apiKey });
  const keyPair = await mnemonicToPrivateKey(CONFIG.mnemonic.split(" "));
  const wallet = client.open(WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 }));

  console.log("Admin 지갑:", wallet.address.toString());
  const balance = await client.getBalance(wallet.address);
  console.log("잔액:", Number(balance) / 1e9, "TON");
  if (Number(balance) < 0.5e9) { console.log("TON 부족"); return; }

  const MINTER_CODE = Cell.fromBase64(MINTER_CODE_B64);
  console.log("코드 로드 완료");

  // Jetton Wallet 코드도 기존 minter에서 가져오기
  const jettonData = await client.runMethod(
    require("@ton/ton").Address.parse("kQA2RN8fRocgG8KcRYCHnZrQiIfOXpzoTgOB_MkiF2TqalnF"),
    "get_jetton_data"
  );
  jettonData.stack.skip(3); // total_supply, mintable, admin
  jettonData.stack.skip(1); // content
  const WALLET_CODE = jettonData.stack.readCell();
  console.log("Wallet 코드 로드 완료");

  const contentCell = beginCell()
    .storeUint(1, 8)
    .storeStringTail("https://timelink.digital/tlc-metadata.json")
    .endCell();

  const minterData = beginCell()
    .storeCoins(0)
    .storeAddress(wallet.address)
    .storeRef(contentCell)
    .storeRef(WALLET_CODE)
    .endCell();

  const minterInit = { code: MINTER_CODE, data: minterData };
  const minterAddress = contractAddress(0, minterInit);

  console.log("새 Minter 주소:", minterAddress.toString());
  console.log("배포 중...");

  const seqno = await wallet.getSeqno();
  await wallet.sendTransfer({
    secretKey: keyPair.secretKey,
    seqno,
    messages: [
      internal({
        to: minterAddress,
        value: toNano("0.15"),
        init: minterInit,
        body: beginCell().endCell(),
      })
    ]
  });

  console.log("✅ 배포 완료!");
  console.log('JETTON_MINTER = "' + minterAddress.toString() + '"');
}

main().catch(console.error);
