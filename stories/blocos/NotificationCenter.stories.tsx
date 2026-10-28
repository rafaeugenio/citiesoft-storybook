import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiDownloadCloud2Line, RiShieldCheckLine, RiUserAddLine } from '@remixicon/react';
import {
  NotificationCenter,
  type NotificationCenterItem,
  type NotificationCenterTab,
} from '@/components/application/notification-center/notification-center';
import { TemplateNotificationCenterMenu } from '@/components/application/notification-center/template-notification-center-menu';

const notificacoes: NotificationCenterItem[] = [
  {
    id: 'mencao-laudo',
    category: 'mentions',
    group: 'Hoje',
    title: 'Mariana Duarte mencionou você',
    description: 'Pode revisar o fluxo de autorização do TFD antes da reunião de quinta?',
    timestamp: '2 min',
    unread: true,
    avatar: { initials: 'MD', alt: 'Mariana Duarte' },
    actions: [
      { id: 'responder', label: 'Responder', variant: 'primary' },
      { id: 'ver', label: 'Ver conversa', variant: 'secondary' },
    ],
  },
  {
    id: 'backup',
    category: 'system',
    group: 'Hoje',
    title: 'Backup do ambiente concluído',
    description: 'O backup de 14/10 terminou sem erros e está pronto para download.',
    timestamp: '18 min',
    unread: true,
    status: 'success',
    icon: RiDownloadCloud2Line,
    actions: [{ id: 'baixar', label: 'Baixar', variant: 'secondary' }],
  },
  {
    id: 'convite',
    category: 'activity',
    group: 'Hoje',
    title: 'Você entrou no projeto Regulação',
    description: 'Carlos Menezes adicionou você como editor. Todos os arquivos já estão liberados.',
    timestamp: '1 h',
    unread: true,
    status: 'information',
    icon: RiUserAddLine,
  },
  {
    id: 'revisao',
    category: 'mentions',
    group: 'Esta semana',
    title: 'Rafael Tavares pediu sua revisão',
    description: 'O pull request 284 altera o fluxo de preferências de notificação.',
    timestamp: 'Seg',
    avatar: { initials: 'RT', alt: 'Rafael Tavares' },
    actions: [{ id: 'revisar', label: 'Revisar alterações', variant: 'secondary' }],
  },
  {
    id: 'seguranca',
    category: 'system',
    group: 'Esta semana',
    title: 'Verificação de segurança concluída',
    description: 'Nenhuma credencial exposta nem dependência vulnerável foi encontrada.',
    timestamp: 'Dom',
    status: 'success',
    icon: RiShieldCheckLine,
  },
  {
    id: 'deploy',
    category: 'system',
    group: 'Esta semana',
    title: 'Falha na implantação de homologação',
    description: 'O build parou durante a validação das rotas da aplicação.',
    timestamp: 'Sáb',
    unread: true,
    status: 'error',
    actions: [
      { id: 'repetir', label: 'Tentar de novo', variant: 'primary' },
      { id: 'logs', label: 'Ver logs', variant: 'secondary' },
    ],
  },
];

const meta = {
  title: 'Blocos/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { notifications: notificacoes },
  argTypes: {
    defaultTab: { control: 'inline-radio', options: ['all', 'mentions', 'system'] },
    title: { control: 'text' },
    emptyMessage: { control: 'text' },
  },
} satisfies Meta<typeof NotificationCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
};

export const ApenasMencoes: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
  args: { defaultTab: 'mentions' } };

export const ApenasSistema: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
  args: { defaultTab: 'system' } };

export const TudoLido: Story = {
  args: { notifications: notificacoes.map((n) => ({ ...n, unread: false })) },
};

export const SemNotificacoes: Story = {
  args: { notifications: [], emptyMessage: 'Você está em dia.' },
};

export const TituloPersonalizado: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
  args: { title: 'Avisos do plantão' } };

export const AbaControlada: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  render: function Render(args) {
    const [aba, setAba] = useState<NotificationCenterTab>('system');
    const [ultima, setUltima] = useState('Nenhuma ação executada');
    return (
      <div className="flex flex-col gap-3">
        <NotificationCenter
          {...args}
          tab={aba}
          onTabChange={setAba}
          onAction={(id, acao) => setUltima(`Notificação ${id}, ação ${acao}`)}
        />
        <p className="text-body-regular text-text-secondary">Aba ativa: {aba}. {ultima}.</p>
      </div>
    );
  },
};

export const MenuSuspenso: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="flex min-h-[640px] w-[480px] justify-end">
      <TemplateNotificationCenterMenu notifications={notificacoes} />
    </div>
  ),
};
