import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import HeroIntro from './components/HeroIntro';
export default function App() {
  // Рефы для контейнера и его контента
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  // Состояния для текущей секции и подсекции
  const [section, setSection] = useState(0);
  const [subSection, setSubSection] = useState(0);
  // Рефы для хранения актуальных значений состояний (необходимы для событий)
  const sectionRef = useRef(section);
  const subSectionRef = useRef(subSection);
  // Флаг для "телепортации" при переходе между секциями
  const teleportRef = useRef(false);
  // Реф для хранения предыдущих значений секции и подсекции
  const prevRef = useRef({ section: 0, sub: 0 });
  // Обновляем рефы при изменении состояний
  useEffect(() => {
    sectionRef.current = section;
    subSectionRef.current = subSection;
  }, [section, subSection]);
  // Эффект для установки и удаления обработчиков событий (тач, мышь, колесико, клавиши, resize)
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    // Получаем размеры контейнера
    let vw = container.clientWidth;
    let vh = container.clientHeight;
    // Общее число секций и массив с числом подсекций для каждой секции
    const sectionsCount = 3;
    const subCounts = [0, 2, 1]; // число подсекций у каждой секции
    const threshold = 50;
    const maxDrag = Math.min(vw, vh) / 2;

    let startX = 0, startY = 0, deltaX = 0, deltaY = 0;
    let moving = false, baseX = 0, baseY = 0;
    let isHorizontal = false, isVertical = false;

    function rubberband(delta, limit) {
      if (delta > limit) return limit + (delta - limit) * 0.15;
      if (delta < -limit) return -limit + (delta + limit) * 0.15;
      return delta;
    }

    function applyDrag() {
      const rX = isHorizontal ? rubberband(deltaX, maxDrag) : 0;
      const rY = isVertical ? rubberband(deltaY, maxDrag) : 0;
      const maxTiltY = 10;
      const foldFactor = 0.3;
      const angleY = isHorizontal
        ? (rX / maxDrag) * maxTiltY * (1 + (Math.abs(rX) / maxDrag) * foldFactor) * 0.15
        : 0;
      const brightness =
        1 -
        Math.min((Math.abs(rX) / maxDrag) * 0.3, 0.15) -
        Math.min((Math.abs(rY) / maxDrag) * 0.3, 0.15);

      gsap.set(content, {
        x: baseX + rX,
        y: baseY + rY,
        rotationY: angleY,
        filter: `brightness(${brightness})`,
        transformPerspective: 1000,
        transformOrigin: 'center center',
      });
    }

    function resetStyle() {
      gsap.to(content, {
        rotationX: 0,
        rotationY: 0,
        filter: 'brightness(1)',
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    function onTouchStart(e) {
      moving = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      startY = e.touches ? e.touches[0].clientY : e.clientY;
      deltaX = 0;
      deltaY = 0;
      isHorizontal = false;
      isVertical = false;
      baseX = -sectionRef.current * vw;
      baseY = -subSectionRef.current * vh;
      gsap.killTweensOf(content);
    }

    function onTouchMove(e) {
      if (!moving) return;
      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const currentY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = currentX - startX;
      const dy = currentY - startY;

      if (!isHorizontal && !isVertical) {
        if (Math.abs(dx) > Math.abs(dy)) isHorizontal = true;
        else isVertical = true;
      }

      if (isHorizontal) {
        const canLeft = sectionRef.current < sectionsCount - 1;
        const canRight = sectionRef.current > 0;
        if ((dx < 0 && !canLeft) || (dx > 0 && !canRight)) return;
        deltaX = dx;
      }
      
      if (isVertical) {
        const maxSub = subCounts[sectionRef.current];
        const canDown = subSectionRef.current < maxSub;
        const canUp = subSectionRef.current > 0;
        if ((dy < 0 && !canDown) || (dy > 0 && !canUp)) return;
        deltaY = dy;
      }

      applyDrag();
    }

    function onTouchEnd() {
      moving = false;
      let newSec = sectionRef.current;
      let newSub = subSectionRef.current;
      let horizSwipe = false;

      if (isHorizontal && Math.abs(deltaX) > threshold) {
        horizSwipe = true;
        if (deltaX < 0 && sectionRef.current < sectionsCount - 1) newSec = sectionRef.current + 1;
        else if (deltaX > 0 && sectionRef.current > 0) newSec = sectionRef.current - 1;
        newSub = 0;
      } else if (isVertical && Math.abs(deltaY) > threshold) {
        const maxSub = subCounts[sectionRef.current];
        if (deltaY < 0 && subSectionRef.current < maxSub) newSub = subSectionRef.current + 1;
        else if (deltaY > 0 && subSectionRef.current > 0) newSub = subSectionRef.current - 1;
      }

      if (horizSwipe && subSectionRef.current > 0 && newSec !== sectionRef.current) {
        teleportRef.current = true;
      }

      if (newSec !== sectionRef.current) {
      setSection(newSec);
      }
      if (newSub !== subSectionRef.current) {
      setSubSection(newSub);
      }
      resetStyle();
    }

    function onMouseDown(e) {
      onTouchStart(e);
    }
    
    function onMouseMove(e) {
      onTouchMove(e);
    }
    
    function onMouseUp() {
      onTouchEnd();
    }
    
    function onWheel(e) {
      e.preventDefault();
      const maxSub = subCounts[sectionRef.current];
      if (e.deltaY < 0 && subSectionRef.current > 0) {
        setSubSection(prev => prev - 1);
      } else if (e.deltaY > 0 && subSectionRef.current < maxSub) {
        setSubSection(prev => prev + 1);
      }
    }
    
    function onKeyDown(e) {
      if (e.key === 'ArrowRight') {
        if (sectionRef.current < sectionsCount - 1) {
          setSection(prev => prev + 1);
        } else {
          setSection(sectionsCount - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (sectionRef.current > 0) {
          setSection(prev => prev - 1);
        } else {
          setSection(0);
        }
      } else if (e.key === 'ArrowDown') {
        const maxSub = subCounts[sectionRef.current];
        if (subSectionRef.current < maxSub) {
          setSubSection(prev => prev + 1);
        }
      } else if (e.key === 'ArrowUp' && subSectionRef.current > 0) {
        setSubSection(prev => prev - 1);
      }
    }

    // Привязаниe событий
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel);
    window.addEventListener('keydown', onKeyDown);

    // Обработка изменения размеров окна
    const onResize = () => {
      vw = container.clientWidth;
      vh = container.clientHeight;
    };
    window.addEventListener('resize', onResize);
    
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  
  // Эффект для анимации GSAP при изменении секции или подсекции
  useEffect(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;
    
    const vw = container.clientWidth;
    const vh = container.clientHeight;
    const targetX = -section * vw;
    const targetY = -subSection * vh;

    const prev = prevRef.current;
    if (teleportRef.current) {
      const tl = gsap.timeline();
      tl.to(content, { x: targetX - 100, duration: 0.2, ease: 'power2.in' });
      tl.set(content, { x: targetX, y: targetY });
      tl.to(content, { x: targetX, duration: 0.3, ease: 'power2.out' });
      teleportRef.current = false;
    } else if (prev.section !== section || prev.sub !== subSection) {
      const easeType = (prev.section !== section) ? 'elastic.out(0.1, 1)' : 'power3.out';
      gsap.to(content, {
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: easeType,
      });
    }
    prevRef.current = { section, sub: subSection };
  }, [section, subSection]);

  // Обработчик для "Погружения" из интро
  const handleExploreClick = () => {
    setSection(1);
    setSubSection(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#1D1E26] select-none"
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      <div ref={contentRef} className="flex w-[300vw]">
        <section className="flex-shrink-0 w-screen h-screen p-1">
          <div className="w-full h-full bg-[#1D1E26] rounded-xl shadow-lg overflow-hidden">
            <HeroIntro onDone={handleExploreClick} />
            <h1>Cекция 0</h1>
          </div>
        </section>
        <section className="flex-shrink-0 w-screen flex flex-col">
          <div className="h-screen p-1">
            <div className="w-full h-full bg-[#2C2F3A] rounded-xl shadow-lg flex items-center justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#F4F5F7]" style={{ fontFamily: 'Manrope' }}>
                Секция 1
              </h1>
            </div>
          </div>
          <div className="h-screen p-1">
            <div className="w-full h-full bg-[#4A4E61] rounded-xl shadow-lg flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#E8DED2]" style={{ fontFamily: 'Manrope' }}>
                Секция 1.1
              </h2>
            </div>
          </div>
          <div className="h-screen p-1">
            <div className="w-full h-full bg-[#4A4E61] rounded-xl shadow-lg flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#D4AF37]" style={{ fontFamily: 'Manrope' }}>
                Секция 1.2
              </h2>
            </div>
          </div>
        </section>
        <section className="flex-shrink-0 w-screen flex flex-col">
          <div className="h-screen p-1">
            <div className="w-full h-full bg-[#2C2F3A] rounded-xl shadow-lg flex items-center justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#F4F5F7]" style={{ fontFamily: 'Manrope' }}>
                Секция 2
              </h1>
            </div>
          </div>
          <div className="h-screen p-1">
            <div className="w-full h-full bg-[#4A4E61] rounded-xl shadow-lg flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#E8DED2]" style={{ fontFamily: 'Manrope' }}>
                Секция 2.1
              </h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}         