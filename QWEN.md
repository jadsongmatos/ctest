# Ctest

Ctest é uma ferramenta de linha de comando que analisa projetos npm e gera arquivos markdown com testes das dependências externas para cada arquivo de código-fonte.

## Recursos

* Gera um SBOM CycloneDX para projetos npm
* Importa o SBOM para um banco SQLite usando o ORM Prisma
* Baixa código fonte de dependências usando repo_url
* Extrai arquivos de teste das dependências externas
* Analisa o código-fonte do projeto para identificar funções de libs externas usadas
* Gera um arquivo `.md` para cada arquivo de código-fonte com os testes das funções usadas

## Dependências

O Ctest depende de uma ferramenta dedicada para gerar SBOM CycloneDX para projetos npm:

```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.cdx.json
```

## Uso

### Gerar arquivos markdown com testes externos

```bash
node src/index.js /caminho/para/projeto/npm --download-dependencies
```

Este comando gera um arquivo `.md` para cada arquivo de código-fonte do projeto (ex: `index.js.md`), contendo:
- Lista de bibliotecas externas usadas no arquivo
- Funções de cada biblioteca que são utilizadas
- Testes externos disponíveis para essas funções
- Conteúdo completo dos arquivos de teste

## Esquema do banco de dados

O banco SQLite contém as seguintes tabelas:

**Tabelas principais:**
* `components` - dependências npm (name, version, repo_url, created_at)

**Tabelas de testes externos:**
* `external_components` - dependências externas baixadas (name, version, repo_url, downloadPath, createdAt)
* `external_test_files` - arquivos de teste das dependências externas (externalComponentId, path)

## Estrutura do projeto

* `src/index.js` - ponto de entrada principal do CLI
* `src/lib/database-libsql.js` - operações de banco de dados baseadas em libsql
* `src/lib/sbom.js` - geração e parsing do SBOM
* `src/lib/functions.js` - geração de markdown para arquivos de código-fonte
* `src/lib/repo-downloader.js` - download de repositórios git usando repo_url
* `src/lib/external-test-extractor.js` - extração de testes de dependências externas
* `src/lib/source-parser.js` - parser de código JavaScript/TypeScript
* `src/lib/source-analyzer.js` - análise de imports e uso de bibliotecas externas
* `prisma/schema.prisma` - definição do schema do Prisma
* `tests/` - arquivos de teste
* `ref/` - projetos de teste de referência

## Desenvolvimento

Antes de implementar novos recursos, execute os testes:

```bash
npm test
```

## Regras de criação de arquivos

Não crie arquivos diretamente em **`/workspaces/ctest`**; crie-os **somente em subdiretórios** dentro desse diretório.
