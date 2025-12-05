import React from 'react';
import { AnalysisResult } from '../types';
import RadialScore from './RadialScore';
import Roadmap from './Roadmap';
import { Briefcase, IndianRupee, Globe, BookOpen, AlertCircle, CheckCircle, Wand2, User, Mail, Award, Target, FileSearch, LayoutTemplate, AlertTriangle, TrendingUp, PenTool } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const { extracted_data, ats_score, resume_improvements, job_role_suggestions, salary_prediction } = data;

  const roleChartData = job_role_suggestions.map(role => ({
    name: role.role.split(' ')[0] + '...', // Truncate for display
    fullName: role.role,
    match: role.match_percentage
  }));

  const getFormatColor = (quality: string) => {
    switch(quality) {
        case 'High': return 'text-green-600 bg-green-50 border-green-200';
        case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
        default: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Profile Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{extracted_data.name || "Candidate"}</h1>
                <div className="flex flex-wrap gap-4 text-slate-500 text-sm mt-1">
                    {extracted_data.current_role && (
                        <span className="flex items-center gap-1"><Briefcase size={14} /> {extracted_data.current_role}</span>
                    )}
                    {extracted_data.email && (
                        <span className="flex items-center gap-1"><Mail size={14} /> {extracted_data.email}</span>
                    )}
                    <span className="flex items-center gap-1"><Award size={14} /> {extracted_data.years_of_experience} Years Exp.</span>
                </div>
            </div>
        </div>
        <button 
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
            Analyze New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Scores & Skills */}
        <div className="space-y-8">
            {/* ATS Score & Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    ATS Compatibility
                </h2>
                
                {/* Main Score */}
                <div className="mb-6">
                    <RadialScore score={ats_score.total_score} label={ats_score.skill_alignment + " Match"} />
                </div>
                
                {/* Breakdown List */}
                <div className="space-y-4">
                    
                    {/* Keywords */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FileSearch size={14} className="text-blue-500"/> Keyword Match
                            </span>
                            <span className="text-sm font-bold text-slate-900">{ats_score.keyword_match_score}/100</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${ats_score.keyword_match_score}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {ats_score.keyword_match_explanation}
                        </p>
                    </div>

                    {/* Quantifiable Impact - NEW */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <TrendingUp size={14} className="text-green-500"/> Impact & Metrics
                            </span>
                            <span className="text-sm font-bold text-slate-900">{ats_score.quantifiable_impact_score || 0}/100</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${ats_score.quantifiable_impact_score || 0}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {ats_score.quantifiable_impact_explanation || "No data available."}
                        </p>
                    </div>

                    {/* Action Verbs - NEW */}
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <PenTool size={14} className="text-orange-500"/> Action Verbs
                            </span>
                            <span className="text-sm font-bold text-slate-900">{ats_score.action_verbs_score || 0}/100</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${ats_score.action_verbs_score || 0}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {ats_score.action_verbs_explanation || "No data available."}
                        </p>
                    </div>

                    {/* Formatting */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <LayoutTemplate size={14} className="text-purple-500"/> Formatting
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getFormatColor(ats_score.format_quality)}`}>
                                {ats_score.format_quality}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {ats_score.format_quality_explanation}
                        </p>
                    </div>

                    {/* Skills Alignment */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Briefcase size={14} className="text-indigo-500"/> Skill Match
                            </span>
                             <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {ats_score.skill_alignment}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                             {ats_score.skill_alignment_explanation}
                        </p>
                    </div>

                    {/* Grammar Issues */}
                    {ats_score.grammar_issues && ats_score.grammar_issues.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                             <h4 className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                                <AlertTriangle size={12} /> Grammar & Clarity Issues
                             </h4>
                             <ul className="space-y-1">
                                {ats_score.grammar_issues.map((issue, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                        <span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0"></span>
                                        {issue}
                                    </li>
                                ))}
                             </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Skills Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    Skills Gap Analysis
                </h2>
                
                <div className="mb-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {extracted_data.skills.slice(0, 10).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Missing / Recommended</h3>
                    <div className="flex flex-wrap gap-2">
                        {resume_improvements.missing_skills.length > 0 ? resume_improvements.missing_skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100">
                                {skill}
                            </span>
                        )) : (
                            <span className="text-xs text-slate-500 italic">No major skills missing for this role.</span>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Salary Prediction */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                 <h2 className="text-lg font-bold text-slate-800 mb-4">Estimated Salary</h2>
                 <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-green-700">
                        <IndianRupee size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-green-800 font-medium uppercase tracking-wide opacity-80">Annual Salary (India)</p>
                        <p className="text-xl font-bold text-green-900">{salary_prediction.estimated_salary}</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* Middle & Right Col: Improvements & Roadmap */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Suggested Roles */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Best Fit Roles</h2>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={roleChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="fullName" type="category" width={150} tick={{fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{fill: '#f1f5f9'}}
                            />
                            <Bar dataKey="match" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                {roleChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#93c5fd'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid gap-4">
                    {job_role_suggestions.slice(0, 3).map((role, idx) => (
                        <div key={idx} className="text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            <span className="font-semibold text-blue-900">{role.role}:</span> 
                            <span className="text-slate-700 ml-1">{role.reason}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resume Rewriter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-500" />
                    AI Resume Improvements
                </h2>
                
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <h3 className="text-sm font-bold text-purple-900 mb-2">Suggested Professional Summary</h3>
                        <p className="text-sm text-purple-800 leading-relaxed italic">"{resume_improvements.professional_summary}"</p>
                    </div>

                    {/* Bullets */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Bullet Point Rewrites</h3>
                        {resume_improvements.rewritten_bullets.map((item, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                                <div className="p-3 bg-red-50 border-b border-slate-100 flex gap-3">
                                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-red-600 uppercase block mb-1">Original</span>
                                        <p className="text-sm text-slate-600">{item.original}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 flex gap-3">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-green-600 uppercase block mb-1">AI Enhanced</span>
                                        <p className="text-sm text-slate-800 font-medium">{item.improved}</p>
                                        <p className="text-xs text-green-700 mt-2 opacity-80">Reason: {item.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Roadmap roadmap={data.career_roadmap} />
            
        </div>
      </div>
    </div>
  );
};

export default Dashboard;