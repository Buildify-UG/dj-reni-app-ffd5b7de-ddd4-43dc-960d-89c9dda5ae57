import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, Zap, Waves, Radio, Gauge, Music, Repeat, Flag, Link2, Sliders, Grid3x3, Settings, Zap as ZapIcon, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Deck {
  id: number;
  title: string;
  playing: boolean;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
  effect: string;
  effectIntensity: number;
  tempo: number;
  currentTime: number;
  duration: number;
  loopStart: number;
  loopEnd: number;
  loopActive: boolean;
  cuePoint: number;
  synced: boolean;
}

interface Pad {
  id: number;
  name: string;
  color: string;
  active: boolean;
}

const EFFECTS = ['None', 'Reverb', 'Echo', 'Filter', 'Flanger', 'Phaser', 'Distortion', 'Delay', 'Chorus', 'Compressor'];

const DJReni: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([
    { id: 1, title: 'Deck 1', playing: false, volume: 80, bass: 50, mid: 50, treble: 50, effect: 'None', effectIntensity: 50, tempo: 120, currentTime: 0, duration: 180, loopStart: 0, loopEnd: 180, loopActive: false, cuePoint: 0, synced: false },
    { id: 2, title: 'Deck 2', playing: false, volume: 80, bass: 50, mid: 50, treble: 50, effect: 'None', effectIntensity: 50, tempo: 120, currentTime: 0, duration: 180, loopStart: 0, loopEnd: 180, loopActive: false, cuePoint: 0, synced: false },
    { id: 3, title: 'Deck 3', playing: false, volume: 80, bass: 50, mid: 50, treble: 50, effect: 'None', effectIntensity: 50, tempo: 120, currentTime: 0, duration: 180, loopStart: 0, loopEnd: 180, loopActive: false, cuePoint: 0, synced: false },
    { id: 4, title: 'Deck 4', playing: false, volume: 80, bass: 50, mid: 50, treble: 50, effect: 'None', effectIntensity: 50, tempo: 120, currentTime: 0, duration: 180, loopStart: 0, loopEnd: 180, loopActive: false, cuePoint: 0, synced: false },
  ]);

  const [masterVolume, setMasterVolume] = useState(90);
  const [crossfader, setCrossfader] = useState(50);
  const [showPads, setShowPads] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState(1);
  const [pads, setPads] = useState<Pad[]>(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Pad ${i + 1}`, color: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'][i], active: false })));
  const animationFrameRef = useRef<number>();

  // Simulate playback
  useEffect(() => {
    const animate = () => {
      setDecks(prevDecks =>
        prevDecks.map(deck => ({
          ...deck,
          currentTime: deck.playing && deck.currentTime < deck.duration 
            ? deck.currentTime + 0.016 
            : deck.currentTime
        }))
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const updateDeck = (id: number, updates: Partial<Deck>) => {
    setDecks(decks.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const togglePlay = (id: number) => {
    setDecks(decks.map(d => 
      d.id === id ? { ...d, playing: !d.playing } : d
    ));
  };

  const resetDeck = (id: number) => {
    updateDeck(id, { currentTime: 0, playing: false });
  };

  const setCue = (id: number) => {
    const deck = decks.find(d => d.id === id);
    if (deck) updateDeck(id, { cuePoint: deck.currentTime });
  };

  const jumpToCue = (id: number) => {
    const deck = decks.find(d => d.id === id);
    if (deck) updateDeck(id, { currentTime: deck.cuePoint });
  };

  const toggleLoop = (id: number) => {
    const deck = decks.find(d => d.id === id);
    if (deck) updateDeck(id, { loopActive: !deck.loopActive });
  };

  const syncTempo = (id: number) => {
    const mainDeck = decks.find(d => d.id === 1);
    if (mainDeck) {
      updateDeck(id, { tempo: mainDeck.tempo, synced: true });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerPad = (padId: number) => {
    setPads(pads.map(p => p.id === padId ? { ...p, active: true } : p));
    setTimeout(() => {
      setPads(pads.map(p => p.id === padId ? { ...p, active: false } : p));
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-foreground p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">DJ RENI PRO</h1>
              <p className="text-xs text-slate-400">Professional Cross DJ System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPads(!showPads)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-lg transition-all"
              title="Toggle Performance Pads"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{masterVolume}%</div>
              <p className="text-xs text-slate-500">Master</p>
            </div>
          </div>
        </div>
      </div>

      {/* Master Controls */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-400" />
              Master Volume
            </label>
            <Slider
              value={[masterVolume]}
              onValueChange={(val) => setMasterVolume(val[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              Crossfader
            </label>
            <Slider
              value={[crossfader]}
              onValueChange={(val) => setCrossfader(val[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Left Sidebar - Decks */}
        <div className="lg:col-span-3">
      {/* 4 Decks Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-xl p-6 hover:border-purple-500/50 transition-all"
          >
            {/* Deck Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-100">{deck.title}</h2>
              <div className="text-xs font-mono bg-slate-900/80 px-2 py-1 rounded text-purple-400">
                {formatTime(deck.currentTime)} / {formatTime(deck.duration)}
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="bg-slate-900/50 rounded-lg p-3 mb-4 h-16 flex items-center justify-center overflow-hidden">
              <div className="flex items-center gap-1 h-full w-full">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animation: deck.playing ? `pulse 0.5s ease-in-out infinite` : 'none',
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-900/50 rounded-full h-1 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-400 h-full transition-all"
                style={{ width: `${(deck.currentTime / deck.duration) * 100}%` }}
              />
            </div>

            {/* Play Controls */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => togglePlay(deck.id)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {deck.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {deck.playing ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => resetDeck(deck.id)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-lg transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Volume
              </label>
              <Slider
                value={[deck.volume]}
                onValueChange={(val) => updateDeck(deck.id, { volume: val[0] })}
                min={0}
                max={100}
                step={1}
              />
            </div>

            {/* EQ Section */}
            <div className="bg-slate-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <Waves className="w-3 h-3" /> Equalizer
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Bass</label>
                  <Slider
                    value={[deck.bass]}
                    onValueChange={(val) => updateDeck(deck.id, { bass: val[0] })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Mid</label>
                  <Slider
                    value={[deck.mid]}
                    onValueChange={(val) => updateDeck(deck.id, { mid: val[0] })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Treble</label>
                  <Slider
                    value={[deck.treble]}
                    onValueChange={(val) => updateDeck(deck.id, { treble: val[0] })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="bg-slate-900/30 rounded-lg p-3 mb-4">
              <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <Radio className="w-3 h-3" /> Effect
              </label>
              <select
                value={deck.effect}
                onChange={(e) => updateDeck(deck.id, { effect: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-100 cursor-pointer hover:border-purple-500 transition-colors"
              >
                {EFFECTS.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            {/* Tempo */}
            <div className="bg-slate-900/30 rounded-lg p-3">
              <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <Gauge className="w-3 h-3" /> Tempo (BPM)
              </label>
              <Slider
                value={[deck.tempo]}
                onValueChange={(val) => updateDeck(deck.id, { tempo: val[0] })}
                min={80}
                max={160}
                step={1}
              />
              <div className="text-center text-sm font-mono text-purple-400 mt-1">{deck.tempo} BPM</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 mt-8">
        <p>DJ RENI v1.0 • Professional Mixing System</p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DJReni;
