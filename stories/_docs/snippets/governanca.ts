import type { Abas } from '../Layout';

export const changelogCodigo: Abas = {
  'CHANGELOG.md': { linguagem: 'markdown', codigo: `## [1.2.0] 2026-03-10

### Adicionado
- Diretriz de uso do Cyan como acento tecnológico.

### Alterado
- Checklist de tipografia expandido.

### Corrigido
- Valor HEX do Citie Blue 600: de #1261E3 para #1261E4.

### Depreciado
- JetBrains Mono. Migrar para Red Hat Mono até 2026-06-30.` },
  'Frontmatter': { linguagem: 'yaml', codigo: `---
title: Tipografia, JetBrains Mono (depreciado)
status: deprecated        # stable | draft | deprecated
version: 1.1.0
deprecated_in: "1.1.0"
replaced_by: "[[02-tipografia/red-hat-mono]]"
migration_deadline: "2026-06-30"
---` },
};
