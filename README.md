# Smart Life Echo (智慧生活回响)

这是一个基于 AI 的个人生活复盘助手。它能自动分析你的屏幕使用时间截图，结合今日任务清单，通过 AI 生成一份带有情感和建议的日记复盘。

## 🌟 核心功能
*   **私密复盘**：数据通过 Supabase Edge Functions 中转，保护隐私。
*   **多维输入**：支持屏幕截图识别与提醒事项导入。
*   **三种人设**：客观中性、严厉教练、温情管家。
*   **双端支持**：iPhone 快捷指令 + Web 操控台。

## 🚀 快速开始

### 1. 后端部署
项目依赖 Supabase Edge Functions。
```bash
# 部署云函数
supabase functions deploy echo-process --no-verify-jwt
```

### 2. 数据库准备
在 Supabase SQL Editor 中运行：
```sql
create table if not exists daily_narratives (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  summary text not null,
  created_at timestamp with time zone default now()
);
```

### 3. Web 门户
直接在浏览器中打开 `echo_portal.html` 即可使用。

## 🛠 技术栈
*   **Frontend**: Vanilla HTML/JS, CSS
*   **Backend**: Supabase Edge Functions (Deno)
*   **AI Model**: Google Gemini 3 (Flash)
