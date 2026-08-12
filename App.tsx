
import React, { useState, useRef } from 'react';
import Lens from './components/Lens';
import { MediaFile, LensSide, LensColor, DEFAULT_COLOR } from './types';
import { Play, Pause, Eye, RefreshCw, Power, Link2, Unlink, Palette } from 'lucide-react';

const App: React.FC = () => {
  const [leftPlaylist, setLeftPlaylist] = useState<MediaFile[]>([]);
  const [rightPlaylist, setRightPlaylist] = useState<MediaFile[]>([]);
  
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  const [leftTransform, setLeftTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [rightTransform, setRightTransform] = useState({ scale: 1, x: 0, y: 0 });

  const [leftColor, setLeftColor] = useState<LensColor>(DEFAULT_COLOR);
  const [rightColor, setRightColor] = useState<LensColor>(DEFAULT_COLOR);

  const [isLinked, setIsLinked] = useState(false);
  const [isColorsLinked, setIsColorsLinked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const leftVideoRef = useRef<HTMLVideoElement | null>(null);
  const rightVideoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const syncRightToLeft = () => {
    setRightPlaylist([...leftPlaylist]);
    setRightIndex(leftIndex);
    if (isLinked) {
        setRightTransform({ ...leftTransform });
    }
    if (isColorsLinked) {
        setRightColor({ ...leftColor });
    }
  };

  const handleTransformChange = (side: LensSide, scale: number, position: { x: number; y: number }) => {
    const newTransform = { scale, ...position };
    if (isLinked) {
        setLeftTransform(newTransform);
        setRightTransform(newTransform);
    } else {
        side === LensSide.LEFT ? setLeftTransform(newTransform) : setRightTransform(newTransform);
    }
  };

  const handleColorChange = (side: LensSide, colors: LensColor) => {
    if (isColorsLinked) {
      setLeftColor(colors);
      setRightColor(colors);
    } else {
      side === LensSide.LEFT ? setLeftColor(colors) : setRightColor(colors);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 font-sans selection:bg-blue-500/30">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               <Eye size={18} className="text-white" />
             </div>
             <div>
               <h1 className="text-lg font-bold tracking-tight text-white">SmartLens <span className="text-blue-500">OS</span></h1>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest">Dual Vision System v2.7</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 hover:bg-gray-800 rounded-full transition text-gray-400 hover:text-white">
                <Power size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full flex justify-center gap-3 mb-8 flex-wrap">
           <button onClick={togglePlay} className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">
             {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
             {isPlaying ? "PAUSE" : "PLAY"}
           </button>
           
           <div className="flex bg-gray-900/50 p-1 rounded-full border border-gray-800">
             <button 
               onClick={() => setIsLinked(!isLinked)} 
               className={`flex items-center gap-2 px-5 py-2 rounded-full transition text-sm font-medium ${isLinked ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
               title="Link Transforms & Playlists"
             >
               {isLinked ? <Link2 size={16} /> : <Unlink size={16} />}
               <span>MOTION LINK</span>
             </button>
             <button 
               onClick={() => setIsColorsLinked(!isColorsLinked)} 
               className={`flex items-center gap-2 px-5 py-2 rounded-full transition text-sm font-medium ${isColorsLinked ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
               title="Link Chroma Engine Settings"
             >
               {isColorsLinked ? <Link2 size={16} /> : <Unlink size={16} />}
               <Palette size={14} />
               <span>COLOR LINK</span>
             </button>
           </div>

           <button onClick={syncRightToLeft} className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 font-medium rounded-full hover:bg-gray-700 transition">
             <RefreshCw size={18} />
             <span>SYNC ALL</span>
           </button>
        </div>

        <div className="relative w-full max-w-5xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-4 bg-gray-900 z-10 rounded-full shadow-lg border border-gray-800"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                <div className="relative">
                     <div className="absolute -top-10 left-0 text-gray-500 text-xs font-mono uppercase tracking-tighter">LENS_01 // <span className="text-orange-500">RDY</span></div>
                     <Lens 
                        side={LensSide.LEFT}
                        playlist={leftPlaylist}
                        currentIndex={leftIndex}
                        isPlaying={isPlaying}
                        onPlaylistChange={setLeftPlaylist}
                        onIndexChange={setLeftIndex}
                        onVideoRef={(ref) => leftVideoRef.current = ref}
                        isActive={false}
                        scale={leftTransform.scale}
                        position={{ x: leftTransform.x, y: leftTransform.y }}
                        onTransformChange={(s, p) => handleTransformChange(LensSide.LEFT, s, p)}
                        colors={leftColor}
                        onColorChange={(c) => handleColorChange(LensSide.LEFT, c)}
                        isColorsLinked={isColorsLinked}
                     />
                </div>
                <div className="relative">
                    <div className="absolute -top-10 right-0 text-gray-500 text-xs font-mono text-right uppercase tracking-tighter"><span className="text-blue-500">RDY</span> // LENS_02</div>
                    <Lens 
                        side={LensSide.RIGHT}
                        playlist={rightPlaylist}
                        currentIndex={rightIndex}
                        isPlaying={isPlaying}
                        onPlaylistChange={setRightPlaylist}
                        onIndexChange={setRightIndex}
                        onVideoRef={(ref) => rightVideoRef.current = ref}
                        isActive={false}
                        scale={rightTransform.scale}
                        position={{ x: rightTransform.x, y: rightTransform.y }}
                        onTransformChange={(s, p) => handleTransformChange(LensSide.RIGHT, s, p)}
                        colors={rightColor}
                        onColorChange={(c) => handleColorChange(LensSide.RIGHT, c)}
                        isColorsLinked={isColorsLinked}
                    />
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;
