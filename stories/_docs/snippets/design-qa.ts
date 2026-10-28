import type { Abas } from '../Layout';

export const registroDeAchado: Abas = {
  'Registro de achado': { codigo: `[S1] Botão primário com hex fixo no SCSS
Tela: Administrativo, Lançamento de Diária
Local: botão Salvar lançamento
Encontrado: background-color com hex literal no SCSS do componente
Esperado: cor vinda do token do preset (variável --p-primary-color)
Regra violada: zero cor fixa no código
Evidência: DevTools, regra .btn-primary
Responsável: dev do PBI`, linguagem: 'text' },
  'Auditoria de valores fixos': { codigo: `# Deve retornar zero resultados fora dos arquivos de preset e variáveis
grep -rEn "#[0-9a-fA-F]{3,6}|font-family\\s*:" src/app`, linguagem: 'bash' },
  'Movimento reduzido (opt-in)': { codigo: `/* Estado base estático. Animação só com a preferência liberada. */
@media (prefers-reduced-motion: no-preference) {
  .cs-overlay {
    transition: opacity var(--motion-quick) var(--ease-citie-out),
                transform var(--motion-quick) var(--ease-citie-out);
  }
}`, linguagem: 'css' },
};
