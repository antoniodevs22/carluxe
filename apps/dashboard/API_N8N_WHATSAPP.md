# 📚 Documentação da API para Integração n8n (WhatsApp)

Esta documentação fornece os comandos `CURL` exatos para você copiar e colar nos nós **HTTP Request** do n8n. O objetivo é permitir que o n8n crie agendamentos, clientes e veículos diretamente no banco de dados (Supabase) do dashboard Car Luxe.

## 🔐 Autenticação (Para todos os requests)

Em todos os nós **HTTP Request** do n8n, você precisará configurar os seguintes **Headers**:

- **apikey**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A`
- **Authorization**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A`
- **Content-Type**: `application/json`
- **Prefer**: `return=representation` *(útil para o Supabase retornar o ID do registro criado no POST)*

Abaixo estão as operações principais para o seu fluxo do WhatsApp:

---

### 1. 🔍 Buscar Cliente (Ex: Pelo Telefone)
Antes de criar o agendamento, o n8n pode verificar se o cliente já existe para não duplicar.

```bash
curl -X GET 'https://sbbsgjsoqhgsjbtsraij.supabase.co/rest/v1/clientes?telefone=eq.SEU_NUMERO_AQUI&select=id,nome' \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A'
```

---

### 2. 👤 Criar Novo Cliente
Se o cliente não existir no passo anterior, você o cria com os dados fornecidos pelo WhatsApp.

```bash
curl -X POST 'https://sbbsgjsoqhgsjbtsraij.supabase.co/rest/v1/clientes' \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A' \
-H 'Content-Type: application/json' \
-H 'Prefer: return=representation' \
-d '{
  "nome": "Nome do Cliente",
  "telefone": "5511999999999",
  "email": "email_opcional@email.com"
}'
```

---

### 3. 🚗 Criar Veículo (Opcional)
Se precisar cadastrar o carro do cliente pelo WhatsApp:

```bash
curl -X POST 'https://sbbsgjsoqhgsjbtsraij.supabase.co/rest/v1/veiculos' \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A' \
-H 'Content-Type: application/json' \
-H 'Prefer: return=representation' \
-d '{
  "cliente_id": "ID_DO_CLIENTE_CRIADO_NO_PASSO_ANTERIOR",
  "modelo": "Porsche 911",
  "placa": "ABC1234",
  "cor": "Preto",
  "ano": "2024"
}'
```

---

### 4. 📅 Criar Agendamento (Aparecerá automaticamente no Dashboard!)
O evento principal! Quando o n8n rodar esse curl, o dashboard vai atualizar **na hora** para os funcionários, pois o React está ouvindo os eventos realtime do Supabase.

```bash
curl -X POST 'https://sbbsgjsoqhgsjbtsraij.supabase.co/rest/v1/agendamentos' \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYnNnanNvcWhnc2pidHNyYWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjUyODgsImV4cCI6MjA5MjA0MTI4OH0.sPdrzsXAsj-aqh3-GyH2cYdGtCY_Dig2q7anqjNj31A' \
-H 'Content-Type: application/json' \
-H 'Prefer: return=representation' \
-d '{
  "cliente_id": "ID_DO_CLIENTE",
  "veiculo_id": "ID_DO_VEICULO",
  "data_hora": "2026-04-25T14:30:00-03:00",
  "status": "pendente",
  "observacoes": "Agendado via WhatsApp. Detalhes: Lavagem Premium e Polimento",
  "valor_estimado": 250.00
}'
```

---

## 🛠️ Dicas para o Node `HTTP Request` do n8n:

1. **Method:** Mude para `POST` ou `GET` dependendo do comando.
2. **URL:** Copie exatamente o endereço até `...supabase.co/rest/v1/nome_da_tabela`
3. **Authentication:** Selecione `None` e coloque as chaves diretamente na aba de Headers.
4. **Headers:** Adicione 3 campos manualmente e cole os valores fornecidos:
   - `apikey`
   - `Authorization`
   - `Content-Type`
5. **Body parameters:** Selecione o formato `JSON/RAW` e copie e cole o `{ ... }` do `CURL`. Utilize expressões do n8n (Ex: `{{$json.telefone}}`) para tornar dinâmico.
