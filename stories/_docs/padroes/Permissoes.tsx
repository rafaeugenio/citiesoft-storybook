import { useState } from 'react';
import { RiLockLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Moldura } from './Moldura';

type Perfil = 'servidor' | 'gestor' | 'administrador';

const PERFIS: { id: Perfil; nome: string }[] = [
  { id: 'servidor', nome: 'Servidor operacional' },
  { id: 'gestor', nome: 'Gestor de unidade' },
  { id: 'administrador', nome: 'Administrador' },
];

/** O mesmo lançamento visto por três perfis: ocultar, desabilitar com explicação e somente leitura. */
export function PerfisDemo() {
  const [perfil, setPerfil] = useState<Perfil>('gestor');
  const [propria, setPropria] = useState(false);
  const podeAprovar = perfil !== 'servidor';
  const bloqueadaPorRegra = podeAprovar && propria;

  return (
    <Moldura legenda="Troque o perfil e a origem da solicitação. Servidor não vê Aprovar. Gestor vê Aprovar bloqueado, com motivo visível.">
      <div className="flex flex-col gap-4">
        <div role="group" aria-label="Perfil do usuário" className="flex flex-wrap gap-2">
          {PERFIS.map((p) => (
            <Button key={p.id} size="small" variant={perfil === p.id ? 'primary' : 'secondary'} aria-pressed={perfil === p.id} onClick={() => setPerfil(p.id)}>
              {p.nome}
            </Button>
          ))}
          <Button size="small" variant="ghost" aria-pressed={propria} onClick={() => setPropria((v) => !v)}>
            {propria ? 'Solicitação feita por mim' : 'Solicitação de outra pessoa'}
          </Button>
        </div>

        <div className="rounded-2xl border border-border-button-default bg-background-primary-default p-4">
          <p className="text-body-medium text-text-primary">Lançamento de diária 2025/0481</p>
          <div className="mt-3 flex flex-col gap-1">
            <label htmlFor="valor-diaria" className="text-body-medium text-text-primary">Valor da diária</label>
            <input
              id="valor-diaria"
              readOnly={perfil !== 'administrador'}
              defaultValue="R$ 720,00"
              key={perfil}
              aria-describedby="valor-diaria-ajuda"
              className="h-10 w-48 rounded-lg border border-border-button-default bg-background-secondary-default px-3 text-body-regular text-text-secondary read-only:cursor-default outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            />
            {perfil !== 'administrador' ? (
              <p id="valor-diaria-ajuda" className="flex items-center gap-1 text-caption-1-medium text-text-secondary">
                <RiLockLine className="size-4" aria-hidden />
                Somente leitura. Somente administradores do sistema podem alterar este parâmetro.
              </p>
            ) : (
              <p id="valor-diaria-ajuda" className="text-caption-1-medium text-text-secondary">Editável neste perfil.</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-start gap-2">
            <Button variant="secondary" size="small">Acompanhar processo</Button>
            {podeAprovar ? (
              <div className="flex flex-col gap-1">
                <Button
                  size="small"
                  aria-disabled={bloqueadaPorRegra || undefined}
                  aria-describedby={bloqueadaPorRegra ? 'motivo-aprovar' : undefined}
                  onClick={(e) => { if (bloqueadaPorRegra) e.preventDefault(); }}
                >
                  Aprovar
                </Button>
                {bloqueadaPorRegra ? (
                  <p id="motivo-aprovar" className="max-w-[28ch] text-caption-1-medium text-text-secondary">
                    Você não pode aprovar sua própria solicitação. Encaminhe para outro gestor.
                  </p>
                ) : null}
              </div>
            ) : null}
            {perfil === 'administrador' ? <Button variant="danger" size="small">Excluir processo</Button> : null}
          </div>
        </div>
      </div>
    </Moldura>
  );
}
