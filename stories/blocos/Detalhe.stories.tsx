import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  RiCheckboxCircleLine,
  RiFileAddLine,
  RiFileSearchLine,
  RiMailSendLine,
  RiMoreFill,
  RiTimeLine,
} from '@remixicon/react';
import { DetailHeader } from '@/components/application/detalhe/detail-header';
import { KeyValueList } from '@/components/application/detalhe/key-value-list';
import { Timeline, type TimelineEvent } from '@/components/application/detalhe/timeline';
import { IconButton } from '@/components/base/buttons/icon-button';

const eventos: TimelineEvent[] = [
  {
    key: 'e5',
    title: 'Consulta agendada',
    description: 'Hospital Regional de Imperatriz, Cardiologia, 28/07/2026 às 08:30.',
    date: '15/07/2026 às 14:32',
    dateTime: '2026-07-15T14:32',
    author: 'Regulação estadual',
    icon: RiCheckboxCircleLine,
    tone: 'success',
  },
  {
    key: 'e4',
    title: 'Documentos conferidos',
    description: 'Laudo médico e encaminhamento validados.',
    date: '13/07/2026 às 10:05',
    dateTime: '2026-07-13T10:05',
    author: 'Carlos Lima',
    icon: RiFileSearchLine,
    tone: 'brand',
  },
  {
    key: 'e3',
    title: 'Documento pendente',
    description: 'Solicitado o comprovante de residência atualizado.',
    date: '10/07/2026 às 16:48',
    dateTime: '2026-07-10T16:48',
    author: 'Mariana Souza',
    icon: RiMailSendLine,
    tone: 'warning',
  },
  {
    key: 'e2',
    title: 'Em análise',
    date: '08/07/2026 às 09:12',
    dateTime: '2026-07-08T09:12',
    author: 'Mariana Souza',
    icon: RiTimeLine,
  },
  {
    key: 'e1',
    title: 'Solicitação criada',
    date: '07/07/2026 às 15:20',
    dateTime: '2026-07-07T15:20',
    author: 'Ana Ribeiro',
    icon: RiFileAddLine,
  },
];

const dados = [
  { label: 'Paciente', value: 'Joana Pereira Alves' },
  { label: 'CPF', value: '123.***.***-45' },
  { label: 'Cartão SUS', value: '***********4821' },
  { label: 'Município de origem', value: 'Açailândia' },
  { label: 'Município de destino', value: 'Imperatriz' },
  { label: 'Especialidade', value: 'Cardiologia' },
  { label: 'Unidade de destino', value: 'Hospital Regional de Imperatriz' },
  { label: 'Tipo de transporte', value: 'Ambulância' },
  { label: 'Acompanhante', value: undefined },
  { label: 'Justificativa', value: 'Avaliação cardiológica de seguimento, sem oferta do serviço no município.', span: 3 as const },
];

/* ---------------------------------- Timeline ---------------------------------- */

const metaTimeline = {
  title: 'Blocos/Detalhe',
  component: Timeline,
  tags: ['autodocs'],
  args: { events: eventos },
} satisfies Meta<typeof Timeline>;

export default metaTimeline;
type Story = StoryObj<typeof metaTimeline>;

export const LinhaDoTempo: Story = {};

export const SemIcones: Story = {
  args: { events: eventos.map(({ icon: _icon, ...e }) => e) },
};

export const Vazia: Story = { args: { events: [] } };

export const VazioPersonalizado: Story = {
  args: { events: [], emptyText: 'Esta solicitação ainda não tem movimentações.' },
};

export const ComConteudoExtra: Story = {
  args: {
    events: [
      {
        ...eventos[2],
        extra: (
          <p className="rounded-2lg bg-background-tertiary-default p-2 text-caption-1-regular text-text-secondary">
            comprovante-residencia.pdf
          </p>
        ),
      },
      eventos[4],
    ],
  },
};

/* ------------------------------- DetailHeader ------------------------------- */

export const CabecalhoDeDetalhe: Story = {
  render: function Render() {
    return (
      <DetailHeader
        breadcrumb={[{ label: 'Solicitações TFD', href: '#' }, { label: 'TFD-2026-004812' }]}
        title="Joana Pereira Alves"
        identifier="TFD-2026-004812"
        statusLabel="Agendada"
        statusColor="lime"
        meta="Cardiologia, Imperatriz · Atualizada em 15/07/2026"
        onEdit={fn()}
        menu={<IconButton icon={RiMoreFill} aria-label="Mais ações" />}
      />
    );
  },
};

export const CabecalhoSemTrilha: Story = {
  render: function Render() {
    return (
      <DetailHeader
        title="Joana Pereira Alves"
        identifier="TFD-2026-004812"
        statusLabel="Aguardando documentos"
        statusColor="yellow"
        headingLevel={2}
      />
    );
  },
};

export const CabecalhoStatusNegada: Story = {
  render: function Render() {
    return (
      <DetailHeader
        title="Pedro Henrique Costa"
        identifier="TFD-2026-004790"
        statusLabel="Negada"
        statusColor="rose"
        onEdit={fn()}
        editLabel="Editar solicitação"
      />
    );
  },
};

/* -------------------------------- KeyValueList -------------------------------- */

export const ListaDeDados: Story = {
  render: function Render() {
    return <KeyValueList items={dados} columns={2} />;
  },
};

export const ListaEmUmaColuna: Story = {
  render: function Render() {
    return <KeyValueList items={dados.slice(0, 5)} columns={1} />;
  },
};

export const ListaEmTresColunas: Story = {
  render: function Render() {
    return <KeyValueList items={dados} columns={3} />;
  },
};

export const ListaEmLinhas: Story = {
  render: function Render() {
    return <KeyValueList items={dados.slice(0, 6)} layout="rows" />;
  },
};

/* ------------------------------- Composição ------------------------------- */

export const TelaDeDetalhe: Story = {
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    return (
      <div className="flex flex-col gap-6 bg-background-full p-4 sm:p-6">
        <DetailHeader
          breadcrumb={[{ label: 'Solicitações TFD', href: '#' }, { label: 'TFD-2026-004812' }]}
          title="Joana Pereira Alves"
          identifier="TFD-2026-004812"
          statusLabel="Agendada"
          statusColor="lime"
          onEdit={fn()}
          menu={<IconButton icon={RiMoreFill} aria-label="Mais ações" />}
        />
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <section aria-label="Dados da solicitação" className="rounded-3xl border border-border-button-default bg-background-primary-default p-5">
            <KeyValueList items={dados} columns={2} />
          </section>
          <section aria-label="Atividade" className="rounded-3xl border border-border-button-default bg-background-primary-default p-5">
            <Timeline events={eventos} />
          </section>
        </div>
      </div>
    );
  },
};

export const TelaDeDetalheMobile: Story = {
  ...TelaDeDetalhe,
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
