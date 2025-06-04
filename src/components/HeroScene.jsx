// src/components/HeroScene.jsx
import React, { useRef, useEffect, useState } from 'react';
import './HeroScene.css';
import diveSoundFile from './dive.mp3';

const HeroScene = ({ onDiveComplete }) => {
   const [isDiving, setIsDiving] = useState(false);
   const letterRefs = useRef([]);
   const audioRef = useRef(null);
   const bgRef = useRef(null);

   // 1. Создаём Audio при монтировании
   useEffect(() => {
      audioRef.current = new Audio(diveSoundFile);
      audioRef.current.preload = 'auto';
   }, []);

   // 2. Параллакс-фон: реагирует на курсор, пока isDiving = false
   useEffect(() => {
      const bg = bgRef.current;
      if (!bg) return;
      let rafId;

      const handleMouseMove = (e) => {
         if (isDiving) return;
         const { innerWidth, innerHeight } = window;
         const xNorm = (e.clientX / innerWidth - 0.5) * 2;
         const yNorm = (e.clientY / innerHeight - 0.5) * 2;
         const moveX = xNorm * 15;
         const moveY = yNorm * 15;
         const scaleAmount = 1 + Math.abs(xNorm) * 0.02 + Math.abs(yNorm) * 0.02;

         cancelAnimationFrame(rafId);
         rafId = requestAnimationFrame(() => {
            bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleAmount})`;
         });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
         window.removeEventListener('mousemove', handleMouseMove);
         cancelAnimationFrame(rafId);
      };
   }, [isDiving]);

   // 3. Обработчик «погружения»
   const handleDive = () => {
      if (isDiving) return;
      setIsDiving(true);

      // 3.1. Проигрываем звук
      if (audioRef.current) {
         audioRef.current.currentTime = 0;
         audioRef.current.play().catch(() => { /* подавляем ошибки autoplay */ });
      }

      // 3.2. Вибрация (если поддерживается)
      if (navigator.vibrate) {
         navigator.vibrate([100, 50, 100]);
      }

      // 3.3. Добавляем класс для фоновой анимации
      if (bgRef.current) {
         bgRef.current.classList.add('parallax-dive');
      }

      // 3.4. Анимируем буквы: задаём задержку и вешаем класс
      letterRefs.current.forEach((el, idx) => {
         if (!el) return;
         el.style.animationDelay = `${idx * 0.05}s`;
         el.classList.add('letter-dive');
      });

      // 3.5. По таймауту: либо вызываем onDiveComplete, либо scrollIntoView
      setTimeout(() => {
         if (onDiveComplete) {
            onDiveComplete();
         } else {
            const next = document.getElementById('nextSection');
            if (next) {
               next.scrollIntoView({ behavior: 'smooth' });
            }
         }
      }, 1200); // 1000ms анимация + 200ms «буфер»
   };

   const logoText = 'GraviCo'.split('');

   return (
      <div className="hero-container">
         <div className="hero-parallax" ref={bgRef} />

         <div className="logo-container">
            {logoText.map((char, i) => (
               <span
                  key={i}
                  className="logo-letter"
                  ref={(el) => (letterRefs.current[i] = el)}
               >
                  {char}
               </span>
            ))}
         </div>

         <button
            className={`dive-button ${isDiving ? 'button-disabled' : ''}`}
            onClick={handleDive}
            disabled={isDiving}
         >
            Погрузиться
         </button>
      </div>
   );
};

export default HeroScene;
