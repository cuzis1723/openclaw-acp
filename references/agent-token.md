# Agent Token Reference

> **When to use this reference:** Use this file when you need detailed information about launching or retrieving agent tokens. For general skill usage, see [SKILL.md](../SKILL.md).

This reference covers agent token tools in the ACP skill. These tools operate on the **current agent's** token (the agent identified by `LITE_AGENT_API_KEY`).

---

## 1. Launch Agent Token

Launch the current agent's token as a funding mechanism (e.g., tax fees). **One token per agent.**

### Tool

`launch_my_token`

### Parameters

| Position | Name         | Required | Description                                      |
|----------|--------------|----------|--------------------------------------------------|
| 1        | `symbol`     | Yes      | Token symbol/ticker (e.g., `MYAGENT`, `BOT`)    |
| 2        | `description`| Yes      | Short description of the token                   |
| 3        | `imageUrl`   | No       | URL for the token image                         |

### Command (CLI)

```bash
npx tsx scripts/index.ts launch_my_token "<symbol>" "<description>" ["<imageUrl>"]
```

### Examples

**Minimal (symbol + description):**

```bash
npx tsx scripts/index.ts launch_my_token "MYAGENT" "Agent reward and governance token"
```

**With image URL:**

```bash
npx tsx scripts/index.ts launch_my_token "BOT" "My assistant token" "https://example.com/logo.png"
```

**Example output:**

```json
{
  "data": {
    "id": "token-123",
    "symbol": "MYAGENT",
    "description": "Agent reward and governance token",
    "status": "active",
    "imageUrl": "https://example.com/logo.png"
  }
}
```

**Error cases:**

- `{"error":"Token already exists"}` — Agent has already launched a token (one token per agent)
- `{"error":"Invalid symbol"}` — Symbol format is invalid
- `{"error":"Unauthorized"}` — API key is missing or invalid

---

## 2. Get Agent Token

Get the current agent's token information (symbol, description, status). Use when the user asks about "my token" or their agent's token.

### Tool

`get_my_token`

### Parameters

None. The agent is inferred from `LITE_AGENT_API_KEY`.

### Command (CLI)

```bash
npx tsx scripts/index.ts get_my_token
```

### Examples

```bash
npx tsx scripts/index.ts get_my_token
```

**Example output (token exists):**

```json
{
  "data": {
    "id": "token-123",
    "symbol": "MYAGENT",
    "description": "Agent reward and governance token",
    "status": "active",
    "imageUrl": "https://example.com/logo.png"
  }
}
```

**Example output (no token):**

```json
{
  "error": "Token not found"
}
```

**Error cases:**

- `{"error":"Unauthorized"}` — API key is missing or invalid
- `{"error":"Token not found"}` — Agent has not launched a token yet
