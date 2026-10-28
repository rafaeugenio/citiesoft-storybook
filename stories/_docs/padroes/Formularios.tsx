import { useRef, useState, type FormEvent } from 'react';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { Input } from '@/components/base/input/input';
import { FormActions } from '@/components/application/formulario/form-actions';
import { FormField, FormGrid } from '@/components/application/formulario/form-grid';
import { FormSection } from '@/components/application/formulario/form-section';
import { Moldura } from './Moldura';

type Campo = 'nome' | 'cpf' | 'matricula';

const ROTULOS: Record<Campo, string> = { nome: 'Nome completo', cpf: 'CPF', matricula: 'Matrícula' };

function cpfValido(valor: string) {
  const d = valor.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (base: number) => {
    let soma = 0;
    for (let i = 0; i < base; i++) soma += Number(d[i]) * (base + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

function validar(campo: Campo, valor: string): string | undefined {
  const v = valor.trim();
  if (campo === 'nome') return v ? undefined : 'Informe o nome completo para continuar.';
  if (campo === 'cpf') {
    if (!v) return 'Informe o CPF para continuar.';
    return cpfValido(v) ? undefined : 'CPF inválido. Verifique os 11 dígitos e tente novamente.';
  }
  if (!v) return 'Informe a matrícula para continuar.';
  return /^\d+$/.test(v) ? undefined : 'Use só números, sem espaços ou pontos. Ex.: 123456';
}

/** Cadastro curto com validação ao sair do campo, resumo de erros e foco no primeiro inválido. */
export function FormularioDeCadastro() {
  const [valores, setValores] = useState<Record<Campo, string>>({ nome: '', cpf: '', matricula: '' });
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [enviado, setEnviado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const resumo = useRef<HTMLDivElement>(null);

  const campos = Object.keys(ROTULOS) as Campo[];
  const erros = campos.flatMap((c) => {
    const msg = validar(c, valores[c]);
    return msg ? [{ campo: c, msg }] : [];
  });
  const erroDe = (c: Campo) => (tocados[c] || enviado ? erros.find((e) => e.campo === c)?.msg : undefined);

  const atualizar = (c: Campo) => (v: string) => {
    setSalvo(false);
    setValores((a) => ({ ...a, [c]: v }));
  };
  const tocar = (c: Campo) => () => setTocados((a) => ({ ...a, [c]: true }));

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    if (erros.length > 0) {
      requestAnimationFrame(() => resumo.current?.focus());
      return;
    }
    setSalvando(true);
    window.setTimeout(() => {
      setSalvando(false);
      setSalvo(true);
    }, 900);
  };

  const irPara = (c: Campo) => document.querySelector<HTMLInputElement>(`input[name="${c}"]`)?.focus();
  const mostrarResumo = enviado && erros.length > 0;

  return (
    <Moldura legenda="Deixe um campo vazio e use Salvar para ver o resumo. O CPF aceita com ou sem pontuação.">
      <form noValidate onSubmit={enviar} className="flex flex-col gap-4">
        {mostrarResumo ? (
          <div
            ref={resumo}
            tabIndex={-1}
            role="alert"
            className="rounded-2xl border border-border-error-default bg-background-tertiary-error p-4 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <p className="flex items-center gap-2 text-body-medium text-text-error-primary">
              <RiErrorWarningFill className="size-5" aria-hidden />
              Corrija {erros.length} {erros.length === 1 ? 'erro' : 'erros'} antes de continuar.
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {erros.map((e) => (
                <li key={e.campo}>
                  <button type="button" onClick={() => irPara(e.campo)} className="cursor-pointer text-start text-body-regular text-text-primary underline underline-offset-2">
                    {ROTULOS[e.campo]}: {e.msg}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <FormSection title="Identificação" description="Dados usados para localizar o servidor." requiredNote="* Campos obrigatórios" card={false}>
          <FormGrid columns={2}>
            <FormField span="full">
              <Input name="nome" label="Nome completo" placeholder="Ex.: Ana Paula Ribeiro" isRequired value={valores.nome} onChange={atualizar('nome')} onBlur={tocar('nome')} isInvalid={Boolean(erroDe('nome'))} hint={erroDe('nome')} />
            </FormField>
            <Input name="cpf" label="CPF" placeholder="Ex.: 123.456.789-09" inputMode="numeric" isRequired value={valores.cpf} onChange={atualizar('cpf')} onBlur={tocar('cpf')} isInvalid={Boolean(erroDe('cpf'))} hint={erroDe('cpf')} />
            <Input name="matricula" label="Matrícula" placeholder="Ex.: 123456" inputMode="numeric" isRequired value={valores.matricula} onChange={atualizar('matricula')} onBlur={tocar('matricula')} isInvalid={Boolean(erroDe('matricula'))} hint={erroDe('matricula') ?? 'Sem espaços ou pontos. Ex.: 123456'} />
          </FormGrid>
        </FormSection>
        {salvo ? (
          <p role="status" className="flex items-center gap-2 text-body-medium text-text-primary">
            <RiCheckboxCircleFill className="size-5 text-state-success-base" aria-hidden />
            Cadastro atualizado.
          </p>
        ) : null}
        <FormActions primaryLabel="Salvar" loadingLabel="Salvando" isLoading={salvando} sticky={false} className="rounded-2xl border" hideCancel={false} />
      </form>
    </Moldura>
  );
}
