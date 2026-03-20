# Ctest

Ctest é uma ferramenta de linha de comando que analisa projetos npm e gera arquivos markdown com testes das dependências externas para cada arquivo de código-fonte, usando **Horsebox** como mecanismo de busca de código.

## Recursos

* Gera um SBOM CycloneDX para projetos npm
* Baixa código fonte de dependências usando `repo_url`
* **Indexa todo o código do projeto e das dependências com Horsebox**
* **Suporte a índices filecontent e fileline** para buscas flexíveis
* Analisa o código-fonte do projeto para identificar funções de libs externas usadas
* **Detecta cadeias de member expressions** (ex: `prisma.component.upsert`)
* **Rastreia instâncias de classes importadas** (ex: `new PrismaClient()`)
* **Busca no índice Horsebox** por ocorrências das funções nas dependências
* **Filtra automaticamente para arquivos de teste**
* **Extrai blocos `test()` / `it()` relevantes**
* Gera um arquivo `.md` para cada arquivo de código-fonte com os testes encontrados
* **Sem banco de dados** - índices temporários criados sob demanda

## Dependências Externas

O Ctest requer o **Horsebox** (`hb`) instalado no sistema:

```bash
# Instalar uv (gerenciador de pacotes Python)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar Horsebox
uv tool install git+https://github.com/michelcaradec/horsebox
```

## Dependências npm

O Ctest depende de uma ferramenta dedicada para gerar SBOM CycloneDX para projetos npm:

```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.cdx.json
```

## Uso

### Gerar arquivos markdown com testes externos para todo o projeto

```bash
# Sem download de dependências
node src/index.js /caminho/para/projeto/npm

# Com download de dependências (todas)
node src/index.js /caminho/para/projeto/npm --download-dependencies

# Com download limitado (útil para projetos grandes)
node src/index.js /caminho/para/projeto/npm --download-dependencies --max-downloads=10
```

### Gerar arquivo markdown com testes externos para um único arquivo

```bash
node src/index.js /caminho/para/projeto/npm --download-dependencies --file=index.js
```

Este comando gera um arquivo `.md` para o arquivo de código-fonte especificado (ex: `index.js.md`), contendo:
- Lista de bibliotecas externas usadas no arquivo
- Consultas usadas no Horsebox para buscar testes
- Arquivos de teste encontrados
- Blocos `test()` / `it()` extraídos de cada arquivo de teste

**Nota:** Os índices Horsebox são criados em diretórios temporários e removidos após a execução. Use `--download-dependencies` para baixar e indexar os testes externos das dependências.

## Opções de Linha de Comando

| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `<project-path>` | Caminho para o projeto npm | `process.cwd()` |
| `--file=<arquivo>` | Analisar apenas um arquivo | Todos os arquivos |
| `--download-dependencies` | Baixar dependências com repo_url | `false` |
| `--max-downloads=<n>` | Máximo de dependências para baixar | `-1` (sem limite) |

## Estrutura do Projeto

```
ctest/
├── src/
│   ├── index.js                      # ponto de entrada principal do CLI
│   └── lib/
│       ├── horsebox.js               # integração com Horsebox (build/search index)
│       ├── markdown-generator.js     # geração de arquivos markdown
│       ├── repo-downloader.js        # download de repositórios git
│       ├── sbom.js                   # geração e parsing do SBOM
│       ├── source-analyzer.js        # análise de imports e uso de libs (AST)
│       ├── test-extractor.js         # extração de blocos test()/it()
│       └── utils.js                  # funções utilitárias
├── tests/
│   ├── index.test.js                 # testes do CLI principal
│   ├── horsebox.test.js              # testes do módulo Horsebox
│   ├── source-analyzer.test.js       # testes de análise de código
│   ├── test-extractor.test.js        # testes de extração de testes
│   └── sbom.test.js                  # testes de geração de SBOM
├── ref/                              # projetos de teste de referência
└── scripts/                          # scripts utilitários
```

## Desenvolvimento

### Instalar dependências

```bash
npm install
```

### Rodar testes

Antes de implementar novos recursos, execute os testes:

```bash
npm test
```

Os testes são executados em modo silencioso (`--silent`) para reduzir a verbosidade da saída.

### Estrutura dos Testes

Os testes verificam:
- Geração e parsing de SBOM
- Análise de código fonte (AST)
- Extração de blocos de teste
- Integração com Horsebox
- Fluxo completo do CLI

## Fluxo de Processamento

1. **Gerar SBOM**: Usa `@cyclonedx/cyclonedx-npm` para criar SBOM CycloneDX
2. **Extrair componentes**: Filtra componentes com `repo_url`
3. **Baixar dependências** (opcional): Clona repositórios via Git
4. **Indexar com Horsebox**:
   - Projeto: índice `filecontent`
   - Dependências: índices `filecontent` + `fileline`
5. **Analisar arquivos fonte**: Parseia com `@babel/parser` para identificar:
   - Imports ES6 e CommonJS
   - Member expressions em cadeia
   - Instâncias de classes
6. **Buscar testes**: Para cada lib, query Horsebox com termos relevantes
7. **Extrair blocos**: Abre arquivos de teste e extrai `test()` / `it()`
8. **Gerar markdown**: Escreve arquivo `.md` com resultados

## Regras de Criação de Arquivos

Não crie arquivos diretamente em **`/workspaces/ctest`**; crie-os **somente em subdiretórios** dentro desse diretório.

## Melhorias Recentes (v2.0)

### Migração para Horsebox
- Removido Prisma, SQLite, libsql
- Índices temporários em vez de banco permanente
- Busca full-text mais rápida e flexível

### Detecção de Funções em Cadeia
O source-analyzer detecta corretamente funções usadas em cadeias como `prisma.component.upsert()`, extraindo todas as propriedades da cadeia.

### Rastreamento de Instâncias de Classes
O analyzer rastreia instâncias de classes importadas (ex: `const prisma = new PrismaClient()`) e associa chamadas de método à biblioteca original.

### Download Otimizado
- Clone shallow (`--depth 1`) para repositórios grandes
- Timeout configurável por operação
- Limite de downloads com `--max-downloads`

### Extração de Testes Contextual
- Busca baseada em múltiplos termos (cadeia completa + partes)
- Filtragem por arquivos de teste
- Extração de blocos completos com braces balanceados

### Segurança de Diretórios
- Todos os diretórios criados usam permissões restritivas (`mode: 0o700`)
- Previne vulnerabilidades de diretórios world-writable
- Diretórios temporários e de cache são criados com acesso apenas para o proprietário

### Saída de Testes
- Comandos de teste usam `--silent` para reduzir verbosidade
- Foco nos resultados dos testes sem ruído de `console.log`
