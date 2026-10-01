import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, MapPin } from 'lucide-react';
import { ScenicIllustration } from './ScenicIllustration';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanTrip: () => void;
}

export function VideoModal({ isOpen, onClose, onPlanTrip }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const [activeChapter, setActiveChapter] = useState<'angkor' | 'halong' | 'temple' | 'bhutan'>('angkor');

  const chapters: { id: 'angkor' | 'halong' | 'temple' | 'bhutan'; title: string; location: string }[] = [
    { id: 'angkor', title: 'Angkor Wat Sunrise', location: 'Siem Reap, Cambodia' },
    { id: 'halong', title: 'Lan Ha Karsts', location: 'Tonkin Gulf, Vietnam' },
    { id: 'temple', title: 'Highland Blessings', location: 'Bali & Ubud, Indonesia' },
    { id: 'bhutan', title: 'Tiger’s Nest Taktsang', location: 'Paro Valley, Bhutan' },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 200);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between p-4 border-b border-stone-800/80 bg-stone-950/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-serif font-bold text-white text-sm">Asia Destination DMC · Inbound Showreel</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-850 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cinematic Canvas Container */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            <ScenicIllustration type={activeChapter} className="w-full h-full" />

            {/* Cinematic overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/40 pointer-events-none" />

            {/* Center Play/Pause button on canvas */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute z-20 w-16 h-16 rounded-full bg-stone-900/70 hover:bg-stone-900 border border-amber-400/40 text-amber-400 flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-2xl"
              aria-label={isPlaying ? 'Pause film' : 'Play film'}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-amber-400" /> : <Play className="w-6 h-6 fill-amber-400 translate-x-[2px]" />}
            </button>

            {/* Chapter Location Tag */}
            <div className="absolute bottom-16 left-6 flex items-center gap-2 text-xs text-white bg-stone-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{chapters.find((c) => c.id === activeChapter)?.location}</span>
            </div>

            {/* Controls bottom toolbar inside canvas */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-stone-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px] text-stone-400">01:42 / 04:15</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onPlanTrip();
                }}
                className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Plan Expedition →
              </button>
            </div>

            {/* Scrubber Progress Bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-800 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.round((clickX / rect.width) * 100);
                setProgress(newProgress);
              }}
            >
              <div
                className="h-full bg-amber-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Chapter Selector Strip */}
          <div className="p-4 bg-stone-950 border-t border-stone-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-2.5">
              Jump to Chapter
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(ch.id)}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    activeChapter === ch.id
                      ? 'bg-stone-800 border-amber-400 text-white'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="block text-xs font-semibold">{ch.title}</span>
                  <span className="block text-[11px] text-stone-500 truncate">{ch.location}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
