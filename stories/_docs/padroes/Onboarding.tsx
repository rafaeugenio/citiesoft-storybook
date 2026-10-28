import { RiFileList3Line, RiInformationLine, RiLockLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { EmptyState } from '@/components/application/estados/empty-state';
import { Moldura } from './Moldura';

/** As três variantes de estado vazio: ação possível, bloqueado por dependência e informativo. */
export function EstadosVaziosDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Moldura legenda="Ação possível">
        <EmptyState
          size="sm"
          icon={RiFileList3Line}
          title="Nenhum processo aberto"
          description="Para registrar uma solicitação de TFD, selecione Novo processo. O sistema pré-preenche os dados do paciente cadastrado."
          action={<Button size="small">Novo processo</Button>}
          secondaryAction={<Button size="small" variant="secondary">Importar do sistema de origem</Button>}
        />
      </Moldura>
      <Moldura legenda="Bloqueado por dependência">
        <EmptyState
          size="sm"
          icon={RiLockLine}
          title="Integração não configurada"
          description="A importação automática de servidores requer credenciais do sistema de origem. Configure a integração para continuar."
          action={<Button size="small">Configurar integração</Button>}
        />
      </Moldura>
      <Moldura legenda="Informativo">
        <EmptyState
          size="sm"
          icon={RiInformationLine}
          title="Nenhuma diária registrada ainda"
          description="Quando houver lançamentos no período, eles aparecem aqui com o valor e a situação."
        />
      </Moldura>
    </div>
  );
}

/** Default visível: o valor vem do perfil e a legenda lembra de conferir. */
export function DefaultComLegendaDemo() {
  return (
    <Moldura legenda="Em campo de impacto financeiro ou legal, o default nunca é silencioso." largura={460}>
      <div className="flex flex-col gap-4">
        <Input label="Órgão" defaultValue="Prefeitura Municipal de São Luís" hint="Pré-preenchido com base no perfil do órgão. Verifique antes de confirmar." />
        <Input label="Competência" defaultValue="Junho / 2026" hint="Pré-preenchido com base no perfil do órgão. Verifique antes de confirmar." />
      </div>
    </Moldura>
  );
}
