import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AvatarGroup } from './AvatarGroup';

const meta = {
  title: 'Moléculas/Identidade/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Empilha Avatares para resumir **quem são os vários responsáveis** de um mesmo registro:',
          'co-responsáveis de processo, membros de equipe, aprovadores de uma etapa.',
          'Spec: `03-components/avatar.md` v2.0.0. Biblioteca Figma: `07-figma-library/avatar.md`.',
          'Equivalente PrimeNG: `p-avatarGroup`.',
          '',
          'Regra do grupo: até 4 avatares empilhados com sobreposição parcial; o excedente vira um',
          'contador "+N" clicável que abre a lista completa. Todos os avatares do grupo compartilham',
          'o mesmo tamanho.',
          '',
          'Badge de status não deve ser usado em grupo com mais de 3 itens: a sobreposição cobre o',
          'canto inferior direito do avatar e torna o badge ilegível. Quando os status importarem,',
          'mostre a lista completa em vez do grupo empilhado.',
          '',
          '**Quando usar este e não o Avatar:** o grupo é a resposta para "quem responde por isto",',
          'no plural, com limite e excedente resolvidos. Para um único ator — autor de um comentário,',
          'responsável de uma linha, usuário logado no cabeçalho — use `Átomos/Identidade/Avatar`.',
        ].join('\n'),
      },
    },
  },
  args: {
    pessoas: [{ nome: 'Maria de Fátima Souza' }, { nome: 'João Silva' }],
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grupo: Story = {
  name: 'AvatarGroup · com excedente',
  render: () => (
    <AvatarGroup
      size="large"
      pessoas={[
        { nome: 'Maria de Fátima Souza' },
        { nome: 'João Silva' },
        { nome: 'Carlos Andrade' },
        { nome: 'Ana Beatriz Lima' },
        { nome: 'Pedro Henrique Costa' },
        { nome: 'Luiza Martins' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'e mais 2 responsáveis' })).toBeVisible();
  },
};
