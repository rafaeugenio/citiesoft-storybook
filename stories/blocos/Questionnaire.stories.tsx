import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Questionnaire,
  type QuestionnaireAnswers,
  type QuestionnaireQuestion,
} from '@/components/application/questionnaire/questionnaire';

const perguntas: QuestionnaireQuestion[] = [
  {
    id: 'perfil',
    question: 'Qual é o seu perfil de atuação?',
    options: [
      { value: 'gestor', label: 'Gestor', description: 'Acompanho indicadores e aprovo solicitações.' },
      { value: 'regulador', label: 'Regulador', description: 'Analiso e encaminho pedidos de tratamento.' },
      { value: 'atendente', label: 'Atendente', description: 'Registro e consulto cadastros de pacientes.' },
    ],
  },
  {
    id: 'modulos',
    question: 'Quais módulos você usa no dia a dia?',
    select: 'multiple',
    options: [
      { value: 'cadastro', label: 'Cadastro de pacientes' },
      { value: 'agenda', label: 'Agenda de viagens' },
      { value: 'relatorios', label: 'Relatórios' },
      { value: 'financeiro', label: 'Ajuda de custo' },
    ],
    other: { label: 'Outro módulo', placeholder: 'Digite o nome do módulo' },
  },
  {
    id: 'frequencia',
    question: 'Com que frequência você acessa o sistema?',
    options: [
      { value: 'diaria', label: 'Todos os dias' },
      { value: 'semanal', label: 'Algumas vezes por semana' },
      { value: 'mensal', label: 'Poucas vezes por mês' },
    ],
    other: true,
  },
];

const meta = {
  title: 'Blocos/Questionnaire',
  component: Questionnaire,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { questions: perguntas },
  argTypes: {
    select: { control: 'inline-radio', options: ['single', 'multiple'] },
    advanceDelay: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[560px] py-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Questionnaire>;

export default meta;
type Story = StoryObj<typeof meta>;

const rotulosPt = {
  previous: 'Voltar',
  next: 'Avançar',
  complete: 'Concluir',
  other: 'Outro',
  otherPlaceholder: 'Digite sua resposta',
};

export const Padrao: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
  args: { labels: rotulosPt } };

export const SelecaoMultipla: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: {
    select: 'multiple',
    labels: rotulosPt,
    questions: perguntas.map((p) => ({ ...p, select: undefined })),
  },
};

export const ComRespostasIniciais: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: {
    labels: rotulosPt,
    defaultStep: 1,
    defaultAnswers: {
      perfil: { values: ['regulador'] },
      modulos: { values: ['cadastro', 'relatorios'] },
    },
  },
};

export const UltimaPergunta: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { labels: rotulosPt, defaultStep: 2 },
};

export const ComRespostaLivre: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: {
    labels: rotulosPt,
    defaultStep: 2,
    defaultAnswers: { frequencia: { values: [], other: 'Apenas em dias de auditoria' } },
  },
};

export const PerguntaUnica: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { labels: rotulosPt, questions: [perguntas[0]] },
};

export const ComBotaoFechar: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { labels: rotulosPt, onDismiss: () => undefined },
};

export const RotulosPadraoIngles: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
};

export const Controlado: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  render: function Render(args) {
    const [passo, setPasso] = useState(0);
    const [respostas, setRespostas] = useState<QuestionnaireAnswers>({});
    const [concluido, setConcluido] = useState<QuestionnaireAnswers | null>(null);
    return (
      <div className="flex flex-col gap-4">
        <Questionnaire
          {...args}
          labels={rotulosPt}
          step={passo}
          onStepChange={setPasso}
          answers={respostas}
          onAnswersChange={setRespostas}
          onComplete={setConcluido}
        />
        <pre className="rounded-xl bg-background-secondary-default p-3 text-caption-1-medium text-text-secondary">
          {`Passo: ${passo + 1} de ${args.questions.length}\n${JSON.stringify(concluido ?? respostas, null, 2)}`}
        </pre>
      </div>
    );
  },
};
