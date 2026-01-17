import { useState, useRef, useEffect, useMemo, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraProps {
  onCapture: (imageData: string) => void;
  isProcessing?: boolean;
}

export function CameraCapture({ onCapture, isProcessing = false }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  /**
   * Request camera permission and start stream
   */
  const startCamera = async () => {
    try {
      setError(null);
      setIsOpen(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unable to access camera. Please check permissions.';
      setError(errorMsg);
      console.error('Camera error:', err);
    }
  };

  /**
   * Stop camera stream
   */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsOpen(false);
    setIsCameraReady(false);
  };

  /**
   * Toggle between front and back camera
   */
  const toggleCamera = async () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  /**
   * Capture photo from video stream
   */
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(imageData);
    stopCamera();
  };

  /**
   * Fallback: allow direct photo upload for mobile or blocked camera
   */
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        onCapture(result);
      }
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) {
    return (
      <>
        <Button
          size="lg"
          className="w-full"
          disabled={isProcessing}
          onClick={startCamera}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isProcessing ? 'Analyzing...' : 'Take Photo'}
        </Button>
        {/* Mobile-friendly fallback trigger */}
        {isMobile && (
          <Button
            variant="outline"
            size="lg"
            className="w-full mt-3"
            disabled={isProcessing}
            onClick={openFilePicker}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload photo instead
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={facingMode}
          className="hidden"
          onChange={handleFileUpload}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-4"
      >
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-sm text-center space-y-3">
            <h3 className="font-bold text-red-900">Camera Access Error</h3>
            <p className="text-sm text-red-800">{error}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={startCamera}>
                Retry Camera
              </Button>
              <Button variant="outline" onClick={openFilePicker}>
                Use photo upload
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setError(null);
                  setIsOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-4">
            {/* Camera Feed */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
              {isCameraReady ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}

              {/* Crosshair overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-white/30 rounded-lg"></div>
              </div>

              {/* Close Button */}
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instructions */}
            <p className="text-white text-sm text-center">
              Position your glucometer screen inside the frame
            </p>

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={toggleCamera}
                disabled={!isCameraReady || isProcessing}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Flip Camera
              </Button>

              <Button
                size="lg"
                className="flex-1"
                onClick={capturePhoto}
                disabled={!isCameraReady || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </>
                )}
              </Button>
            </div>

            {/* Camera Tips */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-white text-xs space-y-1">
              <p>📸 Tips for best results:</p>
              <ul className="list-disc list-inside space-y-1 text-white/80">
                <li>Ensure good lighting</li>
                <li>Position screen horizontally</li>
                <li>Keep device steady</li>
                <li>Fill the frame with the display</li>
              </ul>
            </div>
          </div>
        )}

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>

      {/* Keep file input available for fallback even when overlay is open */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture={facingMode}
        className="hidden"
        onChange={handleFileUpload}
      />
    </>
  );
}
