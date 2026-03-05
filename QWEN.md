# Ctest

Ctest é uma ferramenta de linha de comando que analisa projetos npm.

## Recursos

* Gera um SBOM CycloneDX para projetos npm
* Importa o SBOM para um banco SQLite usando o ORM Prisma
* Mapeia arquivos de teste para funções do código-fonte usando cobertura do Jest
* Armazena informações de componentes: nome, versão, repo_url

## Dependências

O Ctest depende de uma ferramenta dedicada para gerar SBOM CycloneDX para projetos npm, com foco em completude:

```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.cdx.json
```

O Ctest importa o SBOM para o SQLite (via Prisma ORM) para obter esta lista: nome, versão, repo_url.

## Uso

### Análise básica (somente componentes)

```bash
node index.js /caminho/para/projeto/npm
```

### Com mapeamento de funções

```bash
node index.js /caminho/para/projeto/npm --map-functions
```

## Esquema do banco de dados

O banco SQLite contém as seguintes tabelas:

* `components` - dependências npm (name, version, repo_url, created_at)
* `test_files` - caminhos dos arquivos de teste
* `source_files` - caminhos dos arquivos de código-fonte
* `functions` - definições de funções (name, start_line, start_col, end_line, end_col)
* `function_hits` - mapeamento entre testes e funções com contagens de execuções (hit counts)

## Estrutura do projeto

* `lib/database.js` - operações de banco de dados baseadas em Prisma
* `lib/sbom.js` - geração e parsing do SBOM
* `lib/functions.js` - mapeamento de funções via cobertura do Jest
* `index.js` - ponto de entrada principal do CLI
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
