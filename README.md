# Solana Devnet Autonomous Multi-Agent Prototype

🚀 **Fully autonomous Solana Devnet prototype** demonstrating multi-agent wallet interactions, SPL token minting, and test dApp interaction.



## Overview

This project simulates a **Master → Agent system** on Solana Devnet:

- **Master Wallet**: Holds SOL and SPL tokens, funds agents, mints tokens.  
- **Agent Wallet**: Created programmatically, receives SOL and SPL, returns tokens, interacts with a test dApp (Memo program).  

The architecture is **autonomous**, **multi-agent ready**, and **secure**.  

This prototype demonstrates how wallets can interact programmatically without manual intervention, making it ideal for DeFi automation, DAOs, and blockchain experiments.



## Architecture


Master Wallet
│
│ Funds Agent (SOL)
│ Mints SPL Tokens
▼
Agent Wallet
│
│ Receives SPL Tokens
│ Returns Some Tokens
│ Interacts with Memo Program (dApp)
▼
Master Wallet (Receives Returned Tokens)



- The Master wallet acts as the central authority.  
- Agents simulate autonomous multi-agent behavior.  
- SPL token minting and transfers demonstrate token management on Devnet.  
- Interaction with the Memo program simulates a simple on-chain dApp call.

---

## Features

- Programmatically generates wallets.  
- Automatic transaction signing.  
- Supports SOL and SPL tokens.  
- Multi-agent ready architecture.  
- Interacts with a test dApp (Memo Program).  
- Logs every step for transparency.  
- Secure key storage (wallets stored locally, never committed to GitHub).  

---

## Master Wallet Explanation

- **Master wallet** is the main wallet that funds agents and mints SPL tokens.  
- **Private keys are never exposed**; the wallet is stored locally in `master.json`.  
- Example public key for demonstration:
Master wallet:DsP7FAfEPCEEqXfq8vSZZKDnwzvSRqHsQEMaSsMvqrCX


- This wallet is the only one you need to fund manually on Devnet. Agents are funded programmatically by the master.

---

## Agent Wallets

- Agents are **created programmatically** when the prototype runs.  
- Each agent receives SOL from the master wallet automatically.  
- SPL tokens are transferred from master → agent and returned as part of the simulation.  
- Example agent public key:
9AK7dShxvjBSYkuZUZP3jCsfGpYo9mhveQr6GTdJUWjf


---

## SPL Token Flow

1. Master mints SPL token on Devnet.  
2. Master receives minted tokens.  
3. Master transfers tokens to agent wallets.  
4. Agents return tokens partially to master.  
5. This simulates multi-agent token operations in a fully automated workflow.

---

## Test dApp Interaction

- Agents interact with the **Memo program** on Solana Devnet.  
- This demonstrates basic smart contract interaction without additional setup.  
- All calls are logged for transparency


## Installation

1. Clone the repository:

```bash
git clone https://github.com/wrukky/solana-autonomous-devnet.git
cd solana-autonomous-devnet

---

Usage

Run the prototype:

npx ts-node src/index.ts

Expected output:

🚀 Devnet Autonomous Multi-Agent Prototype
Master wallet balance: 4.79 SOL
Agent wallet: 9AK7dShxvjBSYkuZUZP3jCsfGpYo9mhveQr6GTdJUWjf
💸 Funding agent...
Transferred tokens to agent
Agent returned tokens
📝 Agent interacted with Memo program
✅ Prototype Complete.

Wallet files (master.json, agent.json) are generated locally and never committed.

Project Structure
solana-autonomous-devnet/
│
├── src/index.ts      ← main prototype code
├── package.json
├── tsconfig.json
├── README.md
├── SKILLS.md
├── .gitignore        ← excludes wallets, node_modules, dist
└── node_modules/
Security Notes

Master wallet is funded manually; agents are funded programmatically.

Private keys are never exposed or committed.

.gitignore ensures wallet files, node_modules, and dist are ignored.
