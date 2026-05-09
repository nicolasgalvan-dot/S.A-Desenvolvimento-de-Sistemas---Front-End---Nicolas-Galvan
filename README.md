# FinTech Flow - Frontend

Projeto frontend do FinTech Flow desenvolvido com Vite + React.

**Este é um repositório independente do backend.** Para o backend completo, acesse o repositório separado.

## Configuração do Ambiente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
VITE_API_URL=http://localhost:3333/api
```

### 3. Iniciar o Projeto
```bash
npm run dev
```

## Estrutura do Projeto

- `src/pages/` - Páginas da aplicação
- `src/components/` - Componentes reutilizáveis
- `src/contexts/` - Contextos React (Auth, etc.)
- `src/services/` - Serviços de API
- `src/routes/` - Configuração de rotas

## Como Funciona em Diferentes Máquinas

1. **Clone o repositório**: `git clone [URL]`
2. **Instale dependências**: `npm install`
3. **Copie o .env.example**: `cp .env.example .env`
4. **Configure suas variáveis**: Edite o `.env` com suas configurações locais
5. **Execute**: `npm run dev`

## Importante

- O arquivo `.env` nunca deve ser commitado
- Use o `.env.example` como template
- Configure as URLs conforme seu ambiente local

## Integração com Backend

Para integração completa, certifique-se que:
- Backend está rodando em `http://localhost:3333`
- Variável `VITE_API_URL` no `.env` aponta para o backend
- Frontend estará disponível em `http://localhost:5173` (ou porta próxima disponível)
