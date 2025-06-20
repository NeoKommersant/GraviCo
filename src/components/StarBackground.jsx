// components/StarBackground.jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function StarBackground() {
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);
  const bg3Ref = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    // Вертикальное движение второго слоя (только вверх)
    gsap.to(bg2Ref.current, {
      y: "-100%",
      duration: 90,
      repeat: -1,
      ease: "none"
    });

    // Движение частиц-звёзд
    starsRef.current.forEach((el) => {
      gsap.to(el, {
        y: "-120vh",
        duration: 40 + Math.random() * 30,
        repeat: -1,
        delay: Math.random() * 20,
        ease: "none"
      });
    });

    // Параллакс по движению мыши для bg1 и bg3 и звёзд
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 50; // +/-15px сдвиг
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 90;

      // Первый слой — глубокий фон, небольшое смещение
      gsap.to(bg1Ref.current, {
        x: mouseX * 0.3,
        y: mouseY * 0.3,
        duration: 1.2,
        ease: "power2.out"
      });

      // Третий слой — более заметное смещение
      gsap.to(bg3Ref.current, {
        x: mouseX * 0.7,
        y: mouseY * 0.7,
        duration: 1.2,
        ease: "power2.out"
      });

      // Звёзды — легкое смещение для живости
      starsRef.current.forEach((star, i) => {
        gsap.to(star, {
          x: mouseX * (0.1 + (i % 5) * 0.05),
          y: mouseY * (0.1 + (i % 5) * 0.05),
          duration: 1.2,
          ease: "power2.out"
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Первый слой — глубокий фон, реагирует на мышь */}
      <div
        ref={bg1Ref}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parallax-bg.jpg')" }}
      />
      {/* Второй слой — бесконечное вертикальное движение вверх, без параллакса */}
      <div
        ref={bg2Ref}
        className="absolute inset-0 bg-repeat-y bg-center bg-contain opacity-50"
        style={{ backgroundImage: "url('/images/parallax-bg2.png')" }}
      />
      {/* Третий слой — реагирует на мышь, дополнительный параллакс */}
      <div
        ref={bg3Ref}
        className="absolute inset-0 bg-repeat-y bg-center bg-contain opacity-30"
        style={{ backgroundImage: "url('/images/parallax-bg3.png')" }}
      />
      {/* Частицы-звёзды */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (starsRef.current[i] = el)}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
            willChange: "transform"
          }}
        />
      ))}
    </div>
  );
}
