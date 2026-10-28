"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RiCheckboxCircleLine, RiFileTextLine } from "@remixicon/react";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { KeyValueList } from "@/components/application/detalhe/key-value-list";
import { FormActions } from "@/components/application/formulario/form-actions";
import { FormField, FormGrid } from "@/components/application/formulario/form-grid";
import { PageHeader } from "@/components/application/page-header/page-header";
import { Stepper, type StepperStep } from "@/components/application/stepper/stepper";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { LinkButton } from "@/components/base/buttons/link-button";
import { formatFileSize } from "@/components/base/file-upload/file-upload";
import { Input } from "@/components/base/input/input";
import { Radio, RadioGroup } from "@/components/base/radio/radio";
import { Switch } from "@/components/base/switch/switch";
import { Textarea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import { AvisoFormulario, SelectField } from "./campos";
import { ESPECIALIDADES, MUNICIPIOS, TIPOS_TRANSPORTE, UNIDADES_DESTINO } from "./dados/comum";
import {
  DOCUMENTOS_EXEMPLO,
  PROTOCOLO_EXEMPLO,
  SOLICITACAO_PREENCHIDA,
  SOLICITACAO_VAZIA,
  TIPOS_DOCUMENTO,
  type DocumentoAnexado,
  type ValoresSolicitacao,
} from "./dados/wizard-solicitacao";
import { MolduraSistema } from "./moldura-sistema";
import { UploadPt } from "./upload-pt";
import { cnsValido, cpfValido, HOJE_EXEMPLO, lerData, maskCns, maskCpf, maskData, maskTelefone } from "./validacao";

type Chave = keyof ValoresSolicitacao | "documentos" | "confirmacao";
type Erros = Partial<Record<Chave, string>>;

const ETAPAS = [
  { key: "paciente", label: "Paciente" },
  { key: "atendimento", label: "Atendimento" },
  { key: "trajeto", label: "Trajeto" },
  { key: "documentos", label: "Documentos" },
  { key: "revisao", label: "Revisão" },
] as const;

function dataFutura(texto: string, rotulo: string): string | undefined {
  if (texto === "") return `Informe ${rotulo}.`;
  const d = lerData(texto);
  if (!d) return "Data inválida. Use dd/mm/aaaa.";
  if (d < HOJE_EXEMPLO) return "A data não pode ser anterior a hoje.";
  return undefined;
}

/** Valida os campos de uma etapa. */
function validarEtapa(etapa: number, v: ValoresSolicitacao, docs: DocumentoAnexado[], confirmou: boolean): Erros {
  const e: Erros = {};
  if (etapa === 0) {
    if (v.nome.trim() === "") e.nome = "Informe o nome completo.";
    else if (v.nome.trim().split(/\s+/).length < 2) e.nome = "Informe nome e sobrenome.";
    if (v.cpf === "") e.cpf = "Informe o CPF.";
    else if (!cpfValido(v.cpf)) e.cpf = "CPF inválido. Confira os dígitos.";
    if (v.cns === "") e.cns = "Informe o cartão SUS.";
    else if (!cnsValido(v.cns)) e.cns = "Cartão SUS inválido. Confira os 15 dígitos.";
    if (v.nascimento === "") e.nascimento = "Informe a data de nascimento.";
    else {
      const d = lerData(v.nascimento);
      if (!d) e.nascimento = "Data inválida. Use dd/mm/aaaa.";
      else if (d > HOJE_EXEMPLO) e.nascimento = "A data não pode ser futura.";
    }
    if (v.telefone !== "" && v.telefone.replace(/\D/g, "").length < 10) e.telefone = "Informe o DDD e o número.";
  }
  if (etapa === 1) {
    if (v.especialidade === "") e.especialidade = "Selecione a especialidade.";
    if (v.unidade === "") e.unidade = "Selecione a unidade de destino.";
    if (v.destino === "") e.destino = "Selecione o município de destino.";
    const c = dataFutura(v.consulta, "a data da consulta");
    if (c) e.consulta = c;
    if (v.justificativa.trim().length < 20) e.justificativa = "Descreva a justificativa com pelo menos 20 caracteres.";
  }
  if (etapa === 2) {
    if (v.origem === "") e.origem = "Selecione o município de origem.";
    else if (v.destino !== "" && v.origem === v.destino) e.origem = "A origem deve ser diferente do destino.";
    if (v.transporte === "") e.transporte = "Selecione o tipo de transporte.";
    if (v.acompanhante && v.nomeAcompanhante.trim() === "") e.nomeAcompanhante = "Informe o nome do acompanhante.";
    const ida = dataFutura(v.ida, "a data de ida");
    if (ida) e.ida = ida;
    else {
      const consulta = lerData(v.consulta);
      if (consulta && (lerData(v.ida) as Date) > consulta) e.ida = "A ida deve ser até a data da consulta.";
    }
    if (v.volta === "") e.volta = "Informe a data de volta.";
    else if (!lerData(v.volta)) e.volta = "Data inválida. Use dd/mm/aaaa.";
    else if (!ida && (lerData(v.volta) as Date) < (lerData(v.ida) as Date)) e.volta = "A volta deve ser depois da ida.";
  }
  if (etapa === 3) {
    const faltam = TIPOS_DOCUMENTO.filter((t) => t.obrigatorio && !docs.some((d) => d.tipoId === t.id));
    if (faltam.length > 0) e.documentos = `Faltam documentos obrigatórios: ${faltam.map((t) => t.rotulo.toLowerCase()).join(", ")}.`;
  }
  if (etapa === 4 && !confirmou) e.confirmacao = "Confirme a declaração para enviar.";
  return e;
}

export interface WizardSolicitacaoTelaProps {
  contained?: boolean;
  /** Etapa inicial (0 a 4). */
  initialStep?: number;
  /** Carrega dados de exemplo em todas as etapas e os documentos obrigatórios. */
  prefilled?: boolean;
  /** Exibe os erros da etapa inicial desde o começo. */
  initialShowErrors?: boolean;
  /** Começa com o envio em andamento (etapa de revisão). */
  initialSubmitting?: boolean;
  /** Começa na confirmação final. */
  initialDone?: boolean;
}

/** Wizard de nova solicitação de TFD, com validação por etapa e revisão final. */
export function WizardSolicitacaoTela({
  contained = false,
  initialStep = 0,
  prefilled = false,
  initialShowErrors = false,
  initialSubmitting = false,
  initialDone = false,
}: WizardSolicitacaoTelaProps) {
  const base = prefilled || initialStep > 0 || initialDone ? SOLICITACAO_PREENCHIDA : SOLICITACAO_VAZIA;
  const [v, setV] = useState<ValoresSolicitacao>(base);
  const [docs, setDocs] = useState<DocumentoAnexado[]>(prefilled || initialStep >= 4 || initialDone ? DOCUMENTOS_EXEMPLO : []);
  const [etapa, setEtapa] = useState(initialStep);
  const [tocados, setTocados] = useState<Set<string>>(new Set());
  const [mostrarTodos, setMostrarTodos] = useState(initialShowErrors);
  const [confirmou, setConfirmou] = useState(initialSubmitting);
  const [enviando, setEnviando] = useState(initialSubmitting);
  const [concluido, setConcluido] = useState(initialDone);
  const [sair, setSair] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState(
    () => TIPOS_DOCUMENTO.find((t) => !(prefilled || initialStep >= 4 ? DOCUMENTOS_EXEMPLO : []).some((d) => d.tipoId === t.id))?.rotulo ?? TIPOS_DOCUMENTO[0].rotulo,
  );
  const titulo = useRef<HTMLHeadingElement>(null);
  const primeiraVez = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const erros = useMemo(() => validarEtapa(etapa, v, docs, confirmou), [etapa, v, docs, confirmou]);
  const valida = Object.keys(erros).length === 0;
  const sujo = JSON.stringify(v) !== JSON.stringify(SOLICITACAO_VAZIA) || docs.length > 0;

  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    titulo.current?.focus();
  }, [etapa, concluido]);

  const set = <K extends keyof ValoresSolicitacao>(k: K, valor: ValoresSolicitacao[K]) => setV((a) => ({ ...a, [k]: valor }));
  const tocar = (k: string) => setTocados((a) => new Set(a).add(`${etapa}:${k}`));
  const erro = (k: Chave) => (mostrarTodos || tocados.has(`${etapa}:${k}`) ? erros[k] : undefined);

  const campo = (k: keyof ValoresSolicitacao, mascara?: (x: string) => string) => ({
    name: k,
    value: v[k] as string,
    onChange: (x: string) => set(k, (mascara ? mascara(x) : x) as never),
    onBlur: () => tocar(k),
    isInvalid: Boolean(erro(k)),
    hint: erro(k),
    isDisabled: enviando,
  });

  const selecao = (k: "especialidade" | "unidade" | "destino" | "origem" | "transporte", rotulo: string, opcoes: readonly string[]) => (
    <SelectField
      label={rotulo}
      name={k}
      options={opcoes}
      value={v[k]}
      onChange={(x) => set(k, x)}
      onBlur={() => tocar(k)}
      error={erro(k)}
      required
      disabled={enviando}
    />
  );

  const avancar = () => {
    if (!valida) {
      setMostrarTodos(true);
      return;
    }
    setMostrarTodos(false);
    setEtapa((e) => Math.min(ETAPAS.length - 1, e + 1));
  };

  const voltar = () => {
    setMostrarTodos(false);
    setEtapa((e) => Math.max(0, e - 1));
  };

  const irPara = (indice: number) => {
    setMostrarTodos(false);
    setEtapa(indice);
  };

  const enviar = () => {
    if (!valida || enviando) return;
    setEnviando(true);
    timer.current = setTimeout(() => {
      setEnviando(false);
      setConcluido(true);
    }, 1100);
  };

  const reiniciar = () => {
    setV(SOLICITACAO_VAZIA);
    setDocs([]);
    setEtapa(0);
    setConfirmou(false);
    setConcluido(false);
    setTocados(new Set());
    setTipoSelecionado(TIPOS_DOCUMENTO[0].rotulo);
  };

  const passos: StepperStep[] = ETAPAS.map((e) => ({ key: e.key, label: e.label }));
  const rotuloEtapa = `Etapa ${etapa + 1} de ${ETAPAS.length}: ${ETAPAS[etapa].label}`;

  const anexar = (arquivo: File) => {
    const tipo = TIPOS_DOCUMENTO.find((t) => t.rotulo === tipoSelecionado) ?? TIPOS_DOCUMENTO[0];
    const novo: DocumentoAnexado = { tipoId: tipo.id, arquivo: arquivo.name, tamanho: formatFileSize(arquivo.size) };
    const proximos = [...docs.filter((d) => d.tipoId !== tipo.id), novo];
    setDocs(proximos);
    const pendente = TIPOS_DOCUMENTO.find((t) => !proximos.some((d) => d.tipoId === t.id));
    if (pendente) setTipoSelecionado(pendente.rotulo);
  };

  const corpo = (() => {
    if (etapa === 0) {
      return (
        <FormGrid columns={2}>
          <FormField span={2}>
            <Input {...campo("nome")} label="Nome completo" placeholder="Nome e sobrenome" autoComplete="name" isRequired />
          </FormField>
          <Input {...campo("cpf", maskCpf)} label="CPF" placeholder="000.000.000-00" inputMode="numeric" inputDir="ltr" isRequired />
          <Input {...campo("cns", maskCns)} label="Cartão SUS" placeholder="000 0000 0000 0000" inputMode="numeric" inputDir="ltr" isRequired />
          <Input {...campo("nascimento", maskData)} label="Data de nascimento" placeholder="dd/mm/aaaa" inputMode="numeric" autoComplete="bday" inputDir="ltr" isRequired />
          <Input {...campo("telefone", maskTelefone)} label="Telefone" type="tel" placeholder="(99) 99999-9999" autoComplete="tel" />
        </FormGrid>
      );
    }
    if (etapa === 1) {
      return (
        <FormGrid columns={2}>
          {selecao("especialidade", "Especialidade", ESPECIALIDADES)}
          {selecao("unidade", "Unidade de destino", UNIDADES_DESTINO)}
          {selecao("destino", "Município de destino", MUNICIPIOS)}
          <Input {...campo("consulta", maskData)} label="Data da consulta" placeholder="dd/mm/aaaa" inputMode="numeric" inputDir="ltr" isRequired />
          <FormField span={2}>
            <RadioGroup
              aria-label="Caráter do atendimento"
              orientation="horizontal"
              value={v.carater}
              onChange={(x) => set("carater", x as ValoresSolicitacao["carater"])}
              isDisabled={enviando}
              className="flex-row gap-6"
            >
              <Radio value="eletivo">Eletivo</Radio>
              <Radio value="urgencia">Urgência</Radio>
            </RadioGroup>
          </FormField>
          <FormField span={2}>
            <Textarea
              name="justificativa"
              label="Justificativa clínica"
              placeholder="Descreva o motivo do deslocamento"
              rows={4}
              value={v.justificativa}
              onChange={(x) => set("justificativa", x)}
              onBlur={() => tocar("justificativa")}
              isRequired
              isInvalid={Boolean(erro("justificativa"))}
              hint={erro("justificativa")}
              isDisabled={enviando}
            />
          </FormField>
        </FormGrid>
      );
    }
    if (etapa === 2) {
      return (
        <FormGrid columns={2}>
          {selecao("origem", "Município de origem", MUNICIPIOS)}
          {selecao("transporte", "Tipo de transporte", TIPOS_TRANSPORTE)}
          <Input {...campo("ida", maskData)} label="Data de ida" placeholder="dd/mm/aaaa" inputMode="numeric" inputDir="ltr" isRequired />
          <Input {...campo("volta", maskData)} label="Data de volta" placeholder="dd/mm/aaaa" inputMode="numeric" inputDir="ltr" isRequired />
          <FormField span={2}>
            <Switch isSelected={v.acompanhante} onChange={(x) => set("acompanhante", x)} isDisabled={enviando}>
              Viaja com acompanhante
            </Switch>
          </FormField>
          {v.acompanhante ? (
            <FormField span={2}>
              <Input {...campo("nomeAcompanhante")} label="Nome do acompanhante" placeholder="Nome completo" isRequired />
            </FormField>
          ) : null}
          <FormField span={2}>
            <Checkbox isSelected={v.hospedagem} onChange={(x) => set("hospedagem", x)} isDisabled={enviando}>
              Necessita de hospedagem no destino
            </Checkbox>
          </FormField>
        </FormGrid>
      );
    }
    if (etapa === 3) {
      const pendentes = TIPOS_DOCUMENTO.filter((t) => !docs.some((d) => d.tipoId === t.id));
      return (
        <div className="flex flex-col gap-5">
          <ul aria-label="Documentos da solicitação" className="flex flex-col divide-y divide-separator-border rounded-2lg border border-border-button-default">
            {TIPOS_DOCUMENTO.map((t) => {
              const anexo = docs.find((d) => d.tipoId === t.id);
              return (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <RiFileTextLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-body-medium text-text-primary">
                        {t.rotulo}
                        {t.obrigatorio ? <span className="ms-1 text-caption-1-regular text-text-secondary">Obrigatório</span> : <span className="ms-1 text-caption-1-regular text-text-secondary">Opcional</span>}
                      </span>
                      {anexo ? (
                        <span className="truncate text-caption-1-regular text-text-secondary">{`${anexo.arquivo}, ${anexo.tamanho}`}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Chip color={anexo ? "lime" : t.obrigatorio ? "yellow" : "neutral"}>{anexo ? "Anexado" : "Pendente"}</Chip>
                    {anexo ? (
                      <LinkButton
                        variant="secondary"
                        size="xs"
                        aria-label={`Remover ${t.rotulo.toLowerCase()}`}
                        onClick={() => setDocs((a) => a.filter((d) => d.tipoId !== t.id))}
                      >
                        Remover
                      </LinkButton>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
          {erro("documentos") ? <AvisoFormulario role="status">{erro("documentos")}</AvisoFormulario> : null}
          <div className="flex flex-col gap-3">
            <SelectField
              label="Tipo de documento a anexar"
              name="tipoDocumento"
              options={TIPOS_DOCUMENTO.map((t) => t.rotulo)}
              value={tipoSelecionado}
              onChange={setTipoSelecionado}
              hint={pendentes.length === 0 ? "Todos os documentos foram anexados. Um novo arquivo substitui o anterior." : "Formatos PDF, JPG ou PNG, até 5 MB."}
              disabled={enviando}
            />
            <UploadPt allowedExtensions={["pdf", "jpg", "png"]} maxBytes={5 * 1024 * 1024} onUploadComplete={anexar} />
          </div>
        </div>
      );
    }
    /* Revisão */
    const cartao = (indice: number, itens: { label: string; value?: string }[]) => (
      <section key={ETAPAS[indice].key} aria-labelledby={`rev-${indice}`} className="flex flex-col gap-3 rounded-2lg border border-border-button-default p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 id={`rev-${indice}`} className="text-body-medium text-text-primary">
            {ETAPAS[indice].label}
          </h3>
          <LinkButton size="xs" onClick={() => irPara(indice)} aria-label={`Editar ${ETAPAS[indice].label.toLowerCase()}`}>
            Editar
          </LinkButton>
        </div>
        <KeyValueList columns={2} items={itens} />
      </section>
    );
    return (
      <div className="flex flex-col gap-4">
        {cartao(0, [
          { label: "Paciente", value: v.nome },
          { label: "CPF", value: v.cpf ? `${v.cpf.slice(0, 3)}.***.***-${v.cpf.slice(-2)}` : undefined },
          { label: "Cartão SUS", value: v.cns ? `*** **** **** ${v.cns.slice(-4)}` : undefined },
          { label: "Nascimento", value: v.nascimento },
          { label: "Telefone", value: v.telefone || undefined },
        ])}
        {cartao(1, [
          { label: "Especialidade", value: v.especialidade },
          { label: "Unidade de destino", value: v.unidade },
          { label: "Município de destino", value: v.destino },
          { label: "Data da consulta", value: v.consulta },
          { label: "Caráter", value: v.carater === "eletivo" ? "Eletivo" : "Urgência" },
          { label: "Justificativa clínica", value: v.justificativa },
        ])}
        {cartao(2, [
          { label: "Município de origem", value: v.origem },
          { label: "Transporte", value: v.transporte },
          { label: "Ida", value: v.ida },
          { label: "Volta", value: v.volta },
          { label: "Acompanhante", value: v.acompanhante ? v.nomeAcompanhante : "Não" },
          { label: "Hospedagem", value: v.hospedagem ? "Necessária" : "Não necessária" },
        ])}
        {cartao(3, [
          {
            label: "Documentos anexados",
            value: docs.length === 0 ? undefined : docs.map((d) => TIPOS_DOCUMENTO.find((t) => t.id === d.tipoId)?.rotulo).join(", "),
          },
        ])}
        <div className="flex flex-col gap-1.5">
          <Checkbox isSelected={confirmou} onChange={setConfirmou} isDisabled={enviando}>
            Declaro que as informações conferem com a documentação do paciente
          </Checkbox>
          {erro("confirmacao") ? <p className="text-caption-1-medium text-text-error-primary">{erro("confirmacao")}</p> : null}
        </div>
      </div>
    );
  })();

  const ultima = etapa === ETAPAS.length - 1;

  if (concluido) {
    return (
      <MolduraSistema contained={contained} selected="solicitacoes" breadcrumb={[{ label: "Solicitações TFD", href: "#solicitacoes" }, { label: "Nova solicitação" }]}>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="flex w-full max-w-[480px] flex-col items-center gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
              <RiCheckboxCircleLine className="size-6" aria-hidden />
            </span>
            <div role="status" className="flex flex-col gap-1.5">
              <h1 ref={titulo} tabIndex={-1} className="text-title-2-medium text-text-primary outline-none">
                Solicitação enviada
              </h1>
              <p className="text-body-regular text-text-secondary">
                Protocolo <span className="text-body-medium text-text-primary">{PROTOCOLO_EXEMPLO}</span>. A regulação analisa os documentos e o andamento aparece no detalhe da solicitação.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={reiniciar}>
                Nova solicitação
              </Button>
              <Button onClick={() => undefined}>Ver solicitação</Button>
            </div>
          </div>
        </div>
      </MolduraSistema>
    );
  }

  return (
    <MolduraSistema contained={contained} selected="solicitacoes" breadcrumb={[{ label: "Solicitações TFD", href: "#solicitacoes" }, { label: "Nova solicitação" }]}>
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col gap-4 p-1 pb-4">
          <PageHeader title="Nova solicitação de TFD" titleAs="h1" description="Cinco etapas para registrar o deslocamento do paciente." />
          <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-4 sm:p-5">
            <Stepper
              steps={passos}
              current={etapa}
              clickable="completed"
              onStepClick={(indice) => irPara(indice)}
              aria-label="Etapas da solicitação"
            />
          </div>
          <section
            aria-labelledby="wizard-etapa"
            className="flex flex-col gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-5 sm:p-6"
          >
            <div className="flex flex-col gap-1">
              <h2 id="wizard-etapa" ref={titulo} tabIndex={-1} className="text-headline-medium text-text-primary outline-none">
                {rotuloEtapa}
              </h2>
              <p className="text-caption-1-regular text-text-tertiary">* Campos obrigatórios</p>
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              {rotuloEtapa}
            </p>
            {corpo}
          </section>
        </div>
        <FormActions
          cancelLabel="Cancelar"
          onCancel={() => (sujo ? setSair(true) : undefined)}
          secondaryLabel={etapa > 0 ? "Voltar" : undefined}
          onSecondary={voltar}
          primaryLabel={ultima ? "Enviar solicitação" : "Avançar"}
          loadingLabel="Enviando"
          onPrimary={ultima ? enviar : avancar}
          isLoading={enviando}
          isDisabled={!valida}
          info={!valida && !enviando ? (ultima ? "Confirme a declaração para enviar" : "Preencha os campos obrigatórios para avançar") : undefined}
          className={cx("rounded-b-3xl")}
        />
      </div>
      <ConfirmDialog
        isOpen={sair}
        onOpenChange={setSair}
        onConfirm={() => {
          setSair(false);
          reiniciar();
        }}
        tone="danger"
        title="Sair da solicitação?"
        description="Os dados preenchidos e os documentos anexados serão perdidos."
        confirmLabel="Sair sem enviar"
        cancelLabel="Continuar preenchendo"
      />
    </MolduraSistema>
  );
}
