import { pgTable, varchar,serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum',["system","user"]);

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfname: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  // 定义表的 createdAt 字段，类型为 timestamp，表示记录的创建时间，该字段不能为空，并且设置默认值为当前时间,createdAt是在代码中访问这个字段时使用的变量名或属性名。created_at 是该字段在数据库中的名字
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  fileKey: text('file_key').notNull(), //识别s3里的文件
});


export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created at').notNull().defaultNow(),
  role: userSystemEnum('role').notNull(),
});