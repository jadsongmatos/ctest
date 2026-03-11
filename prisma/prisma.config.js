import { defineConfig } from 'prisma/config';

export default defineConfig({
  sqlite: {
    url: 'file:../db/ctest.db',
  },
});
