
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Upload, X, Film, ZoomIn, Search, Maximize, Move, RotateCcw, Lock, Unlock, Volume2, VolumeX, Palette, ChevronDown, ChevronUp, Link2, Ghost } from 'lucide-react';
import { MediaFile, LensSide, LensColor } from '../types';

interface LensProps {
  side: LensSide;
  playlist: MediaFile[];
  currentIndex: number;
  isPlaying: boolean;
  onPlaylistChange: (files: MediaFile[]) => void;
  onIndexChange: (index: number) => void;
  onVideoRef: (ref: HTMLVideoElement | null) => void;
  isActive: boolean;
  scale: number;
  position: { x: number; y: number };
  onTransformChange: (scale: number, position: { x: number; y: number }) => void;
  colors: LensColor;
  onColorChange: (colors: LensColor) => void;
  isColorsLinked: boolean;
}

const Lens: React.FC<LensProps> = ({
  side,
  playlist,
  currentIndex,
  isPlaying,
  onPlaylistChange,
  onIndexChange,
  onVideoRef,
  isActive,
  scale,
  position,
  onTransformChange,
  colors,
  onColorChange,
  isColorsLinked
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLocked, setIsLocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showColorControls, setShowColorControls] = useState(false);

  useEffect(() => {
    onVideoRef(videoRef.current);
  }, [onVideoRef]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: MediaFile[] = (Array.from(e.target.files) as File[]).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image'
      }));
      onPlaylistChange([...playlist, ...newFiles]);
    }
  };

  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newList = playlist.filter(item => item.id !== id);
    onPlaylistChange(newList);
    if (currentIndex >= newList.length) {
      onIndexChange(Math.max(0, newList.length - 1));
    }
  };

  const resetTransform = () => {
    onTransformChange(1, { x: 0, y: 0 });
  };

  const resetColors = () => {
    onColorChange({ r: 0, g: 0, b: 0, c: 0, m: 0, y: 0, k: 0, bw: 0 });
  };

  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    const r = 255 * (1 - c / 100) * (1 - k / 100);
    const g = 255 * (1 - m / 100) * (1 - k / 100);
    const b = 255 * (1 - y / 100) * (1 - k / 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const currentMedia = playlist[currentIndex];
  const shapeClass = side === LensSide.LEFT ? 'lens-shape-left' : 'lens-shape-right';
  const gradientClass = side === LensSide.LEFT 
    ? 'bg-gradient-to-br from-orange-400/20 to-blue-600/20' 
    : 'bg-gradient-to-bl from-orange-400/20 to-blue-600/20';

  return (
    <div className="flex flex-col w-full max-w-md mx-auto relative group">
      
      {/* Lens Viewer */}
      <div className={`relative aspect-[4/3] bg-black overflow-hidden border-4 border-gray-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] ${shapeClass}`}>
        
        {!currentMedia && (
          <div className={`absolute inset-0 flex items-center justify-center ${gradientClass} backdrop-blur-sm`}>
             <div className="text-center p-6 opacity-60">
                <Upload className="w-12 h-12 mx-auto mb-2 text-white/50" />
                <p className="text-xs font-mono uppercase tracking-widest text-white/70">
                  {side === LensSide.LEFT ? 'L_EYE' : 'R_EYE'} FEED
                </p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition border border-white/10"
                  disabled={isLocked}
                >
                  LOAD
                </button>
             </div>
          </div>
        )}

        {currentMedia && (
          <div className="w-full h-full overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentMedia.url}
              className="w-full h-full object-cover transition-[transform,filter] duration-75 ease-out will-change-transform"
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                filter: `grayscale(${colors.bw}%)` 
              }}
              playsInline
              loop
              muted={isMuted}
            />
            
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-screen transition-colors duration-300"
              style={{ backgroundColor: `rgb(${colors.r}, ${colors.g}, ${colors.b})` }}
            />
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-multiply transition-colors duration-300"
              style={{ backgroundColor: cmykToRgb(colors.c, colors.m, colors.y, colors.k) }}
            />
          </div>
        )}
        
        <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        {isActive && (
            <div className="absolute inset-0 pointer-events-none border-2 border-green-500/30 shadow-[inset_0_0_20px_rgba(34,197,94,0.2)] animate-pulse rounded-[inherit]"></div>
        )}
        {isLocked && <div className="absolute top-4 right-4"><Lock size={16} className="text-white/20" /></div>}
        {isMuted && currentMedia && (
             <div className="absolute bottom-4 right-4 bg-black/50 p-1.5 rounded-full backdrop-blur-md">
                <VolumeX size={14} className="text-white/70" />
            </div>
        )}
      </div>

      {/* Control Unit */}
      <div className="mt-4 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-lg p-3">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{side} FEED CONTROL</h3>
            <div className="flex gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-1.5 rounded transition ${isMuted ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}>
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button onClick={() => setIsLocked(!isLocked)} className={`p-1.5 rounded transition ${isLocked ? 'bg-red-500/20 text-red-400' : 'text-gray-400'}`}>
                    {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
                {!isLocked && (
                    <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-blue-400 hover:text-blue-300">
                        <Upload size={14} />
                    </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" multiple accept="video/*,image/*" onChange={handleFileUpload} />
            </div>
        </div>

        <div className={`transition-all duration-300 ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}>
            {/* Transform */}
            <div className="space-y-2 mb-3 bg-gray-950/30 p-2 rounded border border-gray-800/50">
                <div className="flex items-center gap-2">
                    <Maximize size={12} className="text-gray-500" />
                    <input type="range" min="0.1" max="3" step="0.05" value={scale} onChange={(e) => onTransformChange(parseFloat(e.target.value), position)} className="flex-1 h-1 bg-gray-700 accent-blue-500 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="flex items-center gap-2">
                    <Move size={12} className="text-gray-500" />
                    <input type="range" min="-200" max="200" value={position.x} onChange={(e) => onTransformChange(scale, { ...position, x: parseInt(e.target.value) })} className="flex-1 h-1 bg-gray-700 accent-green-500 rounded-lg appearance-none cursor-pointer" />
                    <input type="range" min="-200" max="200" value={position.y} onChange={(e) => onTransformChange(scale, { ...position, y: parseInt(e.target.value) })} className="flex-1 h-1 bg-gray-700 accent-green-500 rounded-lg appearance-none cursor-pointer" />
                    <button onClick={resetTransform} className="text-gray-600 hover:text-white"><RotateCcw size={14} /></button>
                </div>
            </div>

            {/* Chroma Engine */}
            <div className={`mb-3 bg-gray-950/30 rounded border transition-colors ${isColorsLinked ? 'border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.05)]' : 'border-gray-800/50'}`}>
                <button 
                    onClick={() => setShowColorControls(!showColorControls)}
                    className="w-full flex items-center justify-between p-2 text-[10px] font-bold hover:bg-white/5 transition uppercase tracking-widest"
                >
                    <div className="flex items-center gap-2">
                        <Palette size={12} className={isColorsLinked ? 'text-emerald-400' : 'text-blue-400'} />
                        <span className={isColorsLinked ? 'text-emerald-400' : 'text-blue-400'}>Chroma Engine</span>
                        {isColorsLinked && <Link2 size={10} className="text-emerald-400 animate-pulse" />}
                    </div>
                    {showColorControls ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                
                {showColorControls && (
                    <div className="p-2 space-y-3 animate-in slide-in-from-top-2 duration-300">
                        {/* Monochrome Section */}
                        <div className="space-y-1.5 pb-2 border-b border-gray-800/50">
                            <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase">
                                <span>Monochrome Module</span>
                                <span>{colors.bw}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={colors.bw} 
                                onChange={(e) => onColorChange({ ...colors, bw: parseInt(e.target.value) })}
                                className="w-full h-1.5 bg-gradient-to-r from-gray-400 to-white rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase">
                                <span>RGB Correction</span>
                                <button onClick={resetColors} className="text-blue-500 hover:underline">Reset</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {['r', 'g', 'b'].map((channel) => (
                                    <div key={channel} className="space-y-0.5">
                                        <div className="flex justify-between text-[7px] text-gray-600">
                                            <span>{channel.toUpperCase()}</span>
                                            <span>{colors[channel as keyof LensColor]}</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="255" 
                                            value={colors[channel as keyof LensColor]} 
                                            onChange={(e) => onColorChange({ ...colors, [channel]: parseInt(e.target.value) })}
                                            className={`w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer ${
                                                channel === 'r' ? 'accent-red-500' : channel === 'g' ? 'accent-green-500' : 'accent-blue-500'
                                            }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-[8px] font-mono text-gray-500 uppercase">CMYK Filter</p>
                            <div className="grid grid-cols-4 gap-2">
                                {['c', 'm', 'y', 'k'].map((channel) => (
                                    <div key={channel} className="space-y-0.5">
                                        <div className="flex justify-between text-[7px] text-gray-600">
                                            <span>{channel.toUpperCase()}</span>
                                            <span>{colors[channel as keyof LensColor]}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="100" 
                                            value={colors[channel as keyof LensColor]} 
                                            onChange={(e) => onColorChange({ ...colors, [channel]: parseInt(e.target.value) })}
                                            className={`w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer ${
                                                channel === 'c' ? 'accent-cyan-400' : channel === 'm' ? 'accent-magenta-400' : channel === 'y' ? 'accent-yellow-400' : 'accent-gray-400'
                                            }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Playlist */}
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {playlist.map((item, idx) => (
                    <div 
                        key={item.id}
                        onClick={() => onIndexChange(idx)}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer text-[10px] transition ${
                            idx === currentIndex ? 'bg-blue-900/30 text-blue-200 border border-blue-800' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                        }`}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Film size={10} />
                            <span className="truncate">{item.name}</span>
                        </div>
                        <button onClick={(e) => removeFile(item.id, e)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><X size={10} /></button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Lens;
