
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Layers, Map as MapIcon, Aperture, AlertTriangle, RefreshCw, X, Save, Navigation } from 'lucide-react';

interface ARSceneViewerProps {
  onClose: () => void;
}

const ARSceneViewer: React.FC<ARSceneViewerProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode, setMode] = useState<'trajectory' | 'satellite' | 'none'>('trajectory');
  const [satelliteOpacity, setSatelliteOpacity] = useState(0.5);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gps, setGps] = useState({ lat: 34.0522, lng: -118.2437 });

  useEffect(() => {
    // Initialize Camera
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    // Simulate GPS updates
    const interval = setInterval(() => {
        setGps(prev => ({
            lat: prev.lat + (Math.random() - 0.5) * 0.0001,
            lng: prev.lng + (Math.random() - 0.5) * 0.0001
        }));
    }, 2000);

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(interval);
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        // Draw Video
        ctx.drawImage(video, 0, 0);
        
        // Draw Overlays manually for the screenshot (simplified)
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.font = "30px monospace";
        ctx.fillStyle = "white";
        ctx.fillText(`AR FORENSIC CAPTURE | ${new Date().toISOString()}`, 50, 50);
        ctx.fillText(`GPS: ${gps.lat.toFixed(6)}, ${gps.lng.toFixed(6)}`, 50, 100);
        
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  const saveToCase = () => {
    // In a real app, this would save to the case file
    alert("Exhibit captured and saved to Case #2025-TEMP.");
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start pointer-events-none">
        <div>
          <h2 className="text-red-500 font-bold tracking-widest flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            LIVE FORENSIC FEED
          </h2>
          <div className="text-xs font-mono text-green-400 mt-1">
            <div className="flex items-center gap-2"><Navigation size={12}/> LAT: {gps.lat.toFixed(6)} N</div>
            <div className="flex items-center gap-2"><Navigation size={12}/> LNG: {gps.lng.toFixed(6)} W</div>
          </div>
        </div>
        <button onClick={onClose} className="pointer-events-auto bg-slate-800/50 p-2 rounded-full hover:bg-slate-700 text-white backdrop-blur">
          <X size={24} />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        {/* Video Feed */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Satellite Overlay (Comparison Mode) */}
        {mode === 'satellite' && (
          <div 
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
            style={{ 
              backgroundImage: 'url("https://picsum.photos/seed/satellite/1920/1080?grayscale&blur=2")', 
              opacity: satelliteOpacity 
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-yellow-500/50 w-full h-full opacity-50 grid grid-cols-4 grid-rows-4">
                {[...Array(16)].map((_, i) => <div key={i} className="border border-yellow-500/20"></div>)}
              </div>
            </div>
          </div>
        )}

        {/* Trajectory Overlay (AR Mode) */}
        {mode === 'trajectory' && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full opacity-80">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#ef4444', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#ef4444', stopOpacity: 0}} />
                </linearGradient>
                <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0}} />
                </linearGradient>
              </defs>
              
              {/* Perspective Grid */}
              <path d="M0,800 L1920,800 M0,900 L1920,900 M600,600 L200,1080 M1320,600 L1720,1080" stroke="rgba(0, 255, 0, 0.3)" strokeWidth="2" />

              {/* Vehicle A Path */}
              <path d="M 960 1080 Q 960 800 1200 600" stroke="url(#grad1)" strokeWidth="8" fill="none" strokeDasharray="20,10" className="animate-pulse" />
              <rect x="1180" y="580" width="40" height="20" fill="#ef4444" opacity="0.8" />
              <text x="1230" y="590" fill="#ef4444" fontSize="16" fontFamily="monospace" fontWeight="bold">VEHICLE A (IMPACT ZONE)</text>

              {/* Vehicle B Path */}
              <path d="M 200 800 Q 600 800 1150 620" stroke="url(#grad2)" strokeWidth="8" fill="none" strokeDasharray="20,10" />
              
              {/* Impact Marker */}
              <circle cx="1180" cy="610" r="20" stroke="orange" strokeWidth="4" fill="none" className="animate-ping" />
            </svg>
          </div>
        )}

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Capture Preview Modal */}
        {capturedImage && (
            <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-8">
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl max-w-2xl w-full">
                    <img src={capturedImage} alt="Capture" className="w-full rounded-lg mb-4 border border-slate-800" />
                    <div className="flex gap-4">
                        <button onClick={saveToCase} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                            <Save size={20} /> Save to Exhibit List
                        </button>
                        <button onClick={() => setCapturedImage(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg font-bold">
                            Discard
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-slate-900/90 border-t border-slate-800 p-6 flex items-center justify-between backdrop-blur-md">
        
        {/* Mode Toggles */}
        <div className="flex gap-2">
          <button 
            onClick={() => setMode(mode === 'trajectory' ? 'none' : 'trajectory')}
            className={`p-3 rounded-lg flex flex-col items-center gap-1 w-24 transition-all ${mode === 'trajectory' ? 'bg-brand-900/50 text-brand-400 border border-brand-500' : 'bg-slate-800 text-slate-400'}`}
          >
            <Layers size={20} />
            <span className="text-[10px] font-bold">3D PATHS</span>
          </button>
          
          <button 
            onClick={() => setMode(mode === 'satellite' ? 'none' : 'satellite')}
            className={`p-3 rounded-lg flex flex-col items-center gap-1 w-24 transition-all ${mode === 'satellite' ? 'bg-blue-900/50 text-blue-400 border border-blue-500' : 'bg-slate-800 text-slate-400'}`}
          >
            <MapIcon size={20} />
            <span className="text-[10px] font-bold">SATELLITE</span>
          </button>
        </div>

        {/* Main Action */}
        <div className="relative">
             <button 
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
             >
                <Aperture size={32} className="text-slate-900" />
             </button>
        </div>

        {/* Satellite Slider (Conditional) or Status */}
        <div className="w-48">
            {mode === 'satellite' ? (
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
                        <span>Overlay Opacity</span>
                        <span>{Math.round(satelliteOpacity * 100)}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" max="1" step="0.1" 
                        value={satelliteOpacity} 
                        onChange={(e) => setSatelliteOpacity(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-end gap-2 text-slate-500">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-mono">CALIBRATING SENSORS...</span>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ARSceneViewer;
