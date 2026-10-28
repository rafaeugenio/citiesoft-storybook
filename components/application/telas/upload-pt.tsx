"use client";

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { FileUpload, type FileUploadProps } from "@/components/base/file-upload/file-upload";
import { TemplateCopyProvider } from "@/components/foundations/template-copy/template-copy";

const MAPA: Record<string, string> = {
  "Upload a file": "Anexar arquivo",
  "Choose a file to upload": "Escolher arquivo para anexar",
  "Drag and drop to upload or ": "Arraste e solte para anexar ou ",
  select: "selecione",
  "Uploaded successfully!": "Anexado com sucesso!",
  "Uploading ": "Enviando ",
  " (max ": " (máx. ",
};

function traduzirTexto(texto: string): string {
  if (MAPA[texto]) return MAPA[texto];
  const ext = /^Only (.+) files are supported$/.exec(texto);
  if (ext) return `Formatos aceitos: ${ext[1]}`;
  const grande = /^That file is larger than (.+)$/.exec(texto);
  if (grande) return `O arquivo excede ${grande[1]}`;
  return texto;
}

function visitar(no: ReactNode): ReactNode {
  if (typeof no === "string") return traduzirTexto(no);
  if (Array.isArray(no)) return no.map(visitar);
  if (!isValidElement(no)) return no;
  const elemento = no as ReactElement<{ children?: ReactNode; "aria-label"?: string }>;
  const { children, "aria-label": rotulo } = elemento.props;
  // O campo de arquivo aninhado no botão de soltar viola "nested-interactive".
  // Oculto, ele segue abrindo o seletor por `click()` e sai da árvore de acessibilidade.
  const arquivo = elemento.type === "input" && (elemento.props as { type?: string }).type === "file";
  const props = rotulo || arquivo ? { ...(rotulo ? { "aria-label": traduzirTexto(rotulo) } : {}), ...(arquivo ? { hidden: true } : {}) } : undefined;
  if (children === undefined) return props ? cloneElement(elemento, props) : elemento;
  const filhos = Array.isArray(children) ? children.map(visitar) : [visitar(children)];
  return cloneElement(elemento, props, ...filhos);
}

const semTraducao = (texto: string) => texto;

/**
 * FileUpload base com os textos em português do Brasil. O componente base traz os
 * rótulos em inglês; a tradução entra pelo provedor de texto de template, sem
 * alterar o componente.
 */
export function UploadPt(props: FileUploadProps) {
  return (
    <TemplateCopyProvider translate={semTraducao} render={visitar as <T,>(no: T) => T}>
      <FileUpload {...props} />
    </TemplateCopyProvider>
  );
}
