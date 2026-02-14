
import React, { useState } from 'react';
import { StoryRequest, StoryResult, GenerationStatus } from './types';
import { generateStoryContent } from './services/geminiService';

// --- Components ---

const InputField: React.FC<{
  label: string;
  icon: string;
  value: string | number;
  onChange: (val: any) => void;
  type?: string;
  placeholder?: string;
}> = ({ label, icon, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
      <i className={icon}></i> {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
      className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-500"
      placeholder={placeholder}
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  icon: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string; description?: string }[];
}> = ({ label, icon, value, onChange, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
      <i className={icon}></i> {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Stack 19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#0f172a]">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const SectionHeader: React.FC<{ title: string; step: number }> = ({ title, step }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
      {step}
    </div>
    <h2 className="text-xl font-bold text-white">{title}</h2>
  </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy}
      className="p-2 rounded-md hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
      title="Copy to clipboard"
    >
      <i className={copied ? "fas fa-check text-green-400" : "fas fa-copy"}></i>
    </button>
  );
};

// --- Constants ---

const IMAGE_STYLES = [
  { value: "photorealistic", label: "Photorealistic (사진처럼 사실적)" },
  { value: "Cinematic 3D Animation", label: "시네마틱 3D 애니메이션 (웅장하고 화려함)" },
  { value: "Pixar 3D Character style", label: "픽사풍 3D 캐릭터 (귀여운 비율과 정교한 질감)" },
  { value: "3D Disney Animation style", label: "3D 디즈니 스타일 (크고 맑은 눈망울과 부드러운 피부)" },
  { value: "Semi-Realistic 3D Illustration", label: "세미 리얼리스틱 3D 일러스트 (특징 강조와 정교함)" },
  { value: "Storybook Stylized Illustration", label: "동화책 스타일 일러스트 (포근한 색감과 손그림 질감)" },
  { value: "Dark Fantasy Illustration", label: "다크 판타지 일러스트 (어둡고 무거운 웅장함)" }
];

// --- Main App ---

export default function App() {
  const [request, setRequest] = useState<StoryRequest>({
    topic: '',
    duration: '1분 내외',
    imageStyle: IMAGE_STYLES[0].value,
    sceneCount: 4
  });

  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!request.topic) {
      alert("주제를 입력해주세요.");
      return;
    }
    setStatus(GenerationStatus.IDLE); // Reset
    setTimeout(async () => {
      setStatus(GenerationStatus.LOADING);
      setError(null);
      try {
        const data = await generateStoryContent(request);
        setResult(data);
        setStatus(GenerationStatus.SUCCESS);
      } catch (err: any) {
        setError(err.message || "생성 중 오류가 발생했습니다.");
        setStatus(GenerationStatus.ERROR);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-film text-white"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AI Story Director <span className="text-indigo-400">Pro</span></h1>
          </div>
          <div className="hidden md:block text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
            Powered by Gemini 3 Pro
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-morphism rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fas fa-sliders-h text-indigo-400"></i> 구성 설정
            </h2>
            
            <div className="space-y-5">
              <InputField 
                label="주제 (Topic)" 
                icon="fas fa-lightbulb" 
                value={request.topic} 
                onChange={(v) => setRequest({...request, topic: v})} 
                placeholder="예) 고대 도서관을 지키는 로봇의 모험"
              />
              <InputField 
                label="목표 분량" 
                icon="fas fa-clock" 
                value={request.duration} 
                onChange={(v) => setRequest({...request, duration: v})} 
                placeholder="예) 2분 내외"
              />
              <SelectField
                label="이미지 스타일"
                icon="fas fa-paint-brush"
                value={request.imageStyle}
                options={IMAGE_STYLES}
                onChange={(v) => setRequest({...request, imageStyle: v})}
              />
              <InputField 
                label="장면 개수 (N)" 
                icon="fas fa-images" 
                type="number"
                value={request.sceneCount} 
                onChange={(v) => setRequest({...request, sceneCount: v})} 
              />
              
              <button
                onClick={handleGenerate}
                disabled={status === GenerationStatus.LOADING}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {status === GenerationStatus.LOADING ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>
                    생성 중...
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles"></i>
                    콘텐츠 설계 시작
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300">
            <p className="flex items-start gap-2">
              <i className="fas fa-info-circle mt-1"></i>
              입력하신 정보를 바탕으로 대본부터 영상 행동 묘사까지 한 번에 설계됩니다.
            </p>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-8">
          {status === GenerationStatus.IDLE && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-2xl opacity-50">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-terminal text-3xl text-slate-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-400">출력 준비 완료</h3>
              <p className="max-w-xs mt-2 text-slate-500">왼쪽 패널에서 주제를 입력하고 생성 버튼을 눌러주세요.</p>
            </div>
          )}

          {status === GenerationStatus.LOADING && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 glass-morphism rounded-2xl space-y-8">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-brain text-indigo-400 text-2xl animate-pulse"></i>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">스토리를 설계하고 있습니다</h3>
                <p className="text-slate-400">
                  대본 작성, 캐릭터 참조 설계, 장면 프롬프트 구상 중...
                </p>
              </div>
            </div>
          )}

          {status === GenerationStatus.ERROR && (
            <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
              <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">오류가 발생했습니다</h3>
              <p className="text-red-300">{error}</p>
              <button 
                onClick={handleGenerate}
                className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {status === GenerationStatus.SUCCESS && result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* STEP 1: Script */}
              <div className="glass-morphism rounded-2xl p-8 overflow-hidden">
                <SectionHeader title="몰입형 대본 및 요약" step={1} />
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 mb-6">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Story Summary</h4>
                  <p className="text-lg leading-relaxed text-slate-200 italic">"{result.summary}"</p>
                </div>
                <div className="relative">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between items-center">
                    Final Narration Script
                    <CopyButton text={result.script} />
                  </h4>
                  <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto custom-scrollbar">
                    {result.script}
                  </div>
                </div>
              </div>

              {/* STEP 2: Characters */}
              <div className="glass-morphism rounded-2xl p-8">
                <SectionHeader title="캐릭터 참조 설계" step={2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.characters.map((char, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-xl border border-slate-700 p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-white">{char.name}</h4>
                        <CopyButton text={char.referencePrompt} />
                      </div>
                      <div className="text-sm text-slate-400 border-l-2 border-indigo-600 pl-3">
                        {char.description}
                      </div>
                      <div className="text-xs bg-black/40 p-3 rounded-lg text-slate-500 font-mono break-words leading-tight">
                        <span className="text-indigo-400">Prompt:</span> {char.referencePrompt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 3 & 4: Scenes & Motion */}
              <div className="glass-morphism rounded-2xl p-8">
                <SectionHeader title="장면 이미지 및 행동 묘사" step={3} />
                <div className="space-y-10">
                  {result.scenes.map((scene, idx) => (
                    <div key={idx} className="relative pl-10 border-l border-slate-800">
                      <div className="absolute top-0 left-[-8px] w-4 h-4 rounded-full bg-indigo-500 shadow-glow"></div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <h4 className="text-lg font-bold text-indigo-300">Scene #{scene.id} <span className="text-slate-500 text-sm font-normal ml-2">{scene.meaning}</span></h4>
                          <div className="flex gap-2">
                             <CopyButton text={scene.imagePrompt} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Image Prompt Box */}
                          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                             <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Image Prompt (EN)</span>
                             <p className="text-sm text-slate-300 italic">{scene.imagePrompt}</p>
                          </div>
                          
                          {/* Motion Description Box */}
                          <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
                             <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-2">Motion Description (KR)</span>
                             <p className="text-sm text-indigo-100 flex items-center gap-2">
                               <i className="fas fa-play-circle text-indigo-400"></i>
                               {scene.motionDescription}
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="text-center p-8 bg-gradient-to-t from-indigo-900/20 to-transparent rounded-2xl border border-indigo-500/10">
                <p className="text-slate-400 text-sm mb-4 italic">이제 이 설계도를 바탕으로 AI 영상 툴(Runway, Luma, Kling 등)에서 멋진 영상을 제작해보세요!</p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-medium transition-colors"
                >
                  <i className="fas fa-arrow-up mr-2"></i> 상단으로 이동
                </button>
              </div>

            </div>
          )}
        </div>

      </main>

      {/* Floating Info */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">
            <i className="fas fa-check"></i>
          </div>
          <div className="text-[11px] leading-tight">
            <span className="block font-bold text-white">System Status</span>
            <span className="text-slate-400">Ready to direct stories</span>
          </div>
        </div>
      </div>
    </div>
  );
}
