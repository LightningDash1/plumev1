import { useEffect, useState } from 'react';
import plumeLogo from '@/assets/plume-logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[hsl(210,35%,22%)] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src={plumeLogo}
        alt="Plume"
        className="w-64 h-64 object-contain animate-scale-in"
      />
      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
};
