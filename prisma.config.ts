import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use DATABASE_URL from environment or default to ctest.db
    url: process.env.DATABASE_URL || "file:./ctest.db",
  },
});
