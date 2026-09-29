import React, { useEffect, useRef } from 'react';

interface StormAtmosphereCanvasProps {
  className?: string;
  intensity?: 'moderate' | 'severe' | 'extreme';
}

export const StormAtmosphereCanvas: React.FC<StormAtmosphereCanvasProps> = ({
  className = '',
  intensity = 'severe',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initClouds();
    };
    window.addEventListener('resize', handleResize);

    // Particle count based on intensity
    const rainCount = intensity === 'extreme' ? 380 : intensity === 'severe' ? 260 : 160;
    const windAngle = 0.28; // radians (~16 degrees tilt)
    const windCos = Math.cos(windAngle);
    const windSin = Math.sin(windAngle);

    // Rain particles
    interface RainDrop {
      x: number;
      y: number;
      len: number;
      speed: number;
      opacity: number;
      depth: number; // 0 = far, 1 = near
    }

    const rainDrops: RainDrop[] = [];
    for (let i = 0; i < rainCount; i++) {
      const depth = Math.random();
      rainDrops.push({
        x: Math.random() * (width + 300) - 150,
        y: Math.random() * height,
        len: 12 + depth * 22,
        speed: 16 + depth * 20,
        opacity: 0.15 + depth * 0.45,
        depth,
      });
    }

    // Splash particles
    interface Splash {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      opacity: number;
    }
    const splashes: Splash[] = [];

    // Cloud masses
    interface CloudPuff {
      x: number;
      y: number;
      radius: number;
      driftSpeed: number;
      color: string;
      baseAlpha: number;
    }
    let clouds: CloudPuff[] = [];

    const initClouds = () => {
      clouds = [];
      const cloudPuffsCount = Math.floor(width / 70) + 12;
      for (let i = 0; i < cloudPuffsCount; i++) {
        const radius = 180 + Math.random() * 260;
        const x = (i / cloudPuffsCount) * (width + 400) - 200 + (Math.random() * 80 - 40);
        const y = Math.random() * (height * 0.48) - 60;
        const shade = Math.floor(6 + Math.random() * 12);
        clouds.push({
          x,
          y,
          radius,
          driftSpeed: 0.12 + Math.random() * 0.18,
          color: `rgb(${shade}, ${shade + 3}, ${shade + 8})`,
          baseAlpha: 0.35 + Math.random() * 0.35,
        });
      }
    };
    initClouds();

    // Lightning state
    let lightningOpacity = 0;
    let nextLightningTime = Date.now() + 2500 + Math.random() * 5000;
    let lightningDuration = 0;
    let lightningCenterX = width * 0.5;

    const render = () => {
      const now = Date.now();

      // Trigger sheet lightning
      if (now > nextLightningTime) {
        lightningOpacity = 0.55 + Math.random() * 0.4;
        lightningDuration = 120 + Math.random() * 140;
        lightningCenterX = width * (0.2 + Math.random() * 0.6);
        nextLightningTime = now + 4500 + Math.random() * 8000;
      }

      // Decay lightning
      if (lightningOpacity > 0) {
        lightningOpacity -= 0.045;
        if (lightningOpacity < 0) lightningOpacity = 0;
      }

      // Base background color (night / ominous storm sky)
      ctx.fillStyle = '#040608';
      ctx.fillRect(0, 0, width, height);

      // Flash background illumination when lightning discharges
      if (lightningOpacity > 0.01) {
        const grad = ctx.createRadialGradient(
          lightningCenterX,
          height * 0.15,
          50,
          lightningCenterX,
          height * 0.25,
          width * 0.85
        );
        grad.addColorStop(0, `rgba(224, 242, 254, ${lightningOpacity * 0.4})`);
        grad.addColorStop(0.3, `rgba(186, 230, 253, ${lightningOpacity * 0.2})`);
        grad.addColorStop(0.7, `rgba(56, 189, 248, ${lightningOpacity * 0.08})`);
        grad.addColorStop(1, 'rgba(4, 6, 8, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Render drifting storm clouds
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.x += c.driftSpeed;
        if (c.x - c.radius > width) {
          c.x = -c.radius;
        }

        const cloudGrad = ctx.createRadialGradient(
          c.x,
          c.y,
          c.radius * 0.1,
          c.x,
          c.y,
          c.radius
        );

        // Highlight clouds if lightning is active
        if (lightningOpacity > 0.05) {
          cloudGrad.addColorStop(0, `rgba(147, 197, 253, ${lightningOpacity * 0.3})`);
          cloudGrad.addColorStop(0.5, c.color);
          cloudGrad.addColorStop(1, 'rgba(4, 6, 8, 0)');
        } else {
          cloudGrad.addColorStop(0, `rgba(14, 22, 34, ${c.baseAlpha})`);
          cloudGrad.addColorStop(0.6, `rgba(8, 13, 20, ${c.baseAlpha * 0.8})`);
          cloudGrad.addColorStop(1, 'rgba(4, 6, 8, 0)');
        }

        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Atmospheric fog / rain mist gradient
      const mistGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      mistGrad.addColorStop(0, 'rgba(4, 6, 8, 0)');
      mistGrad.addColorStop(0.6, 'rgba(6, 10, 16, 0.45)');
      mistGrad.addColorStop(1, 'rgba(4, 6, 8, 0.85)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, 0, width, height);

      // Render and update rain streaks
      ctx.lineWidth = 1.2;
      for (let i = 0; i < rainDrops.length; i++) {
        const drop = rainDrops[i];

        // Draw rain streak
        const x2 = drop.x + drop.len * windSin;
        const y2 = drop.y + drop.len * windCos;

        ctx.strokeStyle = `rgba(186, 215, 240, ${drop.opacity})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Advance position
        drop.x += drop.speed * windSin;
        drop.y += drop.speed * windCos;

        // Splashes near bottom or viewport bounds
        if (drop.y > height - 10) {
          if (drop.depth > 0.6 && Math.random() < 0.4) {
            splashes.push({
              x: drop.x,
              y: height - Math.random() * 8,
              vx: (Math.random() - 0.5) * 3 + windSin * 2,
              vy: -(Math.random() * 2.5 + 1.2),
              life: 0,
              maxLife: 10 + Math.random() * 8,
              opacity: drop.opacity * 0.8,
            });
          }
          // Reset drop to top
          drop.y = -drop.len - Math.random() * 50;
          drop.x = Math.random() * (width + 300) - 150;
        }

        if (drop.x > width + 100) {
          drop.x = -50;
        }
      }

      // Update and render splash particles
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.22; // gravity
        s.life++;

        const currentAlpha = s.opacity * (1 - s.life / s.maxLife);
        ctx.fillStyle = `rgba(186, 215, 240, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.1, 0, Math.PI * 2);
        ctx.fill();

        if (s.life >= s.maxLife) {
          splashes.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.92 }}
    />
  );
};
