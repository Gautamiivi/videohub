import { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Initialize stars
    const initStars = () => {
      stars = [];
      const numStars = Math.min(Math.floor(window.innerWidth * window.innerHeight / 8000), 300);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.2
        });
      }
    };

    // Draw star with glow effect
    const drawStar = (star, offsetX, offsetY) => {
      const x = (star.x + offsetX + canvas.width) % canvas.width;
      const y = (star.y + offsetY + canvas.height) % canvas.height;
      
      // Twinkle effect
      star.twinklePhase += star.twinkleSpeed;
      const twinkleOpacity = star.opacity * (0.7 + 0.3 * Math.sin(star.twinklePhase));
      
      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${twinkleOpacity})`);
      gradient.addColorStop(0.3, `rgba(200, 220, 255, ${twinkleOpacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Bright center
      ctx.beginPath();
      ctx.arc(x, y, star.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      // Smooth mouse following
      targetX += (mouseX - targetX) * 0.02;
      targetY += (mouseY - targetY) * 0.02;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(5, 10, 25, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw all stars with parallax offset
      stars.forEach(star => {
        const offsetX = targetX * star.speed * 10;
        const offsetY = targetY * star.speed * 10;
        drawStar(star, offsetX, offsetY);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    // Touch move handler for mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    // Initial setup
    resizeCanvas();
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #050a19 0%, #0a1525 100%)'
      }}
    />
  );
};

export default Starfield;
