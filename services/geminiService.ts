import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// Define the schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    extracted_data: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        current_role: { type: Type.STRING },
        years_of_experience: { type: Type.NUMBER },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        education: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    ats_score: {
      type: Type.OBJECT,
      properties: {
        total_score: { type: Type.NUMBER },
        keyword_match_score: { type: Type.NUMBER },
        keyword_match_explanation: { type: Type.STRING, description: "Brief explanation of why the keyword match score is high or low." },
        format_quality: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
        format_quality_explanation: { type: Type.STRING, description: "Feedback on layout, fonts, and structure." },
        skill_alignment: { type: Type.STRING, enum: ["Poor", "Good", "Excellent"] },
        skill_alignment_explanation: { type: Type.STRING, description: "How well the skills match the current role or target roles." },
        quantifiable_impact_score: { type: Type.NUMBER, description: "Score 0-100 based on usage of numbers and metrics." },
        quantifiable_impact_explanation: { type: Type.STRING, description: "Explanation of how well the candidate used metrics." },
        action_verbs_score: { type: Type.NUMBER, description: "Score 0-100 based on strength of action verbs." },
        action_verbs_explanation: { type: Type.STRING, description: "Explanation of action verb usage." },
        grammar_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    resume_improvements: {
      type: Type.OBJECT,
      properties: {
        rewritten_bullets: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              improved: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
          },
        },
        missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        professional_summary: { type: Type.STRING },
      },
    },
    job_role_suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          match_percentage: { type: Type.NUMBER },
          reason: { type: Type.STRING },
        },
      },
    },
    career_roadmap: {
      type: Type.OBJECT,
      properties: {
        short_term: { type: Type.ARRAY, items: { type: Type.STRING } },
        medium_term: { type: Type.ARRAY, items: { type: Type.STRING } },
        long_term: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    salary_prediction: {
        type: Type.OBJECT,
        properties: {
            estimated_salary: { type: Type.STRING, description: "Estimated annual salary range in INR (e.g. ₹12 - 18 LPA)" }
        }
    },
    final_summary: { type: Type.STRING },
  },
  required: [
    "extracted_data",
    "ats_score",
    "resume_improvements",
    "job_role_suggestions",
    "career_roadmap",
    "salary_prediction",
    "final_summary",
  ],
};

export const analyzeResume = async (
  base64Data: string,
  mimeType: string
): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const modelId = "gemini-2.5-flash"; // Using 2.5 Flash as requested for efficiency and multimodal
  
  const systemInstruction = `You are a world-class AI Resume Analyzer and Career Mentor.
Your goal is to rigorously evaluate resumes against modern ATS (Applicant Tracking System) standards and provide actionable career advice.

1. **Extract**: Identify key details, skills (categorized), and measurable metrics.
2. **Evaluate**: Score the resume (0-100) based on impact, clarity, keywords, formatting, quantifiable results, and action verbs. Be strict but fair. Provide specific explanations for your scores.
3. **Improve**: Rewrite weak bullet points into "Action Verb + Task + Result" format.
4. **Mentor**: Suggest role fits, a concrete learning roadmap, and a realistic annual salary range in Indian Rupees (INR) formatted as '₹X - Y LPA'.

Input will be a resume file (PDF/Image). 
Output MUST be strict JSON matching the provided schema.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this resume. Provide the output in JSON format.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for more analytical/consistent results
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response received from Gemini.");
    }
    
    // The response is guaranteed to be JSON due to responseMimeType
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

export const analyzeResumeText = async (
    textData: string
  ): Promise<AnalysisResult> => {
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }
  
    const modelId = "gemini-2.5-flash"; 
    
    const systemInstruction = `You are a world-class AI Resume Analyzer and Career Mentor. 
    (Same instructions as above, but for text input).`;
  
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: {
          parts: [
            {
              text: `Analyze the following resume text:\n\n${textData}\n\nProvide the output in JSON format.`,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
          systemInstruction: systemInstruction,
          temperature: 0.4,
        },
      });
  
      const text = response.text;
      if (!text) {
          throw new Error("No response received from Gemini.");
      }
      
      return JSON.parse(text) as AnalysisResult;
  
    } catch (error) {
      console.error("Error analyzing resume text:", error);
      throw error;
    }
  };