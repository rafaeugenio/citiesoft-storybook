import { useEffect, useState } from 'react';
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill, RiContrast2Line } from '@remixicon/react';
import { Input } from '@/components/base/input/input';
import { LoginSimples } from '@/components/application/login-simples/login-simples';
import { Moldura } from './Moldura';

/** Login com erro genérico e aviso da política de bloqueio a partir da terceira falha. */
export function LoginDemo() {
  const [tentativas, setTentativas] = useState(0);
  const bloqueado = tentativas >= 5;
  const erro = tentativas === 0
    ? undefined
    : bloqueado
      ? 'Sua conta foi bloqueada por 15 minutos após cinco tentativas incorretas. Aguarde ou redefina sua senha.'
      : `E-mail ou senha incorretos.${tentativas >= 3 ? ' Após cinco tentativas, o acesso será bloqueado por 15 minutos.' : ''}`;
  return (
    <Moldura legenda="Envie o formulário várias vezes: a mensagem não diz qual campo errou, e o aviso de bloqueio entra na terceira falha.">
      <div className="mx-auto w-full max-w-[400px]">
        <LoginSimples
          layout="card"
          identifierType="email"
          identifierLabel="E-mail institucional"
          title="Entrar no sistema"
          error={erro}
          isDisabled={bloqueado}
          onSubmit={() => setTentativas((n) => n + 1)}
          footer="Suporte: suporte@exemplo.gov.br"
        />
      </div>
    </Moldura>
  );
}

type Forca = 'fraca' | 'media' | 'forte' | null;

function avaliar(senha: string): Forca {
  if (!senha) return null;
  const tem = [/[a-z]/i.test(senha), /\d/.test(senha), senha.length >= 8, /[^\w]/.test(senha) || senha.length >= 12].filter(Boolean).length;
  return tem >= 4 ? 'forte' : tem >= 3 ? 'media' : 'fraca';
}

const FORCA = {
  fraca: { texto: 'Senha fraca', cor: 'text-status-orange-text', Icone: RiCheckboxBlankCircleLine },
  media: { texto: 'Senha média', cor: 'text-status-yellow-text', Icone: RiContrast2Line },
  forte: { texto: 'Senha forte', cor: 'text-state-success-text', Icone: RiCheckboxCircleFill },
} as const;

/** Indicador de força com três canais (cor, texto, ícone) e anúncio após 500 ms de pausa. */
export function ForcaDaSenhaDemo() {
  const [senha, setSenha] = useState('');
  const [anunciada, setAnunciada] = useState<Forca>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setAnunciada(avaliar(senha)), 500);
    return () => window.clearTimeout(t);
  }, [senha]);
  const atual = avaliar(senha);
  const item = atual ? FORCA[atual] : null;
  return (
    <Moldura legenda="O texto lido pelo leitor de tela só muda depois de 500 ms sem digitar." largura={420}>
      <div className="flex flex-col gap-2">
        <Input label="Nova senha" type="password" autoComplete="new-password" hint="Mínimo 8 caracteres, letras e números." value={senha} onChange={setSenha} />
        <p className={`flex min-h-6 items-center gap-1.5 text-body-medium ${item?.cor ?? ''}`}>
          {item ? <><item.Icone className="size-5" aria-hidden />{item.texto}</> : null}
        </p>
        <p className="sr-only" role="status">{anunciada ? FORCA[anunciada].texto : ''}</p>
      </div>
    </Moldura>
  );
}
