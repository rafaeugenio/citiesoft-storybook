import type { Abas } from '../Layout';

export const microcopyProduto: Abas = {
  'Erros': { codigo: `Validação de campo
CPF inválido. Verifique os 11 dígitos e tente novamente.

Conflito de datas
A data de retorno não pode ser anterior à data de saída.

Valor fora do limite
Valor excede o limite aprovado para esta categoria (R$ 500,00).

Falha de conexão
Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.

Permissão insuficiente
Sem permissão para aprovar lançamentos desta secretaria.
Solicite acesso ao administrador do sistema.

Sessão expirada
Sessão encerrada por inatividade. Faça login para continuar.

Duplicidade
Já existe um lançamento registrado para este servidor nesta data.
Revise o período ou edite o lançamento existente.`, linguagem: 'text' },
  'Sucesso': { codigo: `Diária lançada com sucesso.
Prestação de contas enviada para o gestor responsável.
Lançamento excluído.
Beneficiário cadastrado. O acesso será liberado em até 24 horas.
Relatório exportado. O download iniciará em instantes.
Solicitação de TFD aprovada e encaminhada para a secretaria.`, linguagem: 'text' },
  'Carregamento': { codigo: `Consultando registros da secretaria...
Gerando relatório de prestação de contas...
Validando dados do servidor junto ao cadastro...
Processando lançamento de diária...
Sincronizando com o sistema de gestão municipal...`, linguagem: 'text' },
  'Estado vazio': { codigo: `Lista de lançamentos
Nenhum lançamento registrado neste período.
Adicione o primeiro lançamento para começar.
[Botão: Adicionar lançamento]

Busca sem resultado
Nenhum resultado encontrado para os filtros aplicados.
Ajuste os critérios de busca ou limpe os filtros.
[Botão: Limpar filtros]

Documentos anexados
Nenhum documento anexado a esta solicitação.
Adicione os comprovantes obrigatórios antes de enviar.
[Botão: Anexar documento]`, linguagem: 'text' },
  'Modal': { codigo: `Exclusão irreversível
Título: Excluir lançamento?
Corpo: Esta ação não pode ser desfeita. O lançamento de diária de 15/06/2026
       para João Silva será removido permanentemente.
Botão principal: Excluir lançamento
Botão secundário: Cancelar

Envio para aprovação
Título: Enviar para aprovação?
Corpo: A prestação de contas do período 01/05 a 31/05/2026 será encaminhada
       ao gestor. Após o envio, o documento não poderá ser editado.
Botão principal: Enviar para aprovação
Botão secundário: Cancelar`, linguagem: 'text' },
  'Ajuda': { codigo: `Tooltip de campo
Data de referência: mês e ano a que se refere o lançamento,
independentemente da data de pagamento.

Texto de apoio abaixo do campo
Informe o número do processo SEI vinculado a esta despesa.
Exemplo: 12345.678901/2026-01`, linguagem: 'text' },
};
