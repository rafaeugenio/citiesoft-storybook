import { useId, type ReactNode } from 'react';
import {
  Breadcrumb,
  Button,
  Dialog,
  Drawer,
  Fieldset,
  type NivelDaTrilha,
  type PosicaoDrawer,
  type TamanhoDialog,
} from '../../../src';
import './Formulario.css';

/**
 * Apresentações permitidas pela spec.
 *
 * `drawer` é o padrão default da Citiesoft para cadastro direto. `dialog` só
 * para criação mínima (1 a 3 campos) de entidade auxiliar. `pagina` quando o
 * formulário é extenso ou tem seções internas.
 */
export type ApresentacaoFormulario = 'drawer' | 'dialog' | 'pagina';

export interface DadosDeAuditoria {
  criadoPor: string;
  criadoEm: string;
  alteradoPor?: string;
  alteradoEm?: string;
}

export interface FormularioProps {
  apresentacao?: ApresentacaoFormulario;
  /** Overlay começa fechado: quem controla é a tela de origem. Ignorado em `pagina`. */
  aberto?: boolean;
  /** Nomeia a tarefa e a entidade: "Novo servidor", "Editar servidor". */
  titulo: string;
  subtitulo?: string;
  /** Trilha com o link de volta à listagem. Usada na apresentação em página. */
  trilha?: NivelDaTrilha[];
  /** Aviso no topo do corpo: consolidação de erros do envio, conflito, indisponibilidade. */
  aviso?: ReactNode;
  /** Campos do corpo, em `SecaoDoFormulario` ou direto em `CampoDoFormulario`. */
  children: ReactNode;
  /** Somente leitura, exibida apenas após o primeiro salvamento. */
  auditoria?: DadosDeAuditoria;
  rotuloCancelar?: string;
  /** Nomeia o resultado esperado: "Salvar servidor", nunca "OK". */
  rotuloSalvar: string;
  /** Rótulo do primário durante o envio. */
  rotuloSalvando?: string;
  salvando?: boolean;
  posicaoDrawer?: PosicaoDrawer;
  tamanhoDialog?: TamanhoDialog;
  onCancelar?: () => void;
  onSalvar?: () => void;
}

/** Um campo dentro da grade de 12 colunas. `span` é a largura em colunas. */
export interface CampoDoFormularioProps {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  children: ReactNode;
}

export function CampoDoFormulario({ span = 12, children }: CampoDoFormularioProps) {
  return (
    <div className="citie-tpl-formulario__campo" data-span={span}>
      {children}
    </div>
  );
}

export interface SecaoDoFormularioProps {
  /** Nome da seção. Vira `legend` e é repetido pelo leitor de tela em cada campo. */
  titulo: string;
  /** Seções colapsáveis a partir de 12 campos na entidade. */
  colapsavel?: boolean;
  recolhidaPorPadrao?: boolean;
  children: ReactNode;
}

export function SecaoDoFormulario({
  titulo,
  colapsavel = false,
  recolhidaPorPadrao = false,
  children,
}: SecaoDoFormularioProps) {
  return (
    <Fieldset legend={titulo} toggleable={colapsavel} defaultCollapsed={recolhidaPorPadrao}>
      <div className="citie-tpl-formulario__grade">{children}</div>
    </Fieldset>
  );
}

function AreaDeAuditoria({ dados }: { dados: DadosDeAuditoria }) {
  return (
    <aside className="citie-tpl-formulario__auditoria" aria-label="Auditoria do registro">
      <dl>
        <div>
          <dt>Criado por</dt>
          <dd>
            {dados.criadoPor} em {dados.criadoEm}
          </dd>
        </div>
        {dados.alteradoPor && dados.alteradoEm ? (
          <div>
            <dt>Última alteração</dt>
            <dd>
              {dados.alteradoPor} em {dados.alteradoEm}
            </dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}

/**
 * Template de tela de formulário de cadastro.
 *
 * Anatomia da spec `09-templates/tela-formulario-cadastro.md` v1.0.0, na ordem
 * que ela fixa:
 *
 * 1. Cabeçalho, com título e trilha de volta à listagem, ou botão de fechar
 *    quando em drawer ou dialog (entregue pelo próprio overlay);
 * 2. Corpo, com os campos em grade de 12 colunas, agrupados em seções nomeadas;
 * 3. Rodapé fixo, "Cancelar" à esquerda e o primário "Salvar [Entidade]" à direita;
 * 4. Área de auditoria, somente leitura, exibida após o primeiro salvamento.
 *
 * A ordem interna do corpo é responsabilidade de quem preenche: identificadores
 * primeiro, obrigatórios em seguida, opcionais por último.
 *
 * Componentes do sistema usados aqui: `Drawer`, `Dialog`, `Breadcrumb`,
 * `Fieldset` e `Button`. Os campos (`Input`, `Select`, `DatePicker`,
 * `Textarea`, `Upload`, `Checkbox`, `RadioGroup`), o `Message` de consolidação,
 * o `Toast` de confirmação e o `Skeleton` de carregamento entram pelos slots,
 * porque são conteúdo da página, não estrutura da tela.
 */
export function Formulario({
  apresentacao = 'drawer',
  aberto = false,
  titulo,
  subtitulo,
  trilha,
  aviso,
  children,
  auditoria,
  rotuloCancelar = 'Cancelar',
  rotuloSalvar,
  rotuloSalvando = 'Salvando...',
  salvando = false,
  posicaoDrawer = 'right-lg',
  tamanhoDialog = 'md',
  onCancelar,
  onSalvar,
}: FormularioProps) {
  const idFormulario = `formulario-${useId()}`;

  // Região 2. O `form` fica no corpo e o primário do rodapé aponta para ele
  // pelo atributo `form`, o que mantém o envio por Enter funcionando mesmo com
  // o botão fora do formulário, dentro do rodapé do overlay.
  const rolavel = apresentacao === 'pagina';
  const corpo = (
    <div
      className={`citie-tpl-formulario__corpo${
        rolavel ? ' citie-tpl-formulario__corpo--rolavel' : ''
      }`}
      // Na página o corpo é a região rolável, então precisa ser alcançável
      // pelo teclado. No overlay quem rola é o corpo do próprio Drawer/Dialog.
      role={rolavel ? 'group' : undefined}
      aria-label={rolavel ? `Campos de ${titulo}` : undefined}
      tabIndex={rolavel ? 0 : undefined}
    >
      {aviso}
      <form
        id={idFormulario}
        className="citie-tpl-formulario__secoes"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          onSalvar?.();
        }}
      >
        {children}
      </form>
    </div>
  );

  // Regiões 3 e 4, nesta ordem: ações do rodapé e, abaixo, a auditoria.
  const rodape = (
    <div className="citie-tpl-formulario__rodape">
      <div className="citie-tpl-formulario__acoes">
        <Button variant="text" onClick={onCancelar} disabled={salvando}>
          {rotuloCancelar}
        </Button>
        <Button
          type="submit"
          form={idFormulario}
          variant="primary"
          loading={salvando}
          loadingLabel={rotuloSalvando}
        >
          {rotuloSalvar}
        </Button>
      </div>
      {auditoria ? <AreaDeAuditoria dados={auditoria} /> : null}
    </div>
  );

  if (apresentacao === 'drawer') {
    return (
      <Drawer
        aberto={aberto}
        titulo={titulo}
        subtitulo={subtitulo}
        posicao={posicaoDrawer}
        rodape={rodape}
        onClose={onCancelar}
      >
        {corpo}
      </Drawer>
    );
  }

  if (apresentacao === 'dialog') {
    return (
      <Dialog
        aberto={aberto}
        titulo={titulo}
        subtitulo={subtitulo}
        tamanho={tamanhoDialog}
        rodape={rodape}
        onClose={onCancelar}
      >
        {corpo}
      </Dialog>
    );
  }

  return (
    <main className="citie-tpl-formulario">
      <header className="citie-tpl-formulario__cabecalho">
        {trilha && trilha.length > 0 ? <Breadcrumb niveis={trilha} /> : null}
        <h1 className="citie-tpl-formulario__titulo">{titulo}</h1>
        {subtitulo ? <p className="citie-tpl-formulario__subtitulo">{subtitulo}</p> : null}
      </header>

      {corpo}

      <div className="citie-tpl-formulario__rodape--fixo">{rodape}</div>
    </main>
  );
}
