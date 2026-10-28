import type { Abas } from '../Layout';

export const mobileExemplo: Abas = {
  'HTML/CSS': { codigo: `<meta name="viewport" content="width=device-width, initial-scale=1"> <!-- nunca bloqueie o zoom -->

<label for="cpf">CPF</label>
<input id="cpf" inputmode="numeric" autocomplete="off" placeholder="Ex.: 111.444.777-35">

<div id="offline" role="status" hidden>Você está sem conexão. Suas alterações serão salvas e enviadas quando a internet voltar.</div>

<nav aria-label="Navegação principal">
  <a href="/" aria-current="page">Início</a>
  <a href="/solicitacoes" aria-label="Solicitações, 3 notificações">Solicitações</a>
</nav>

nav a, button, input { min-height: 44px; min-width: 44px; }
input { font-size: 16px; } /* evita o zoom automático do iOS */

window.addEventListener('offline', () => (offline.hidden = false));
window.addEventListener('online', () => (offline.hidden = true));` },
  'Angular com PrimeNG': { codigo: `// conexao.service.ts
online = toSignal(
  merge(fromEvent(window, 'online').pipe(map(() => true)), fromEvent(window, 'offline').pipe(map(() => false))),
  { initialValue: navigator.onLine },
);

<!-- app.component.html -->
@if (!conexao.online()) {
  <p-message severity="warn" role="status">
    Você está sem conexão. Suas alterações serão salvas e enviadas quando a internet voltar.
  </p-message>
}
<p-fileupload mode="basic" accept="image/jpeg,image/png,application/pdf" [maxFileSize]="10485760"
              chooseLabel="Escolher arquivo" [auto]="false" />` },
  'React': { codigo: `import { useSyncExternalStore } from 'react';

function assinar(cb: () => void) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}
const useOnline = () => useSyncExternalStore(assinar, () => navigator.onLine, () => true);

{!useOnline() && (
  <div role="status">Você está sem conexão. Suas alterações serão salvas e enviadas quando a internet voltar.</div>
)}` },
};
