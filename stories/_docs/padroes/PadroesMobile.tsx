import { useState } from 'react';
import { RiFileTextLine, RiHome5Line, RiUser3Line, RiWifiOffLine, RiFolderUserLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Moldura } from './Moldura';

const ABAS = [
  { id: 'inicio', rotulo: 'Início', Icone: RiHome5Line },
  { id: 'solicitacoes', rotulo: 'Solicitações', Icone: RiFileTextLine, contador: 3 },
  { id: 'documentos', rotulo: 'Documentos', Icone: RiFolderUserLine },
  { id: 'perfil', rotulo: 'Perfil', Icone: RiUser3Line },
] as const;

/** Tela do cidadão em 375 px: banner offline, upload com preview e navegação inferior com rótulos. */
export function TelaMobileDemo() {
  const [aba, setAba] = useState<string>('solicitacoes');
  const [offline, setOffline] = useState(true);
  return (
    <Moldura legenda="Alvos de 44 px, rótulo sempre visível e item atual marcado. Alterne o banner de conexão.">
      <div className="mb-3">
        <Button size="small" variant="secondary" onClick={() => setOffline((v) => !v)}>{offline ? 'Restaurar conexão' : 'Simular perda de conexão'}</Button>
      </div>
      <div className="mx-auto flex h-[560px] w-[375px] max-w-full flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default">
        {offline ? (
          <div role="status" className="flex items-start gap-2 bg-status-yellow-background px-4 py-3 text-body-regular text-status-yellow-text">
            <RiWifiOffLine className="mt-0.5 size-5 shrink-0" aria-hidden />
            Você está sem conexão. Suas alterações serão salvas e enviadas quando a internet voltar.
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
          <h3 className="text-title-3-semibold text-text-primary">Enviar laudo médico</h3>
          <p className="text-caption-1-medium text-text-secondary">Aceito: JPG, PNG, PDF. Máx. 10 MB.</p>
          <div className="flex flex-col gap-2">
            <Button className="min-h-11" variant="secondary">Tirar foto</Button>
            <Button className="min-h-11" variant="secondary">Escolher da galeria</Button>
            <Button className="min-h-11" variant="secondary">Escolher arquivo</Button>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-border-button-default bg-background-primary-default p-3">
            <p className="min-w-0 text-body-regular text-text-primary"><span className="block truncate">laudo-cardiologia.pdf</span><span className="text-caption-1-medium text-text-secondary">2,4 MB</span></p>
            <Button className="min-h-11 shrink-0" variant="ghost" size="small">Remover</Button>
          </div>
          <div role="progressbar" aria-label="Enviando laudo" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-1.5 rounded-full bg-background-tertiary-default"><div className="h-full w-[72%] rounded-full bg-text-primary" /></div>
            <p className="mt-1 text-caption-1-medium text-text-secondary">Enviando... 72%</p>
          </div>
        </div>
        <nav aria-label="Navegação principal" className="flex min-h-14 border-t border-border-button-default bg-background-primary-default">
          {ABAS.map(({ id, rotulo, Icone, ...resto }) => {
            const contador = 'contador' in resto ? resto.contador : undefined;
            return (
              <button
                key={id}
                type="button"
                aria-current={aba === id ? 'page' : undefined}
                aria-label={contador ? `${rotulo}, ${contador} notificações` : rotulo}
                onClick={() => setAba(id)}
                className={`flex min-h-14 min-w-11 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring ${aba === id ? 'text-text-primary' : 'text-text-secondary'}`}
              >
                <Icone className="size-5" aria-hidden />
                <span className="text-caption-2-semibold" aria-hidden>{rotulo}{contador ? ` (${contador})` : ''}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </Moldura>
  );
}
