import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import './Fundacoes.css';

/**
 * As fundações são lidas do CSS real, então esta página nunca diverge dos tokens
 * que os componentes consomem. Se um token some, a amostra some junto.
 */

const meta = {
  title: 'Fundações/Tokens',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tokens Citiesoft aplicados. Fonte: `design-system/01-foundations/` e `02-tokens/`. O componente consome token por nome, nunca hex literal.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Amostra({ nome, token, texto }: { nome: string; token: string; texto?: string }) {
  return (
    <div className="fnd-amostra">
      <span className="fnd-amostra__cor" style={{ backgroundColor: `var(${token})` }} />
      <div>
        <p className="fnd-amostra__nome">{nome}</p>
        <code className="fnd-amostra__token">{token}</code>
        {texto ? <p className="fnd-amostra__texto">{texto}</p> : null}
      </div>
    </div>
  );
}

export const Cores: Story = {
  name: 'Cores semânticas',
  render: () => (
    <div className="fnd">
      <section>
        <h3 className="fnd__titulo">Marca</h3>
        <div className="fnd__grade">
          <Amostra nome="Primária" token="--citie-brand-primary" texto="Ação principal, no máximo uma por contexto" />
          <Amostra nome="Hover" token="--citie-brand-hover" />
          <Amostra nome="Pressionado" token="--citie-brand-active" />
          <Amostra nome="Sutil" token="--citie-brand-subtle" texto="Linha selecionada, item ativo de menu" />
        </div>
      </section>

      <section>
        <h3 className="fnd__titulo">Superfícies</h3>
        <div className="fnd__grade">
          <Amostra nome="Fundo de página" token="--citie-background-default" />
          <Amostra nome="Superfície" token="--citie-background-surface" texto="Cards, modais, tabelas" />
          <Amostra nome="Sutil" token="--citie-background-subtle" texto="Cabeçalho de tabela, faixa zebrada" />
        </div>
      </section>

      <section>
        <h3 className="fnd__titulo">Texto</h3>
        <div className="fnd__grade">
          <Amostra nome="Primário" token="--citie-text-primary" texto="Títulos e dados de máxima ênfase" />
          <Amostra nome="Base" token="--citie-text-base" texto="Todo texto de corpo" />
          <Amostra nome="Secundário" token="--citie-text-secondary" texto="Metadado; nunca abaixo de 12px" />
        </div>
      </section>

      <section>
        <h3 className="fnd__titulo">Feedback</h3>
        <div className="fnd__grade">
          <Amostra nome="Sucesso" token="--citie-success-emphasis" texto="Aprovado, homologado, vigente" />
          <Amostra nome="Aviso" token="--citie-warning-emphasis" texto="Pendente, prazo próximo" />
          <Amostra nome="Erro" token="--citie-danger-emphasis" texto="Devolvido, vencido, exclusão" />
          <Amostra nome="Informação" token="--citie-info-text" texto="Em andamento, em análise" />
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const estilo = getComputedStyle(canvasElement.ownerDocument.documentElement);
    // A amostra lê o token real: se o valor mudar no CSS, a página acompanha.
    await expect(estilo.getPropertyValue('--citie-brand-primary').trim()).toBe('#1261e4');
    await expect(within(canvasElement).getByText('--citie-brand-primary')).toBeVisible();
  },
};

export const Tipografia: Story = {
  name: 'Tipografia',
  parameters: {
    docs: {
      description: {
        story:
          'Inter para toda interface densa e Red Hat Display para títulos e momentos institucionais. Fontes fora do sistema (Arial, Roboto, Montserrat) não aparecem em produto.',
      },
    },
  },
  render: () => (
    <div className="fnd">
      <p className="fnd__display fnd__display--xl">Red Hat Display 32/600</p>
      <p className="fnd__display">Red Hat Display 20/600, títulos de seção</p>
      <p className="fnd__corpo fnd__corpo--lg">Inter 16/400, corpo ampliado e mobile</p>
      <p className="fnd__corpo">Inter 14/400, corpo padrão de produto</p>
      <p className="fnd__corpo fnd__corpo--sm">Inter 13/400, helper text e metadado</p>
      <p className="fnd__corpo fnd__corpo--acao">Inter 14/500, rótulo de ação</p>
    </div>
  ),
};

export const Espacamento: Story = {
  name: 'Espaçamento e raio',
  render: () => (
    <div className="fnd">
      <section>
        <h3 className="fnd__titulo">Escala de espaçamento</h3>
        {[1, 2, 3, 4, 5].map((passo) => (
          <div key={passo} className="fnd__linha">
            <code className="fnd-amostra__token">--citie-spacing-{passo}</code>
            <span className="fnd__barra" style={{ width: `var(--citie-spacing-${passo})` }} />
          </div>
        ))}
      </section>

      <section>
        <h3 className="fnd__titulo">Raio</h3>
        <div className="fnd__grade">
          {[
            ['sm', 'Tags secundárias, paginador'],
            ['md', 'PADRÃO: todo controle interativo'],
            ['lg', 'Cards e painéis'],
            ['xl', 'Modais e widgets'],
          ].map(([nome, uso]) => (
            <div key={nome} className="fnd-amostra">
              <span
                className="fnd-amostra__cor fnd-amostra__cor--raio"
                style={{ borderRadius: `var(--citie-radius-${nome})` }}
              />
              <div>
                <p className="fnd-amostra__nome">radius.{nome}</p>
                <code className="fnd-amostra__token">--citie-radius-{nome}</code>
                <p className="fnd-amostra__texto">{uso}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="fnd__titulo">Altura de controle</h3>
        <div className="fnd__grade">
          {[
            ['small', '32px'],
            ['normal', '40px'],
            ['large', '48px'],
          ].map(([nome, medida]) => (
            <div key={nome} className="fnd-amostra">
              <span
                className="fnd__controle"
                style={{ height: `var(--citie-control-height-${nome})` }}
              />
              <div>
                <p className="fnd-amostra__nome">{medida}</p>
                <code className="fnd-amostra__token">--citie-control-height-{nome}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const estilo = getComputedStyle(canvasElement.ownerDocument.documentElement);
    // radius.md é o padrão Citiesoft para controle interativo.
    await expect(estilo.getPropertyValue('--citie-radius-md').trim()).toBe('6px');
    await expect(estilo.getPropertyValue('--citie-control-height-normal').trim()).toBe('40px');
  },
};

export const Elevacao: Story = {
  name: 'Elevação e foco',
  render: () => (
    <div className="fnd">
      <div className="fnd__grade">
        <div className="fnd__elevacao" style={{ boxShadow: 'var(--citie-shadow-card)' }}>
          shadow card
        </div>
        <div className="fnd__elevacao" style={{ boxShadow: 'var(--citie-shadow-overlay)' }}>
          shadow overlay
        </div>
        <div className="fnd__elevacao" style={{ boxShadow: 'var(--citie-state-focus-ring)' }}>
          anel de foco
        </div>
      </div>
      <p className="fnd-amostra__texto">
        O anel de foco é obrigatório em todo elemento focável e nunca pode ser removido sem
        substituto equivalente ou superior (WCAG 2.4.7 e 2.4.11).
      </p>
    </div>
  ),
};
