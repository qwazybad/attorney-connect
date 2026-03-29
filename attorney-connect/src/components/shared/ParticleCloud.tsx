"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  opacity: number;
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

    const COUNT = 350;
    const SPREAD = 0.38; // fraction of canvas width for cloud radius
    const particles: Particle3D[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      if (!canvas) return;
      particles.length = 0;
      const r = Math.min(canvas.width, canvas.height) * SPREAD;

      for (let i = 0; i < COUNT; i++) {
        // Random point inside a sphere using rejection sampling
        let x, y, z;
        do {
          x = (Math.random() * 2 - 1) * r;
          y = (Math.random() * 2 - 1) * r;
          z = (Math.random() * 2 - 1) * r;
        } while (x * x + y * y + z * z > r * r);

        particles.push({
          x, y, z,
          radius: Math.random() * 1.8 + 0.4,
          opacity: Math.random() * 0.5 + 0.3,
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

      angleY += 0.0018;
      angleX += 0.0008;
      angleZ += 0.0004;

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

        // Depth-based brightness: closer = brighter
        const depthFactor = (z + fov) / (fov * 2);
        const finalOpacity = p.opacity * (0.3 + depthFactor * 0.7);
        const finalRadius = p.radius * scale;

        return { sx, sy, z, finalOpacity, finalRadius };
      });

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        if (p.finalRadius < 0.1) continue;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.finalRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(p.finalOpacity, 1)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => { resize(); init(); });
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
