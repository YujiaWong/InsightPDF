// 从 @neondatabase/serverless 库中引入 `neon` 和 `neonConfig`，用于创建与 Neon 数据库的连接和配置
import { neon, neonConfig } from '@neondatabase/serverless';
// 从 drizzle-orm 库中引入 `drizzle`，用于创建 ORM 实例以简化数据库操作
import { drizzle } from 'drizzle-orm/neon-http';

// 配置 neonConfig，启用连接缓存以提高性能（避免每次请求都重新连接）
neonConfig.fetchConnectionCache = true;
// 检查环境变量中是否包含 DATABASE_URL，这个 URL 会告诉我们如何连接到数据库
if (!process.env.DATABASE_URL) {
  throw new Error('database url not found');
}
// 使用从环境变量中获取的 DATABASE_URL 创建一个 Neon 客户端实例，这个实例负责与数据库建立连接并执行 SQL 查询
const sql = neon(process.env.DATABASE_URL);
// 使用 `drizzle` 创建一个 ORM 实例，该实例会简化数据库操作,`sql` 是我们之前创建的 Neon 客户端实例，drizzle 将用它来执行数据库查询
export const db = drizzle(sql);
