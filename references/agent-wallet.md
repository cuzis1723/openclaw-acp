# Agent Wallet Reference

> **When to use this reference:** Use this file when you need detailed information about retrieving the agent's wallet address or balance. For general skill usage, see [SKILL.md](../SKILL.md).

This reference covers agent wallet tools in the ACP skill. These tools operate on the **current agent's wallet** (the agent identified by `LITE_AGENT_API_KEY`) and retrieve wallet information on the Base chain.

---

## 1. Get Wallet Address

Get the wallet address of the current agent.

### Tool

`get_wallet_address`

### Parameters

None. The agent is inferred from `LITE_AGENT_API_KEY`.

### Command (CLI)

```bash
npx tsx scripts/index.ts get_wallet_address
```

### Examples

```bash
npx tsx scripts/index.ts get_wallet_address
```

**Example output:**

```json
{
  "walletAddress": "0x1234567890123456789012345678901234567890"
}
```

**Response fields:**

| Field           | Type   | Description                              |
| --------------- | ------ | ---------------------------------------- |
| `walletAddress` | string | The agent's wallet address on Base chain |

**Error cases:**

- `{"error":"Unauthorized"}` — API key is missing or invalid

---

## 2. Get Wallet Balance

Get all token balances in the current agent's wallet on Base chain.

### Tool

`get_wallet_balance`

### Parameters

None. The agent is inferred from `LITE_AGENT_API_KEY`.

### Command (CLI)

```bash
npx tsx scripts/index.ts get_wallet_balance
```

### Examples

```bash
npx tsx scripts/index.ts get_wallet_balance
```

**Example output:**

```json
[
  {
    "network": "base-mainnet",
    "tokenAddress": null,
    "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "tokenMetadata": {
      "symbol": null,
      "decimals": null,
      "name": null,
      "logo": null
    },
    "tokenPrices": [
      {
        "currency": "usd",
        "value": "2097.0244158432",
        "lastUpdatedAt": "2026-02-05T11:04:59Z"
      }
    ]
  },
  {
    "network": "base-mainnet",
    "tokenAddress": "0x4200000000000000000000000000000000000006",
    "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "tokenMetadata": {
      "decimals": 18,
      "logo": null,
      "name": "Wrapped Ether",
      "symbol": "WETH"
    },
    "tokenPrices": [
      {
        "currency": "usd",
        "value": "2096.7550144675",
        "lastUpdatedAt": "2026-02-05T11:04:51Z"
      }
    ]
  },
  {
    "network": "base-mainnet",
    "tokenAddress": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000004e20",
    "tokenMetadata": {
      "decimals": 6,
      "logo": null,
      "name": "USD Coin",
      "symbol": "USDC"
    },
    "tokenPrices": [
      {
        "currency": "usd",
        "value": "0.9997921712",
        "lastUpdatedAt": "2026-02-05T11:04:32Z"
      }
    ]
  }
]
```

**Response fields:**

| Field           | Type   | Description                                                                    |
|-----------------|--------|--------------------------------------------------------------------------------|
| `network`       | string | Blockchain network (e.g., "base-mainnet")                                     |
| `tokenAddress` | string \| null | Contract address of the token (null for native/base token)                    |
| `tokenBalance` | string | Balance amount as a hex string (e.g., "0x0000...4e20")                        |
| `tokenMetadata` | object | Token metadata object (see below)                                             |
| `tokenPrices`  | array  | Array with price objects containing `currency`, `value` (string), and `lastUpdatedAt` |

**Token metadata fields:**

| Field      | Type   | Description                                    |
|------------|--------|------------------------------------------------|
| `symbol`   | string \| null | Token symbol/ticker (e.g., "WETH", "USDC")    |
| `decimals` | number \| null | Token decimals for formatting                  |
| `name`     | string \| null | Token name (e.g., "Wrapped Ether", "USD Coin") |
| `logo`     | string \| null | URL to token logo image                        |

**Token price fields:**

| Field           | Type   | Description                                    |
|-----------------|--------|------------------------------------------------|
| `currency`      | string | Price currency (e.g., "usd")                  |
| `value`         | string | Price value as a string                        |
| `lastUpdatedAt` | string | ISO 8601 timestamp of when price was last updated |

**Error cases:**

- `{"error":"Unauthorized"}` — API key is missing or invalid
- `{"error":"Wallet not found"}` — Agent wallet does not exist
