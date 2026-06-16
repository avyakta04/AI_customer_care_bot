import React, { useEffect, useRef } from 'react';

const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const connectionDistance = 120;
    const mouse = { x: null, y: null, radius: 150 };

    // Moving soft colored light blobs
    const blobs = [
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 350,
        color: 'rgba(139, 92, 246, 0.035)' // Violet
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 400,
        color: 'rgba(6, 182, 212, 0.035)' // Cyan
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 320,
        color: 'rgba(244, 63, 94, 0.02)' // Pink/Rose
      }
    ];

    let time = 0;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)';
      }

      update() {
        // Ambient movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 0.6;
            this.y -= (dy / dist) * force * 0.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Waving Aurora Background Effect
      time += 0.0015;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // Plot curvy sine wave path
        for (let x = 0; x <= width; x += 30) {
          const baseHeight = height * 0.75;
          const sineFactor = Math.sin(x * 0.003 + time + wave * (Math.PI / 1.5)) * 60;
          const cosFactor = Math.cos(x * 0.0015 - time) * 30;
          const y = baseHeight + sineFactor + cosFactor;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, height * 0.6, 0, height);
        grad.addColorStop(0, 'transparent');
        
        if (wave === 0) {
          grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.025)'); // Emerald Green
        } else if (wave === 1) {
          grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.025)');  // Cyan
        } else {
          grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');  // Violet
        }
        
        grad.addColorStop(0.9, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // 2. Draw Moving Soft Light Blobs
      blobs.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;

        // Bounce
        if (b.x < 0 || b.x > width) b.vx *= -1;
        if (b.y < 0 || b.y > height) b.vy *= -1;

        const grad = ctx.createRadialGradient(b.x, b.y, 5, b.x, b.y, b.radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.5, b.color.replace('0.035', '0.015').replace('0.02', '0.008'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Connected Particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Dynamic color gradient between nodes
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-2] bg-transparent"
    />
  );
};

export default NeuralBackground;
