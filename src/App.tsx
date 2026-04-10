import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowUpRight, Code2, Mail, GitBranch, Briefcase, ExternalLink, Cloud, Brain, Sigma } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
  span: string;
  url: string;
  tags?: string[];
  icon?: React.ReactNode;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Qrucial",
    description: "An AI-powered automated management platform designed for corporate teams that integrates document management, task tracking, and real-time communication within a secure, hierarchical workspace.",
    color: "bg-surface",
    hoverColor: "hover:bg-primary-container",
    tags: ["TEAM MANAGEMENT", "AI-POWERED"],
    span: "md:col-span-8",
    url: "https://qrucial.app"
  },
  {
    id: "02",
    title: "Leenar",
    description: "A no-code, self-healing multi-agent orchestration platform that empowers companies to build autonomous AI departments to automate complex workflows.",
    color: "bg-surface-container-high",
    hoverColor: "hover:bg-primary-container",
    tags: ["AGENTIC AI", "NO-CODE"],
    span: "md:col-span-4",
    url: "https://leenar.net"
  }
];

interface Expertise {
  icon: React.ReactNode;
  title: string;
}

const expertise: Expertise[] = [
  { icon: <Cloud />, title: "Cloud Infrastructure" },
  { icon: <Brain />, title: "AI/ML" },
  { icon: <Code2 />, title: "Python" },
  { icon: <Sigma />, title: "Applied Mathematics" }
];

const PixelGarden = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 500, H = 200;
    const G = 160; // ground y

    // ── helpers ───────────────────────────────────────────────────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const eIO = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // ━━ GROUND & GRASS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const drawGround = () => {
      ctx.fillStyle = '#2a6e10';
      ctx.fillRect(0, G, W, 2);
      ctx.fillStyle = '#1d5208';
      ctx.fillRect(0, G + 2, W, H - G - 2);
      const tufts = [10, 30, 62, 88, 148, 178, 218, 258, 305, 350, 398, 445, 478];
      tufts.forEach(x => {
        ctx.fillStyle = '#44bb22';
        ctx.fillRect(x, G - 4, 2, 4);
        ctx.fillRect(x + 3, G - 7, 2, 7);
        ctx.fillRect(x + 6, G - 3, 2, 3);
      });
    };

    // ━━ FLOWERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    type Fl = { x: number; h: number; petal: string; center: string; phase: number };
    const flowers: Fl[] = [
      { x: 50, h: 42, petal: '#ff3355', center: '#ffcc00', phase: 0.0 },
      { x: 118, h: 56, petal: '#ffdd00', center: '#ff8822', phase: 0.7 },
      { x: 302, h: 46, petal: '#bb44ff', center: '#ffffff', phase: 1.5 },
      { x: 442, h: 38, petal: '#33ccff', center: '#ffcc00', phase: 2.2 },
      { x: 490, h: 30, petal: '#ff66cc', center: '#ffff88', phase: 1.0 },
    ];

    const drawFlower = (f: Fl, now: number) => {
      const sw = Math.sin(now / 1700 + f.phase) * 2.5;
      const tx = f.x + sw, ty = G - f.h;
      const sx = Math.round(f.x + sw * 0.5);

      ctx.fillStyle = '#3a7a10';
      ctx.fillRect(sx - 1, Math.round(ty), 2, f.h);

      ctx.fillStyle = '#44aa22';
      ctx.fillRect(sx - 6, Math.round(ty + f.h * 0.42), 6, 3);
      ctx.fillRect(sx + 1, Math.round(ty + f.h * 0.63), 6, 3);

      const px = Math.round(tx), py = Math.round(ty);
      ctx.fillStyle = f.petal;
      ctx.fillRect(px - 5, py - 2, 4, 4);
      ctx.fillRect(px + 2, py - 2, 4, 4);
      ctx.fillRect(px - 2, py - 6, 4, 4);
      ctx.fillRect(px - 2, py + 2, 4, 4);
      ctx.fillRect(px - 5, py - 5, 3, 3);
      ctx.fillRect(px + 3, py - 5, 3, 3);
      ctx.fillRect(px - 5, py + 3, 3, 3);
      ctx.fillRect(px + 3, py + 3, 3, 3);

      ctx.fillStyle = f.center;
      ctx.fillRect(px - 2, py - 2, 5, 5);
    };

    // ━━ SPARKLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const spCols = ['#ffcc00', '#ff44aa', '#44aaff', '#55ff88', '#ff8833', '#cc44ff', '#ff4444'];
    const sparks = Array.from({ length: 22 }, (_, i) => ({
      x: 8 + (i * 22 + 5) % (W - 16),
      y: 8 + (i * 17 + 3) % (G - 55),
      ph: i * 0.63,
      sp: 0.6 + (i % 5) * 0.38,
      col: spCols[i % spCols.length],
      cross: i % 4 === 0,
    }));

    const drawSparkles = (now: number) => {
      sparks.forEach(s => {
        const v = Math.sin(now * s.sp / 1900 + s.ph);
        if (v <= 0) return;
        ctx.globalAlpha = v * 0.85;
        ctx.fillStyle = s.col;
        if (s.cross && v > 0.55) {
          ctx.fillRect(s.x - 1, s.y + 1, 5, 1);
          ctx.fillRect(s.x + 1, s.y - 1, 1, 5);
          ctx.fillRect(s.x, s.y, 3, 3);
        } else {
          ctx.fillRect(s.x, s.y, 2, 2);
        }
      });
      ctx.globalAlpha = 1;
    };

    // ━━ BUTTERFLY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const drawButterfly = (bx: number, by: number, now: number) => {
      const f = Math.abs(Math.sin(now / 145));
      const ww = Math.round(lerp(2, 10, f));
      const wh = Math.round(lerp(2, 7, f));
      const wl = Math.round(lerp(1, 5, f));

      ctx.fillStyle = '#3366ee';
      ctx.fillRect(bx - ww - 1, by - wh, ww, wh);
      ctx.fillRect(bx + 2, by - wh, ww, wh);
      ctx.fillStyle = '#6699ff';
      ctx.fillRect(bx - Math.round(ww * 0.7) - 1, by + 1, Math.round(ww * 0.7), wl);
      ctx.fillRect(bx + 2, by + 1, Math.round(ww * 0.7), wl);

      if (f > 0.45) {
        const ox = Math.round(ww * 0.45);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(bx - ox - 1, by - Math.round(wh * 0.55), 2, 2);
        ctx.fillRect(bx + ox, by - Math.round(wh * 0.55), 2, 2);
      }

      ctx.fillStyle = '#111';
      ctx.fillRect(bx - 1, by - 2, 3, 8);
      ctx.fillStyle = '#333';
      ctx.fillRect(bx - 3, by - 6, 1, 4);
      ctx.fillRect(bx + 3, by - 6, 1, 4);
      ctx.fillStyle = '#ff3355';
      ctx.fillRect(bx - 4, by - 7, 2, 2);
      ctx.fillRect(bx + 3, by - 7, 2, 2);
    };

    // ━━ BEE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const drawBee = (bx: number, by: number, now: number) => {
      const f = Math.abs(Math.sin(now / 72));
      const ww = Math.round(lerp(3, 7, f));
      ctx.fillStyle = '#bbddff';
      ctx.fillRect(bx - ww - 1, by - 3, ww, 3);
      ctx.fillRect(bx + 2, by - 3, ww, 3);
      ctx.fillStyle = '#ffcc00'; ctx.fillRect(bx - 2, by, 5, 2);
      ctx.fillStyle = '#111'; ctx.fillRect(bx - 2, by + 2, 5, 2);
      ctx.fillStyle = '#ffcc00'; ctx.fillRect(bx - 2, by + 4, 5, 2);
      ctx.fillStyle = '#111'; ctx.fillRect(bx - 2, by + 6, 4, 2);
      ctx.fillStyle = '#ffcc00'; ctx.fillRect(bx - 2, by - 3, 5, 3);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 1, by - 2, 1, 1);
      ctx.fillRect(bx + 1, by - 2, 1, 1);
      ctx.fillStyle = '#aa5500';
      ctx.fillRect(bx, by + 8, 2, 2);
    };

    // ━━ LADYBUG ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const drawLadybug = (lx: number, ly: number) => {
      ctx.fillStyle = '#cc2200';
      ctx.fillRect(lx - 4, ly - 3, 9, 6);
      ctx.fillRect(lx - 3, ly - 4, 7, 8);
      ctx.fillRect(lx - 2, ly - 5, 5, 10);
      ctx.fillStyle = '#111';
      ctx.fillRect(lx - 2, ly - 5, 5, 3);
      ctx.fillRect(lx, ly - 3, 1, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(lx - 3, ly - 1, 2, 2);
      ctx.fillRect(lx + 2, ly - 1, 2, 2);
      ctx.fillRect(lx - 2, ly + 2, 2, 2);
      ctx.fillRect(lx + 1, ly + 2, 2, 2);
      ctx.fillStyle = '#fff';
      ctx.fillRect(lx - 1, ly - 4, 1, 1);
      ctx.fillRect(lx + 1, ly - 4, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillRect(lx - 6, ly - 1, 3, 1);
      ctx.fillRect(lx + 4, ly - 1, 3, 1);
      ctx.fillRect(lx - 6, ly + 1, 3, 1);
      ctx.fillRect(lx + 4, ly + 1, 3, 1);
      ctx.fillRect(lx - 5, ly + 3, 2, 1);
      ctx.fillRect(lx + 4, ly + 3, 2, 1);
    };

    // ━━ CATERPILLAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const segCols = ['#44bb22', '#55cc33', '#44bb22', '#66dd44', '#44bb22'];
    const drawCaterpillar = (cx: number, cy: number, wave: number) => {
      for (let i = 0; i < 5; i++) {
        const sx = cx - i * 9;
        const sy = cy + Math.sin(wave + i * 0.8) * 2;
        const r = 5;
        ctx.fillStyle = segCols[i];
        ctx.fillRect(Math.round(sx - r), Math.round(sy - r), r * 2, r * 2);
        ctx.fillStyle = '#33aa11';
        ctx.fillRect(Math.round(sx - r + 1), Math.round(sy - r + 1), r * 2 - 2, r * 2 - 2);
      }
      ctx.fillStyle = '#44bb22';
      ctx.fillRect(Math.round(cx + 5 - 4), Math.round(cy - 4), 8, 8);
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.round(cx + 5 - 1), Math.round(cy - 2), 1, 1);
      ctx.fillRect(Math.round(cx + 5 + 1), Math.round(cy - 2), 1, 1);
      ctx.fillStyle = '#333';
      ctx.fillRect(Math.round(cx + 5 - 1), Math.round(cy - 4), 1, 3);
      ctx.fillRect(Math.round(cx + 5 + 1), Math.round(cy - 4), 1, 3);
    };

    // ━━ JETS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Pass 1 (t 0→P1_END): both jets left→right, Jet A fires at Jet B
    // Gap  (t P1_END→P2_START): jets off-screen
    // Pass 2 (t P2_START→1): both jets right→left, Jet B fires at Jet A
    const JET_MS = 13_000;
    const P1_END = 0.62;   // pass 1 ends (jets exit right)
    const P2_START = 0.72;   // pass 2 begins (jets enter from right)
    const FIRE1_T = 0.30;   // pass 1: Jet A fires
    const EXPL1_T = 0.42;   // pass 1: explosion near Jet B
    const FIRE2_T = 0.84;   // pass 2: Jet B fires
    const EXPL2_T = 0.94;   // pass 2: explosion near Jet A
    const EXPL_MS = 700;    // explosion duration ms

    // Jet A: slower/lower (shooter in pass 1, target in pass 2)
    const JA_Y = 28;
    // Jet B: faster/higher (target in pass 1, shooter in pass 2)
    const JB_Y = 16;

    // Helper: x position of jet during a linear pass
    const jetX = (xStart: number, xEnd: number, tStart: number, tEnd: number, jt: number) =>
      lerp(xStart, xEnd, Math.min(1, Math.max(0, (jt - tStart) / (tEnd - tStart))));

    const drawJet = (cx: number, cy: number, right: boolean, body: string, glass: string) => {
      ctx.save();
      ctx.translate(Math.round(cx), Math.round(cy));
      if (!right) ctx.scale(-1, 1);
      // tail fins
      ctx.fillStyle = body;
      ctx.fillRect(-12, -5, 3, 3);
      ctx.fillRect(-12, 2, 3, 3);
      ctx.fillRect(-13, -2, 4, 4);
      // main delta wings
      ctx.fillRect(-10, -8, 13, 2);
      ctx.fillRect(-10, 6, 13, 2);
      ctx.fillRect(-4, -10, 5, 2);
      ctx.fillRect(-4, 8, 5, 2);
      // fuselage
      ctx.fillRect(-10, -2, 23, 4);
      // nose
      ctx.fillRect(13, -1, 4, 2);
      // cockpit
      ctx.fillStyle = glass;
      ctx.fillRect(0, -4, 8, 2);
      ctx.fillStyle = body;
      ctx.fillRect(0, -5, 7, 1);
      // engine glow
      ctx.fillStyle = '#ff7700';
      ctx.fillRect(-15, -1, 3, 2);
      ctx.fillStyle = '#ffee00';
      ctx.fillRect(-17, 0, 2, 1);
      ctx.restore();
    };

    const drawMissile = (mx: number, my: number, right: boolean) => {
      ctx.save();
      ctx.translate(Math.round(mx), Math.round(my));
      if (!right) ctx.scale(-1, 1);
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(-7, -1, 13, 2);
      ctx.fillStyle = '#ff4400';
      ctx.fillRect(6, -1, 4, 2);
      ctx.fillRect(7, -2, 2, 4);
      ctx.fillStyle = '#aaaaaa';
      ctx.fillRect(-4, -2, 3, 1);
      ctx.fillRect(-4, 1, 3, 1);
      // exhaust trail
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(-11, -1, 5, 2);
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(-16, 0, 5, 1);
      ctx.fillStyle = '#ffffaa';
      ctx.fillRect(-21, 0, 5, 1);
      ctx.restore();
    };

    const drawExplosion = (ex: number, ey: number, p: number) => {
      ctx.globalAlpha = Math.max(0, 1 - p);
      const r = p * 22;
      const dirs: [number, number][] = [
        [0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7],
        [0, -0.5], [0.5, 0], [0, 0.5], [-0.5, 0],
      ];
      dirs.forEach(([dx, dy], i) => {
        const d = r * (i < 8 ? 1 : 0.45);
        const col = p < 0.25 ? '#ffffff' : p < 0.5 ? '#ffee00' : p < 0.75 ? '#ff8800' : '#ff3300';
        const sz = Math.max(1, Math.round(5 - p * 4));
        ctx.fillStyle = col;
        ctx.fillRect(Math.round(ex + dx * d - sz / 2), Math.round(ey + dy * d - sz / 2), sz, sz);
      });
      const fc = Math.round((1 - p) * 12);
      if (fc > 1) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(ex - fc / 2), Math.round(ey - fc / 2), fc, fc); }
      ctx.globalAlpha = 1;
    };

    // ━━ MAIN LOOP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let raf = 0, t0: number | null = null, jt0: number | null = null;

    const frame = (now: number) => {
      if (!t0) t0 = now;
      if (!jt0) jt0 = now;

      ctx.clearRect(0, 0, W, H);

      drawSparkles(now);
      drawGround();
      flowers.forEach(f => drawFlower(f, now));

      // ladybug crawls slowly along ground between flower 0 and 1
      const lbP = (Math.sin(now / 4200) + 1) / 2;
      drawLadybug(Math.round(lerp(52, 115, lbP)), G - 5);

      // caterpillar wanders right side of scene
      const catX = 385 + Math.sin(now / 5500) * 55;
      drawCaterpillar(Math.round(catX), G - 6, now / 400);

      // bee buzzes between flower 0 and flower 1
      const bT = (now / 4600) % 1;
      const bE = bT < 0.5 ? eIO(bT * 2) : eIO((1 - bT) * 2);
      drawBee(
        Math.round(lerp(flowers[0].x, flowers[1].x, bE) + Math.sin(now / 110) * 2.5),
        Math.round(lerp(G - flowers[0].h, G - flowers[1].h, bE) - 18 + Math.sin(now / 130) * 2.5),
        now
      );

      // butterfly — compound sinusoidal Lissajous-ish path
      drawButterfly(
        Math.round(205 + Math.sin(now / 3100) * 140 + Math.sin(now / 1850) * 42),
        Math.round(48 + Math.sin(now / 2700) * 36 + Math.sin(now / 1250) * 14),
        now
      );

      // ── Jets ─────────────────────────────────────────────────────────────
      const jt = ((now - jt0) % JET_MS) / JET_MS;

      // pass 1 positions (flying right, 0→P1_END)
      const jaX1 = jetX(-55, 540, 0, P1_END, jt);
      const jbX1 = jetX(55, 650, 0, P1_END, jt);

      // pass 2 positions (flying left, P2_START→1)
      const jaX2 = jetX(540, -55, P2_START, 1, jt);
      const jbX2 = jetX(650, 55, P2_START, 1, jt);

      const inP1 = jt < P1_END;
      const inP2 = jt >= P2_START;

      if (inP1) {
        drawJet(jaX1, JA_Y, true, '#2c3e55', '#6fa8d0');  // Jet A: grey-blue
        drawJet(jbX1, JB_Y, true, '#3a4a22', '#8ab04a');  // Jet B: olive
      }
      if (inP2) {
        drawJet(jaX2, JA_Y, false, '#2c3e55', '#6fa8d0');
        drawJet(jbX2, JB_Y, false, '#3a4a22', '#8ab04a');
      }

      // ── Missile pass 1 (Jet A fires right at Jet B) ──────────────────────
      if (jt > FIRE1_T && jt < EXPL1_T) {
        const mp = (jt - FIRE1_T) / (EXPL1_T - FIRE1_T);
        const mSX = jetX(-55, 540, 0, P1_END, FIRE1_T);   // Jet A x at fire
        const mEX = jetX(55, 650, 0, P1_END, EXPL1_T);   // Jet B x at explosion
        drawMissile(lerp(mSX, mEX, mp), lerp(JA_Y, JB_Y, mp), true);
      }
      // explosion pass 1
      if (jt >= EXPL1_T && jt < EXPL1_T + EXPL_MS / JET_MS) {
        drawExplosion(
          jetX(55, 650, 0, P1_END, EXPL1_T),
          JB_Y,
          (jt - EXPL1_T) / (EXPL_MS / JET_MS)
        );
      }

      // ── Missile pass 2 (Jet B fires left at Jet A) ───────────────────────
      if (jt > FIRE2_T && jt < EXPL2_T) {
        const mp = (jt - FIRE2_T) / (EXPL2_T - FIRE2_T);
        const mSX = jetX(650, 55, P2_START, 1, FIRE2_T);   // Jet B x at fire
        const mEX = jetX(540, -55, P2_START, 1, EXPL2_T);  // Jet A x at explosion
        drawMissile(lerp(mSX, mEX, mp), lerp(JB_Y, JA_Y, mp), false);
      }
      // explosion pass 2
      if (jt >= EXPL2_T && jt < EXPL2_T + EXPL_MS / JET_MS) {
        drawExplosion(
          jetX(540, -55, P2_START, 1, EXPL2_T),
          JA_Y,
          (jt - EXPL2_T) / (EXPL_MS / JET_MS)
        );
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={200}
      className="absolute pointer-events-none"
      style={{ top: '100%', left: -80, imageRendering: 'pixelated' }}
    />
  );
};

const App = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="bg-background text-primary selection:bg-primary-container selection:text-on-primary-container min-h-screen overflow-x-hidden">
      {/* TopNavBar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="w-full border-b-4 border-primary bg-background flex justify-between items-center px-6 py-4 sticky top-0 z-50"
      >
        <div className="text-2xl font-black tracking-tighter uppercase font-headline">
          EFE DARA
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          {['about', 'projects', 'contact'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="font-headline uppercase tracking-tighter hover:bg-primary hover:text-white transition-colors duration-100 px-2 py-1 cursor-pointer active:translate-x-1 active:translate-y-1"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center">
          <motion.a
            href="https://github.com/mahmutefedara"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="cursor-pointer p-2 hover:bg-primary hover:text-background transition-colors"
          >
            <Terminal size={24} />
          </motion.a>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-24 md:py-40 flex flex-col gap-12" id="about">
          <motion.div
            initial={{ borderLeftWidth: 0, opacity: 0 }}
            animate={{ borderLeftWidth: 8, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="border-l-8 border-primary pl-4 md:pl-8 group relative"
          >
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-start gap-12">
                <div className="max-w-4xl pt-2">
                  <motion.h1
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-8xl lg:text-[110px] font-black uppercase tracking-tighter leading-[0.9] font-headline"
                  >
                    EFE DARA  <br />
                    <span className="text-tertiary">ENTREPRENEUR - <br className="hidden md:block" /> COMPUTER ENGINEER</span>
                  </motion.h1>
                </div>

                <div className="relative relative">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="w-full max-w-[400px] aspect-square md:w-[450px] md:h-[450px] shrink-0 relative z-10"
                  >
                    <img
                      src="/efe.jpg"
                      alt="Efe Dara"
                      className="w-full h-full object-cover neo-shadow border-4 border-primary"
                    />
                  </motion.div>
                  {/* Pixel Bahçe */}
                  <PixelGarden />
                </div>
              </div>

              {/* Alta Düşen Hover Sosyal Linkler */}
              <div className="relative h-12">
                <div className="flex items-center gap-2 cursor-pointer text-primary font-black uppercase tracking-widest text-sm mb-4">
                  <span className="bg-primary text-white px-2 py-1">Links</span>
                  <span className="animate-bounce">↓</span>
                </div>

                <div className="absolute top-8 left-0 flex flex-col md:flex-row gap-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 ease-out z-20">
                  {[
                    { icon: <GitBranch size={18} />, label: "Github", url: "https://github.com/mahmutefedara" },
                    { icon: <Briefcase size={18} />, label: "LinkedIn", url: "https://www.linkedin.com/in/mahmutefedara/" },
                    { icon: <ExternalLink size={18} />, label: "Blog", url: "https://mahmutefedara.github.io" }
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, backgroundColor: '#1a1a1a', color: '#ffffff' }}
                      className="flex items-center gap-2 border-2 border-primary bg-white px-4 py-2 font-black text-xs uppercase tracking-widest transition-colors neo-shadow min-w-[120px]"
                    >
                      {social.icon}
                      <span>{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-3xl font-medium max-w-3xl leading-tight mt-12 md:mt-4"
              >
                Building for my dreams.
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <a href="#contact" className="inline-block bg-primary text-white px-8 py-4 text-xl font-bold uppercase tracking-widest border-2 border-primary hover:bg-primary-container hover:text-on-primary-container transition-all active:translate-x-1 active:translate-y-1 neo-shadow">
              Get in touch
            </a>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section className="py-20 border-t-4 border-primary" id="projects">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4"
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-headline">Selected_Work</h2>
            <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">001 — 002</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -8 }}
                className={`${project.span} border-4 border-primary p-8 ${project.color} ${project.hoverColor} transition-colors group relative overflow-hidden`}
              >
                <div className="flex justify-between items-start mb-12 relative z-10">
                  <span className="text-6xl font-black opacity-10 group-hover:opacity-100 transition-opacity font-headline">{project.id}</span>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary hover:text-white transition-all rounded-full border-2 border-transparent hover:border-primary">
                    <ArrowUpRight className="w-10 h-10 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 font-headline">{project.title}</h3>
                  <p className="text-lg max-w-xl text-on-surface-variant group-hover:text-primary transition-colors">
                    {project.description}
                  </p>
                  {project.tags && (
                    <div className="mt-8 border-t-2 border-primary pt-4 flex gap-2">
                      {project.tags.map((tag: string) => (
                        <span key={tag} className="text-xs font-bold bg-primary text-white px-2 py-1">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {project.icon && (
                  <div className="hidden md:flex absolute bottom-8 right-8 w-64 h-32 bg-primary items-center justify-center">
                    {project.icon}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20 border-t-4 border-primary" id="expertise">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 font-headline">Expertise_Set</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary border-4 border-primary">
            {expertise.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ backgroundColor: '#ffcc00' }}
                className="bg-background p-8 aspect-square flex flex-col justify-between transition-colors"
              >
                <div className="text-primary w-10 h-10">{item.icon}</div>
                <h4 className="text-xl font-black uppercase tracking-tighter font-headline">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 border-t-4 border-primary mb-20" id="contact">
          <motion.div
            whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
            viewport={{ once: true }}
            className="bg-secondary p-12 neo-shadow"
          >
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-8 font-headline">Ready to_build?</h2>
            <p className="text-white text-xl md:text-2xl font-medium mb-12 max-w-xl">
              I am currently open to high-impact collaborations and technical leadership roles.
            </p>
            <a
              href="mailto:mahmutefedara@leenar.net"
              className="inline-flex items-center gap-4 text-3xl md:text-5xl font-black uppercase tracking-tighter text-white hover:text-primary-fixed transition-colors underline decoration-8 underline-offset-8 font-headline"
            >
              mahmutefedara@leenar.net
              <Mail className="w-10 h-10 md:w-16 md:h-16" />
            </a>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-4 border-primary bg-primary flex flex-col md:flex-row justify-between items-center p-8 text-white font-headline text-xs font-bold uppercase">
        <div className="flex gap-8 mb-4 md:mb-0">
          <a href="https://github.com/mahmutefedara" target="_blank" rel="noopener noreferrer" className="hover:text-primary-fixed transition-colors flex items-center gap-1"><GitBranch size={14} /> Github</a>
          <a href="https://www.linkedin.com/in/mahmutefedara/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-fixed transition-colors flex items-center gap-1"><Briefcase size={14} /> LinkedIn</a>
          <a href="https://mahmutefedara.github.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary-fixed transition-colors flex items-center gap-1"><ExternalLink size={14} /> Blog</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
