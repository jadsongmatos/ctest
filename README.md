# Ctest

Ctest é uma ferramenta de linha de comando que analisa projetos npm e gera arquivos markdown com testes das dependências externas para cada arquivo de código-fonte, usando **Horsebox** como mecanismo de busca de código.

## Visão Geral

O Ctest analisa seu projeto npm para identificar quais funções de bibliotecas externas são usadas em cada arquivo fonte, então gera arquivos markdown contendo os casos de teste relevantes dessas bibliotecas externas.

## Recursos

- Gera um SBOM CycloneDX para projetos npm
- Baixa código fonte de dependências usando `repo_url`
- Indexa **todo o código do projeto** e **das dependências** com Horsebox
- Analisa o código-fonte do projeto para identificar funções de libs externas usadas
- Detecta **cadeias de member expressions** (ex: `prisma.component.upsert`)
- Rastreia **instâncias de classes importadas** (ex: `new PrismaClient()`)
- Pergunta ao Horsebox **onde cada função apareceu nas dependências**
- Filtra resultados para **arquivos de teste**
- Copia **todos os blocos `test()` / `it()` relevantes** para o `.md`

## Dependências Externas

O Ctest requer o **Horsebox** (`hb`) instalado no sistema:

```bash
# Instalar uv (gerenciador de pacotes Python)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar Horsebox
uv tool install git+https://github.com/michelcaradec/horsebox
```

## Instalação

```bash
npm install
```

## Início Rápido

Analise um projeto npm e gere arquivos markdown com testes externos:

```bash
# Com download de dependências (recomendado para resultados completos)
node src/index.js /caminho/para/projeto --download-dependencies

# Sem download (usa apenas código já disponível)
node src/index.js /caminho/para/projeto
```

## Uso

### Opções de Linha de Comando

| Opção | Descrição |
|-------|-----------|
| `<project-path>` | Caminho para o projeto npm a ser analisado (obrigatório) |
| `--download-dependencies` | Baixar código fonte das dependências com `repo_url` |
| `--max-downloads=<n>` | Número máximo de dependências para baixar (padrão: -1 = sem limite) |
| `--file=<arquivo>` | Gerar markdown para um único arquivo fonte |

### Gerar arquivos markdown para todo o projeto

```bash
node src/index.js <projeto> --download-dependencies --max-downloads=10
```

### Gerar markdown para um único arquivo

```bash
node src/index.js <projeto> --download-dependencies --file=index.js
```

### Exemplos

```bash
# Analisar projeto (sem download)
node src/index.js /path/to/npm/project

# Analisar projeto (baixando todas as dependências com repo_url)
node src/index.js /path/to/npm/project --download-dependencies

# Analisar com limite de downloads (útil para projetos grandes)
node src/index.js /path/to/npm/project --download-dependencies --max-downloads=5

# Gerar markdown para um único arquivo
node src/index.js /path/to/npm/project --download-dependencies --file=src/index.js
```

## Como Funciona

1. **Gerar SBOM**: O Ctest usa `@cyclonedx/cyclonedx-npm` para gerar um SBOM CycloneDX
2. **Extrair componentes**: Componentes com `repo_url` são identificados
3. **Baixar dependências** (opcional): Código fonte é clonado via Git
4. **Indexar com Horsebox**:
   - Código do projeto → índice `filecontent`
   - Código das dependências → índices `filecontent` + `fileline`
5. **Analisar código fonte**: Cada arquivo é parseado com AST para identificar:
   - Imports ES6 e CommonJS
   - Member expressions em cadeia (ex: `prisma.component.upsert`)
   - Instâncias de classes (ex: `new PrismaClient()`)
6. **Buscar testes externos**: Para cada lib detectada:
   - Constrói consultas baseadas nas funções usadas
   - Query Horsebox nos índices das dependências
   - Filtra apenas arquivos de teste
7. **Extrair blocos de teste**: Abre arquivos de teste e extrai blocos `test()` / `it()` relevantes
8. **Gerar Markdown**: Cria arquivo `.md` com todos os testes encontrados

## Formato de Saída

Para cada arquivo fonte (ex: `index.js`), um arquivo markdown é gerado (`index.js.md`):

```markdown
# External tests for index.js

**Arquivo:** `/caminho/para/index.js`

## @prisma/client

**Consultas usadas no Horsebox:** `component.upsert`, `upsert`, `client upsert`

**Arquivos de teste encontrados:** 141

### /tmp/ctest-repos-xxx/prisma/packages/client/src/__tests__/integration/upsert.test.ts

#### should upsert a record

```ts
it('should upsert a record', async () => {
  const result = await prisma.component.upsert({
    where: { id: 1 },
    create: { name: 'test' },
    update: { name: 'updated' }
  });
  expect(result.name).toBe('updated');
});
```

### /tmp/ctest-repos-xxx/prisma/packages/client/src/__tests__/functional/upsert/basic.ts

#### basic upsert functionality

```ts
test('basic upsert functionality', () => {
  // ... conteúdo completo do teste ...
});
```

## lodash

**Consultas usadas no Horsebox:** `map`, `filter`, `capitalize`

**Arquivos de teste encontrados:** 329

### ...
```

## Uso Programático

```javascript
const { analyze } = require('./src/index');

async function main() {
  const result = await analyze('/caminho/para/projeto', {
    sbomPath: 'sbom.cdx.json',      // Caminho do SBOM (padrão: sbom.cdx.json)
    sourceFile: 'index.js',         // Opcional: analisar único arquivo
    downloadDependencies: true,     // Baixar dependências (padrão: false)
    maxDownloads: -1,               // Máximo de dependências (padrão: -1 = sem limite)
  });

  console.log(result);
  // {
  //   sbomPath: '/caminho/para/sbom.cdx.json',
  //   generated: ['src/index.js.md', 'src/lib/utils.js.md', ...]
  // }
}
```

## Módulos

### SBOM (`src/lib/sbom.js`)

| Função | Descrição |
|--------|-----------|
| `generateSBOM(projectPath, outputFile, fetchRepoUrls)` | Gera SBOM CycloneDX |
| `readSBOM(sbomPath)` | Lê e parseia arquivo SBOM |
| `extractComponents(sbom)` | Extrai componentes do SBOM |
| `createSBOMFromPackageLock(packageLock, fetchRepoUrls)` | Cria SBOM do package-lock.json |

### Horsebox (`src/lib/horsebox.js`)

| Função | Descrição |
|--------|-----------|
| `ensureHorsebox()` | Verifica se `hb` está instalado |
| `buildFileContentIndex(fromDir, indexDir)` | Cria índice filecontent |
| `buildFileLineIndex(fromDir, indexDir)` | Cria índice fileline |
| `searchIndex(indexDir, query, limit)` | Busca no índice |

### Source Analyzer (`src/lib/source-analyzer.js`)

| Função | Descrição |
|--------|-----------|
| `analyzeSourceFile(filePath)` | Analisa arquivo fonte identificando uso de libs externas |
| `scanSourceFiles(dir)` | Varre diretório por arquivos JS/TS |

### Test Extractor (`src/lib/test-extractor.js`)

| Função | Descrição |
|--------|-----------|
| `extractTestBlocks(content)` | Extrai blocos `test()` / `it()` do código |
| `extractRelevantBlocksFromFile(filePath, terms)` | Extrai blocos relevantes de um arquivo |

### Markdown Generator (`src/lib/markdown-generator.js`)

| Função | Descrição |
|--------|-----------|
| `writeMarkdownForSource(options)` | Gera arquivo markdown para um arquivo fonte |

### Repo Downloader (`src/lib/repo-downloader.js`)

| Função | Descrição |
|--------|-----------|
| `downloadRepos(components, options)` | Baixa repositórios das dependências |
| `cleanupRepos(downloadRoot)` | Remove repositórios baixados |
| `parseRepoUrl(repoUrl, version)` | Parseia URL do repositório |

### Utils (`src/lib/utils.js`)

| Função | Descrição |
|--------|-----------|
| `uniq(items)` | Remove duplicatas |
| `normalizeLibraryNames(libName)` | Gera variações de nome da lib |
| `isTestFile(filePath)` | Verifica se arquivo é de teste |
| `safeReadFile(filePath)` | Lê arquivo com tratamento de erro |

## Rodando Testes

```bash
npm test
```

## License

ISC
