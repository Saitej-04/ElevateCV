import React from 'react';
import { CareerRoadmap } from '../types';
import { ArrowRight, CheckCircle2, Clock, Trophy } from 'lucide-react';

interface RoadmapProps {
  roadmap: CareerRoadmap;
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmap }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Career Acceleration Roadmap
      </h3>
      
      <div className="relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Short Term */}
          <div className="group">
             <div className="bg-blue-50 border-2 border-blue-100 rounded-lg p-5 transition-all hover:shadow-md hover:border-blue-300">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">1</div>
                    <span className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Short Term (0-3 Mo)</span>
                </div>
                <ul className="space-y-3">
                    {roadmap.short_term.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
             </div>
          </div>

          {/* Medium Term */}
          <div className="group">
             <div className="bg-indigo-50 border-2 border-indigo-100 rounded-lg p-5 transition-all hover:shadow-md hover:border-indigo-300">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">2</div>
                    <span className="text-sm font-semibold text-indigo-800 uppercase tracking-wide">Mid Term (3-6 Mo)</span>
                </div>
                <ul className="space-y-3">
                    {roadmap.medium_term.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <Clock className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
             </div>
          </div>

          {/* Long Term */}
          <div className="group">
             <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-5 transition-all hover:shadow-md hover:border-purple-300">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">3</div>
                    <span className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Long Term (6+ Mo)</span>
                </div>
                <ul className="space-y-3">
                    {roadmap.long_term.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
