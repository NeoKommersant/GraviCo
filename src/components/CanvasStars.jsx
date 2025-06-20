// components/CanvasStars.jsx
import { useEffect, useRef } from 'react';

export default function CanvasStars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 300 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      radius: Math.random() * 1.5 + 0.5
    }));

    const comets = Array.from({ length: 1 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 4 + 6, // faster speed
      vy: Math.random() * 2 + 2,
      length: Math.random() * 40 + 40,
      alpha: 0.3 + Math.random() * 0.3,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      stars.forEach((star) => {
        star.z -= 1;
        if (star.z <= 1) star.z = width;

        const perspective = 200 / star.z;
        const px = (star.x + star.z * 0.15) * perspective;
        const py = (star.y + star.z * 0.08) * perspective;

        const size = star.radius * (1 - star.z / width);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw comets
      comets.forEach((comet) => {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(comet.x, comet.y, comet.x - comet.length, comet.y - comet.length / 2);
        grad.addColorStop(0, comet.color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(comet.x - comet.length, comet.y - comet.length / 2);
        ctx.stroke();

        comet.x += comet.vx;
        comet.y += comet.vy;

        // Reset if off-screen
        if (comet.x > width + 100 || comet.y > height + 100) {
          comet.x = -50;
          comet.y = Math.random() * height * 0.5;
          comet.vx = (Math.random() * 4 + 6) * 9;
          comet.vy = (Math.random() * 2 + 2) *9;
          comet.length = Math.random() * 40 + 40;
          comet.alpha = 0.3 + Math.random() * 0.3;
          comet.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
    />
  );
}
