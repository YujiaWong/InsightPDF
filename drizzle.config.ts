import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' }); 

// 使用 defineConfig 函数导出 Drizzle 的配置对象
export default defineConfig({
  // 指定生成的迁移文件（migrations）的输出目录
  out: './drizzle',
  // 例如，当你运行 `npx drizzle-kit generate` 时，生成的迁移文件会存储在 ./drizzle 文件夹下
  // 指定数据库模式（schema）的位置
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  // Drizzle 也支持 MySQL、SQLite 等其他数据库
  // 数据库的连接信息，来自 .env 文件
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // 读取 .env 文件中的 DATABASE_URL 环境变量
    // ! 是 TypeScript 的非空断言，表示确定这个值一定存在
  },
});
