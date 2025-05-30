\# 💈 Barbearia API

API para controle de agendamentos de uma barbearia com dois barbeiros, horários flexíveis, serviços de corte de cabelo, barba e pintura.

Desenvolvida com Node.js, Express, Supabase (PostgreSQL), JWT para autenticação e hospedagem no Railway.

\---

\## 🛠️ Tecnologias Utilizadas

- \*\*Linguagem & Framework\*\*: Node.js, Express
- \*\*Banco de Dados\*\*: Supabase (PostgreSQL)
- \*\*Autenticação\*\*: JSON Web Token (JWT), Bcrypt
- \*\*Variáveis de Ambiente\*\*: dotenv
- \*\*Hospedagem\*\*: Railway
- \*\*CORS\*\*: cors
- \*\*Desenvolvimento\*\*: nodemon

\---

\## 📁 Estrutura de Pastas

barbearia-api/

├── node\_modules/

├── src/

│ ├── config/

│ │ └── supabase.js # Conexão com Supabase

│ ├── controllers/

│ │ ├── auth.controller.js # Registro e login (JWT)

│ │ ├── servico.controller.js # Listar/criar serviços

│ │ └── barbeiro.controller.js# Disponibilidade/indisponibilidade

│ ├── middlewares/

│ │ ├── auth.middleware.js # Validação do token JWT

│ │ └── authorize.middleware.js # Autorização por tipo de usuário

│ ├── routes/

│ │ ├── auth.routes.js # Rotas de registro e login

│ │ ├── servico.routes.js # Rotas de serviços

│ │ ├── barbeiro.routes.js # Rotas de barbeiro (disponibilidades)

│ │ └── index.js # Agrega todas as rotas em /api

│ ├── services/

│ │ ├── user.service.js # (opcional) lógica de usuário

│ │ ├── servico.service.js # Lógica de CRUD de serviços

│ │ └── barbeiro.service.js # Lógica de disponibilidade/indisponibilidade

│ ├── utils/

│ │ └── jwt.js # Geração e verificação de JWT

│ └── app.js # Configuração do Express (middlewares globais)

├── .env # Variáveis de ambiente

├── .gitignore

├── package.json

└── server.js # Ponto de entrada: importa app e inicia servidor

yaml

Copiar

Editar

\---

\## 🔧 Instalação e Execução

1. \*\*Clone o repositório\*\*

\```bash

git clone https://github.com/seu-usuario/barbearia-api.git

cd barbearia-api

Instale as dependências

bash

Copiar

Editar

npm install

Configure o arquivo .env

Na raiz do projeto, crie um arquivo .env com as seguintes variáveis:

env

Copiar

Editar

PORT=3000

SUPABASE\_URL=https://<seu-projeto>.supabase.co

SUPABASE\_KEY=<sua-service-role-key>

JWT\_SECRET=umaChaveMuitoSecreta

PORT: porta em que a API vai rodar (padrão 3000).

SUPABASE\_URL: URL do seu projeto Supabase.

SUPABASE\_KEY: chave de API (service\_role) do Supabase.

JWT\_SECRET: chave secreta para assinar e verificar tokens JWT.

Scripts no package.json

Confirme que seu package.json tem:

json

Copiar

Editar

"scripts": {

"start": "node server.js",

"dev": "nodemon server.js"

}

Executar em modo desenvolvimento

bash

Copiar

Editar

npm run dev

A API estará disponível em http://localhost:3000/api/....

🗄️ Modelagem do Banco de Dados (Supabase)

Abra o SQL Editor no Supabase e execute os scripts abaixo em sequência:

1. Tabela users

sql

Copiar

Editar

CREATE TABLE users (

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

nome TEXT        NOT NULL,

email TEXT UNIQUE NOT NULL,

telefone TEXT,

senha TEXT       NOT NULL,

tipo TEXT CHECK (tipo IN ('cliente','barbeiro')) NOT NULL,

criado\_em TIMESTAMP DEFAULT NOW()

);

Campos:

id: chave primária (UUID).

nome, email, telefone: dados de contato.

senha: hash da senha (bcrypt).

tipo: define se é cliente ou barbeiro.

criado\_em: data de criação automática.

1. Tabela barbeiros

sql

Copiar

Editar

CREATE TABLE barbeiros (

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

user\_id UUID REFERENCES users(id) ON DELETE CASCADE,

nome\_exibicao TEXT NOT NULL

);

Campos:

id: chave primária (UUID).

user\_id: referência a users(id) (é necessário cadastrar o usuário antes).

nome\_exibicao: nome público (pode ser igual a users.nome).

1. Tabela servicos

sql

Copiar

Editar

CREATE TABLE servicos (

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

nome TEXT NOT NULL,

duracao INT NOT NULL,      -- duração em minutos

preco NUMERIC(10,2) NOT NULL

);

Campos:

id: chave primária (UUID).

nome: nome do serviço (e.g. “Corte de cabelo”).

duracao: duração em minutos.

preco: em moeda local (R$).

1. Tabela disponibilidades

sql

Copiar

Editar

CREATE TABLE disponibilidades (

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

barbeiro\_id UUID REFERENCES barbeiros(id) ON DELETE CASCADE,

dia\_semana INT CHECK (dia\_semana BETWEEN 0 AND 6) NOT NULL,

hora\_inicio TIME NOT NULL,

hora\_fim TIME NOT NULL

);

Campos:

id: chave primária (UUID).

barbeiro\_id: referência a barbeiros(id).

dia\_semana: 0=domingo, 1=segunda, …, 6=sábado.

hora\_inicio, hora\_fim: intervalo fixo de atendimento semanal.

1. Tabela indisponibilidades

sql

Copiar

Editar

CREATE TABLE indisponibilidades (

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

barbeiro\_id UUID REFERENCES barbeiros(id) ON DELETE CASCADE,

data DATE NOT NULL,

hora\_inicio TIME NOT NULL,

hora\_fim TIME NOT NULL,

motivo TEXT

);

Campos:

id: chave primária (UUID).

barbeiro\_id: referência a barbeiros(id).

data: data específica da indisponibilidade.

hora\_inicio, hora\_fim: horário na data indicada.

motivo: texto opcional (ex: “Folga”, “Compromisso”).

🔐 Autenticação com JWT

A autenticação utiliza bcrypt para criptografar senhas e JWT para gerar tokens que guardam id e tipo do usuário.

1. Gerador de Token

src/utils/jwt.js:

js

Copiar

Editar

const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {

return jwt.sign(payload, process.env.JWT\_SECRET, { expiresIn: '7d' });

};

exports.verifyToken = (token) => {

return jwt.verify(token, process.env.JWT\_SECRET);

};

Recebe um payload (ex: { id: user.id, tipo: user.tipo })

Gera um token válido por 7 dias.

1. Middlewares
   1. auth.middleware.js

Valida se o token JWT está presente e é válido. Insere req.user = { id, tipo }:

js

Copiar

Editar

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

const authHeader = req.headers['authorization'];

const token = authHeader?.split(' ')[1];

if (!token) {

return res.status(401).json({ error: 'Token não fornecido' });

}

try {

const decoded = jwt.verify(token, process.env.JWT\_SECRET);

req.user = decoded; // ex: { id: 'uuid', tipo: 'barbeiro' }

next();

} catch {

return res.status(401).json({ error: 'Token inválido' });

}

};

1. authorize.middleware.js

Verifica se o req.user.tipo está na lista de tipos permitidos:

js

Copiar

Editar

module.exports = function permitTipos(...tiposPermitidos) {

return (req, res, next) => {

if (!tiposPermitidos.includes(req.user.tipo)) {

return res.status(403).json({ error: 'Acesso negado: permissões insuficientes' });

}

next();

};

};

Exemplo de uso: authorize('barbeiro') garante que só barbeiros acessem.

📦 Endpoints Disponíveis

Todas as rotas ficam em /api (por causa do app.use('/api', routes) em app.js).

🧍‍♂️ Autenticação

POST /api/auth/register

Descrição: cadastro de usuário (cliente ou barbeiro).

Body (JSON):

json

Copiar

Editar

{

"nome": "João Silva",

"email": "joao@mail.com",

"telefone": "11999999999",

"senha": "123456",

"tipo": "barbeiro"        // “cliente” ou “barbeiro”

}

Fluxo:

Cria registro na tabela users.

Se tipo === "barbeiro", também insere em barbeiros (campo user\_id e nome\_exibicao = nome).

Gera token JWT com { id: user.id, tipo: user.tipo }.

Resposta (200):

json

Copiar

Editar

{

"user": {

"id": "...",

"nome": "João Silva",

"email": "joao@mail.com",

"telefone": "11999999999",

"tipo": "barbeiro",

"criado\_em": "2025-05-30T12:34:56.789Z"

},

"token": "<JWT\_TOKEN>"

}

POST /api/auth/login

Descrição: login de usuário existente.

Body (JSON):

json

Copiar

Editar

{

"email": "joao@mail.com",

"senha": "123456"

}

Fluxo:

Busca usuário na tabela users pelo email.

Compara senha com bcrypt.compare.

Gera token JWT com { id: user.id, tipo: user.tipo }.

Resposta (200):

json

Copiar

Editar

{

"user": {

"id": "...",

"nome": "João Silva",

"email": "joao@mail.com",

"telefone": "11999999999",

"tipo": "barbeiro",

"criado\_em": "2025-05-30T12:34:56.789Z"

},

"token": "<JWT\_TOKEN>"

}

💇‍♂️ Serviços

GET /api/servicos

Descrição: lista todos os serviços cadastrados.

Autorização: não requer token (podemos disponibilizar publicamente).

Resposta (200):

json

Copiar

Editar

[

{

"id": "...",

"nome": "Corte de cabelo",

"duracao": 60,

"preco": 50.00

},

{

"id": "...",

"nome": "Barba",

"duracao": 60,

"preco": 40.00

}

// ...

]

POST /api/servicos

Descrição: cadastra um novo serviço (exclusivo para barbeiros/admins).

Autorização:

Header: Authorization: Bearer <JWT\_TOKEN>

Middlewares: auth → authorize('barbeiro')

Body (JSON):

json

Copiar

Editar

{

"nome": "Pintura",

"duracao": 60,

"preco": 70.00

}

Resposta (201):

json

Copiar

Editar

{

"id": "...",

"nome": "Pintura",

"duracao": 60,

"preco": 70.00

}

💈 Barbeiros – Disponibilidade & Indisponibilidade

GET /api/barbeiros/:id/disponibilidade?dia\_semana=<0-6>

Descrição: retorna todas as disponibilidades fixas do barbeiro em determinado dia da semana.

Parâmetros:

:id (path): UUID do barbeiro (tabela barbeiros.id).

Query String:

dia\_semana = número de 0 a 6 (0=domingo, 1=segunda, … 6=sábado).

Autorização:

Header: Authorization: Bearer <JWT\_TOKEN>

Middlewares: auth (qualquer usuário logado pode ver disponibilidade).

Exemplo de requisição:

bash

Copiar

Editar

GET /api/barbeiros/123e4567-e89b-12d3-a456-426614174000/disponibilidade?dia\_semana=1

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...

Resposta (200):

json

Copiar

Editar

[

{

"id": "...",

"barbeiro\_id": "123e4567-e89b-12d3-a456-426614174000",

"dia\_semana": 1,

"hora\_inicio": "09:00:00",

"hora\_fim": "17:00:00"

},

{

"id": "...",

"barbeiro\_id": "123e4567-e89b-12d3-a456-426614174000",

"dia\_semana": 1,

"hora\_inicio": "18:00:00",

"hora\_fim": "20:00:00"

}

]

POST /api/barbeiros/:id/disponibilidade

Descrição: cadastra uma nova disponibilidade fixa semanal para o barbeiro.

Parâmetros:

:id (path): UUID do barbeiro.

Autorização:

Header: Authorization: Bearer <JWT\_TOKEN>

Middlewares: auth → authorize('barbeiro')

(apenas o próprio barbeiro ou admin deve adicionar)

Body (JSON):

json

Copiar

Editar

{

"dia\_semana": 1,

"hora\_inicio": "09:00",

"hora\_fim": "17:00"

}

Fluxo:

Verifica se o barbeiro com id existe em barbeiros.

Insere em disponibilidades.

Respostas possíveis:

201 Created:

json

Copiar

Editar

{

"id": "...",

"barbeiro\_id": "123e4567-e89b-12d3-a456-426614174000",

"dia\_semana": 1,

"hora\_inicio": "09:00:00",

"hora\_fim": "17:00:00"

}

404 Not Found (barbeiro não existe):

json

Copiar

Editar

{ "error": "Barbeiro não encontrado" }

400 Bad Request (campo inválido):

json

Copiar

Editar

{ "error": "Campos inválidos ou ausentes" }

POST /api/barbeiros/:id/indisponibilidades

Descrição: cadastra uma indisponibilidade específica (folga, feriado, cancelamento).

Parâmetros:

:id (path): UUID do barbeiro.

Autorização:

Header: Authorization: Bearer <JWT\_TOKEN>

Middlewares: auth → authorize('barbeiro')

Body (JSON):

json

Copiar

Editar

{

"data": "2025-06-15",

"hora\_inicio": "14:00",

"hora\_fim": "17:00",

"motivo": "Folga"

}

data: formato YYYY-MM-DD

hora\_inicio e hora\_fim: formato HH:mm (o banco armazena como TIME)

motivo: campo opcional para texto explicativo

Fluxo:

Verifica se o barbeiro existe em barbeiros.

Insere em indisponibilidades.

Respostas possíveis:

201 Created:

json

Copiar

Editar

{

"id": "...",

"barbeiro\_id": "123e4567-e89b-12d3-a456-426614174000",

"data": "2025-06-15",

"hora\_inicio": "14:00:00",

"hora\_fim": "17:00:00",

"motivo": "Folga"

}

404 Not Found (barbeiro não existe):

json

Copiar

Editar

{ "error": "Barbeiro não encontrado" }

400 Bad Request (campo ausente):

json

Copiar

Editar

{ "error": "Campos obrigatórios: data, hora\_inicio, hora\_fim" }

🔄 Fluxo Completo até o Momento

Registro de Usuário

Se tipo = "barbeiro", usuário é inserido em users e em barbeiros.

Se tipo = "cliente", apenas em users.

Login de Usuário

Gera JWT com { id, tipo }.

Serviços

GET /api/servicos: qualquer usuário (ou público) pode listar.

POST /api/servicos: apenas barbeiros (authorize('barbeiro')).

Gerenciamento de Agenda do Barbeiro

GET /api/barbeiros/:id/disponibilidade?dia\_semana=: retorna horários fixos semanais.

POST /api/barbeiros/:id/disponibilidade: cadastra horário fixo semanal — só barbeiros podem.

POST /api/barbeiros/:id/indisponibilidades: cadastra folga/feriado — só barbeiros podem.

🚀 Como Testar Localmente

Inicialize a API

bash

Copiar

Editar

npm run dev

Cadastrar Usuário Barbeiro (POST /api/auth/register)

json

Copiar

Editar

POST http://localhost:3000/api/auth/register

Content-Type: application/json

{

"nome": "Carlos Barbeiro",

"email": "carlos@barbearia.com",

"telefone": "11988887777",

"senha": "senha123",

"tipo": "barbeiro"

}

Resposta: retorna user, token.

Login de Usuário (POST /api/auth/login)

json

Copiar

Editar

POST http://localhost:3000/api/auth/login

Content-Type: application/json

{

"email": "carlos@barbearia.com",

"senha": "senha123"

}

Resposta: retorna user, token.

Cadastrar Serviço (POST /api/servicos)

Header: Authorization: Bearer <token obtido no login>

json

Copiar

Editar

POST http://localhost:3000/api/servicos

Content-Type: application/json

{

"nome": "Corte masculino",

"duracao": 60,

"preco": 50.00

}

Apenas barbeiro autenticado pode.

Listar Serviços (GET /api/servicos)

http

Copiar

Editar

GET http://localhost:3000/api/servicos

Cadastrar Disponibilidade Semanal (POST /api/barbeiros/:id/disponibilidade)

Supondo :id = 123e4567-e89b-12d3-a456-426614174000

Header: Authorization: Bearer <token>

json

Copiar

Editar

POST http://localhost:3000/api/barbeiros/123e4567-e89b-12d3-a456-426614174000/disponibilidade

Content-Type: application/json

{

"dia\_semana": 1,

"hora\_inicio": "09:00",

"hora\_fim": "17:00"

}

Listar Disponibilidade (GET /api/barbeiros/:id/disponibilidade?dia\_semana=1)

http

Copiar

Editar

GET http://localhost:3000/api/barbeiros/123e4567-e89b-12d3-a456-426614174000/disponibilidade?dia\_semana=1

Authorization: Bearer <token>

Cadastrar Indisponibilidade (POST /api/barbeiros/:id/indisponibilidades)

json

Copiar

Editar

POST http://localhost:3000/api/barbeiros/123e4567-e89b-12d3-a456-426614174000/indisponibilidades

Content-Type: application/json

Authorization: Bearer <token>

{

"data": "2025-06-15",

"hora\_inicio": "14:00",

"hora\_fim": "17:00",

"motivo": "Folga"

}

🚧 Próximos Passos (Futuras Funcionalidades)

CRUD de Agendamentos

GET /agendamentos/disponiveis?barbeiro\_id=&data=

POST /agendamentos (checa disponibilidade fixa + indisponibilidade + conflito com agendamentos existentes)

DELETE /agendamentos/:id (cancelamento com validação de 12h de antecedência)

GET /barbeiros/:id/agendamentos (agenda do barbeiro)

GET /clientes/:id/agendamentos (agenda do cliente)

Integração com WhatsApp

Enviar link de agendamento automático (Webhooks ou Twilio).

Frontend Básico (HTML/CSS)

Formulário de login/cadastro

Página de agendamento (selecionar barbeiro, serviço, data e hora)

Painel de barbeiro para gerenciar agenda visualmente

Melhorias de Segurança

Rate limiting

Validação mais rigorosa de inputs (ex: celebrate / Joi)

Deploy no Railway

Configurar variáveis de ambiente no painel

Fazer deploy contínuo a partir do GitHub

📄 Exemplos de Requisições (cURL)

Cadastro de Barbeiro

bash

Copiar

Editar

curl -X POST http://localhost:3000/api/auth/register \

- H "Content-Type: application/json" \
- d '{

"nome": "Carlos Barbeiro",

"email": "carlos@barbearia.com",

"telefone": "11988887777",

"senha": "senha123",

"tipo": "barbeiro"

}'

Login

bash

Copiar

Editar

curl -X POST http://localhost:3000/api/auth/login \

- H "Content-Type: application/json" \
- d '{

"email": "carlos@barbearia.com",

"senha": "senha123"

}'

Cadastrar Serviço (Barbeiro)

bash

Copiar

Editar

curl -X POST http://localhost:3000/api/servicos \

- H "Content-Type: application/json" \
- H "Authorization: Bearer <SEU\_TOKEN\_JWT>" \
- d '{

"nome": "Corte e Barba",

"duracao": 90,

"preco": 80.00

}'

Listar Disponibilidades (Segunda-feira)

bash

Copiar

Editar

curl -X GET "http://localhost:3000/api/barbeiros/123e4567-e89b-12d3-a456-426614174000/disponibilidade?dia\_semana=1" \

- H "Authorization: Bearer <SEU\_TOKEN\_JWT>"

📄 Licença

MIT License

