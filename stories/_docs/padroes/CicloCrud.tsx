import { useState } from 'react';
import { RiDeleteBin6Line } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { ConfirmDialog } from '@/components/application/dialog/confirm-dialog';
import { Moldura } from './Moldura';

type Caso = 'simples' | 'dependencias' | 'massa';

const CASOS: Record<Caso, { botao: string; verbo: string; affectedCount?: number; entitySingular: string; entityPlural: string; confirmLabel?: string; descricao: string; sucesso: string }> = {
  simples: {
    botao: 'Excluir uma diária',
    verbo: 'Excluir',
    entitySingular: 'diária',
    entityPlural: 'diárias',
    confirmLabel: 'Excluir',
    descricao: 'Você está prestes a excluir a diária de Ana Paula Ribeiro, de 15/06 a 17/06/2025. Esta ação não pode ser desfeita.',
    sucesso: 'Diária excluída com sucesso.',
  },
  dependencias: {
    botao: 'Excluir com vínculos',
    verbo: 'Excluir',
    entitySingular: 'cargo',
    entityPlural: 'cargos',
    confirmLabel: 'Excluir mesmo assim',
    descricao: 'O cargo Analista Administrativo está vinculado a 3 lançamentos e 1 processo ativo. A exclusão irá remover todos esses vínculos.',
    sucesso: 'Cargo excluído com sucesso.',
  },
  massa: {
    botao: 'Excluir 12 selecionados',
    verbo: 'Excluir',
    affectedCount: 12,
    entitySingular: 'registro',
    entityPlural: 'registros',
    confirmLabel: 'Excluir 12 registros',
    descricao: 'Você selecionou 12 registros. A exclusão é permanente e não pode ser desfeita.',
    sucesso: '12 registros excluídos com sucesso.',
  },
};

/** Os três diálogos de exclusão do ciclo, com texto específico, contagem exata e estado de carregamento. */
export function ExclusaoDemo() {
  const [aberto, setAberto] = useState<Caso | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const caso = aberto ? CASOS[aberto] : null;

  const confirmar = () => {
    setCarregando(true);
    window.setTimeout(() => {
      setCarregando(false);
      setMensagem(caso?.sucesso ?? '');
      setAberto(null);
    }, 800);
  };

  return (
    <Moldura legenda="O foco inicial do diálogo fica em Cancelar. O botão destrutivo diz o que apaga.">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(CASOS) as Caso[]).map((c) => (
          <Button key={c} variant="secondary" leadingIcon={RiDeleteBin6Line} onClick={() => { setMensagem(''); setAberto(c); }}>
            {CASOS[c].botao}
          </Button>
        ))}
      </div>
      <p role="status" className="mt-3 min-h-6 text-body-medium text-text-primary">{mensagem}</p>
      {caso ? (
        <ConfirmDialog
          isOpen
          onOpenChange={(o) => { if (!o) setAberto(null); }}
          onConfirm={confirmar}
          tone="danger"
          verb={caso.verbo}
          affectedCount={caso.affectedCount}
          entitySingular={caso.entitySingular}
          entityPlural={caso.entityPlural}
          title={aberto === 'simples' ? 'Excluir diária?' : aberto === 'dependencias' ? 'Excluir cargo?' : undefined}
          description={caso.descricao}
          confirmLabel={caso.confirmLabel}
          loadingLabel="Excluindo"
          isLoading={carregando}
        />
      ) : null}
    </Moldura>
  );
}
