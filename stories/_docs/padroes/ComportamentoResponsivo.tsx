import { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { Moldura } from './Moldura';

const PONTOS = [375, 768, 1366] as const;

const LINHAS = [
  { id: 'L-1042', servidor: 'Ana Paula Ribeiro', destino: 'Imperatriz', periodo: '15/06 a 17/06', valor: 'R$ 1.440,00', status: 'Aprovada', cor: 'lime' as const },
  { id: 'L-1041', servidor: 'Carlos Menezes', destino: 'Caxias', periodo: '10/06 a 11/06', valor: 'R$ 960,00', status: 'Em análise', cor: 'cyan' as const },
  { id: 'L-1040', servidor: 'Marta Lima', destino: 'Balsas', periodo: '02/06 a 05/06', valor: 'R$ 2.160,00', status: 'Devolvida', cor: 'yellow' as const },
];

/** Tabela de 6 colunas que vira lista de cards em 375 px, com a largura do contêiner simulada. */
export function TabelaOuCardsDemo() {
  const [largura, setLargura] = useState<number>(375);
  const cards = largura < 768;
  return (
    <Moldura legenda="Simula a largura do viewport. Os mesmos dados e ações existem nos dois formatos.">
      <div role="group" aria-label="Largura simulada" className="mb-4 flex flex-wrap gap-2">
        {PONTOS.map((p) => (
          <Button key={p} size="small" variant={largura === p ? 'primary' : 'secondary'} aria-pressed={largura === p} onClick={() => setLargura(p)}>{p}px</Button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border-button-default p-3">
        <div style={{ width: largura, maxWidth: '100%' }} className="mx-auto">
          {cards ? (
            <ul className="flex flex-col gap-3">
              {LINHAS.map((l) => (
                <li key={l.id} className="rounded-2xl border border-border-button-default bg-background-primary-default px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <Chip variant="caption" color={l.cor}>{l.status}</Chip>
                    <span className="text-caption-1-medium text-text-secondary">{l.periodo}</span>
                  </div>
                  <p className="mt-2 text-body-medium text-text-primary">{l.servidor}</p>
                  <dl className="mt-1 grid grid-cols-2 gap-2">
                    <div><dt className="text-caption-1-medium text-text-secondary">Destino</dt><dd className="text-body-regular text-text-primary">{l.destino}</dd></div>
                    <div><dt className="text-caption-1-medium text-text-secondary">Valor</dt><dd className="text-body-regular text-text-primary">{l.valor}</dd></div>
                  </dl>
                  <div className="mt-3"><Button className="min-h-11" size="small" variant="secondary">Ver detalhes</Button></div>
                </li>
              ))}
            </ul>
          ) : (
            <table className="w-full border-collapse text-body-regular">
              <caption className="sr-only">Lançamentos de diárias</caption>
              <thead>
                <tr className="border-b border-border-button-default text-caption-1-semibold text-text-secondary">
                  {['Código', 'Servidor', 'Destino', 'Período', 'Valor', 'Situação'].map((c) => <th key={c} scope="col" className="px-2 py-2 text-start">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {LINHAS.map((l) => (
                  <tr key={l.id} className="border-b border-border-button-default last:border-b-0">
                    <td className="px-2 py-2.5 text-body-medium text-text-primary">{l.id}</td>
                    <td className="px-2 py-2.5 text-text-primary">{l.servidor}</td>
                    <td className="px-2 py-2.5 text-text-secondary">{l.destino}</td>
                    <td className="px-2 py-2.5 text-text-secondary">{l.periodo}</td>
                    <td className="px-2 py-2.5 text-text-secondary">{l.valor}</td>
                    <td className="px-2 py-2.5"><Chip variant="caption" color={l.cor}>{l.status}</Chip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Moldura>
  );
}
