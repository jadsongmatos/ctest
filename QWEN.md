# Ctest

Ctest é uma ferramenta de linha de comando que analisa projetos npm e gera arquivos markdown com testes das dependências externas para cada arquivo de código-fonte.

## Recursos

* Gera um SBOM CycloneDX para projetos npm
* Importa o SBOM para um banco SQLite usando o ORM Prisma com adapter libsql
* **Cria/atualiza automaticamente o schema do banco de dados** quando necessário
* Baixa código fonte de dependências usando repo_url
* **Suporte a sparse checkout para monorepos grandes** (ex: Prisma)
* **Download seletivo** de apenas dependências usadas no arquivo analisado
* Extrai arquivos de teste das dependências externas
* Analisa o código-fonte do projeto para identificar funções de libs externas usadas
* **Detecta cadeias de member expressions** (ex: `prisma.component.upsert`)
* **Rastreia instâncias de classes importadas** (ex: `new PrismaClient()`)
* Gera um arquivo `.md` para cada arquivo de código-fonte com os testes das funções usadas

## Dependências

O Ctest depende de uma ferramenta dedicada para gerar SBOM CycloneDX para projetos npm:

```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.cdx.json
```

## Uso

### Gerar arquivos markdown com testes externos para todo o projeto

```bash
node src/index.js /caminho/para/projeto/npm --download-dependencies
```

### Gerar arquivo markdown com testes externos para um único arquivo

```bash
node src/index.js /caminho/para/projeto/npm --download-dependencies --file=index.js
```

Este comando gera um arquivo `.md` para o arquivo de código-fonte especificado (ex: `index.js.md`), contendo:
- Lista de bibliotecas externas usadas no arquivo
- Funções de cada biblioteca que são utilizadas
- Testes externos disponíveis para essas funções
- Conteúdo completo dos arquivos de teste

**Nota:** O banco de dados é criado automaticamente na primeira execução. Para repositórios grandes (ex: Prisma), use `--download-dependencies` para baixar os testes externos.

## Esquema do banco de dados

O banco SQLite contém as seguintes tabelas:

**Tabelas principais:**
* `components` - dependências npm (id, name, version, repo_url, created_at)

**Tabelas de análise de código:**
* `source_files` - arquivos de código-fonte analisados (id, path)
* `functions` - funções encontradas nos arquivos de código (id, sourceFileId, name, startLine, startCol, endLine, endCol)
* `test_files` - arquivos de teste (id, path)
* `function_hits` - relação entre testes e funções executadas (testFileId, functionId, hits)

**Tabelas de testes externos:**
* `external_components` - dependências externas baixadas (id, name, version, repo_url, downloadPath, createdAt)
* `external_test_files` - arquivos de teste das dependências externas (id, externalComponentId, path)

## Estrutura do projeto

* `src/index.js` - ponto de entrada principal do CLI
* `src/lib/database-libsql.js` - operações de banco de dados usando Prisma com adapter libsql (com criação automática do schema)
* `src/lib/sbom.js` - geração e parsing do SBOM
* `src/lib/functions.js` - geração de markdown para arquivos de código-fonte (com download seletivo)
* `src/lib/repo-downloader.js` - download de repositórios git (com suporte a blobless clone para monorepos)
* `src/lib/external-test-extractor.js` - extração de testes de dependências externas
* `src/lib/source-parser.js` - parser de código JavaScript/TypeScript
* `src/lib/source-analyzer.js` - análise de imports e uso de bibliotecas externas (detecta member expressions em cadeia)
* `prisma/schema.prisma` - definição do schema do Prisma
* `prisma.config.ts` - configuração do Prisma
* `tests/` - arquivos de teste
  * `database.test.js` - testes do módulo de banco de dados
  * `duplicate.test.js` - testes de idempotência (verifica que dados não são duplicados)
  * `index.test.js` - testes do CLI principal
  * `sbom.test.js` - testes de geração de SBOM
* `ref/` - projetos de teste de referência

## Desenvolvimento

### Gerar o Prisma Client

Antes de rodar o projeto, gere o Prisma Client:

```bash
npx prisma generate
```

### Rodar testes

Antes de implementar novos recursos, execute os testes:

```bash
npm test
```

### Testes de idempotência

O projeto inclui testes que verificam que a execução múltipla não duplica dados:

```bash
npm test -- --testPathPatterns=duplicate.test.js
```

Os testes verificam:
- A função `importComponents` usa `upsert` para evitar duplicatas
- Componentes são únicos pela combinação `name@version`
- Múltiplas execuções mantêm dados consistentes

## Regras de criação de arquivos

Não crie arquivos diretamente em **`/workspaces/ctest`**; crie-os **somente em subdiretórios** dentro desse diretório.

## Melhorias Recentes

### Detecção de funções em cadeias de member expressions
O source-analyzer agora detecta corretamente funções usadas em cadeias como `prisma.component.upsert()`, extraindo todas as propriedades da cadeia.

### Rastreamento de instâncias de classes
O analyzer rastreia instâncias de classes importadas (ex: `const prisma = new PrismaClient()`) e associa chamadas de método à biblioteca original.

### Criação automática do schema
O banco de dados é criado e configurado automaticamente na primeira execução, sem necessidade de comandos manuais.

### Download otimizado para monorepos
Para repositórios grandes como Prisma, o downloader usa:
- `--filter=blob:none` para clone inicial rápido
- Checkout seletivo de paths específicos
- Timeout configurável por operação
