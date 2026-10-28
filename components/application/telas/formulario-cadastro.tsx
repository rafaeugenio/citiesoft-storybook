"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { RiAddLine, RiUserAddLine } from "@remixicon/react";
import { ConfirmDialog } from "@/components/application/dialog/confirm-dialog";
import { Drawer } from "@/components/application/drawer/drawer";
import { DrawerActions } from "@/components/application/drawer/drawer-actions";
import { KeyValueList } from "@/components/application/detalhe/key-value-list";
import { FormActions } from "@/components/application/formulario/form-actions";
import { FormField, FormGrid } from "@/components/application/formulario/form-grid";
import { FormSection } from "@/components/application/formulario/form-section";
import { PageHeader } from "@/components/application/page-header/page-header";
import { Chip } from "@/components/base/badges/chip";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { TableBody, TableCell, TableColumn, TableHeader, TableRow, Table } from "@/components/base/table/table";
import { Textarea } from "@/components/base/textarea/textarea";
import { AvisoFormulario, SelectField } from "./campos";
import { AUDITORIA_EXEMPLO, OPCOES_SEXO, PACIENTE_PREENCHIDO, PACIENTE_VAZIO, type ValoresPaciente } from "./dados/cadastro-paciente";
import { MUNICIPIOS } from "./dados/comum";
import { MolduraSistema } from "./moldura-sistema";
import {
  cnsValido,
  cpfValido,
  emailValido,
  HOJE_EXEMPLO,
  lerData,
  maskCep,
  maskCns,
  maskCpf,
  maskData,
  maskTelefone,
} from "./validacao";

type Erros = Partial<Record<keyof ValoresPaciente, string>>;

/** Regras de validação do cadastro de paciente. */
function validarPaciente(v: ValoresPaciente): Erros {
  const e: Erros = {};
  if (v.nome.trim() === "") e.nome = "Informe o nome completo.";
  else if (v.nome.trim().split(/\s+/).length < 2) e.nome = "Informe nome e sobrenome.";
  if (v.cpf === "") e.cpf = "Informe o CPF.";
  else if (!cpfValido(v.cpf)) e.cpf = "CPF inválido. Confira os dígitos.";
  if (v.cns === "") e.cns = "Informe o cartão SUS.";
  else if (!cnsValido(v.cns)) e.cns = "Cartão SUS inválido. Confira os 15 dígitos.";
  if (v.nascimento === "") e.nascimento = "Informe a data de nascimento.";
  else {
    const data = lerData(v.nascimento);
    if (!data) e.nascimento = "Data inválida. Use dd/mm/aaaa.";
    else if (data > HOJE_EXEMPLO) e.nascimento = "A data não pode ser futura.";
  }
  if (v.sexo === "") e.sexo = "Selecione o sexo.";
  if (v.mae.trim() === "") e.mae = "Informe o nome da mãe.";
  if (v.telefone !== "" && v.telefone.replace(/\D/g, "").length < 10) e.telefone = "Informe o DDD e o número.";
  if (v.email !== "" && !emailValido(v.email)) e.email = "Informe um e-mail válido.";
  if (v.cep !== "" && v.cep.replace(/\D/g, "").length !== 8) e.cep = "O CEP deve ter 8 dígitos.";
  if (v.municipio === "") e.municipio = "Selecione o município de residência.";
  return e;
}

const ORDEM_CAMPOS: (keyof ValoresPaciente)[] = [
  "nome", "cpf", "cns", "nascimento", "sexo", "mae", "telefone", "email", "cep", "municipio",
];

export interface PacienteFormProps {
  formId: string;
  /** Desenha as seções como cartões. Desligue dentro do drawer. */
  card?: boolean;
  columns?: 2 | 3;
  initialValues?: ValoresPaciente;
  /** Exibe os erros de campo desde o início (como após um envio inválido). */
  initialSubmitted?: boolean;
  disabled?: boolean;
  onValid: (valores: ValoresPaciente) => void;
  onDirtyChange?: (dirty: boolean) => void;
  /** Conteúdo logo abaixo das seções (barra de ações no modo página). */
  children?: React.ReactNode;
  className?: string;
}

/** Campos do cadastro de paciente: seções, grade, máscaras e validação. */
export function PacienteForm({
  formId,
  card = true,
  columns = 3,
  initialValues = PACIENTE_VAZIO,
  initialSubmitted = false,
  disabled = false,
  onValid,
  onDirtyChange,
  children,
  className,
}: PacienteFormProps) {
  const [v, setV] = useState<ValoresPaciente>(initialValues);
  const [tocados, setTocados] = useState<Set<string>>(new Set());
  const [enviado, setEnviado] = useState(initialSubmitted);
  const [tentativa, setTentativa] = useState(0);
  const ref = useRef<HTMLFormElement>(null);

  const erros = useMemo(() => validarPaciente(v), [v]);
  const temErros = Object.keys(erros).length > 0;
  const dirty = JSON.stringify(v) !== JSON.stringify(initialValues);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (tentativa === 0) return;
    const primeiro = ORDEM_CAMPOS.find((k) => erros[k]);
    if (!primeiro || !ref.current) return;
    const alvo =
      ref.current.querySelector<HTMLElement>(`input[name="${primeiro}"]`) ??
      ref.current.querySelector<HTMLElement>(`[data-campo="${primeiro}"] button`);
    alvo?.focus();
    // Só reage a uma nova tentativa de envio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativa]);

  const set = <K extends keyof ValoresPaciente>(k: K, valor: ValoresPaciente[K]) => setV((a) => ({ ...a, [k]: valor }));
  const tocar = (k: string) => setTocados((a) => new Set(a).add(k));
  const erro = (k: keyof ValoresPaciente) => (enviado || tocados.has(k) ? erros[k] : undefined);

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    if (disabled) return;
    setEnviado(true);
    if (temErros) {
      setTentativa((t) => t + 1);
      return;
    }
    onValid(v);
  };

  const campo = (k: keyof ValoresPaciente, mascara?: (x: string) => string) => ({
    name: k,
    value: v[k] as string,
    onChange: (x: string) => set(k, (mascara ? mascara(x) : x) as never),
    onBlur: () => tocar(k),
    isInvalid: Boolean(erro(k)),
    hint: erro(k),
    isDisabled: disabled,
  });

  const spanMeio = columns === 3 ? 2 : 2;
  const mostrarAviso = enviado && temErros;

  return (
    <form
      id={formId}
      ref={ref}
      noValidate
      onSubmit={enviar}
      className={className ?? "flex min-h-full flex-col"}
    >
      <div className="flex flex-1 flex-col gap-4">
        {mostrarAviso ? (
          <AvisoFormulario>Corrija os campos destacados para continuar.</AvisoFormulario>
        ) : null}

        <FormSection
          title="Identificação"
          description="Dados usados para localizar o paciente nas solicitações."
          requiredNote="* Campos obrigatórios"
          card={card}
          headingLevel={card ? 2 : 3}
        >
          <FormGrid columns={columns}>
            <FormField span={spanMeio}>
              <Input {...campo("nome")} label="Nome completo" placeholder="Nome e sobrenome" autoComplete="name" isRequired />
            </FormField>
            <FormField span={columns === 3 ? 1 : 2}>
              <Input {...campo("nomeSocial")} label="Nome social" placeholder="Se houver" hint={undefined} isInvalid={false} />
            </FormField>
            <Input {...campo("cpf", maskCpf)} label="CPF" placeholder="000.000.000-00" inputMode="numeric" inputDir="ltr" isRequired />
            <Input {...campo("cns", maskCns)} label="Cartão SUS" placeholder="000 0000 0000 0000" inputMode="numeric" inputDir="ltr" isRequired />
            <Input
              {...campo("nascimento", maskData)}
              label="Data de nascimento"
              placeholder="dd/mm/aaaa"
              inputMode="numeric"
              autoComplete="bday"
              inputDir="ltr"
              isRequired
            />
            <SelectField
              label="Sexo"
              name="sexo"
              options={OPCOES_SEXO}
              value={v.sexo}
              onChange={(x) => set("sexo", x)}
              onBlur={() => tocar("sexo")}
              error={erro("sexo")}
              required
              disabled={disabled}
            />
            <FormField span={spanMeio}>
              <Input {...campo("mae")} label="Nome da mãe" placeholder="Nome completo" isRequired />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection
          title="Contato e endereço"
          description="Usados para avisos de agendamento e para definir o trajeto."
          card={card}
          headingLevel={card ? 2 : 3}
        >
          <FormGrid columns={columns}>
            <Input {...campo("telefone", maskTelefone)} label="Telefone" type="tel" placeholder="(99) 99999-9999" autoComplete="tel" />
            <Input {...campo("email")} label="E-mail" type="email" placeholder="nome@exemplo.com.br" autoComplete="email" />
            <Input {...campo("cep", maskCep)} label="CEP" placeholder="00000-000" inputMode="numeric" autoComplete="postal-code" inputDir="ltr" />
            <FormField span={spanMeio}>
              <Input {...campo("logradouro")} label="Logradouro" placeholder="Rua, avenida ou povoado" autoComplete="street-address" />
            </FormField>
            <Input {...campo("numero")} label="Número" placeholder="S/N" />
            <Input {...campo("bairro")} label="Bairro" />
            <SelectField
              label="Município de residência"
              name="municipio"
              options={MUNICIPIOS}
              value={v.municipio}
              onChange={(x) => set("municipio", x)}
              onBlur={() => tocar("municipio")}
              error={erro("municipio")}
              required
              disabled={disabled}
            />
          </FormGrid>
        </FormSection>

        <FormSection
          title="Informações adicionais"
          description="Orientações que ajudam a regulação e o transporte."
          card={card}
          headingLevel={card ? 2 : 3}
        >
          <FormGrid columns={1}>
            <Textarea
              label="Observações"
              placeholder="Condições de saúde e necessidades de deslocamento"
              rows={3}
              value={v.observacoes}
              onChange={(x) => set("observacoes", x)}
              isDisabled={disabled}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <Checkbox isSelected={v.acompanhante} onChange={(x) => set("acompanhante", x)} isDisabled={disabled}>
                Necessita de acompanhante
              </Checkbox>
              <Checkbox isSelected={v.mobilidade} onChange={(x) => set("mobilidade", x)} isDisabled={disabled}>
                Mobilidade reduzida
              </Checkbox>
            </div>
          </FormGrid>
        </FormSection>
      </div>
      {children}
    </form>
  );
}

export type ModoCadastro = "pagina" | "drawer";

export interface FormularioCadastroTelaProps {
  contained?: boolean;
  /** `pagina` usa a página inteira; `drawer` abre o mesmo formulário sobre a listagem. */
  modo?: ModoCadastro;
  initialValues?: "vazio" | "preenchido";
  /** Mostra os erros de campo desde o início. */
  initialSubmitted?: boolean;
  /** Começa com o salvamento em andamento. */
  initialSaving?: boolean;
  /** No modo `drawer`, abre o painel ao montar. */
  defaultOpen?: boolean;
}

const PACIENTES_LISTA = [
  { nome: "Antônio Carlos Medeiros", cns: "***********3921", municipio: "Caxias", situacao: "Ativo" },
  { nome: "Maria das Graças Oliveira", cns: "***********1170", municipio: "Barreirinhas", situacao: "Ativo" },
  { nome: "Raimundo Nonato Silva", cns: "***********8847", municipio: "Balsas", situacao: "Ativo" },
  { nome: "Francisca Lima Costa", cns: "***********5036", municipio: "Codó", situacao: "Inativo" },
];

/** Formulário de cadastro de paciente, em página ou em drawer. */
export function FormularioCadastroTela({
  contained = false,
  modo = "pagina",
  initialValues = "vazio",
  initialSubmitted = false,
  initialSaving = false,
  defaultOpen = true,
}: FormularioCadastroTelaProps) {
  const valoresIniciais = initialValues === "preenchido" ? PACIENTE_PREENCHIDO : PACIENTE_VAZIO;
  const [chave, setChave] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [salvando, setSalvando] = useState(initialSaving);
  const [salvo, setSalvo] = useState(false);
  const [aberto, setAberto] = useState(defaultOpen);
  const [descartar, setDescartar] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const formId = "form-paciente";

  const salvar = () => {
    setSalvando(true);
    timer.current = setTimeout(() => {
      setSalvando(false);
      setSalvo(true);
      setDirty(false);
      if (modo === "drawer") setAberto(false);
    }, 900);
  };

  const pedirCancelar = () => {
    if (dirty) setDescartar(true);
    else if (modo === "drawer") setAberto(false);
  };

  const confirmarDescarte = () => {
    setDescartar(false);
    setChave((c) => c + 1);
    setDirty(false);
    if (modo === "drawer") setAberto(false);
  };

  const dialogoDescarte = (
    <ConfirmDialog
      isOpen={descartar}
      onOpenChange={setDescartar}
      onConfirm={confirmarDescarte}
      tone="danger"
      title="Descartar as alterações?"
      description="Os dados preenchidos neste cadastro serão perdidos."
      confirmLabel="Descartar alterações"
      cancelLabel="Continuar editando"
    />
  );

  const avisoSalvo = salvo ? (
    <AvisoFormulario tone="sucesso" role="status">
      Paciente salvo com sucesso.
    </AvisoFormulario>
  ) : null;

  if (modo === "drawer") {
    return (
      <MolduraSistema contained={contained} selected="pacientes" breadcrumb={[{ label: "Pacientes" }]}>
        <div className="flex flex-col gap-4 p-1">
          <PageHeader
            title="Pacientes"
            description="Cadastro dos pacientes atendidos pelo TFD."
            primaryAction={{ label: "Novo paciente", icon: RiAddLine, onClick: () => setAberto(true) }}
          />
          {avisoSalvo}
          <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-2">
            <Table aria-label="Pacientes cadastrados" size="sm">
              <TableHeader>
                <TableColumn isRowHeader>Nome</TableColumn>
                <TableColumn>Cartão SUS</TableColumn>
                <TableColumn>Município</TableColumn>
                <TableColumn>Situação</TableColumn>
              </TableHeader>
              <TableBody>
                {PACIENTES_LISTA.map((p) => (
                  <TableRow key={p.nome}>
                    <TableCell>{p.nome}</TableCell>
                    <TableCell>{p.cns}</TableCell>
                    <TableCell>{p.municipio}</TableCell>
                    <TableCell>
                      <Chip color={p.situacao === "Ativo" ? "lime" : "neutral"}>{p.situacao}</Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Drawer
          isOpen={aberto}
          onOpenChange={(abrir) => {
            if (abrir) setAberto(true);
            else if (dirty) setDescartar(true);
            else setAberto(false);
          }}
          isDismissable={!salvando}
          title="Novo paciente"
          description="Preencha os dados para cadastrar o paciente."
          icon={RiUserAddLine}
          size="lg"
          footer={
            <DrawerActions
              form={formId}
              primaryLabel="Salvar paciente"
              secondaryLabel="Cancelar"
              onSecondary={pedirCancelar}
              isLoading={salvando}
              leading={dirty ? <span className="text-body-regular text-text-secondary">Alterações não salvas</span> : null}
            />
          }
        >
          <PacienteForm
            key={chave}
            formId={formId}
            card={false}
            columns={2}
            initialValues={valoresIniciais}
            initialSubmitted={initialSubmitted}
            disabled={salvando}
            onValid={salvar}
            onDirtyChange={setDirty}
            className="flex flex-col"
          />
        </Drawer>
        {dialogoDescarte}
      </MolduraSistema>
    );
  }

  return (
    <MolduraSistema contained={contained} selected="pacientes" breadcrumb={[{ label: "Pacientes", href: "#pacientes" }, { label: "Novo paciente" }]}>
      <div className="flex min-h-full flex-col">
        <div className="flex flex-col gap-4 p-1 pb-4">
          <PageHeader
            title="Novo paciente"
            description="Cadastro completo, com identificação, contato e orientações de deslocamento."
          />
          {avisoSalvo}
        </div>
        <PacienteForm
          key={chave}
          formId={formId}
          card
          columns={3}
          initialValues={valoresIniciais}
          initialSubmitted={initialSubmitted}
          disabled={salvando}
          onValid={salvar}
          onDirtyChange={setDirty}
          className="flex flex-1 flex-col p-1"
        >
          {salvo ? (
            <div className="px-1 pt-4">
              <FormSection title="Auditoria" description="Registro automático, somente leitura." headingLevel={2}>
                <KeyValueList
                  columns={2}
                  items={[
                    { label: "Criado por", value: AUDITORIA_EXEMPLO.criadoPor },
                    { label: "Criado em", value: AUDITORIA_EXEMPLO.criadoEm },
                  ]}
                />
              </FormSection>
            </div>
          ) : null}
          <FormActions
            primaryLabel="Salvar paciente"
            cancelLabel="Cancelar"
            onCancel={pedirCancelar}
            isLoading={salvando}
            info={dirty ? "Alterações não salvas" : undefined}
            className="mt-4 rounded-b-3xl"
          />
        </PacienteForm>
      </div>
      {dialogoDescarte}
    </MolduraSistema>
  );
}
