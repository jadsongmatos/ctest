O Ctest é uma ferramenta de terminal que analisa outros projetos npm.

Cteste depende da ferramenta dedicada a gerar SBOM CycloneDX para projetos npm, com foco em completude.

```bash
npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file sbom.cdx.json
```

Ctest importar SBOM para SQLite para ter essa lista: name, version, repo_url.
