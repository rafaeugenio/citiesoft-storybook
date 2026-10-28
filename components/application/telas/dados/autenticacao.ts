/** Textos e credenciais fictícias das telas de autenticação. */
export const CREDENCIAIS_EXEMPLO = {
  email: "mariana.souza@saude.ma.gov.br",
  cpf: "111.444.777-35",
  senha: "Citiesoft@2026",
  codigo: "123456",
} as const;

export const ERRO_CREDENCIAL = "E-mail ou senha incorretos. Tente novamente.";
export const ERRO_CREDENCIAL_CPF = "CPF ou senha incorretos. Tente novamente.";

export const RODAPE_AUTENTICACAO = "Precisa de ajuda? Fale com o suporte da sua secretaria. Versão 2.4.0";

export const TENTATIVAS_MAXIMAS_2FA = 3;
export const ESPERA_REENVIO_SEGUNDOS = 30;
