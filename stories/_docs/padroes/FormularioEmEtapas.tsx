import { useState } from 'react';
import { RiCheckboxCircleFill, RiSaveLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';
import { Stepper, type StepperStep } from '@/components/application/stepper/stepper';
import { FormField, FormGrid } from '@/components/application/formulario/form-grid';
import { Moldura } from './Moldura';

const ETAPAS: StepperStep[] = [
  { key: 'pessoais', label: 'Dados pessoais' },
  { key: 'funcionais', label: 'Dados funcionais' },
  { key: 'revisao', label: 'Revisão' },
];

const VINCULOS = ['Estatutário', 'Celetista', 'Comissionado'];

/** Cadastro em três etapas: banner de rascunho, campo condicional, revisão com Editar e protocolo. */
export function FormularioEmEtapas() {
  const [etapa, setEtapa] = useState(0);
  const [rascunho, setRascunho] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [tentou, setTentou] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [vinculo, setVinculo] = useState('Estatutário');
  const [ctps, setCtps] = useState('');
  const [aviso, setAviso] = useState('');

  const celetista = vinculo === 'Celetista';
  const errosEtapa = (i: number) => {
    if (i === 0) return nome.trim() ? [] : ['Informe o nome completo do servidor.'];
    if (i === 1) return celetista && !ctps.trim() ? ['Informe o número da CTPS.'] : [];
    return [];
  };

  const avancar = () => {
    if (errosEtapa(etapa).length > 0) {
      setTentou(true);
      return;
    }
    setTentou(false);
    setEtapa((e) => e + 1);
    setAviso('Rascunho salvo.');
  };
  const voltar = () => {
    setTentou(false);
    setEtapa((e) => Math.max(0, e - 1));
  };

  if (enviado) {
    return (
      <Moldura legenda="Tela de confirmação após o envio: protocolo, data com hora e próximos passos.">
        <div role="status" className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-headline-semibold text-text-primary">
            <RiCheckboxCircleFill className="size-6 text-state-success-base" aria-hidden />
            Cadastro enviado com sucesso
          </p>
          <p className="text-body-regular text-text-secondary">Protocolo 2025/04812, em 15/06/2025 às 14h30.</p>
          <p className="text-body-regular text-text-secondary">Próximo passo: o RH confere os dados e avisa por e-mail.</p>
          <div><Button variant="secondary" size="small" onClick={() => { setEnviado(false); setEtapa(0); }}>Reiniciar exemplo</Button></div>
        </div>
      </Moldura>
    );
  }

  const erroNome = tentou && etapa === 0 && !nome.trim() ? 'Informe o nome completo do servidor.' : undefined;
  const erroCtps = tentou && etapa === 1 && celetista && !ctps.trim() ? 'Informe o número da CTPS.' : undefined;

  return (
    <Moldura legenda="Selecione Celetista na etapa 2 para ver o campo condicional. Voltar nunca valida.">
      <div className="flex flex-col gap-5">
        {rascunho ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-button-default bg-background-secondary-default p-3">
            <p className="max-w-[60ch] text-body-regular text-text-primary">
              Você tem um rascunho de Cadastro de Servidor salvo em 15/06/2025 às 14h30. O rascunho expira em 15/07/2025.
            </p>
            <div className="flex gap-2">
              <Button size="small" onClick={() => setRascunho(false)}>Continuar preenchimento</Button>
              <Button size="small" variant="ghost" onClick={() => setRascunho(false)}>Descartar e começar do zero</Button>
            </div>
          </div>
        ) : null}
        <Stepper steps={ETAPAS} current={etapa} clickable="completed" onStepClick={(i) => setEtapa(i)} aria-label="Progresso do cadastro" />
        <div className="rounded-2xl border border-border-button-default bg-background-primary-default p-5">
          {etapa === 0 ? (
            <FormGrid columns={2}>
              <FormField span="full">
                <Input name="nome" label="Nome completo" isRequired value={nome} onChange={setNome} isInvalid={Boolean(erroNome)} hint={erroNome} />
              </FormField>
              <Input name="email" label="E-mail institucional (opcional)" type="email" value={email} onChange={setEmail} />
            </FormGrid>
          ) : null}
          {etapa === 1 ? (
            <FormGrid columns={2}>
              <div className="flex flex-col gap-1">
                <span className="text-body-medium text-text-primary">Tipo de vínculo</span>
                <Select aria-label="Tipo de vínculo" selectedKey={vinculo} onSelectionChange={(k) => { setVinculo(String(k)); setAviso(String(k) === 'Celetista' ? 'Campo adicional exibido para o vínculo celetista.' : ''); }} className="w-full">
                  {VINCULOS.map((v) => <SelectItem key={v} id={v}>{v}</SelectItem>)}
                </Select>
              </div>
              {celetista ? (
                <Input name="ctps" label="Número da CTPS" isRequired value={ctps} onChange={setCtps} isInvalid={Boolean(erroCtps)} hint={erroCtps} />
              ) : null}
            </FormGrid>
          ) : null}
          {etapa === 2 ? (
            <dl className="flex flex-col gap-3">
              {[
                ['Dados pessoais', `${nome || 'Não informado'} · ${email || 'Não informado'}`, 0],
                ['Dados funcionais', celetista ? `${vinculo} · CTPS ${ctps || 'Não informado'}` : vinculo, 1],
              ].map(([titulo, valor, destino]) => (
                <div key={String(titulo)} className="flex items-start justify-between gap-3 border-b border-separator-border pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <dt className="text-caption-1-semibold text-text-secondary">{titulo}</dt>
                    <dd className="text-body-regular text-text-primary">{valor}</dd>
                  </div>
                  <Button variant="ghost" size="small" onClick={() => setEtapa(Number(destino))}>Editar</Button>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <p aria-live="polite" className="flex min-h-5 items-center gap-1 text-caption-1-medium text-text-secondary">
          {aviso ? <><RiSaveLine className="size-4" aria-hidden />{aviso}</> : null}
        </p>
        <div className="flex items-center justify-between gap-2">
          <Button variant="secondary" onClick={voltar} disabled={etapa === 0}>Anterior</Button>
          {etapa < ETAPAS.length - 1 ? (
            <Button onClick={avancar}>Próximo</Button>
          ) : (
            <Button onClick={() => setEnviado(true)}>Enviar cadastro</Button>
          )}
        </div>
      </div>
    </Moldura>
  );
}
