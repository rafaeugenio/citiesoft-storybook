import type { Abas } from '../Layout';

const URL_MCP = 'https://citiesoft-design-system-mcp.vercel.app/mcp';

export const instalarMcp: Abas = {
  'Claude Code': { linguagem: 'bash', codigo: `claude mcp add --transport http --scope user citiesoft-design-system ${URL_MCP} \\
  --header "Authorization: Bearer <SEU_TOKEN>"

# Conferir
claude mcp list` },
  'Codex': { linguagem: 'bash', codigo: `export CITIESOFT_DESIGN_SYSTEM_MCP_TOKEN="<SEU_TOKEN>"
codex mcp add citiesoft-design-system \\
  --url ${URL_MCP} \\
  --bearer-token-env-var CITIESOFT_DESIGN_SYSTEM_MCP_TOKEN` },
  'Cursor': { linguagem: 'json', codigo: `// ~/.cursor/mcp.json (ou .cursor/mcp.json no projeto)
{
  "mcpServers": {
    "citiesoft-design-system": {
      "url": "${URL_MCP}",
      "headers": { "Authorization": "Bearer \${env:CITIESOFT_DESIGN_SYSTEM_MCP_TOKEN}" }
    }
  }
}` },
  'VS Code': { linguagem: 'json', codigo: `// .vscode/mcp.json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "citiesoft-mcp-token",
      "description": "Token do MCP do Design System Citiesoft",
      "password": true
    }
  ],
  "servers": {
    "citiesoft-design-system": {
      "type": "http",
      "url": "${URL_MCP}",
      "headers": { "Authorization": "Bearer \${input:citiesoft-mcp-token}" }
    }
  }
}` },
  'Claude Desktop': { linguagem: 'json', codigo: `// claude_desktop_config.json (cliente que só aceita processo local: usa a ponte mcp-remote)
{
  "mcpServers": {
    "citiesoft-design-system": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${URL_MCP}", "--header", "Authorization:\${CITIESOFT_AUTH}"],
      "env": { "CITIESOFT_AUTH": "Bearer <SEU_TOKEN>" }
    }
  }
}` },
};

export const testarMcp: Abas = {
  'Pedir à IA': { linguagem: 'text', codigo: `Liste os componentes do Design System Citiesoft.
Mostre a documentação do componente Button.
Como o Design System documenta o drawer de edição?` },
  'curl (diagnóstico)': { linguagem: 'bash', codigo: `# 401 sem token, 200 com token válido
curl -s -o /dev/null -w "%{http_code}\\n" -X POST ${URL_MCP} \\
  -H "content-type: application/json" -H "accept: application/json, text/event-stream" \\
  -H "authorization: Bearer $CITIESOFT_DESIGN_SYSTEM_MCP_TOKEN" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'` },
};
