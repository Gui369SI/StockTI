-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Perfis de Usuário
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'solicitante', -- 'solicitante' ou 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT
);

-- Tabela de Insumos / Estoque
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    quantity_stock INT NOT NULL DEFAULT 0,
    min_quantity_warning INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Requisições de Insumos
CREATE TABLE IF NOT EXISTS requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    status TEXT NOT NULL DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado', 'entregue'
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserção de Dados Iniciais de Teste
INSERT INTO categories (name, description) VALUES
('Papelaria', 'Resmas, cadernos e insumos de papel'),
('Impressão', 'Toners, cartuchos e tintas'),
('Periféricos', 'Mouses, teclados, cabos e adaptadores');

INSERT INTO items (name, description, quantity_stock, min_quantity_warning) VALUES
('Resma de Papel A4', 'Caixa/Pacote com 500 folhas A4', 50, 10),
('Toner Impressora HP Laser', 'Toner preto para impressoras do setor administrativo', 8, 2),
('Mouse USB Optico', 'Mouse preto padrão USB', 15, 3),
('Teclado ABNT2 USB', 'Teclado com fio padrão', 12, 3);