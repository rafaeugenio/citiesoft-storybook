import {
  RiAddLine, RiArchiveLine, RiArrowDownSLine, RiArrowLeftLine, RiArrowRightLine, RiArrowRightSLine, RiArrowUpLine,
  RiCalendarLine, RiCheckLine, RiCloseLine, RiEditLine, RiEyeLine, RiFileCopyLine, RiGlobalLine, RiGroupLine,
  RiHomeLine, RiInformationFill, RiMailLine, RiMenuLine, RiMoreFill, RiNotificationLine, RiSearchLine, RiShieldCheckLine, RiUserLine,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';
import { Copiar } from './Copiar';

type Icone = RemixiconComponentType;

const ICONES: [string, Icone][] = [
  ['RiSearchLine', RiSearchLine], ['RiMenuLine', RiMenuLine], ['RiEditLine', RiEditLine], ['RiAddLine', RiAddLine],
  ['RiCloseLine', RiCloseLine], ['RiCheckLine', RiCheckLine], ['RiFileCopyLine', RiFileCopyLine], ['RiMoreFill', RiMoreFill],
  ['RiArrowRightSLine', RiArrowRightSLine], ['RiArrowDownSLine', RiArrowDownSLine], ['RiArrowLeftLine', RiArrowLeftLine], ['RiArrowRightLine', RiArrowRightLine],
  ['RiArrowUpLine', RiArrowUpLine], ['RiCalendarLine', RiCalendarLine], ['RiGroupLine', RiGroupLine], ['RiUserLine', RiUserLine],
  ['RiGlobalLine', RiGlobalLine], ['RiShieldCheckLine', RiShieldCheckLine], ['RiInformationFill', RiInformationFill], ['RiArchiveLine', RiArchiveLine],
  ['RiMailLine', RiMailLine], ['RiEyeLine', RiEyeLine], ['RiNotificationLine', RiNotificationLine], ['RiHomeLine', RiHomeLine],
];

/** Nome da classe da webfont: RiSearchLine vira ri-search-line. */
const classeWebfont = (nome: string) => 'ri-' + nome.slice(2).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Grade dos ícones mais usados nos componentes. Clique para copiar o nome. */
export function GradeDeIcones() {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2">
      {ICONES.map(([nome, Componente]) => (
        <li key={nome}>
          <Copiar texto={nome} className="flex w-full flex-col items-center gap-2 rounded-2xl border border-border-button-default p-4 hover:bg-background-secondary-default">
            <Componente className="size-6 text-foreground-icon-primary" aria-hidden />
            <span className="break-all text-center font-mono text-caption-2-medium text-text-primary">{nome}</span>
            <span className="font-mono text-caption-2-medium text-text-secondary">{classeWebfont(nome)}</span>
          </Copiar>
        </li>
      ))}
    </ul>
  );
}

const TAMANHOS: [number, string, string][] = [
  [14, 'size-3.5', 'Botão xs'],
  [16, 'size-4', 'Controles compactos, chips'],
  [18, 'size-[18px]', 'Botão small'],
  [20, 'size-5', 'Botão medium, campos, menus'],
  [24, 'size-6', 'Destaque, estados vazios'],
];

/** Os cinco tamanhos que aparecem nos componentes. */
export function TamanhosDeIcone() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-button-default">
      <table className="w-full min-w-[480px] border-collapse text-body-regular">
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            {['Ícone', 'Tamanho', 'Tailwind', 'Onde aparece'].map((h) => <th key={h} scope="col" className="px-3 py-2 text-start font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {TAMANHOS.map(([px, classe, uso]) => (
            <tr key={px} className="border-b border-border-button-default last:border-b-0">
              <td className="px-3 py-2"><RiSearchLine style={{ width: px, height: px }} aria-hidden /></td>
              <td className="px-3 py-2 font-mono text-caption-1-semibold">{px}px</td>
              <td className="px-3 py-2"><code className="font-mono text-caption-1-medium">{classe}</code></td>
              <td className="px-3 py-2 text-text-secondary">{uso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
