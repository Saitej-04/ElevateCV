export interface ExtractedData {
  name: string;
  email: string;
  current_role: string;
  years_of_experience: number;
  skills: string[];
  education: string[];
}

export interface ATSScore {
  total_score: number; // 0-100
  keyword_match_score: number;
  keyword_match_explanation: string;
  format_quality: "Low" | "Medium" | "High";
  format_quality_explanation: string;
  skill_alignment: "Poor" | "Good" | "Excellent";
  skill_alignment_explanation: string;
  quantifiable_impact_score: number; // 0-100
  quantifiable_impact_explanation: string;
  action_verbs_score: number; // 0-100
  action_verbs_explanation: string;
  grammar_issues: string[];
}

export interface ResumeImprovements {
  rewritten_bullets: Array<{
    original: string;
    improved: string;
    explanation: string;
  }>;
  missing_skills: string[];
  professional_summary: string;
}

export interface JobRoleSuggestion {
  role: string;
  match_percentage: number;
  reason: string;
}

export interface CareerRoadmap {
  short_term: string[]; // 0-3 months
  medium_term: string[]; // 3-6 months
  long_term: string[]; // 6+ months
}

export interface SalaryPrediction {
  estimated_salary: string;
}

export interface AnalysisResult {
  extracted_data: ExtractedData;
  ats_score: ATSScore;
  resume_improvements: ResumeImprovements;
  job_role_suggestions: JobRoleSuggestion[];
  career_roadmap: CareerRoadmap;
  final_summary: string;
  salary_prediction: SalaryPrediction;
}

export enum FileType {
  PDF = 'application/pdf',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  TEXT = 'text/plain'
}