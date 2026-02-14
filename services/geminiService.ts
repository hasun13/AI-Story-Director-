
import { GoogleGenAI, Type } from "@google/genai";
import { StoryRequest, StoryResult } from "../types";

export const generateStoryContent = async (request: StoryRequest): Promise<StoryResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    당신은 AI 스토리텔링 및 영상 콘텐츠 설계 전문가입니다. 
    사용자의 요청에 따라 [대본 생성 -> 캐릭터 설계 -> 이미지 프롬프트 -> 영상 행동 묘사]를 수행합니다.
    
    규칙:
    1. STEP 1: 서사 구조(발단-전개-위기-절정-결말)를 지키는 훅 있는 대본 작성.
    2. STEP 2: 주요 캐릭터를 전신(Full Body) 기준으로 일관된 스타일의 영어 프롬프트 생성.
    3. STEP 3: N개의 핵심 장면 선별. 캐릭터 묘사 대신 "based on reference images" 사용.
    4. STEP 4: 영상 행동(Motion) 묘사를 한국어로 작성.
    
    **중요: 모든 영어 이미지 프롬프트(캐릭터 및 장면)는 최고의 품질을 보장하기 위해 고해상도 및 퀄리티 관련 키워드를 반드시 포함하십시오.**
    (예: "masterpiece, 8k resolution, highly detailed, photorealistic, cinematic lighting, sharp focus, intricate textures, professional grading")
    
    반드시 다음 JSON 구조로 응답하십시오.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      주제: ${request.topic}
      목표 분량: ${request.duration}
      이미지 스타일: ${request.imageStyle}
      생성 이미지 개수: ${request.sceneCount}
    `,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "3줄 이야기 요약" },
          script: { type: Type.STRING, description: "최종 나레이션 대본 (구어체)" },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                referencePrompt: { type: Type.STRING, description: "EN character reference prompt (Full body, neutral pose, include high-quality tags)" },
                description: { type: Type.STRING, description: "KR 캐릭터 설명" }
              },
              required: ["name", "referencePrompt", "description"]
            }
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                imagePrompt: { type: Type.STRING, description: "EN scene image prompt (includes 'based on reference images' and high-quality tags)" },
                meaning: { type: Type.STRING, description: "KR 장면 의미 및 참조 인물" },
                motionDescription: { type: Type.STRING, description: "KR 영상 행동 묘사" }
              },
              required: ["id", "imagePrompt", "meaning", "motionDescription"]
            }
          }
        },
        required: ["summary", "script", "characters", "scenes"]
      }
    }
  });

  const resultText = response.text;
  try {
    return JSON.parse(resultText) as StoryResult;
  } catch (e) {
    console.error("JSON Parsing Error:", e);
    throw new Error("Failed to parse AI response.");
  }
};
