# AI Discovery CISO Sample

This sample project is intentionally built for AgentGuard AI Discovery demos.
It contains multiple realistic AI agents, MCP servers, RAG surfaces, and tool
flows with different risk levels so `/agent-security/overview` can render a
clear red/amber/green attack-surface map.

All credentials, customers, and endpoints are fake.

## What The Scanner Should Find

| File | Expected Signal | Risk Story |
|---|---|---|
| `src/01-safe-support-agent.ts` | OpenAI tool-calling agent | Low-risk support search flow, should look green when protected. |
| `src/02-customer-success-rag.ts` | RAG/vector retrieval agent | Amber flow: retrieved chunks enter model context and outbound Slack summary exists. |
| `src/03-finance-refund-agent.ts` | OpenAI tool-calling agent with Stripe/refund/database/email tools | Red flow: payment writes and customer database access need approval. |
| `src/04-devops-mcp-server.ts` | MCP server with shell, file, GitHub, and HTTP tools | Critical red flow: command execution and file writes. |
| `src/05-autogen-data-analyst.py` | AutoGen multi-agent runtime | High-risk analytics/export path from Postgres to email/webhook. |
| `mcp.json` | MCP inventory/config | Shows multiple MCP servers and tool names. |
| `rag-inventory.json` | RAG inventory payload | Includes safe and poisoned chunks for RAG poisoning visibility. |
| `.github/CODEOWNERS` | Ownership evidence | Lets GitHub discovery infer accountable owners. |

## Suggested Demo

Scan this folder with GitHub or repo discovery, then open:

```txt
/agent-security/overview
```

The CISO view should show:

- green path: safe support lookup
- amber path: RAG context and customer-success workflow
- red path: finance refund, database, shell, file write, and external webhook
- blast-radius rows for finance, devops, and analyst agents
- feature cards for Agent Action Firewall, Shadow AI score, RAG poisoning, SOC feed, and trust readiness

## Notes

The code is not meant to run. It is a compact discovery fixture using common
framework names and tool declarations so the scanner can detect realistic AI
assets without requiring external services.
