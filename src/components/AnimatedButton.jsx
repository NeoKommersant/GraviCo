import { useState, useEffect, useRef } from 'react';
const AnimatedButton = ({ children, onClick, className = '' }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const handleClick = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    // Fade out all elements except the button
    document.querySelectorAll('body > *:not(.video-overlay)').forEach(el => {
      el.style.transition = 'opacity 2.5s ease-out';
      el.style.opacity = '0';
    });
    // Show video overlay after initial fade
    setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.display = 'block';
        if (videoRef.current) {
          videoRef.current.play();
        }
      }
    }, 1000);
    // Handle video completion
    if (videoRef.current) {
      videoRef.current.onended = () => {
        if (onClick) onClick();
      };
    }
  };
  useEffect(() => {
    // Create video overlay element
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay fixed top-0 left-0 w-screen h-screen hidden z-50';
    overlay.ref = overlayRef;
    const video = document.createElement('video');
    video.className = 'w-full h-full object-cover';
    video.src = '/videos/deep_anima.gif';
    video.muted = true;
    video.playsInline = true;
    video.ref = videoRef;
    overlay.appendChild(video);
    document.body.appendChild(overlay);
    return () => {
      document.body.removeChild(overlay);
    };
  }, []);
  return (
    <button
      onClick={handleClick}
      disabled={isTransitioning}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl
        bg-transparent
        transition-all duration-700
        ${className}
        before:content-['']
        before:absolute before:inset-0
        before:border before:border-white/20
        before:rounded-xl
        before:transition-all before:duration-700
        before:animate-[rotate_4s_linear_infinite]
        hover:before:border-white/40
        hover:before:animate-[rotate_2s_linear_infinite]
        after:content-['']
        after:absolute after:inset-[2px]
        after:bg-[#1D1E26]
        after:rounded-xl
        after:transition-all after:duration-700
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
    >
      <span className="relative z-10 text-white font-medium">
        {children}
      </span>
    </button>
  );
};
export default AnimatedButton;