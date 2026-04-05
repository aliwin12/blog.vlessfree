import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/check-compliance", async (req, res) => {
    const { title, excerpt, content } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        isCompliant: false, 
        reason: "GEMINI_API_KEY is not configured on the server." 
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Проверь статью на соответствие правилам (https://blog-vlessfree.vercel.app/terms). 
        Дополнительные правила:
        1. Использование слова "tqweji23" строго запрещено в любом контексте.
        2. Использование ненормативной лексики (матов) разрешено, если их количество в тексте не превышает 5 слов. Если матов от 1 до 5, это считается "в меру" и НЕ является нарушением. Если матов больше 5, статья считается нарушающей правила.
        Заголовок: ${title}
        Описание: ${excerpt}
        Текст: ${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCompliant: { type: Type.BOOLEAN },
              reason: { type: Type.STRING, description: "Причина нарушения, если есть (на русском языке)" }
            },
            required: ["isCompliant"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error: any) {
      console.error("AI Compliance Check Error:", error);
      res.status(500).json({ 
        isCompliant: false, 
        reason: "Ошибка при проверке статьи через ИИ." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
