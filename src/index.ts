import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getAccount,
} from "@solana/spl-token";

import * as fs from "fs";

// ---------------- CONFIG ----------------
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const TOKEN_DECIMALS = 9;
const TOKENS_TO_MINT = 100;
const TOKENS_PER_TRANSFER = 25;

// ---------------- UTIL ----------------
function loadOrCreateWallet(name: string): Keypair {
  if (fs.existsSync(name)) {
    const secret = JSON.parse(fs.readFileSync(name, "utf-8"));
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  } else {
    const wallet = Keypair.generate();
    fs.writeFileSync(name, JSON.stringify(Array.from(wallet.secretKey)));
    console.log("Created wallet:", name);
    return wallet;
  }
}

async function getBalance(wallet: Keypair) {
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(
    `${wallet.publicKey.toBase58()} balance: ${
      balance / LAMPORTS_PER_SOL
    } SOL`
  );
  return balance;
}

// ---------------- MAIN ----------------
async function main() {
  console.log("🚀 Devnet Autonomous Multi-Agent Prototype\n");

  // 1️⃣ Load master
  const master = loadOrCreateWallet("master.json");
  await getBalance(master);

  // 2️⃣ Programmatically create agent
  const agent = loadOrCreateWallet("agent.json");
  console.log("Agent wallet:", agent.publicKey.toBase58());

  // 3️⃣ Master funds agent
  console.log("💸 Funding agent...");
  const fundTx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: master.publicKey,
      toPubkey: agent.publicKey,
      lamports: 0.2 * LAMPORTS_PER_SOL,
    })
  );

  await sendAndConfirmTransaction(connection, fundTx, [master]);

  await getBalance(agent);

  // 4️⃣ Create SPL Mint
  const mint = await createMint(
    connection,
    master,
    master.publicKey,
    null,
    TOKEN_DECIMALS
  );

  console.log("Mint Address:", mint.toBase58());

  // 5️⃣ Mint tokens to master
  const masterTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    master,
    mint,
    master.publicKey
  );

  await mintTo(
    connection,
    master,
    mint,
    masterTokenAccount.address,
    master.publicKey,
    TOKENS_TO_MINT * 10 ** TOKEN_DECIMALS
  );

  console.log("Minted tokens to master");

  // 6️⃣ Transfer to agent
  const agentTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    master,
    mint,
    agent.publicKey
  );

  await transfer(
    connection,
    master,
    masterTokenAccount.address,
    agentTokenAccount.address,
    master.publicKey,
    TOKENS_PER_TRANSFER * 10 ** TOKEN_DECIMALS
  );

  console.log("Transferred tokens to agent");

  // 7️⃣ Agent returns some tokens
  await transfer(
    connection,
    agent,
    agentTokenAccount.address,
    masterTokenAccount.address,
    agent.publicKey,
    5 * 10 ** TOKEN_DECIMALS
  );

  console.log("Agent returned tokens");

  // 8️⃣ dApp Interaction (Memo Program)
  const MEMO_PROGRAM_ID = new PublicKey(
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
  );

  const memoIx = new TransactionInstruction({
    keys: [{ pubkey: agent.publicKey, isSigner: true, isWritable: false }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from("Autonomous agent interaction"),
  });

  const memoTx = new Transaction().add(memoIx);

  await sendAndConfirmTransaction(connection, memoTx, [agent]);

  console.log("📝 Agent interacted with Memo program");

  console.log("\n✅ Prototype Complete.");
}

main().catch(console.error);
