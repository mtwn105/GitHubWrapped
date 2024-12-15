"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noise = createNoise3D();
  let w: number, h: number, nt: number, i: number, x: number;
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.current = canvas.getContext("2d");
    if (!ctx.current) return;

    w = ctx.current.canvas.width = window.innerWidth;
    h = ctx.current.canvas.height = window.innerHeight;
    ctx.current.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      if (!ctx.current) return;
      w = ctx.current.canvas.width = window.innerWidth;
      h = ctx.current.canvas.height = window.innerHeight;
      ctx.current.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#22c55e", // green-500
    "#16a34a", // green-600
    "#15803d", // green-700
    "#166534", // green-800
    "#14532d", // green-900
  ];
  const drawWave = (n: number) => {
    if (!ctx.current) return;
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.current.beginPath();
      ctx.current.lineWidth = waveWidth || 50;
      ctx.current.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.current.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
      }
      ctx.current.stroke();
      ctx.current.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    if (!ctx.current) return;
    ctx.current.fillStyle = backgroundFill || "black";
    ctx.current.globalAlpha = waveOpacity || 0.5;
    ctx.current.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
