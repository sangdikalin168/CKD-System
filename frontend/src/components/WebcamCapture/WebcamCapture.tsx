import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface WebcamCaptureProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCapture: (imageSrc: string) => void;
  customerId?: number;
}

export const WebcamCapture = ({ open, setOpen, onCapture }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && !imgSrc) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setHasPermission(true);
      setError(null);
    } catch (err: any) {
      console.error('Camera error:', err);
      setHasPermission(false);
      setError('មិនអាចចូលប្រើកាមេរ៉ាបានទេ។ សូមពិនិត្យមើលការអនុញ្ញាត។');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        
        const imageSrc = canvas.toDataURL('image/jpeg');
        setImgSrc(imageSrc);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setImgSrc(null);
    startCamera();
  };

  const handleSave = () => {
    if (imgSrc) {
      onCapture(imgSrc);
      setImgSrc(null);
      stopCamera();
      setOpen(false);
    }
  };

  const handleClose = () => {
    setImgSrc(null);
    stopCamera();
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                      ថតរូបសមាជិក
                    </Dialog.Title>

                    <div className="mt-2">
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                        {!imgSrc ? (
                          <>
                            {!hasPermission && error ? (
                              <div className="p-8 text-center">
                                <p className="text-red-600 mb-4">{error}</p>
                                <p className="text-sm text-gray-600">
                                  សូមធ្វើការអនុញ្ញាតឱ្យកម្មវិធីចូលប្រើកាមេរ៉ា ហើយព្យាយាមម្តងទៀត។
                                </p>
                              </div>
                            ) : (
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-auto"
                                style={{ transform: 'scaleX(-1)' }}
                              />
                            )}
                          </>
                        ) : (
                          <img src={imgSrc} alt="captured" className="w-full h-auto" />
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                      </div>

                      <div className="mt-4 flex justify-center gap-3">
                        {!imgSrc ? (
                          <>
                            <button
                              type="button"
                              onClick={capture}
                              className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                            >
                              <CameraIcon className="h-5 w-5 mr-2" />
                              ថតរូប
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={retake}
                              className="inline-flex items-center rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                            >
                              ថតម្តងទៀត
                            </button>
                            <button
                              type="button"
                              onClick={handleSave}
                              className="inline-flex items-center rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                            >
                              រក្សាទុក
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default WebcamCapture;
