# Guia de Importação de Clientes

## 📥 Importação em Massa de Clientes

### 🎯 Objetivo
Este guia explica como usar a funcionalidade de importação em massa de clientes, incluindo preparação de arquivos, processo de importação e resolução de problemas.

## 🚀 Como Acessar

1. **Login como Administrador** (obrigatório)
2. No menu principal, clique em **"Importar Dados"**
3. Na página de importação, clique na aba **"Clientes"**

## 📄 Formato do Arquivo

### Estrutura Obrigatória
```
Código;Nome do Cliente;Cidade;CNPJ
001;CLIENTE EXEMPLO LTDA;SAO PAULO;12345678000195
002;EMPRESA TESTE SA;RIO DE JANEIRO;98765432000142
003;COMERCIO ABC;BELO HORIZONTE;
```

### Especificações dos Campos

| Campo | Tipo | Obrigatório | Limite | Validações |
|-------|------|-------------|---------|------------|
| **Código** | Texto | ✅ Sim | 20 caracteres | Único no sistema |
| **Nome** | Texto | ✅ Sim | 255 caracteres | - |
| **Cidade** | Texto | ✅ Sim | 100 caracteres | - |
| **CNPJ** | Número | ❌ Não | 14 dígitos | Apenas números, único |

### Separadores Suportados
- **`;` (ponto e vírgula)** - ✅ **Recomendado** para arquivos brasileiros
- **`,` (vírgula)** - Suportado para compatibilidade

### Formatos de Arquivo Aceitos
- **.txt** - Texto simples
- **.csv** - Valores separados por vírgula/ponto e vírgula

## 🛠️ Processo de Importação

### Passo 1: Preparar o Arquivo
1. **Baixe o template** clicando em "Baixar Template"
2. **Preencha os dados** seguindo o formato exato
3. **Salve como .txt ou .csv** com codificação UTF-8

### Passo 2: Selecionar Usuário Responsável
⚠️ **IMPORTANTE**: Selecione o usuário que será responsável pelos clientes importados
- Usuários normais verão apenas clientes atribuídos a eles
- Administradores veem todos os clientes

### Passo 3: Upload do Arquivo
1. Clique em **"Arquivo CSV/TXT"**
2. Selecione seu arquivo (máximo 50MB)
3. Aguarde o carregamento e validação

### Passo 4: Preview dos Dados
1. Clique em **"Mostrar Preview"** para ver as primeiras 10 linhas
2. **Verifique** se os dados estão corretos
3. **Corrija** o arquivo se necessário

### Passo 5: Executar Importação
1. Clique em **"Importar Clientes"**
2. **Aguarde** o processamento (progresso em tempo real)
3. **Revise** o relatório final

## ✅ Validações Aplicadas

### Durante o Upload
- ✅ Extensão do arquivo (.csv ou .txt)
- ✅ Tamanho máximo (50MB)
- ✅ Formato de separadores
- ✅ Conteúdo não vazio

### Durante a Importação
- ✅ **Campos obrigatórios** preenchidos
- ✅ **Limites de caracteres** respeitados
- ✅ **Códigos únicos** (sem duplicatas)
- ✅ **CNPJs válidos** (14 dígitos, não repetitivos)
- ✅ **Duplicatas no arquivo** detectadas
- ✅ **Duplicatas no banco** verificadas

## 🔧 Exemplos Práticos

### ✅ Arquivo Correto
```
001;METALURGICA ABC LTDA;SAO PAULO;12345678000195
002;COMERCIO XYZ SA;RIO DE JANEIRO;98765432000142
003;EMPRESA DELTA;BELO HORIZONTE;
004;FORNECEDOR OMEGA;CURITIBA;11223344000156
```

### ❌ Erros Comuns

**CNPJ com caracteres especiais:**
```
001;EMPRESA ABC;SAO PAULO;12.345.678/0001-95  ❌ Incorreto
001;EMPRESA ABC;SAO PAULO;12345678000195       ✅ Correto
```

**Campos vazios obrigatórios:**
```
;EMPRESA SEM CODIGO;SAO PAULO;  ❌ Código vazio
001;;SAO PAULO;                 ❌ Nome vazio
001;EMPRESA ABC;;               ❌ Cidade vazia
```

**Códigos duplicados:**
```
001;EMPRESA A;SAO PAULO;
001;EMPRESA B;RIO DE JANEIRO;   ❌ Código duplicado
```

## 📊 Relatório de Importação

### Informações Exibidas
- **Total de linhas** processadas
- **Importações bem-sucedidas**
- **Número de erros** encontrados
- **Detalhes dos erros** organizados por tipo

### Tipos de Erro
1. **Códigos duplicados** - Lista dos códigos repetidos
2. **CNPJs duplicados** - Lista dos CNPJs repetidos  
3. **Outros erros** - Validações de campo e formato

### Exemplo de Relatório
```
✅ Importação concluída
📊 Total de linhas: 1.523
✅ Importados com sucesso: 1.518
❌ Erros: 5

Detalhes dos erros:
• Linha 15: CNPJ '12345678000195' já existe no banco
• Linha 248: Código '001' duplicado no arquivo
• Linha 892: Nome do cliente é obrigatório
```

## ⚡ Dicas de Performance

### Para Arquivos Grandes (>10.000 linhas)
- ✅ Use separador **ponto e vírgula (;)**
- ✅ Divida em arquivos menores se possível
- ✅ Execute durante horários de menor movimento
- ✅ Considere execução direta no Supabase para volumes muito grandes

### Preparação Eficiente
1. **Validação prévia** dos dados no Excel/LibreOffice
2. **Remoção de duplicatas** antes do upload
3. **Formatação correta** do CNPJ (apenas números)
4. **Teste com arquivo pequeno** primeiro

## 🔍 Troubleshooting

### Arquivo não carrega
- **Verifique** a extensão (.csv ou .txt)
- **Confirme** o tamanho (máximo 50MB)
- **Teste** com arquivo menor primeiro

### Muitos erros de validação
- **Revise** o formato dos dados
- **Baixe** e use o template fornecido
- **Verifique** duplicatas no próprio arquivo

### Importação lenta
- **Use** separador ponto e vírgula (;)
- **Reduza** o tamanho do arquivo
- **Execute** em horário de menor uso

### Erro de permissão
- **Confirme** login como administrador
- **Recarregue** a página se necessário

## 📋 Checklist Pré-Importação

Antes de importar, verifique:

- [ ] **Login como administrador** realizado
- [ ] **Usuário responsável** selecionado
- [ ] **Arquivo no formato correto** (template seguido)
- [ ] **Dados validados** (sem duplicatas óbvias)
- [ ] **CNPJs formatados** (apenas 14 dígitos)
- [ ] **Backup dos dados** existentes (se necessário)
- [ ] **Teste com arquivo pequeno** realizado

## 🎯 Boas Práticas

### Preparação de Dados
1. **Use o template** fornecido como base
2. **Valide CNPJs** antes da importação
3. **Remova duplicatas** no Excel/LibreOffice
4. **Padronize nomes** de cidades (MAIÚSCULAS)
5. **Teste incrementalmente** (arquivos pequenos primeiro)

### Durante a Importação
1. **Não feche** a aba durante o processo
2. **Aguarde** o relatório final completo
3. **Anote** os erros para correção
4. **Verifique** os dados importados após o processo

### Pós-Importação
1. **Revise** o relatório de erros
2. **Corrija** dados problemáticos
3. **Reimporte** apenas os registros com erro
4. **Teste** as funcionalidades de busca

---

**Suporte**: Em caso de dúvidas, consulte a documentação técnica completa ou contate o administrador do sistema.

**Última atualização**: 13/06/2025