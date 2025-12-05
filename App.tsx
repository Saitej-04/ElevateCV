import React, { useState, useRef } from 'react';
import { analyzeResume, analyzeResumeText } from './services/geminiService';
import { AnalysisResult } from './types';
import Dashboard from './components/Dashboard';
import { Upload, FileText, Loader2, Sparkles, File, X, ChevronRight, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
          setError("File size exceeds 5MB limit.");
          return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (file.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            return;
        }
          setSelectedFile(file);
          setError(null);
      }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'upload' && selectedFile) {
        const base64 = await convertFileToBase64(selectedFile);
        const mimeType = selectedFile.type;
        const data = await analyzeResume(base64, mimeType);
        setResult(data);
      } else if (activeTab === 'text' && textInput.trim()) {
        const data = await analyzeResumeText(textInput);
        setResult(data);
      } else {
        setError("Please select a file or paste your resume text.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setActiveTab('text');
    setTextInput(`John Doe
Software Engineer | San Francisco, CA | john.doe@example.com

SUMMARY
Passionate Full Stack Developer with 4 years of experience building scalable web applications. Proficient in JavaScript, React, Node.js, and AWS. Proven track record of improving site performance and leading cross-functional teams.

EXPERIENCE
Tech Solutions Inc. - Senior Developer (2021 - Present)
- Developed a new e-commerce platform using Next.js, increasing sales by 20%.
- Optimized database queries, reducing load times by 40%.
- Led a team of 3 junior developers.

Creative Agency - Web Developer (2019 - 2021)
- Built responsive websites for 10+ clients using HTML, CSS, and jQuery.
- Collaborated with designers to implement pixel-perfect UIs.

SKILLS
- Languages: JavaScript, TypeScript, Python, SQL
- Frameworks: React, Vue.js, Express, NestJS
- Tools: Git, Docker, AWS, Jenkins
- Soft Skills: Leadership, Communication, Problem Solving

EDUCATION
B.S. Computer Science - University of Technology (2015 - 2019)
`);
    setError(null);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedFile(null);
    setTextInput('');
    setError(null);
  };

  if (result) {
    return <Dashboard data={result} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 flex flex-col items-center justify-center p-4">
      
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-2">
                <Briefcase size={32} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                ElevateCV
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
                Optimize your resume with AI-powered ATS scoring, rewriting suggestions, and personalized career roadmaps.
            </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'upload' 
                        ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <Upload size={18} />
                    Upload Resume
                </button>
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'text' 
                        ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <FileText size={18} />
                    Paste Text
                </button>
            </div>

            {/* Content Area */}
            <div className="p-8">
                {activeTab === 'upload' ? (
                    <div 
                        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all ${
                            selectedFile ? 'border-blue-500 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        
                        {selectedFile ? (
                            <div className="flex flex-col items-center animate-fade-in">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                    <File size={24} />
                                </div>
                                <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                                <p className="text-sm text-slate-500 mb-4">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                    <X size={14} /> Remove File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                                    <Upload size={24} />
                                </div>
                                <p className="font-medium text-slate-700 mb-1">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-400">PDF, JPG or PNG (max 5MB)</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Paste your resume content here..."
                            className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 text-sm leading-relaxed"
                        ></textarea>
                        {textInput && (
                             <button 
                             onClick={() => setTextInput('')}
                             className="absolute top-2 right-2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-md"
                         >
                             Clear
                         </button>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                        <X size={16} />
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || (!selectedFile && !textInput)}
                        className={`w-full py-3.5 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all ${
                            loading || (!selectedFile && !textInput)
                            ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Analyzing Resume...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Analyze Resume
                            </>
                        )}
                    </button>
                    
                    {!loading && (
                        <button 
                            onClick={handleDemo}
                            className="text-sm text-slate-500 hover:text-blue-600 font-medium text-center transition-colors flex items-center justify-center gap-1"
                        >
                            Try with a demo resume <ChevronRight size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;