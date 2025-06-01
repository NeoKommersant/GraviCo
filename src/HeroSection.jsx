import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function HeroSection({ onDiveComplete, visible }) {
   const videoRef = useRef(null);
   const contentRef = useRef(null);
   const wrapperRef = useRef(null);
   const [hasPlayed, setHasPlayed] = useState(false);

   useEffect(() => {
      const video = videoRef.current;
      if (visible) {
         if (video) {
            video.pause();
            video.currentTime = 0;
         }
         gsap.set(contentRef.current, { opacity: 1 });
         gsap.set(wrapperRef.current, { opacity: 1 });
         setHasPlayed(false);
      }
   }, [visible]);

   const handleDiveClick = () => {
      if (!videoRef.current || !contentRef.current || !wrapperRef.current) return;

      videoRef.current.play();
      setHasPlayed(true);

      gsap.to(contentRef.current, {
         opacity: 0,
         duration: 1,
         ease: 'power2.out'
      });

      gsap.to(wrapperRef.current, {
         opacity: 1,
         duration: 0.5,
         ease: 'power2.out'
      });
   };

   const handleVideoEnd = () => {
      onDiveComplete();
   };

   return (
      <div ref={wrapperRef} className="absolute top-0 left-0 w-full h-full z-0">
         <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/video/intro.mp4"
            preload="auto"
            muted
            playsInline
            onEnded={handleVideoEnd}
         />
         {!hasPlayed && (
            <div
               ref={contentRef}
               className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-transparent"
            >
               <h1
                  className="text-5xl md:text-7xl font-bold text-white tracking-wide"
                  style={{ fontFamily: 'Manrope' }}
               >
                  GraviCo
               </h1>
               <p
                  className="text-lg md:text-xl text-gray-200 text-center px-6"
                  style={{ fontFamily: 'Manrope' }}
               >
                  Маркетинг — который притягивает клиентов
               </p>
               <button
                  onClick={handleDiveClick}
                  className="border-star-button text-white font-medium py-2 px-8 rounded-3xl text-lg md:text-xl transition duration-300 hover:bg-white hover:text-gray-900"
                  style={{ fontFamily: 'Manrope' }}
               >
                  Погрузиться
               </button>
            </div>
         )}
      </div>
   );
}
