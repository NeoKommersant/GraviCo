import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.set(containerRef.current, { opacity: 0 })
        .set(planetRef.current, { y: 100, scale: 0.8, opacity: 0 })
        .set(lettersRef.current, { opacity: 0, y: 20 })
        .to(containerRef.current, { opacity: 1, duration: 1 })
        .to(lettersRef.current, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: 'power3.out',
        })
        .fromTo(
          planetRef.current,
          { y: 100, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
        );

      const serviceTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1000',
          scrub: true,
          pin: true,
        },
      });

      serviceTl
        .to(lettersRef.current, {
          y: (i) => (i % 2 === 0 ? -80 : 80),
          scale: 0.8,
          duration: 1,
          stagger: 0.1,
        })
        .fromTo(
          servicesRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
          },
          '-=0.5'
        );
    }, containerRef);

    return () => ctx.revert();
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
      className="relative w-full h-screen overflow-hidden bg-[#1D1E26] flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-center bg-cover opacity-0" style={{ backgroundImage: "url('/images/parallax-bg.jpg')" }} />
      <h1 className="text-white text-6xl font-extrabold flex space-x-1">
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
      <p className="text-gray-300 mt-4">Маркетинг с погружением</p>
      <img
        ref={planetRef}
        src="/images/hero/planet.png"
        alt="planet"
        className="w-60 mt-10"
      />

      <div className="grid grid-cols-5 gap-4 mt-20 w-full max-w-4xl">
        {services.map((s, i) => (
          <div
            key={i}
            ref={(el) => (servicesRef.current[i] = el)}
            className="flex flex-col items-center opacity-0"
          >
            <img src={s.img} alt="" className="w-16 mb-2" />
            <span className="text-sm text-gray-300">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <AnimatedButton ref={buttonRef} onClick={onDone}>Погрузиться</AnimatedButton>
      </div>
    </section>
  );
}
