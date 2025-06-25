import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedButton from './AnimatedButton';
import StarBackground from './StarBackground';
import CanvasStars from './CanvasStars';

gsap.registerPlugin(ScrollTrigger);
export default function HeroIntro({ onDone }) {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const planetRef = useRef(null);
  const planet2Ref = useRef(null);
  const servicesRef = useRef([]);
  const buttonRef = useRef(null);
  const subtitleRef = useRef(null);
  const sloganRef = useRef(null);
  useEffect(() => {
    let mainTimeline;
    let serviceTimeline;
    let transformTimeline;
    const ctx = gsap.context(() => {
      // Основная анимация появления
      mainTimeline = gsap.timeline({
      onComplete: () => {
        initScrollTrigger();
      }
      });
      // Начальное состояние
      mainTimeline
        .set(containerRef.current, { opacity: 0 })
        .set(planetRef.current, { y: '5vh', scale: 1.5, opacity: 0 })
        .set(planet2Ref.current, { y: '47vh', scale: 7.25, opacity: 0.75 })
        .set(lettersRef.current, { opacity: 0, y: 20 })
        .set(sloganRef.current, { opacity: 0, y: 20 })
        .set(subtitleRef.current, { opacity: 0, y: 20 })
        .set(servicesRef.current, { opacity: 1  , y: 30 })
        .set(buttonRef.current, { opacity: 1 });
      // Анимация появления
      mainTimeline
        .to(containerRef.current, { 
          opacity: 1, 
          duration: 2,
          ease: 'power2.out' 
        })
        .to(lettersRef.current, {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
        }, "<")
        .to(planetRef.current, {
          opacity: 0.75,
          duration: 8,
          ease: 'power4.out'
        }, "<")
        .to(planet2Ref.current, {
          opacity: 0.125,
          duration: 4,
          ease: 'power4.out'
        }, "<")
        .to(sloganRef.current, {
          opacity: 1,
          y: 0,
          duration: 3,
          delay: 2,
          ease: 'power3.out'
        }, "<-2")
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: 'power3.out'
        }, "<")

;
    // Функция инициализации ScrollTrigger
    function initScrollTrigger() {
    }
    }, containerRef);
    return () => {
      if (mainTimeline) mainTimeline.kill();
      if (serviceTimeline) serviceTimeline.kill();
      ctx.revert();
    };
  }, []);
  const letters = ['G', 'r', 'a', 'v', 'i', 'C', 'o'];
  const services = [
      { img: '/images/hero/consultation.png', label: 'Консультации' },
      { img: '/images/hero/offline.png', label: 'Оффлайн обучение' },
      { img: '/images/hero/audit.png', label: 'Аудиты' },
      { img: '/images/hero/seo.png', label: 'SEO' },
      { img: '/images/hero/online.png', label: 'Онлайн курсы' },
  ];
  return (
<section
  ref={containerRef}
  className="relative w-full h-screen overflow-hidden bg-[#1D1E26] flex items-center justify-center"
>
  {/* параллакс звезды фон */}
  <StarBackground />
    {/* летящие звезды */}
  <CanvasStars />
  {/* 🔹 Основной контент по центру экрана */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
    {/* 🔸 Главный заголовок (анимированные буквы) */}
    <h1 className="text-white text-5xl md:text-9xl font-extrabold flex space-x-1">
      {letters.map((ch, i) => (
        <span
          key={i}
          ref={(el) => (lettersRef.current[i] = el)}
          className="inline-block"
        >
          {ch}
        </span>
      ))}
    </h1>
    {/* 🔸 Подзаголовок */}
    <p
    ref={sloganRef}
     className="text-white text-2xl md:text-4xl font-medium">
      Маркетинг с погружением
    </p>
    {/* 🔸 Планета (лого или графика) */}
    <img
      ref={planetRef}
      src="/images/hero/planet.png"
      alt="planet"
      className="w-48 md:w-72"
    />

{/* Планета2 */}
    <img
      ref={planet2Ref}
      src="/images/hero/planet2.png"
      alt="planet2"
      className="w-48 md:w-72"
    />

  </div>
  {/* 🔹 Сетка иконок/сервисов (ниже центра) */}
  <div className="absolute top-[5%] w-full flex justify-center">
    <div className="grid grid-cols-5 gap-4 max-w-4xl w-full">
      {services.map((s, i) => (
        <div
          key={i}
          ref={(el) => (servicesRef.current[i] = el)}
          className="flex flex-col items-center opacity-0 group"
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.1,
              y: 10, // Изменено с -10 на 10 для движения вниз
              duration: 0.3,
              ease: "power2.out"
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.in"
            });
          }}
        >
          <img
            src={s.img}
            alt={s.label}
            className="w-24 mb-2 transition-all duration-300 group-hover:brightness-150"
          />
          <span className="text-sm text-gray-300">{s.label}</span>
        </div>
      ))}
    </div>
  </div>
  {/* 🔹 Кнопка “Погрузиться” — всегда внизу */}
  <div className="absolute bottom-60">
    <AnimatedButton ref={buttonRef} onClick={onDone}>
      Погрузиться
    </AnimatedButton>
  </div>
</section>
  );
}
