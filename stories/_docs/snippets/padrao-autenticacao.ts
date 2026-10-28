import type { Abas } from '../Layout';

export const loginExemplo: Abas = {
  'HTML/CSS': { codigo: `<form method="post" action="/entrar" novalidate>
  <h1>Entrar no sistema</h1>
  <label for="email">E-mail institucional</label>
  <input id="email" name="email" type="email" autocomplete="username" required>
  <label for="senha">Senha</label>
  <input id="senha" name="senha" type="password" autocomplete="current-password" required>
  <p role="alert" id="erro-login">E-mail ou senha incorretos.</p>
  <button type="submit">Entrar</button>
  <a href="/recuperar">Esqueci minha senha</a>
</form>

<!-- Nunca bloqueie a colagem: não use onpaste="return false" -->
<!-- Código de verificação: um campo só -->
<input name="codigo" inputmode="numeric" autocomplete="one-time-code" maxlength="7">` },
  'Angular com PrimeNG': { codigo: `<form [formGroup]="form" (ngSubmit)="entrar()">
  <h1>Entrar no sistema</h1>
  <label for="email">E-mail institucional</label>
  <input pInputText id="email" formControlName="email" autocomplete="username" />
  <label for="senha">Senha</label>
  <p-password inputId="senha" formControlName="senha" [feedback]="false" [toggleMask]="true"
              autocomplete="current-password" />
  @if (erro) { <p-message severity="error" role="alert">E-mail ou senha incorretos.</p-message> }
  <p-button type="submit" label="Entrar" [loading]="entrando" />
</form>

<!-- Criação de senha, com força em cor, texto e ícone -->
<p-password inputId="nova" autocomplete="new-password" promptLabel="Mínimo 8 caracteres, letras e números."
            weakLabel="Senha fraca" mediumLabel="Senha média" strongLabel="Senha forte" />` },
  'React': { codigo: `import { LoginSimples } from '@/components/application/login-simples/login-simples';

<LoginSimples
  layout="card"
  identifierType="email"
  identifierLabel="E-mail institucional"
  title="Entrar no sistema"
  error={erro && 'E-mail ou senha incorretos.'}
  isLoading={entrando}
  onForgot={recuperar}
  onSubmit={({ identifier, password }) => entrar(identifier, password)}
/>` },
};
