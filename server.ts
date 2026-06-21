import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.post("/api/generate", async (req, res) => {
    try {
      const { niche, audience, lang, extra, urlVal, textVal, currentTab, uploadedImageData } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not defined");
      }

      const ai = new GoogleGenAI({ apiKey });

      let contentsParts: any[] = [];
      const promptText = `Anda adalah seorang ahli Pinterest SEO dan Digital Marketing. Tugas Anda adalah menghasilkan metadata Pinterest yang optimal untuk memicu trafik maksimal, berdasarkan input berikut:
      
      Niche/Kategori: ${niche}
      Target Audiens: ${audience}
      Bahasa Output: ${lang}
      Kata Kunci Tambahan: ${extra ? extra : 'Tidak ada'}
      ${currentTab === 'url' ? `Referensi URL: ${urlVal}` : ''}
      ${currentTab === 'text' ? `Deskripsi Produk: ${textVal}` : ''}
      
      Buatlah metadata yang menarik, mengandung kata kunci relevan secara natural, dan berfokus pada konversi klik. Berikan JSON sesuai schema yang diminta.`;

      contentsParts.push({ text: promptText });

      if (currentTab === 'image' && uploadedImageData) {
        contentsParts.push({
          inlineData: { mimeType: uploadedImageData.mimeType, data: uploadedImageData.base64 }
        });
      }

      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Judul pin max 100 karakter, mengandung keyword utama" },
          description: { type: Type.STRING, description: "Deskripsi 150-300 karakter, informatif, natural, dan ada call-to-action" },
          alt_text: { type: Type.STRING, description: "Alt text untuk aksesibilitas dan SEO" },
          primary_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          secondary_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          board_suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          best_posting_time: { type: Type.STRING, description: "Rekomendasi waktu posting dalam bahasa yang diminta" },
          seo_scores: {
            type: Type.OBJECT,
            properties: {
              title_score: { type: Type.INTEGER },
              description_score: { type: Type.INTEGER },
              keyword_score: { type: Type.INTEGER },
              overall: { type: Type.INTEGER }
            },
            required: ["title_score", "description_score", "keyword_score", "overall"]
          },
          seo_label: { type: Type.STRING, description: "Label singkat seperti 'Sangat Optimal' atau 'Cukup'" }
        },
        required: ["title", "description", "alt_text", "primary_keywords", "secondary_keywords", "hashtags", "board_suggestions", "best_posting_time", "seo_scores", "seo_label"]
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contentsParts,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      if (response.text) {
        res.json(JSON.parse(response.text));
      } else {
        throw new Error("No response text from Gemini API");
      }

    } catch (error: any) {
      console.error("API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate metadata" });
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
