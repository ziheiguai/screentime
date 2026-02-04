import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
    // 处理跨域请求 (CORS)
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        })
    }

    // 2. 检查方法（防止浏览器直接访问报错）
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: "请使用 POST 请求访问，不要直接用浏览器打开哦！" }), {
            status: 405,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })
    }

    try {
        const body = await req.json()
        const { screenshot_text, screenshot_image_base64, completed_tasks, personality } = body
        const today = new Date().toISOString().split('T')[0]

        // 1. 定义人设 Prompt
        const personas = {
            coach: "你是一个严厉的效率教练，说话直接、不留情面，重点在指出时间的浪费。",
            butler: "你是一个温和体贴的管家，关心用户的身心健康，语气优雅且富有同理心。",
            neutral: "你是一个客观理性的生活分析助手，语言简洁明了，逻辑清晰，不带多余的情感色彩，客观分析数据并给出建议。"
        }

        const systemPrompt = `
      ${personas[personality] || personas.neutral}
      
      任务描述：根据用户提供的当天信息生成一份复盘报告。
      
      数据输入：
      - 屏幕使用时间信息：${screenshot_text}
      - 今日完成任务：${(completed_tasks || []).join(', ')}
      
      要求：用 Markdown 格式输出，包含核心总结、硬核分析、建议和能量结语。
    `

        // 2. 调用 Gemini API
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`

        // 构造 Multimodal 内容
        const userParts = []
        if (screenshot_text) {
            userParts.push({ text: `屏幕截图识别出的文字：${screenshot_text}` })
        }
        if (screenshot_image_base64) {
            userParts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: screenshot_image_base64
                }
            })
        }
        userParts.push({ text: `今日完成任务：${(completed_tasks || []).join(', ')}` })

        console.log("Calling Gemini API...")
        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: systemPrompt }] },
                    { role: "user", parts: userParts }
                ]
            })
        })

        const geminiData = await geminiRes.json()

        if (geminiData.error) {
            console.error("Gemini API Error:", geminiData.error)
            throw new Error(`Gemini API Error: ${geminiData.error.message}`)
        }

        if (!geminiData.candidates || geminiData.candidates.length === 0) {
            console.error("Gemini Response is empty:", geminiData)
            throw new Error("Gemini 没能给出有效的回答，可能是因为输入内容触发了安全过滤。")
        }

        const aiText = geminiData.candidates[0].content.parts[0].text

        // 3. 存入数据库
        await supabase.from('daily_narratives').upsert({
            date: today,
            summary: aiText
        })

        return new Response(JSON.stringify({ result: aiText }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })
    }
})
