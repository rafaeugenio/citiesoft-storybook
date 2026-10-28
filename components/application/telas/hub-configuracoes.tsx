"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiComputerLine,
  RiLockPasswordLine,
  RiNotification3Line,
  RiSettings3Line,
  RiSmartphoneLine,
  RiUserLine,
} from "@remixicon/react";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { FormField, FormGrid } from "@/components/application/formulario/form-grid";
import { FormSection } from "@/components/application/formulario/form-section";
import { SettingsLayout } from "@/components/application/settings-layout/settings-layout";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Radio, RadioGroup } from "@/components/base/radio/radio";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import {
  CANAIS,
  EVENTOS_NOTIFICACAO,
  FORMATOS_DATA,
  FUSOS,
  IDIOMAS,
  NOTIFICACOES_INICIAIS,
  PERFIL_INICIAL,
  SESSOES_INICIAIS,
} from "./dados/hub-configuracoes";
import type { CanalNotificacao, PerfilUsuario, SessaoAtiva } from "./dados/hub-configuracoes";
import { MolduraGestao } from "./moldura-gestao";

export type CategoriaConfiguracao = "conta" | "sistema" | "seguranca" | "notificacoes";

/* A ordem das categorias fixas nunca muda entre sistemas Citiesoft. */
const GRUPOS = [
  {
    label: "Preferências",
    items: [
      { key: "conta", label: "Conta", icon: RiUserLine },
      { key: "sistema", label: "Sistema", icon: RiSettings3Line },
      { key: "seguranca", label: "Segurança", icon: RiLockPasswordLine },
      { key: "notificacoes", label: "Notificações", icon: RiNotification3Line },
    ],
  },
];

/** Cartão temático com salvamento próprio: cada seção salva de forma independente. */
function CartaoConfig({
  titulo,
  descricao,
  mensagem,
  acao,
  children,
}: {
  titulo: string;
  descricao?: string;
  mensagem?: string | null;
  acao?: ReactNode;
  children: ReactNode;
}) {
  return (
    <FormSection title={titulo} description={descricao}>
      {children}
      {acao || mensagem ? (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <p role="status" className="text-body-regular text-text-secondary">
            {mensagem}
          </p>
          {acao}
        </div>
      ) : null}
    </FormSection>
  );
}

function CampoSelecao({
  rotulo,
  valor,
  opcoes,
  onChange,
}: {
  rotulo: string;
  valor: string;
  opcoes: string[];
  onChange: (valor: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-body-medium text-text-primary">{rotulo}</span>
      <Select
        aria-label={rotulo}
        selectedKey={valor}
        onSelectionChange={(k) => k !== null && onChange(String(k))}
        className="w-full"
      >
        {opcoes.map((o) => (
          <SelectItem key={o} id={o} textValue={o}>
            {o}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

/* ---------------------------------------------------------------- Conta */

function PerfilCartao() {
  const [perfil, setPerfil] = useState<PerfilUsuario>(PERFIL_INICIAL);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  return (
    <CartaoConfig
      titulo="Perfil"
      descricao="Identificação exibida para outros usuários e nos registros de atendimento."
      mensagem={mensagem}
      acao={
        <Button
          onClick={() => {
            if (!perfil.nome.trim()) {
              setErro("Informe o nome completo.");
              setMensagem(null);
              return;
            }
            setErro(null);
            setMensagem("Perfil salvo.");
          }}
        >
          Salvar perfil
        </Button>
      }
    >
      <div className="flex items-center gap-4">
        <Avatar size="lg" color="blue" initials="MA" alt="" />
        <div className="flex min-w-0 flex-col">
          <span className="text-body-medium text-text-primary">{perfil.nome || "Sem nome"}</span>
          <span className="truncate text-body-2-regular text-text-secondary">{perfil.email}</span>
        </div>
        <Button variant="secondary" size="small" className="ms-auto">
          Alterar foto
        </Button>
      </div>
      <FormGrid columns={2}>
        <FormField span="full">
          <Input
            label="Nome completo"
            value={perfil.nome}
            onChange={(nome) => setPerfil((p) => ({ ...p, nome }))}
            isRequired
            isInvalid={Boolean(erro)}
            hint={erro ?? undefined}
          />
        </FormField>
        <FormField span="full">
          <Input
            label="E-mail institucional"
            type="email"
            value={perfil.email}
            isReadOnly
            hint="Alterado somente pelo administrador do sistema."
            inputDir="ltr"
          />
        </FormField>
        <Input label="Cargo" value={perfil.cargo} onChange={(cargo) => setPerfil((p) => ({ ...p, cargo }))} />
        <Input
          label="Telefone"
          type="tel"
          value={perfil.telefone}
          onChange={(telefone) => setPerfil((p) => ({ ...p, telefone }))}
        />
      </FormGrid>
    </CartaoConfig>
  );
}

/* -------------------------------------------------------------- Sistema */

type Tema = "claro" | "escuro";

/**
 * Aplica o tema pela classe `dark` no documento. Dentro do Storybook o tema
 * também vive num contêiner `.light` ou `.dark`, atualizado junto.
 */
function aplicarTema(tema: Tema, referencia: Element | null) {
  const escuro = tema === "escuro";
  document.documentElement.classList.toggle("dark", escuro);
  const escopo = referencia?.closest(".light, .dark");
  if (escopo && escopo !== document.documentElement) {
    escopo.classList.toggle("dark", escuro);
    escopo.classList.toggle("light", !escuro);
  }
}

function temaAtual(referencia: Element | null): Tema {
  const escopo = referencia?.closest(".light, .dark");
  if (escopo && escopo !== document.documentElement) return escopo.classList.contains("dark") ? "escuro" : "claro";
  return document.documentElement.classList.contains("dark") ? "escuro" : "claro";
}

function AparenciaCartao() {
  const ref = useRef<HTMLDivElement>(null);
  const original = useRef<Tema>("claro");
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    const inicial = temaAtual(ref.current);
    original.current = inicial;
    setTema(inicial);
    const elemento = ref.current;
    // Esta demonstração devolve o tema original ao sair da tela. Em um sistema real a escolha fica salva no perfil.
    return () => aplicarTema(original.current, elemento);
  }, []);

  return (
    <div ref={ref}>
      <CartaoConfig
        titulo="Aparência"
        descricao="Escolha o tema da interface. A mudança vale na hora e não precisa de salvamento."
      >
        <RadioGroup
          aria-label="Tema da interface"
          value={tema}
          onChange={(valor) => {
            const proximo = valor as Tema;
            setTema(proximo);
            aplicarTema(proximo, ref.current);
          }}
          className="gap-3 sm:flex-row"
        >
          {(
            [
              ["claro", "Claro", "Fundo branco, indicado para ambientes bem iluminados."],
              ["escuro", "Escuro", "Fundo escuro, reduz o brilho em ambientes de pouca luz."],
            ] as const
          ).map(([valor, rotulo, texto]) => (
            <Radio
              key={valor}
              value={valor}
              className="flex-1 items-start gap-3 rounded-2xl border border-border-button-default p-4 data-[selected]:border-border-button-active"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-body-medium text-text-primary">{rotulo}</span>
                <span className="text-body-2-regular text-text-secondary">{texto}</span>
              </span>
            </Radio>
          ))}
        </RadioGroup>
      </CartaoConfig>
    </div>
  );
}

function IdiomaCartao() {
  const [idioma, setIdioma] = useState(IDIOMAS[0]);
  const [fuso, setFuso] = useState(FUSOS[0]);
  const [data, setData] = useState(FORMATOS_DATA[0]);
  const [mensagem, setMensagem] = useState<string | null>(null);

  return (
    <CartaoConfig
      titulo="Idioma e formato"
      descricao="Define como datas e horários aparecem nas telas e nos relatórios."
      mensagem={mensagem}
      acao={<Button onClick={() => setMensagem("Preferências salvas.")}>Salvar preferências</Button>}
    >
      <FormGrid columns={2}>
        <CampoSelecao rotulo="Idioma" valor={idioma} opcoes={IDIOMAS} onChange={setIdioma} />
        <CampoSelecao rotulo="Fuso horário" valor={fuso} opcoes={FUSOS} onChange={setFuso} />
        <FormField span="full">
          <CampoSelecao rotulo="Formato de data" valor={data} opcoes={FORMATOS_DATA} onChange={setData} />
        </FormField>
      </FormGrid>
    </CartaoConfig>
  );
}

/* ------------------------------------------------------------ Segurança */

function SenhaCartao() {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);

  const alterar = () => {
    const encontrados: Record<string, string> = {};
    if (!atual) encontrados.atual = "Informe a senha atual.";
    if (nova.length < 8 || !/\d/.test(nova)) encontrados.nova = "Use ao menos 8 caracteres, incluindo um número.";
    if (confirmar !== nova) encontrados.confirmar = "As senhas não coincidem.";
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setMensagem(null);
      return;
    }
    setAtual("");
    setNova("");
    setConfirmar("");
    setMensagem("Senha alterada.");
  };

  return (
    <CartaoConfig
      titulo="Senha"
      descricao="Troque a senha periodicamente e evite repetir senhas de outros serviços."
      mensagem={mensagem}
      acao={<Button onClick={alterar}>Alterar senha</Button>}
    >
      <FormGrid columns={1}>
        <Input
          label="Senha atual"
          type="password"
          value={atual}
          onChange={setAtual}
          isInvalid={Boolean(erros.atual)}
          hint={erros.atual}
          autoComplete="current-password"
        />
        <Input
          label="Nova senha"
          type="password"
          value={nova}
          onChange={setNova}
          isInvalid={Boolean(erros.nova)}
          hint={erros.nova ?? "Mínimo de 8 caracteres, com ao menos um número."}
          autoComplete="new-password"
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirmar}
          onChange={setConfirmar}
          isInvalid={Boolean(erros.confirmar)}
          hint={erros.confirmar}
          autoComplete="new-password"
        />
      </FormGrid>
    </CartaoConfig>
  );
}

function DuasEtapasCartao() {
  const [ativo, setAtivo] = useState(true);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <>
      <CartaoConfig
        titulo="Verificação em duas etapas"
        descricao="Pede um código do aplicativo autenticador além da senha ao entrar."
      >
        <Switch
          isSelected={ativo}
          onChange={(on) => (on ? setAtivo(true) : setConfirmando(true))}
          aria-label="Verificação em duas etapas"
        >
          {ativo ? "Ativada" : "Desativada"}
        </Switch>
      </CartaoConfig>
      <ConfirmDialog
        isOpen={confirmando}
        onOpenChange={setConfirmando}
        tone="danger"
        title="Desativar a verificação em duas etapas?"
        description="A conta passa a depender só da senha, o que reduz a proteção do acesso aos dados dos pacientes."
        confirmLabel="Desativar"
        cancelLabel="Manter ativada"
        onConfirm={() => {
          setAtivo(false);
          setConfirmando(false);
        }}
      />
    </>
  );
}

type AlvoEncerrar = { tipo: "uma"; id: string } | { tipo: "todas" } | null;

function SessoesCartao({ confirmarInicial }: { confirmarInicial: boolean }) {
  const [sessoes, setSessoes] = useState<SessaoAtiva[]>(SESSOES_INICIAIS);
  const [alvo, setAlvo] = useState<AlvoEncerrar>(confirmarInicial ? { tipo: "uma", id: "s2" } : null);
  const [ultimo, setUltimo] = useState<AlvoEncerrar>(confirmarInicial ? { tipo: "uma", id: "s2" } : null);
  const outras = sessoes.filter((s) => !s.atual);

  const pedir = (proximo: NonNullable<AlvoEncerrar>) => {
    setUltimo(proximo);
    setAlvo(proximo);
  };

  const quantidade = ultimo?.tipo === "todas" ? outras.length : 1;
  const sessaoAlvo = ultimo?.tipo === "uma" ? sessoes.find((s) => s.id === ultimo.id) : undefined;

  return (
    <>
      <CartaoConfig
        titulo="Sessões ativas"
        descricao="Dispositivos com acesso à conta neste momento."
        acao={
          outras.length > 0 ? (
            <Button variant="secondary" onClick={() => pedir({ tipo: "todas" })}>
              Encerrar todas as demais
            </Button>
          ) : undefined
        }
      >
        <ul className="flex flex-col divide-y divide-separator-border rounded-2xl border border-border-table">
          {sessoes.map((sessao) => {
            const Icone = sessao.dispositivo.includes("iPhone") ? RiSmartphoneLine : RiComputerLine;
            return (
              <li key={sessao.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background-tertiary-default text-foreground-icon-secondary">
                  <Icone className="size-5" aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2 text-body-medium text-text-primary">
                    {sessao.dispositivo}
                    {sessao.atual ? (
                      <Chip variant="caption" color="lime">
                        Sessão atual
                      </Chip>
                    ) : null}
                  </span>
                  <span className="text-body-2-regular text-text-secondary">
                    {sessao.local}, última atividade: {sessao.ultimaAtividade}
                  </span>
                </div>
                {sessao.atual ? null : (
                  <Button
                    variant="secondary"
                    size="small"
                    aria-label={`Encerrar sessão em ${sessao.dispositivo}`}
                    onClick={() => pedir({ tipo: "uma", id: sessao.id })}
                  >
                    Encerrar
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </CartaoConfig>
      <ConfirmDialog
        isOpen={alvo !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setAlvo(null);
        }}
        tone="danger"
        verb="Encerrar"
        affectedCount={quantidade}
        entitySingular="sessão"
        entityPlural="sessões"
        description={
          sessaoAlvo
            ? `${sessaoAlvo.dispositivo} perde o acesso à conta e exige novo login.`
            : "Todos os outros dispositivos perdem o acesso à conta e exigem novo login."
        }
        confirmLabel={quantidade === 1 ? "Encerrar sessão" : `Encerrar ${quantidade} sessões`}
        cancelLabel="Voltar"
        onConfirm={() => {
          setSessoes((atual) =>
            ultimo?.tipo === "todas" ? atual.filter((s) => s.atual) : atual.filter((s) => s.id !== ultimo?.id),
          );
          setAlvo(null);
        }}
      />
    </>
  );
}

/* ---------------------------------------------------------- Notificações */

function NotificacoesCartao() {
  const [marcados, setMarcados] = useState<Record<string, CanalNotificacao[]>>(NOTIFICACOES_INICIAIS);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const alternar = (evento: string, canal: CanalNotificacao, on: boolean) => {
    setMensagem(null);
    setMarcados((atual) => {
      const lista = atual[evento] ?? [];
      return { ...atual, [evento]: on ? [...lista, canal] : lista.filter((c) => c !== canal) };
    });
  };

  return (
    <CartaoConfig
      titulo="Avisos por canal"
      descricao="Escolha por onde receber o aviso de cada evento."
      mensagem={mensagem}
      acao={<Button onClick={() => setMensagem("Preferências de notificação salvas.")}>Salvar avisos</Button>}
    >
      <div
        role="region"
        aria-label="Avisos por evento e canal"
        tabIndex={0}
        className="overflow-x-auto rounded-2xl border border-border-table outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <table className="w-full min-w-[520px] border-collapse text-start">
          <thead>
            <tr className="bg-background-secondary-default">
              <th scope="col" className="px-4 py-2.5 text-start text-body-2-medium text-text-secondary">
                Evento
              </th>
              {CANAIS.map((canal) => (
                <th key={canal.id} scope="col" className="px-4 py-2.5 text-center text-body-2-medium text-text-secondary">
                  {canal.rotulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-separator-border">
            {EVENTOS_NOTIFICACAO.map((evento) => (
              <tr key={evento.id}>
                <th scope="row" className="px-4 py-3 text-start font-normal">
                  <span className="block text-body-medium text-text-primary">{evento.rotulo}</span>
                  <span className="block text-body-2-regular text-text-secondary">{evento.descricao}</span>
                </th>
                {CANAIS.map((canal) => (
                  <td key={canal.id} className="px-4 py-3 text-center">
                    <Checkbox
                      aria-label={`${evento.rotulo} por ${canal.rotulo}`}
                      isSelected={(marcados[evento.id] ?? []).includes(canal.id)}
                      onChange={(on) => alternar(evento.id, canal.id, on)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CartaoConfig>
  );
}

/* ----------------------------------------------------------------- Tela */

export interface HubConfiguracoesTelaProps {
  contained?: boolean;
  /** Categoria exibida ao montar. */
  categoriaInicial?: CategoriaConfiguracao;
  /** Abre a confirmação de encerramento de sessão (categoria Segurança). */
  confirmarSessaoInicial?: boolean;
}

/** Hub de configurações: conta, sistema, segurança e notificações, cada seção com salvamento próprio. */
export function HubConfiguracoesTela({
  contained = false,
  categoriaInicial = "conta",
  confirmarSessaoInicial = false,
}: HubConfiguracoesTelaProps) {
  const [categoria, setCategoria] = useState<string>(categoriaInicial);

  return (
    <MolduraGestao
      selecionado="configuracoes"
      trilha={[{ label: "Sistema" }, { label: "Configurações" }]}
      contained={contained}
    >
      <SettingsLayout
        title="Configurações"
        description="Preferências da conta, do sistema e da segurança do acesso."
        groups={GRUPOS}
        selected={categoria}
        onSelect={setCategoria}
        navLabel="Categorias de configurações"
        selectLabel="Categoria de configurações"
        className="p-0 sm:p-2"
      >
        {categoria === "conta" ? <PerfilCartao /> : null}
        {categoria === "sistema" ? (
          <>
            <AparenciaCartao />
            <IdiomaCartao />
          </>
        ) : null}
        {categoria === "seguranca" ? (
          <>
            <SenhaCartao />
            <DuasEtapasCartao />
            <SessoesCartao confirmarInicial={confirmarSessaoInicial} />
          </>
        ) : null}
        {categoria === "notificacoes" ? <NotificacoesCartao /> : null}
      </SettingsLayout>
    </MolduraGestao>
  );
}
