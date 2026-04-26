export interface Cliente {
  id?: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpf_cnpj?: string;
  criado_em?: string;
}

export interface Veiculo {
  id?: string;
  cliente_id: string;
  marca: string;
  modelo: string;
  placa: string;
  cor?: string;
  ano?: number;
  criado_em?: string;
}

export interface Servico {
  id?: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao_estimada?: string;
  criado_em?: string;
}

export interface Insumo {
  id?: string;
  nome: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  estoque_minimo?: number;
  criado_em?: string;
}

export interface Agendamento {
  id?: string;
  cliente_id: string;
  veiculo_id: string;
  data_hora: string;
  servicos: string[];
  status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
  observacoes?: string;
  criado_em?: string;
}

export interface OrdemServico {
  id?: string;
  cliente_id: string;
  veiculo_id: string;
  status: 'entrada' | 'execucao' | 'finalizacao' | 'pronto' | 'entregue' | 'cancelado';
  servicos: string[];
  valor_total: number;
  fotos?: string[];
  observacoes?: string;
  criado_em?: string;
  data_saida?: string;
}
