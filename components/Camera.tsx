
import React, { useRef, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CameraViewProps {
  onCapture: (result: any) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("No se pudo acceder a la cámara. Verifica permisos o usa HTTPS.");
        onClose();
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const { videoWidth, videoHeight } = videoRef.current;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        
        // Mock AI Processing Logic
        const mockResult = {
            merchant: "Starbucks Coffee",
            total: (Math.random() * 50 + 10).toFixed(2),
            date: new Date().toISOString().split('T')[0],
            category: "Food & Dining",
            isFormal: Math.random() > 0.5,
            ruc: Math.random() > 0.5 ? "20123456789" : undefined
        };

        onCapture(mockResult);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <span className="text-white font-bold text-sm tracking-wider">ESCANEAR COMPROBANTE</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        <video 
          ref={videoRef} 
          className="absolute min-w-full min-h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Guidelines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-64 h-80 border-2 border-white/30 rounded-xl relative">
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1 rounded-tl-xl"></div>
                 <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1 rounded-tr-xl"></div>
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1 rounded-bl-xl"></div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1 rounded-br-xl"></div>
                 <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500/50 w-full"></div>
             </div>
        </div>
      </div>

      <div className="h-32 bg-black flex items-center justify-center gap-8 pb-8">
         <button 
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
         >
             <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform"></div>
         </button>
      </div>
    </div>
  );
};
