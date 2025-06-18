import { useState, useEffect, useRef, forwardRef } from 'react';
import gsap from 'gsap';
const AnimatedButton = forwardRef(function AnimatedButton(
  { children, onClick, className = '' },
  ref,
) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Кэширование DOM-элементов для анимации, чтобы не выполнять выборку при каждом клике
  const animatableElementsRef = useRef(null);
  useEffect(() => {
    // При монтировании выбираем необходимые элементы один раз
    animatableElementsRef.current = document.querySelectorAll('body > *:not(.video-overlay)');
    return () => {
      gsap.killTweensOf(animatableElementsRef.current);
    };
  }, []);
  const handleClick = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    try {
      const tl = gsap.timeline();
      // Сначала вызывается обработчик клика
      if (onClick) {
        onClick();
      }
      // Затем анимируются кэшированные элементы
      await tl.to(animatableElementsRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    } catch (error) {
      console.error('Анимация не удалась:', error);
    } finally {
      setIsTransitioning(false);
    }
  };
  return (
    <button
      ref={ref}
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
      <span className="relative z-10 text-white font-medium">{children}</span>
    </button>
  );
});
export default AnimatedButton;