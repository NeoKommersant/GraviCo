import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedButton from './AnimatedButton';
gsap.registerPlugin(ScrollTrigger);
export default function HeroIntro({ onDone }) {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const planetRef = useRef(null);
  const servicesRef = useRef([]);
  const buttonRef = useRef(null);
  const parallaxBgRef = useRef(null);
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
        .set(parallaxBgRef.current, { opacity: 0 })
        .set(planetRef.current, { y: '25vh', scale: 7, opacity: 0 })
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
        .to(parallaxBgRef.current, {
          opacity: 1,
          duration: 8,
          ease: 'power2.out'
        }, "<")
        
        .to(lettersRef.current, {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
        }, "<")
        .to(sloganRef.current, {
          opacity: 1,
          y: 0,
          duration: 3,
          delay: 2,
          ease: 'power3.out'
        }, "<")
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: 'power3.out'
        }, "<")
        .to(planetRef.current, {
            y: 0, 
            opacity: 0.5, 
            scale: 1.5, 
          duration: 5,
          delay: 0.5,
          ease: 'power3.out'
        }, "<");
    // Функция инициализации ScrollTrigger
    function initScrollTrigger() {
  // Создаем ScrollTrigger для параллакса фона
  ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
            end: 'bottom top',
    scrub: true,
          onUpdate: (self) => {
      if (parallaxBgRef.current) {
        gsap.to(parallaxBgRef.current, {
          y: `${self.progress * 50}%`,
          ease: 'none',
          duration: 0.1
            });
          }
          }
        });
      // Добавляем обработчик движения мыши для параллакса
      const handleMouseMove = (e) => {
        if (parallaxBgRef.current) {
          const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
          const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
          
          gsap.to(parallaxBgRef.current, {
            x: mouseX,
            y: mouseY,
            duration: 1,
            ease: 'power2.out'
          });
        }
      };
      // Добавляем слушатель события
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      // Возвращаем функцию очистки
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
      };
  serviceTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      end: '+=100%',
      scrub: true,
      pin: true
    }
  });
      serviceTimeline
          .to(lettersRef.current[0], { y: 80, x: -50, scale: 0.8 })  // G
          .to(lettersRef.current[1], { y: -80, x: -30, scale: 0.8 }) // r
          .to(lettersRef.current[2], { y: 80, x: -10, scale: 0.8 })  // a
          .to(lettersRef.current[3], { y: -80, x: 10, scale: 0.8 })  // v
          .to(lettersRef.current[4], { y: 80, x: 30, scale: 0.8 })   // i
          .to([lettersRef.current[5], lettersRef.current[6]], { 
            opacity: 0,
            duration: 0.3
          }, '<')
          .to(planetRef.current, {
            scale: 0.5,
            opacity: 0.3,
            y: -50,
            duration: 0.5
          }, '<')
          .to(subtitleRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3
          }, '<');
        // Появление сервисов
        serviceTimeline.fromTo(
          servicesRef.current,
          { 
            opacity: 0,
            y: 30,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.2,
          },
          '-=0.5'
        );
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
  {/* 🔹 Фоновое изображение (парраллакс фон) */}
  <div
  ref={parallaxBgRef}
    className="absolute inset-0 bg-center bg-cover opacity-70 z-0"
    style={{ backgroundImage: "url('/images/parallax-bg.jpg')" }}
  />

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
  </div>

  {/* 🔹 Сетка иконок/сервисов (ниже центра) */}
  <div className="absolute bottom-36 w-full flex justify-center">
    <div className="grid grid-cols-5 gap-4 max-w-4xl w-full">
      {services.map((s, i) => (
        <div
          key={i}
          ref={(el) => (servicesRef.current[i] = el)}
          className="flex flex-col items-center opacity-0"
        >
          <img
            src={s.img}
            alt={s.label}
            className="w-16 mb-2"
          />
          <span className="text-sm text-gray-300">{s.label}</span>
        </div>
      ))}
    </div>
  </div>

  {/* 🔹 Кнопка “Погрузиться” — всегда внизу */}
  <div className="absolute bottom-10">
    <AnimatedButton ref={buttonRef} onClick={onDone}>
      Погрузиться
    </AnimatedButton>
  </div>
</section>

  );
}
