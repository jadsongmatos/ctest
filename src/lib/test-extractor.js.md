# External tests for test-extractor.js

**Arquivo:** `/workspaces/ctest/src/lib/test-extractor.js`

## ./utils

**Consultas usadas no Horsebox:** `safeReadFile`, `./utils safeReadFile`, `utils safeReadFile`

**Arquivos de teste encontrados:** 33

### /tmp/ctest-repos-nXQIAb/14fdeea7a0-jest/examples/automatic-mocks/__tests__/automock.test.js

#### if utils are mocked

```ts
test('if utils are mocked', () => {
  expect(utils.authorize.mock).toBeTruthy();
  expect(utils.isAuthorized.mock).toBeTruthy();
}
```

#### mocked implementation

```ts
test('mocked implementation', () => {
  utils.authorize.mockReturnValue('mocked_token');
  utils.isAuthorized.mockReturnValue(true);

  expect(utils.authorize()).toBe('mocked_token');
  expect(utils.isAuthorized('not_wizard')).toBeTruthy();
}
```

