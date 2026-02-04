# Smart Life Echo - 部署你的第一个云大脑

为了完成第三课的作业，我们需要把代码从你的电脑“送”到 Supabase 的服务器上。

### 1. 安装 Supabase 命令行工具 (Mac)
如果你的电脑还没安装 Supabase CLI，请在你的 **终端 (Terminal)** 中按顺序运行这两行：

```bash
brew install supabase/tap/supabase
```

### 2. 准备代码文件夹
请在你的项目文件夹 (`v4作业`) 下运行以下命令，创建一个标准的函数目录：

```bash
mkdir -p supabase/functions/echo-process
```

然后，将我提供给你的代码保存到 `supabase/functions/echo-process/index.ts`。

### 3. 设置云端“电池” (环境变量)
在部署之前，我们要告诉云端你的 API Key。运行这行命令（我已经把你的 Key 填好了）：

```bash
supabase secrets set GEMINI_API_KEY=AIzaSyCllmtWFA6EyTd9xH5DDFfmSnAIUgWabb0 --project-ref kobnjjkouzatalitkeqr
```

### 4. 一键部署上云
最后，运行这行最有仪式感的命令：

```bash
supabase functions deploy echo-process --project-ref kobnjjkouzatalitkeqr
```

---

### 🚀 部署成功后，你的公网 URL 就是：
`https://kobnjjkouzatalitkeqr.supabase.co/functions/v1/echo-process`

**拿着这个 URL，填进你 iPhone 快捷指令的【获取 URL 内容】里，你的作业就彻底大功告成了！**
