<div align="center">
  <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=200&h=200&fit=crop" alt="Car Luxe Logo Placeholder" width="120" style="border-radius: 20px; margin-bottom: 20px;" />
  <h1>CAR LUXE — Sistema de Gestão para Estética Automotiva</h1>
  <p><i>O futuro da gestão automotiva premium: Agendamentos, Controle de Pátio e Fluxo de Caixa.</i></p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

---

## 📸 Telas do Sistema

> *Nota: Substitua os links das imagens por screenshots reais do sistema.*

### 🌐 Site Público
| Agendamento Online | Orçamento Dinâmico | Acompanhamento do Carro |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/400x250/1A1A1A/D4AF37?text=Tela+Agendamento" alt="Agendamento"> | <img src="https://via.placeholder.com/400x250/1A1A1A/D4AF37?text=Tela+Orçamento" alt="Orçamento"> | <img src="https://via.placeholder.com/400x250/1A1A1A/D4AF37?text=Tela+Tracking" alt="Tracking"> |

### 🔧 Dashboard Admin
| Visão Geral & Métricas | Kanban de Serviços (Pátio) | Ficha da OS |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/400x250/1A1A1A/D4AF37?text=Dashboard+Principal" alt="Dashboard"> | <img src="https://via.placeholder.com/400x250/1A1A1A/D4AF37?text=Gestao+Kanban" alt="Kanban"> | <img src="https://via.placeholder.com/400x250/1A1A1A/D4AF37?text=Detalhe+Ordem+Servico" alt="OS"> |

---

## ✨ Funcionalidades

| 🌐 Site Público (Para o Cliente) | 🔧 Dashboard Admin (Gestão Interna) |
| :--- | :--- |
| **Agendamento Online:** Marcação de horários integrada em tempo real. | **Gestão Visual Kanban:** Controle visual de status (Fila, Lavagem, Polimento, Pronto). |
| **Orçamentos Interativos:** Cálculo de preços por porte e combinação de serviços. | **Ordens de Serviço (OS):** Criação, edição e detalhamento de cada serviço executado. |
| **Acompanhamento (Tracking):** Consulta online do status do veículo pelo cliente. | **Base de Clientes e Veículos:** CRM completo e histórico de manutenções. |
| **Institucional:** Vitrine de serviços premium, tabela de preços e diferenciais. | **Dashboard Financeiro:** Visão geral de faturamento e agendamentos do dia. |
| **Botão Flutuante:** Encaminhamento direto para atendimento via WhatsApp. | **Integrações (n8n):** Documentação de API nativa para automações via WhatsApp. |

---

## 🛠️ Stack Tecnológica

- **Frontend:** React.js, construído com Vite, estilizado com Tailwind CSS e Framer Motion (para animações de alto nível).
- **Backend (BaaS):** Supabase (PostgreSQL para dados relacionais e em tempo real).
- **Storage & Auth:** Supabase Auth e Supabase Storage (pronto para expansão).
- **Automação:** Preparado para integrações webhook com n8n (WhatsApp / CRM).

---

## 📂 Estrutura do Projeto (Monorepo)

```text
carluxe/
├── apps/
│   ├── site/                 # Frontend Público (Landing page, Agendamentos)
│   │   ├── src/pages/        # Home, Booking, Services, Tracking, etc.
│   │   └── src/components/   # Componentes globais (Layout, Header, Footer)
│   └── dashboard/            # Painel Administrativo (Gestão Interna)
│       ├── src/pages/        # Dashboard, Kanban, Clientes, OS detalhada
│       └── src/components/   # Tabelas, Modais, Kanban Boards
├── package.json              # Configurações do Monorepo (Workspaces)
└── README.md                 # Documentação do projeto
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js (v18+)
- Conta no Supabase (para o banco de dados)

### Passo a Passo

1. **Clone o repositório e instale as dependências:**
```bash
git clone https://github.com/SEU_USUARIO/carluxe.git
cd carluxe
npm install
```

2. **Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz dos aplicativos (ou na raiz do projeto) com as credenciais do seu projeto Supabase:
```env
VITE_SUPABASE_URL=https://sua-url-do-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

3. **Inicie os Servidores de Desenvolvimento:**
```bash
# Para rodar o site público e o dashboard simultaneamente
npm run dev --workspaces
```
- **Site Público:** `http://localhost:5174` (normalmente)
- **Dashboard:** `http://localhost:5173` (normalmente)

---

## 🗄️ Banco de Dados (Supabase SQL)

Abaixo está o **código SQL de criação das tabelas principais**. Caso precise mudar a conta do Supabase ou recriar a estrutura do zero, basta rodar este script no `SQL Editor` do seu novo projeto Supabase:

```sql
-- 1. Tabela de Clientes
CREATE TABLE public.clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    cpf TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Veículos
CREATE TABLE public.veiculos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    marca TEXT,
    modelo TEXT,
    ano TEXT,
    placa TEXT UNIQUE,
    cor TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Catálogo de Serviços
CREATE TABLE public.servicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT,
    preco NUMERIC(10,2) DEFAULT 0.00,
    descricao TEXT
);

-- 4. Tabela de Agendamentos (Feitos pelo Site)
CREATE TABLE public.agendamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE CASCADE,
    data_agendamento DATE,
    horario TEXT,
    servicos JSONB, -- Pode guardar um array de IDs ou Nomes
    status TEXT DEFAULT 'pendente', -- pendente, confirmado, convertido, cancelado
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tabela de Ordens de Serviço (OS - Dashboard)
CREATE TABLE public.ordens_servico (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE CASCADE,
    data_entrada DATE,
    previsao_entrega DATE,
    placa TEXT,
    status TEXT DEFAULT 'fila', -- fila, lavagem, polimento, finalizado
    total NUMERIC(10,2) DEFAULT 0.00,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Tabela Relacional (Serviços adicionados dentro de uma OS)
CREATE TABLE public.os_servicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    os_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
    servico_id UUID REFERENCES public.servicos(id) ON DELETE CASCADE,
    preco_cobrado NUMERIC(10,2) DEFAULT 0.00
);

-- (Opcional) Políticas de Segurança (RLS - Row Level Security)
-- Por padrão as tabelas são acessíveis, mas você pode ativá-las:
-- ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
```
