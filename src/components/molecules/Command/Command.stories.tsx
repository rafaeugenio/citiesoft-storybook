import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { Command, type GrupoDoCommand } from './Command';
import { Dialog } from '../../organisms/Overlay/Overlay';
import { Kbd } from '../../atoms/Kbd/Kbd';

function IconeProcesso() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7z" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinejoin="round" />
    </svg>
  );
}
function IconeServidor() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" strokeLinecap="round" />
    </svg>
  );
}
function IconeConfiguracao() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.7a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.3a7 7 0 0 0-2 1.2l-2.4-.7-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.7a7 7 0 0 0 2 1.2L10 21h4l.5-2.3a7 7 0 0 0 2-1.2l2.4.7 2-3.4-2-1.6c.067-.4.1-.8.1-1.2Z" strokeLinejoin="round" />
    </svg>
  );
}

const GRUPOS: GrupoDoCommand[] = [
  {
    rotulo: 'Processos',
    itens: [
      { valor: 'novo-processo', rotulo: 'Abrir novo processo', icone: <IconeProcesso /> },
      { valor: 'buscar-processo', rotulo: 'Buscar processo por número', icone: <IconeProcesso />, atalho: ['⌘', 'F'] },
    ],
  },
  {
    rotulo: 'Servidores',
    itens: [
      { valor: 'cadastro-servidor', rotulo: 'Cadastrar servidor', icone: <IconeServidor /> },
      { valor: 'folha-ponto', rotulo: 'Consultar folha de ponto', icone: <IconeServidor /> },
    ],
  },
  {
    rotulo: 'Sistema',
    itens: [
      { valor: 'preferencias', rotulo: 'Preferências', icone: <IconeConfiguracao />, atalho: ['⌘', ','] },
      { valor: 'sair', rotulo: 'Sair', icone: <IconeConfiguracao />, desabilitado: true },
    ],
  },
];

const meta = {
  title: 'Moléculas/Busca/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Command. Paleta de comandos do kit: campo de busca com `role="combobox"` e lista `role="listbox"` sempre visível, filtrada em tempo real. Equivalente PrimeNG: sem par direto; mais próximo é `p-autocomplete` operado por teclado.',
          '',
          '**Quando usar:** ação rápida disparada por atalho global (`Ctrl+K`), busca de comando ou navegação entre telas num sistema com muitas rotas.',
          '**Quando não usar:** seleção de valor de formulário, onde `Moléculas/Campos/Select` ou `AutoComplete` já resolvem a tarefa com o contrato de campo (rótulo, erro, obrigatório).',
        ].join('\n'),
      },
    },
  },
  args: {
    rotulo: 'Paleta de comandos',
    grupos: GRUPOS,
    onSelect: fn(),
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Anatomia · padrão',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Paleta de comandos' });
    await expect(campo).toBeVisible();

    const opcoes = canvas.getAllByRole('option');
    await expect(opcoes.length).toBe(6);

    const busca = canvasElement.querySelector('.citie-command__busca') as HTMLElement;
    const alturaEsperada = getComputedStyle(document.documentElement)
      .getPropertyValue('--citie-control-height-normal')
      .trim();
    await expect(getComputedStyle(busca).height).toBe(alturaEsperada);

    const item = canvasElement.querySelector('.citie-command__item') as HTMLElement;
    const alturaItemEsperada = getComputedStyle(document.documentElement)
      .getPropertyValue('--citie-control-height-small')
      .trim();
    await expect(getComputedStyle(item).height).toBe(alturaItemEsperada);
  },
};

export const Filtragem: Story = {
  name: 'Interação · filtrar em tempo real',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Paleta de comandos' });

    await userEvent.type(campo, 'processo');
    const opcoes = canvas.getAllByRole('option');
    await expect(opcoes.length).toBe(2);
    await expect(canvas.getByText('Abrir novo processo')).toBeVisible();

    await userEvent.click(canvas.getByText('Abrir novo processo'));
    await expect(args.onSelect).toHaveBeenCalledWith('novo-processo');
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'Interação · navegação por teclado',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Paleta de comandos' });
    campo.focus();

    const primeiraOpcao = canvas.getAllByRole('option')[0];
    await expect(campo).toHaveAttribute('aria-activedescendant', primeiraOpcao.id);

    await userEvent.keyboard('{ArrowDown}');
    const segundaOpcao = canvas.getAllByRole('option')[1];
    await expect(campo).toHaveAttribute('aria-activedescendant', segundaOpcao.id);
    await expect(segundaOpcao).toHaveClass('citie-command__item--ativo');

    // End vai para o último item habilitado ("Sair" está desabilitado e fica
    // de fora), Home volta para o primeiro.
    await userEvent.keyboard('{End}');
    const opcoes = canvas.getAllByRole('option');
    const ultimaHabilitada = opcoes[opcoes.length - 2];
    await expect(campo).toHaveAttribute('aria-activedescendant', ultimaHabilitada.id);

    await userEvent.keyboard('{Home}');
    const primeiraOpcaoDeNovo = opcoes[0];
    await expect(campo).toHaveAttribute('aria-activedescendant', primeiraOpcaoDeNovo.id);

    await userEvent.keyboard('{Enter}');
    await expect(args.onSelect).toHaveBeenCalledWith('novo-processo');
  },
};

export const SemResultado: Story = {
  name: 'Estado · sem resultado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Paleta de comandos' });
    await userEvent.type(campo, 'xyz-inexistente');
    await expect(canvas.getByRole('heading', { name: 'Nenhum resultado' })).toBeVisible();
    await expect(canvas.queryAllByRole('option').length).toBe(0);
  },
};

export const ItemDesabilitado: Story = {
  name: 'Estado · item desabilitado',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Paleta de comandos' });
    await userEvent.type(campo, 'sair');

    const opcao = canvas.getByRole('option', { name: /Sair/ });
    await expect(opcao).toHaveAttribute('aria-disabled', 'true');
    // `pointer-events: none` no CSS já barra o clique real; `fireEvent`
    // dispara o clique de qualquer forma para provar a guarda em JavaScript.
    await expect(getComputedStyle(opcao).pointerEvents).toBe('none');

    fireEvent.click(opcao);
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};

function PaletaModal() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === 'k') {
        evento.preventDefault();
        setAberto(true);
      }
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);

  return (
    <div>
      <p>
        Pressione <Kbd teclas={['⌘', 'K']} /> ou{' '}
        <button type="button" onClick={() => setAberto(true)}>
          abra pelo botão
        </button>{' '}
        para testar em navegador sem atalho de sistema.
      </p>
      <Dialog aberto={aberto} titulo="Paleta de comandos" onClose={() => setAberto(false)}>
        <Command
          rotulo="Paleta de comandos"
          grupos={GRUPOS}
          onSelect={() => setAberto(false)}
          onClose={() => setAberto(false)}
        />
      </Dialog>
    </div>
  );
}

export const DentroDeDialog: Story = {
  name: 'Composição · paleta modal (Ctrl+K)',
  render: () => <PaletaModal />,
  parameters: {
    docs: {
      description: {
        story:
          'A paleta vive dentro do `Dialog` do Overlay (Lote 3): `useDialogModal` entrega fechamento por Escape e prisão de foco manual (Tab não escapa do conteúdo do diálogo), e o `onClose` do Command reforça o mesmo fechamento quando o foco está no campo de busca.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'abra pelo botão' });
    await userEvent.click(gatilho);

    await waitFor(async () => {
      await expect(canvas.getByRole('combobox', { name: 'Paleta de comandos' })).toBeVisible();
    });
  },
};
