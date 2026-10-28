import { useState } from 'react';
import { RiArrowDownLine, RiArrowRightLine, RiArrowUpLine, RiDownload2Line } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Drawer } from '@/components/application/drawer/drawer';
import { Moldura } from './Moldura';

type Tom = 'bom' | 'ruim' | 'neutro';

const INDICADORES: { rotulo: string; valor: string; delta: string; tom: Tom; seta: 'cima' | 'baixo' | 'lado'; meta?: number }[] = [
  { rotulo: 'Aguardando parecer médico', valor: '127', delta: '23% acima do mês anterior', tom: 'ruim', seta: 'cima' },
  { rotulo: 'Autorizadas este mês', valor: '482', delta: '12% acima do mês anterior', tom: 'bom', seta: 'cima', meta: 82 },
  { rotulo: 'Prazo médio de resposta', valor: '4,2 dias', delta: 'Igual ao mês anterior', tom: 'neutro', seta: 'lado' },
  { rotulo: 'Negadas este mês', valor: '38', delta: '5% abaixo do mês anterior', tom: 'bom', seta: 'baixo' },
];

const COR: Record<Tom, string> = { bom: 'text-state-success-text', ruim: 'text-text-error-primary', neutro: 'text-text-secondary' };
const SETA = { cima: RiArrowUpLine, baixo: RiArrowDownLine, lado: RiArrowRightLine };

const DETALHE = [
  ['2025/04812', 'Imperatriz', 'Cardiologia'],
  ['2025/04790', 'Caxias', 'Oncologia'],
  ['2025/04755', 'Balsas', 'Neurologia'],
];

/** Zona superior de um dashboard: rótulo preciso, período, variação com contexto e detalhamento em drawer. */
export function IndicadoresDemo() {
  const [aberto, setAberto] = useState(false);
  return (
    <Moldura legenda="Alta em Aguardando parecer é piora, por isso o delta está em vermelho. Acione o primeiro número para abrir o detalhamento.">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="rounded-lg bg-background-secondary-default px-3 py-1.5 text-caption-1-semibold text-text-primary">Período: Nov 2025</p>
        <Button variant="secondary" size="small" leadingIcon={RiDownload2Line}>Exportar</Button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {INDICADORES.map((i, idx) => {
          const Seta = SETA[i.seta];
          return (
            <li key={i.rotulo} className="rounded-2xl border border-border-button-default bg-background-primary-default p-4">
              <p className="text-caption-1-medium text-text-secondary">{i.rotulo}</p>
              {idx === 0 ? (
                <button type="button" onClick={() => setAberto(true)} className="mt-1 cursor-pointer text-title-1-semibold text-text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                  {i.valor}
                </button>
              ) : (
                <p className="mt-1 text-title-1-semibold text-text-primary">{i.valor}</p>
              )}
              <p className={`mt-1 flex items-center gap-1 text-caption-1-medium ${COR[i.tom]}`}>
                <Seta className="size-4" aria-hidden />
                {i.delta}
              </p>
              {i.meta ? (
                <div className="mt-3" role="img" aria-label={`${i.meta}% da meta mensal`}>
                  <div className="h-1.5 rounded-full bg-background-tertiary-default"><div className="h-full rounded-full bg-text-primary" style={{ width: `${i.meta}%` }} /></div>
                  <p className="mt-1 text-caption-2-medium text-text-secondary">{i.meta}% da meta mensal</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <Drawer isOpen={aberto} onOpenChange={setAberto} title="Aguardando parecer médico" description="Dashboard, Solicitações aguardando, Filtro: Nov 2025" size="md">
        <table className="w-full text-start text-body-regular">
          <caption className="sr-only">Solicitações aguardando parecer médico</caption>
          <thead>
            <tr className="border-b border-separator-border text-caption-1-semibold text-text-secondary">
              <th scope="col" className="py-2 text-start">Processo</th>
              <th scope="col" className="py-2 text-start">Município</th>
              <th scope="col" className="py-2 text-start">Especialidade</th>
            </tr>
          </thead>
          <tbody>
            {DETALHE.map((l) => (
              <tr key={l[0]} className="border-b border-separator-border last:border-b-0">
                {l.map((c, j) => <td key={c} className={`py-2.5 ${j === 0 ? 'text-body-medium text-text-primary' : 'text-text-secondary'}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-caption-1-medium text-text-secondary">Mostrando 1 a 3 de 127 registros.</p>
      </Drawer>
    </Moldura>
  );
}
