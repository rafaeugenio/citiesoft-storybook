import type { Meta, StoryObj } from "@storybook/react-vite";
import { RiPauseLine, RiPlayLine } from "@remixicon/react";
import { useArgs, useState } from "storybook/preview-api";

import { Button } from "@/components/base/buttons/button";
import {
  CitieCharacter,
  type CitieCharacterExpression,
} from "@/components/application/citie-character/citie-character";

const EXPRESSIONS: Array<{
  value: CitieCharacterExpression;
  label: string;
  use: string;
}> = [
  { value: "neutral", label: "Neutro", use: "Estado padrão e empty state" },
  { value: "attentive", label: "Atento", use: "Ajuda contextual e onboarding" },
  { value: "thinking", label: "Pensando", use: "Processamento curto" },
  { value: "success", label: "Sucesso", use: "Conclusão positiva" },
  { value: "warning", label: "Atenção", use: "Orientação recuperável" },
  { value: "error", label: "Incômodo", use: "Falha leve, nunca erro crítico" },
  { value: "sleeping", label: "Em espera", use: "Assistente indisponível ou pausado" },
];

const BLOBATAR_EXPRESSIONS: Array<{
  value: CitieCharacterExpression;
  label: string;
}> = [
  { value: "idle", label: "Neutro" },
  { value: "happy", label: "Feliz" },
  { value: "sad", label: "Triste" },
  { value: "mad", label: "Bravo" },
  { value: "surprised", label: "Surpreso" },
  { value: "wink", label: "Piscadela" },
  { value: "sleepy", label: "Sonolento" },
  { value: "smug", label: "Confiante" },
  { value: "unsure", label: "Incerto" },
  { value: "scared", label: "Assustado" },
  { value: "love", label: "Encantado" },
  { value: "shy", label: "Tímido" },
  { value: "sick", label: "Indisposto" },
  { value: "thinking", label: "Pensando" },
];

const ALL_EXPRESSIONS = [...EXPRESSIONS, ...BLOBATAR_EXPRESSIONS];

const meta = {
  title: "Marca/Personagem Citie",
  component: CitieCharacter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    expression: "neutral",
    motion: "hover",
    paused: false,
    followPointer: true,
    size: "xl",
    label: "Personagem Citie em estado neutro",
  },
  argTypes: {
    expression: {
      control: "select",
      options: ALL_EXPRESSIONS.map(({ value }) => value),
    },
    motion: {
      control: "inline-radio",
      options: ["none", "hover", "always"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof CitieCharacter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => (
    <div className="flex min-h-72 min-w-72 items-center justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-8">
      <CitieCharacter {...args} />
    </div>
  ),
};

export const Estados: Story = {
  args: {
    motion: "none",
    label: undefined,
    size: "lg",
  },
  render: (args) => (
    <div className="grid w-[min(56rem,90vw)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {EXPRESSIONS.map((item) => (
        <section
          key={item.value}
          className="flex min-h-52 flex-col items-center justify-between gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-5 text-center"
        >
          <CitieCharacter
            {...args}
            expression={item.value}
            label={`Personagem Citie: ${item.label}`}
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-body-medium text-text-primary">{item.label}</h3>
            <p className="text-caption-1-medium text-text-secondary">{item.use}</p>
          </div>
        </section>
      ))}
    </div>
  ),
};

export const ExpressoesBlobatar: Story = {
  args: {
    motion: "none",
    label: undefined,
    size: "lg",
  },
  render: (args) => (
    <div className="grid w-[min(64rem,92vw)] gap-4 sm:grid-cols-2 md:grid-cols-4">
      {BLOBATAR_EXPRESSIONS.map((item) => (
        <section
          key={item.value}
          className="flex min-h-40 flex-col items-center justify-between gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-5 text-center"
        >
          <CitieCharacter
            {...args}
            expression={item.value}
            label={`Personagem Citie: ${item.label}`}
          />
          <h3 className="text-body-medium text-text-primary">{item.label}</h3>
        </section>
      ))}
    </div>
  ),
};

export const PlanoDaFace: Story = {
  args: {
    motion: "none",
    expression: "idle",
    label: "Personagem Citie com guias do plano frontal",
    size: "xl",
  },
  render: (args) => (
    <div className="flex max-w-sm flex-col items-center gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-8 text-center">
      <div className="relative">
        <CitieCharacter {...args} />
        <svg
          aria-hidden="true"
          viewBox="0 0 128 88"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-text-secondary"
        >
          <ellipse cx="84" cy="38" rx="32" ry="23" fill="none" stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.6" />
          <circle cx="70" cy="38" r="1.3" fill="currentColor" />
          <circle cx="98" cy="38" r="1.3" fill="currentColor" />
        </svg>
      </div>
      <p className="text-caption-1-medium text-text-secondary">
        Olhos ancorados em (70, 38) e (98, 38). O centro óptico (84, 38) acompanha o plano frontal, deslocado para cima e à direita pela extrusão.
      </p>
    </div>
  ),
};

export const PlaygroundDeReacoes: Story = {
  args: {
    expression: "attentive",
    motion: "always",
    label: "Personagem Citie interativo",
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const followPointer = args.followPointer ?? true;
    const [expression, setExpression] = useState<CitieCharacterExpression>(
      args.expression ?? "attentive",
    );
    const [paused, setPaused] = useState(false);
    const [reactionSeed, setReactionSeed] = useState(0);

    return (
      <div className="flex w-[min(46rem,90vw)] flex-col items-center gap-6 rounded-3xl border border-border-button-default bg-background-primary-default p-8">
        <div className="flex min-h-52 items-center justify-center">
          <CitieCharacter
            key={reactionSeed}
            {...args}
            expression={expression}
            paused={paused}
            label={`Personagem Citie: ${ALL_EXPRESSIONS.find((item) => item.value === expression)?.label}`}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2" aria-label="Expressões do personagem">
          {EXPRESSIONS.map((item) => (
            <Button
              key={item.value}
              size="small"
              variant={expression === item.value ? "primary" : "secondary"}
              aria-pressed={expression === item.value}
              onClick={() => setExpression(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2" aria-label="Expressões de referência do Blobatar">
          {BLOBATAR_EXPRESSIONS.map((item) => (
            <Button
              key={item.value}
              size="small"
              variant={expression === item.value ? "primary" : "secondary"}
              aria-pressed={expression === item.value}
              onClick={() => setExpression(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="secondary"
            size="small"
            disabled={paused}
            onClick={() => setReactionSeed((current) => current + 1)}
          >
            Repetir reação
          </Button>
          <Button
            variant={followPointer ? "secondary" : "ghost"}
            size="small"
            aria-pressed={followPointer}
            onClick={() => updateArgs({ followPointer: !followPointer })}
          >
            {followPointer ? "Seguir mouse: ligado" : "Seguir mouse: desligado"}
          </Button>
          <Button
            variant="ghost"
            size="small"
            leadingIcon={paused ? RiPlayLine : RiPauseLine}
            aria-pressed={paused}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? "Retomar movimento" : "Pausar movimento"}
          </Button>
        </div>

        <p className="max-w-lg text-center text-caption-1-medium text-text-secondary">
          Escolha uma emoção para ver antecipação, exagero e acomodação. Você pode repetir
          a reação, ligar ou desligar o acompanhamento do mouse, ou pausar o movimento.
          Mova o cursor por qualquer ponto da tela, inclusive fora do personagem e sobre os
          controles: olhos e corpo acompanham em ritmos diferentes,
          com os olhos seguindo a inclinação do corpo e voltando à posição vertical no repouso.
          A preferência do sistema por movimento reduzido mantém a pose final sem animação.
        </p>
      </div>
    );
  },
};
