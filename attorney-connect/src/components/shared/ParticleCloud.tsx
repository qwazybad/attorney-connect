"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  opacity: number;
  green: boolean;
}

export default function ParticleCloud() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const isMobile = () => window.innerWidth < 768;
    const COUNT = isMobile() ? 220 : 500;
    const SPREAD = isMobile() ? 0.48 : 0.6;
    const particles: Particle3D[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      if (!canvas) return;
      particles.length = 0;
      const count = isMobile() ? 220 : 500;
      const spread = isMobile() ? 0.48 : 0.6;
      const r = Math.min(canvas.width, canvas.height) * spread;

      for (let i = 0; i < count; i++) {
        let x, y, z;
        do {
          x = (Math.random() * 2 - 1) * r;
          y = (Math.random() * 2 - 1) * r;
          z = (Math.random() * 2 - 1) * r;
        } while (x * x + y * y + z * z > r * r);

        // ~20% green particles
        const green = Math.random() < 0.2;

        particles.push({
          x, y, z,
          radius: Math.random() * 1.8 + 0.4,
          opacity: Math.random() * 0.5 + 0.3,
          green,
        });
      }
    }

    function rotateY(x: number, z: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: x * cos - z * sin, z: x * sin + z * cos };
    }

    function rotateX(y: number, z: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { y: y * cos - z * sin, z: y * sin + z * cos };
    }

    function rotateZ(x: number, y: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: x * cos - y * sin, y: x * sin + y * cos };
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      angleY += 0.0006;
      angleX += 0.0003;
      angleZ += 0.00015;

      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5;
      const fov = canvas.width * 1.2;

      // Project and sort by z
      const projected = particles.map((p) => {
        let { x, y, z } = p;

        const ry = rotateY(x, z, angleY);
        x = ry.x; z = ry.z;

        const rx = rotateX(y, z, angleX);
        y = rx.y; z = rx.z;

        const rz = rotateZ(x, y, angleZ);
        x = rz.x; y = rz.y;

        const scale = fov / (fov + z);
        const sx = cx + x * scale;
        const sy = cy + y * scale;

        const depthFactor = (z + fov) / (fov * 2);
        const finalOpacity = p.opacity * (0.3 + depthFactor * 0.7);
        const finalRadius = p.radius * scale;

        return { sx, sy, z, finalOpacity, finalRadius, green: p.green };
      });

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        if (p.finalRadius < 0.1) continue;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.finalRadius, 0, Math.PI * 2);
        // Green particles use brand green #25BE87, white particles use white
        const color = p.green
          ? `rgba(37,190,135,${Math.min(p.finalOpacity * 1.2, 1)})`
          : `rgba(255,255,255,${Math.min(p.finalOpacity, 1)})`;
        ctx.fillStyle = color;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => { resize(); init(); draw(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
