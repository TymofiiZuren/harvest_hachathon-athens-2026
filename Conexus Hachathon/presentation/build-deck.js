// PlantDex pitch deck — SCAMPER ideation story for EIT Food / EU Enables Athens.
// Professional ed-tech framing: the idea and its design process, no code, no
// "Pokémon". Dark botanical brand theme drawn with vector icons.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBook, FaMobileAlt, FaMapMarkedAlt, FaCamera, FaMagic, FaGlobeEurope,
  FaBullseye, FaBolt, FaGraduationCap, FaUserGraduate, FaChalkboardTeacher,
  FaTractor, FaUsers, FaCheckCircle, FaDoorOpen, FaSeedling,
  FaExchangeAlt, FaLink, FaRecycle, FaExpandArrowsAlt, FaEraser, FaRetweet,
} = require("react-icons/fa");

// Palette — app's "Night Garden" tokens
const BG = "0B110D", SURFACE = "151D17", RAISED = "1C2820", LINE = "2C3B31";
const ACCENT = "4ADE80", ACCENT_LIGHT = "86EFAC", ACCENT_DIM = "143323", ACCENT_EDGE = "2E5C40";
const GOLD = "F5C04E", GOLD_DIM = "33290F";
const TEXT = "F2F7F3", SUB = "A2B3A7", FAINT = "6E7F72";
const FONT = "Arial";

async function iconPng(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Team Conexus";
  pres.title = "PlantDex — EU Enables Athens 2026";

  const I = {};
  const jobs = {
    book: [FaBook, GOLD], phone: [FaMobileAlt, ACCENT], map: [FaMapMarkedAlt, ACCENT],
    camera: [FaCamera, ACCENT], magic: [FaMagic, GOLD], globe: [FaGlobeEurope, "60A5FA"],
    target: [FaBullseye, ACCENT], bolt: [FaBolt, GOLD], grad: [FaGraduationCap, ACCENT],
    student: [FaUserGraduate, ACCENT], teacher: [FaChalkboardTeacher, GOLD],
    tractor: [FaTractor, "60A5FA"], users: [FaUsers, "C084FC"], check: [FaCheckCircle, ACCENT],
    door: [FaDoorOpen, GOLD], seed: [FaSeedling, ACCENT],
    sub: [FaExchangeAlt, ACCENT], comb: [FaLink, GOLD], adapt: [FaRecycle, ACCENT],
    mod: [FaExpandArrowsAlt, GOLD], elim: [FaEraser, "FB7185"], rev: [FaRetweet, "60A5FA"],
    putuse: [FaUsers, "C084FC"],
  };
  for (const [k, [c, col]] of Object.entries(jobs)) I[k] = await iconPng(c, col);

  const dark = () => { const s = pres.addSlide(); s.background = { color: BG }; return s; };
  const kicker = (s, t) => s.addText(t, { x: 0.5, y: 0.34, w: 9, h: 0.26, fontFace: FONT, fontSize: 11, bold: true, color: ACCENT, charSpacing: 3, margin: 0 });
  const title = (s, t, sz = 28) => s.addText(t, { x: 0.5, y: 0.62, w: 9, h: 0.62, fontFace: FONT, fontSize: sz, bold: true, color: TEXT, margin: 0 });
  const card = (s, x, y, w, h, fill = SURFACE) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: LINE, width: 1 } });
  const iconCircle = (s, x, y, d, data, fill = ACCENT_DIM) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: ACCENT_EDGE, width: 0.75 } });
    const k = d * 0.46; s.addImage({ data, x: x + (d - k) / 2, y: y + (d - k) / 2, w: k, h: k });
  };
  const letterBadge = (s, x, y, d, letter, color = ACCENT, fill = ACCENT_DIM) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: d, h: d, rectRadius: d * 0.26, fill: { color: fill }, line: { color: ACCENT_EDGE, width: 1 } });
    s.addText(letter, { x, y: y - 0.02, w: d, h: d, fontFace: FONT, fontSize: d * 40, bold: true, color, align: "center", valign: "middle", margin: 0 });
  };
  const brandMark = (s, x, y, k) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: k, h: k, rectRadius: k * 0.28, fill: { color: ACCENT_DIM }, line: { color: ACCENT_EDGE, width: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: x + k * 0.48, y: y + k * 0.5, w: k * 0.045, h: k * 0.34, fill: { color: ACCENT }, line: { type: "none" } });
    s.addShape(pres.shapes.OVAL, { x: x + k * 0.13, y: y + k * 0.36, w: k * 0.4, h: k * 0.26, rotate: 330, fill: { color: ACCENT }, line: { type: "none" } });
    s.addShape(pres.shapes.OVAL, { x: x + k * 0.46, y: y + k * 0.24, w: k * 0.4, h: k * 0.26, rotate: 30, fill: { color: ACCENT_LIGHT }, line: { type: "none" } });
  };
  const sprout = (s, cx, cy, d) => {
    s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: "24332A" }, line: { color: LINE, width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: cx - d * 0.02, y: cy - d * 0.05, w: d * 0.045, h: d * 0.42, fill: { color: ACCENT }, line: { type: "none" } });
    s.addShape(pres.shapes.OVAL, { x: cx - d * 0.36, y: cy - d * 0.12, w: d * 0.36, h: d * 0.23, rotate: 332, fill: { color: ACCENT }, line: { type: "none" } });
    s.addShape(pres.shapes.OVAL, { x: cx, y: cy - d * 0.22, w: d * 0.36, h: d * 0.23, rotate: 28, fill: { color: ACCENT_LIGHT }, line: { type: "none" } });
  };

  // ── 1 · Title ─────────────────────────────────────────────────────────────
  {
    const s = dark();
    s.addShape(pres.shapes.OVAL, { x: 7.7, y: -1.6, w: 4.2, h: 4.2, fill: { color: ACCENT, transparency: 93 }, line: { type: "none" } });
    s.addShape(pres.shapes.OVAL, { x: -1.7, y: 3.6, w: 3.8, h: 3.8, fill: { color: ACCENT, transparency: 93 }, line: { type: "none" } });

    brandMark(s, 4.42, 0.78, 1.16);
    s.addText("PlantDex", { x: 0.5, y: 2.05, w: 9, h: 0.95, fontFace: FONT, fontSize: 54, bold: true, color: TEXT, align: "center", margin: 0 });
    s.addText("Gamified, hands-on learning for agriculture & biotech education", {
      x: 0.5, y: 3.0, w: 9, h: 0.45, fontFace: FONT, fontSize: 18, color: ACCENT, align: "center", margin: 0,
    });

    card(s, 2.7, 3.85, 4.6, 0.62, RAISED);
    s.addText("EIT Food  ·  Co-funded by the European Union", { x: 2.7, y: 3.85, w: 4.6, h: 0.62, fontFace: FONT, fontSize: 12.5, bold: true, color: SUB, align: "center", valign: "middle", margin: 0 });

    s.addText("Team Conexus  ·  EU Enables Athens  ·  12 June 2026", { x: 0.5, y: 4.95, w: 9, h: 0.4, fontFace: FONT, fontSize: 12, color: FAINT, align: "center", margin: 0 });

    s.addNotes(
      "SPEAKER 1 (~15 sec)\n" +
      "Good afternoon — we're Team Conexus, and our project is PlantDex.\n" +
      "For the EIT Food challenge on gamifying agricultural and biotech education, we built a working app that turns plant science into a game students actually want to play.\n" +
      "Let me start with the problem we set out to solve."
    );
  }

  // ── 2 · The Challenge ───────────────────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "THE CHALLENGE  ·  EIT FOOD");
    title(s, "Make ag & biotech education stick");

    card(s, 0.5, 1.45, 9, 1.5, SURFACE);
    s.addText('"How might we use game mechanics to make agricultural and biotechnology education more engaging, accessible, and effective?"', {
      x: 0.85, y: 1.45, w: 8.3, h: 1.5, fontFace: FONT, fontSize: 17, italic: true, color: TEXT, align: "center", valign: "middle", margin: 0,
    });

    const probs = [
      [I.book, GOLD_DIM, "It feels abstract", "Plant & soil science lives in textbooks — names to memorise, not things you see."],
      [I.mobile = I.phone, ACCENT_DIM, "Attention is elsewhere", "Students' habits live in apps with streaks and rewards. Lessons rarely compete."],
      [I.map, ACCENT_DIM, "Field learning is hard", "Hands-on outdoor learning is hard to organise, track and assess fairly."],
    ];
    const w = 2.95;
    [0.5, 3.525, 6.55].forEach((x, i) => {
      const p = probs[i];
      card(s, x, 3.2, w, 1.95);
      iconCircle(s, x + 0.25, 3.45, 0.6, p[0], p[1]);
      s.addText(p[2], { x: x + 0.25, y: 4.12, w: w - 0.5, h: 0.34, fontFace: FONT, fontSize: 14.5, bold: true, color: TEXT, margin: 0 });
      s.addText(p[3], { x: x + 0.25, y: 4.46, w: w - 0.45, h: 0.62, fontFace: FONT, fontSize: 11, color: SUB, margin: 0 });
    });

    s.addNotes(
      "SPEAKER 1 (~35 sec)\n" +
      "This was the EIT Food brief: how might we use game mechanics to make agricultural and biotech education more engaging, accessible and effective?\n" +
      "We saw three problems. First, the subject feels abstract — soil and plant science is names in a book, not things students notice in the world.\n" +
      "Second, attention lives in apps — TikTok, games — and lessons don't compete on that field.\n" +
      "Third, real hands-on field learning is hard to run and almost impossible to grade.\n" +
      "So we ran a structured ideation — and [Speaker 2] will show you what we built."
    );
  }

  // ── 3 · Our Idea ────────────────────────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "OUR IDEA");
    title(s, "Turn the real world into the classroom");

    card(s, 0.5, 1.45, 9, 1.0, RAISED);
    s.addText([
      { text: "PlantDex  ", options: { bold: true, color: ACCENT, fontSize: 16 } },
      { text: "lets students scan real plants, identify them with AI, collect every species they find, and learn the science behind them — earning points the whole way.", options: { color: TEXT, fontSize: 14 } },
    ], { x: 0.85, y: 1.45, w: 8.3, h: 1.0, fontFace: FONT, valign: "middle", margin: 0 });

    const steps = [
      [I.camera, ACCENT_DIM, "Snap", "Photograph any plant, anywhere."],
      [I.magic, GOLD_DIM, "Identify", "AI returns the species instantly."],
      [I.globe, "1A2738", "Learn", "Facts and a live world range map."],
      [null, ACCENT_DIM, "Collect", "It joins your growing Dex for points."],
    ];
    const w = 2.05, y = 2.85;
    const xs = [0.5, 2.95, 5.4, 7.85];
    steps.forEach((st, i) => {
      card(s, xs[i], y, w, 2.0);
      const cx = xs[i] + (w - 0.62) / 2;
      if (st[0]) iconCircle(s, cx, y + 0.25, 0.62, st[0], st[1]);
      else {
        s.addShape(pres.shapes.OVAL, { x: cx, y: y + 0.25, w: 0.62, h: 0.62, fill: { color: ACCENT_DIM }, line: { color: ACCENT_EDGE, width: 0.75 } });
        const gx = cx + 0.17, gy = y + 0.42, c = 0.115, g = 0.05;
        [[0, 0], [1, 0], [0, 1]].forEach(([a, b]) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: gx + a * (c + g), y: gy + b * (c + g), w: c, h: c, rectRadius: 0.03, fill: { color: ACCENT }, line: { type: "none" } }));
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: gx + c + g, y: gy + c + g, w: c, h: c, rectRadius: 0.03, fill: { color: ACCENT, transparency: 55 }, line: { type: "none" } });
      }
      s.addText(st[2], { x: xs[i] + 0.12, y: y + 1.0, w: w - 0.24, h: 0.36, fontFace: FONT, fontSize: 15, bold: true, color: TEXT, align: "center", margin: 0 });
      s.addText(st[3], { x: xs[i] + 0.15, y: y + 1.38, w: w - 0.3, h: 0.55, fontFace: FONT, fontSize: 10.5, color: SUB, align: "center", margin: 0 });
      if (i < 3) s.addText("→", { x: xs[i] + w - 0.02, y: y + 0.95, w: 0.5, h: 0.6, fontSize: 20, bold: true, color: ACCENT, align: "center", valign: "middle", margin: 0 });
    });

    s.addNotes(
      "SPEAKER 2 (~30 sec)\n" +
      "Our base idea is simple: turn the real world into the classroom.\n" +
      "A student points their phone at any plant. The app identifies the species with AI, shows the science and a world map of where it grows, and adds it to their personal collection — their 'Dex' — for points.\n" +
      "That's the core loop. But the real work was HOW we designed it — and for that we used a structured creativity method called SCAMPER."
    );
  }

  // ── 4 · SCAMPER method overview ─────────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "OUR METHOD");
    title(s, "We designed it with SCAMPER");
    s.addText("A structured creativity framework — we worked through every letter to reinvent how the subject is taught.", {
      x: 0.5, y: 1.28, w: 9, h: 0.4, fontFace: FONT, fontSize: 13.5, color: SUB, margin: 0,
    });

    const letters = [
      ["S", "Substitute", ACCENT], ["C", "Combine", GOLD], ["A", "Adapt", ACCENT],
      ["M", "Modify", GOLD], ["P", "Put to use", ACCENT], ["E", "Eliminate", "FB7185"], ["R", "Reverse", "60A5FA"],
    ];
    const d = 0.92, gap = 0.34;
    const totalW = letters.length * d + (letters.length - 1) * gap;
    const sx = (10 - totalW) / 2;
    letters.forEach(([L, word, col], i) => {
      const x = sx + i * (d + gap);
      letterBadge(s, x, 2.35, d, L, col, col === GOLD ? GOLD_DIM : col === ACCENT ? ACCENT_DIM : "1A2231");
      s.addText(word, { x: x - 0.25, y: 3.4, w: d + 0.5, h: 0.55, fontFace: FONT, fontSize: 11.5, bold: true, color: SUB, align: "center", margin: 0 });
    });

    card(s, 0.5, 4.35, 9, 0.8, RAISED);
    s.addText([
      { text: "The result:  ", options: { bold: true, color: ACCENT } },
      { text: "every feature in PlantDex traces back to a deliberate SCAMPER decision — not a guess.", options: { color: SUB } },
    ], { x: 0.8, y: 4.35, w: 8.4, h: 0.8, fontFace: FONT, fontSize: 13, valign: "middle", margin: 0 });

    s.addNotes(
      "SPEAKER 2 (~25 sec)\n" +
      "SCAMPER stands for Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, and Reverse.\n" +
      "We worked through each letter as a team to push past the obvious. Every feature you'll see came out of one of these prompts.\n" +
      "[Speaker 3] will walk you through what each one gave us."
    );
  }

  // ── 5 · SCAMPER part 1 (S, C, A) ────────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "IDEATION  ·  1 OF 2");
    title(s, "Substitute · Combine · Adapt");

    const rows = [
      ["S", "SUBSTITUTE", ACCENT, "Replace passive learning with active discovery.", "Textbooks → live plant scanning  ·  teacher marking → instant AI ID  ·  traditional exams → instant-feedback quizzes"],
      ["C", "COMBINE", GOLD, "Social-media engagement meets biology.", "Streaks, profiles & cosmetics fused with curriculum  ·  one app = field scanner + classroom tool + exam prep"],
      ["A", "ADAPT", ACCENT, "Borrow mechanics students already love.", "Kahoot-style live quizzes with a join PIN  ·  daily streaks  ·  a collectible species “Dex”  ·  rewards & achievements"],
    ];
    const cardH = 1.13, y0 = 1.45;
    rows.forEach((r, i) => {
      const y = y0 + i * (cardH + 0.11);
      card(s, 0.5, y, 9, cardH);
      letterBadge(s, 0.72, y + 0.2, 0.72, r[0], r[2], r[2] === GOLD ? GOLD_DIM : ACCENT_DIM);
      s.addText(`${r[0]} · ${r[1]}`, { x: 1.65, y: y + 0.13, w: 7.6, h: 0.26, fontFace: FONT, fontSize: 10.5, bold: true, color: r[2], charSpacing: 2, margin: 0 });
      s.addText(r[3], { x: 1.65, y: y + 0.37, w: 7.6, h: 0.3, fontFace: FONT, fontSize: 14, bold: true, color: TEXT, margin: 0 });
      s.addText(r[4], { x: 1.65, y: y + 0.71, w: 7.65, h: 0.38, fontFace: FONT, fontSize: 11, color: SUB, margin: 0 });
    });

    s.addNotes(
      "SPEAKER 3 (~35 sec)\n" +
      "Substitute: we replaced the passive parts of learning. Instead of memorising textbook photos, students scan real plants. Instead of waiting for a teacher to mark work, AI confirms it instantly. Instead of dry exams, quizzes give feedback the moment you answer.\n" +
      "Combine: this was our 'TikTok meets soil health' idea — we fused social-media engagement, streaks and profiles, directly onto biology content, and combined three tools into one app.\n" +
      "Adapt: we borrowed what already works — Kahoot's live quizzes, daily streaks, and collectible-game mechanics with rewards and achievements."
    );
  }

  // ── 6 · SCAMPER part 2 (M, P, E, R) ─────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "IDEATION  ·  2 OF 2");
    title(s, "Modify · Put to use · Eliminate · Reverse");

    const cells = [
      ["M", "MODIFY", GOLD, "Scale the replay value.", "Randomised mock exams  ·  achievement tiers & a points economy  ·  more topics, expandable by teachers"],
      ["P", "PUT TO ANOTHER USE", ACCENT, "Useful far beyond one classroom.", "Farmers identifying crops & weeds  ·  schools teaching in practice  ·  anyone curious about a plant"],
      ["E", "ELIMINATE", "FB7185", "Remove the friction.", "No-account guest mode  ·  no technical jargon, one-tap actions  ·  no field-trip logistics or paper grading"],
      ["R", "REVERSE", "60A5FA", "Flip the classroom.", "Explore outside first, theory second  ·  teacher becomes a mission-designer  ·  assessment = gathering evidence"],
    ];
    const w = 4.45, h = 1.62;
    const pos = [[0.5, 1.45], [5.05, 1.45], [0.5, 3.25], [5.05, 3.25]];
    cells.forEach((c, i) => {
      const [x, y] = pos[i];
      card(s, x, y, w, h);
      const badgeFill = c[2] === GOLD ? GOLD_DIM : c[2] === ACCENT ? ACCENT_DIM : "1A2231";
      letterBadge(s, x + 0.22, y + 0.22, 0.6, c[0], c[2], badgeFill);
      s.addText(`${c[0]} · ${c[1]}`, { x: x + 0.98, y: y + 0.2, w: w - 1.15, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: c[2], charSpacing: 1.5, margin: 0 });
      s.addText(c[3], { x: x + 0.98, y: y + 0.43, w: w - 1.15, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: TEXT, margin: 0 });
      s.addText(c[4], { x: x + 0.98, y: y + 0.76, w: w - 1.2, h: 0.74, fontFace: FONT, fontSize: 10.5, color: SUB, margin: 0 });
    });

    s.addNotes(
      "SPEAKER 3 (~35 sec)\n" +
      "Modify: we magnified replay value — mock exams pull random questions, there are achievement tiers and a points economy, and teachers can add their own content.\n" +
      "Put to another use: this isn't only for students. Farmers can identify crops and weeds, schools can teach in practice, and anyone curious about a plant can use it.\n" +
      "Eliminate: we stripped out friction — a no-account guest mode, no jargon, and none of the cost or logistics of physical field trips.\n" +
      "Reverse: we flipped the classroom — students explore the field first and learn theory second, and the teacher becomes a mission-designer rather than a lecturer.\n" +
      ">>> NOW PLAY THE 30-40 SECOND DEMO VIDEO. <<<  Then hand to [Speaker 4]."
    );
  }

  // ── 7 · What we built ───────────────────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "FROM IDEAS TO A WORKING APP");
    title(s, "Not a concept — a working product");

    // Phone mockup
    card(s, 0.7, 1.4, 2.7, 3.75, SURFACE);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 1.5, w: 0.2, h: 0.2, rectRadius: 0.06, fill: { color: ACCENT }, line: { type: "none" } });
    s.addText("PlantDex", { x: 1.23, y: 1.47, w: 1.6, h: 0.26, fontFace: FONT, fontSize: 11, bold: true, color: TEXT, margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 1.85, w: 2.2, h: 1.5, rectRadius: 0.1, fill: { color: "1F2B22" }, line: { color: LINE, width: 1 } });
    sprout(s, 2.05, 2.58, 1.0);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.48, y: 1.97, w: 0.56, h: 0.27, rectRadius: 0.13, fill: { color: "0A140D" }, line: { color: ACCENT_EDGE, width: 0.75 } });
    s.addText("96%", { x: 2.48, y: 1.97, w: 0.56, h: 0.27, fontFace: FONT, fontSize: 9, bold: true, color: ACCENT, align: "center", valign: "middle", margin: 0 });
    s.addText("English Oak", { x: 0.95, y: 3.5, w: 2.2, h: 0.3, fontFace: FONT, fontSize: 14, bold: true, color: TEXT, align: "center", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.35, y: 3.85, w: 1.4, h: 0.38, rectRadius: 0.19, fill: { color: ACCENT_DIM }, line: { color: ACCENT_EDGE, width: 1 } });
    s.addText("NEW · +100", { x: 1.35, y: 3.85, w: 1.4, h: 0.38, fontFace: FONT, fontSize: 10, bold: true, color: ACCENT, align: "center", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 4.55, w: 2.1, h: 0.4, rectRadius: 0.2, fill: { color: RAISED }, line: { color: LINE, width: 1 } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.08, y: 4.62, w: 0.46, h: 0.26, rectRadius: 0.13, fill: { color: ACCENT_DIM }, line: { color: ACCENT_EDGE, width: 0.75 } });
    [1.72, 2.05, 2.38, 2.71].forEach((x) => s.addShape(pres.shapes.OVAL, { x, y: 4.715, w: 0.07, h: 0.07, fill: { color: FAINT }, line: { type: "none" } }));

    const feats = [
      [I.camera, ACCENT_DIM, "AI field scanner", "Live species ID with a confidence score and world range map."],
      [I.target, ACCENT_DIM, "Teacher-led missions", "Set a target plant; students submit photo evidence, graded automatically."],
      [I.bolt, GOLD_DIM, "Streaks & achievements", "Daily streak flame, a points economy and unlockable profile rewards."],
      [I.grad, ACCENT_DIM, "Leaving Cert prep", "Syllabus revision plus theory-test-style quizzes that pass at 80%."],
    ];
    feats.forEach((f, i) => {
      const y = 1.5 + i * 0.92;
      iconCircle(s, 3.85, y, 0.56, f[0], f[1]);
      s.addText(f[2], { x: 4.6, y: y - 0.02, w: 5.0, h: 0.34, fontFace: FONT, fontSize: 14.5, bold: true, color: TEXT, margin: 0 });
      s.addText(f[3], { x: 4.6, y: y + 0.32, w: 5.05, h: 0.5, fontFace: FONT, fontSize: 11, color: SUB, margin: 0 });
    });

    s.addNotes(
      "SPEAKER 4 (~25 sec) — after the video.\n" +
      "And that's not a mock-up — it's a working app you just saw running.\n" +
      "The four pillars from our ideation are all live: an AI field scanner, teacher-led missions with automatic grading, streaks and achievements that keep students coming back, and built-in Leaving Cert exam prep.\n" +
      "Every one of these came from a SCAMPER prompt."
    );
  }

  // ── 8 · Who it's for ────────────────────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "PUT TO ANOTHER USE  ·  IMPACT");
    title(s, "One app, many learners");

    const aud = [
      [I.student, ACCENT_DIM, "Students", "Discover, collect and revise — learning by doing in the real world."],
      [I.teacher, GOLD_DIM, "Teachers", "Run and grade field lessons from a dashboard, with zero logistics."],
      [I.tractor, "1A2738", "Farmers", "Identify crops, weeds and disease in the field — practical, on demand."],
      [I.putuse, "271A38", "Communities", "Anyone curious about a plant can learn — schools, clubs, training."],
    ];
    const w = 2.18, gap = 0.12;
    aud.forEach((a, i) => {
      const x = 0.5 + i * (w + gap);
      card(s, x, 1.5, w, 2.55);
      iconCircle(s, x + (w - 0.66) / 2, 1.78, 0.66, a[0], a[1]);
      s.addText(a[2], { x: x + 0.1, y: 2.62, w: w - 0.2, h: 0.36, fontFace: FONT, fontSize: 15, bold: true, color: TEXT, align: "center", margin: 0 });
      s.addText(a[3], { x: x + 0.18, y: 3.02, w: w - 0.36, h: 0.95, fontFace: FONT, fontSize: 10.5, color: SUB, align: "center", margin: 0 });
    });

    card(s, 0.5, 4.3, 9, 0.85, RAISED);
    s.addText([
      { text: "Aligned with EIT Food's mission:  ", options: { bold: true, color: ACCENT } },
      { text: "a more food-literate, sustainability-aware generation — starting in the schoolyard.", options: { color: SUB } },
    ], { x: 0.8, y: 4.3, w: 8.4, h: 0.85, fontFace: FONT, fontSize: 13, valign: "middle", margin: 0 });

    s.addNotes(
      "SPEAKER 4 (~25 sec)\n" +
      "When we asked 'who else could use this?', the answer was: almost anyone.\n" +
      "Students learn by doing. Teachers run and grade field lessons with no logistics. Farmers identify crops and weeds on demand. And local communities — clubs, training programmes — get a free way to build plant knowledge.\n" +
      "That directly serves EIT Food's mission: a more food-literate, sustainability-aware generation."
    );
  }

  // ── 9 · Close ───────────────────────────────────────────────────────────────
  {
    const s = dark();
    kicker(s, "BACK TO THE CHALLENGE");
    title(s, "Engaging. Accessible. Effective.");

    const cols = [
      [I.bolt, GOLD_DIM, "Engaging", "Streaks, collection and rewards turn study into a daily habit."],
      [I.door, ACCENT_DIM, "Accessible", "Free, no-account guest mode, no jargon — works on any phone."],
      [I.check, ACCENT_DIM, "Effective", "Real AI, real syllabus prep, teacher-graded evidence."],
    ];
    const w = 2.95;
    [0.5, 3.525, 6.55].forEach((x, i) => {
      const c = cols[i];
      card(s, x, 1.55, w, 2.3);
      iconCircle(s, x + (w - 0.7) / 2, 1.82, 0.7, c[0], c[1]);
      s.addText(c[2], { x, y: 2.65, w, h: 0.4, fontFace: FONT, fontSize: 18, bold: true, color: ACCENT, align: "center", margin: 0 });
      s.addText(c[3], { x: x + 0.25, y: 3.1, w: w - 0.5, h: 0.65, fontFace: FONT, fontSize: 11.5, color: SUB, align: "center", margin: 0 });
    });

    s.addText("PlantDex turns every schoolyard into a living biology lab.", {
      x: 0.5, y: 4.25, w: 9, h: 0.45, fontFace: FONT, fontSize: 16, bold: true, color: TEXT, align: "center", margin: 0,
    });
    s.addText("Next step: school pilots with the EIT Food network.   Thank you — Team Conexus.", {
      x: 0.5, y: 4.78, w: 9, h: 0.4, fontFace: FONT, fontSize: 12.5, color: FAINT, align: "center", margin: 0,
    });

    s.addNotes(
      "SPEAKER 4 (~25 sec)\n" +
      "So, back to the challenge's three words.\n" +
      "Engaging: streaks, collection and rewards make studying a daily habit. Accessible: it's free, needs no account, and runs on any phone. Effective: real AI, real Leaving Cert prep, and teacher-graded field evidence.\n" +
      "PlantDex turns every schoolyard into a living biology lab. Our next step is school pilots with the EIT Food network.\n" +
      "We're Team Conexus — thank you."
    );
  }

  await pres.writeFile({ fileName: process.argv[2] || "PlantDex-pitch.pptx" });
  console.log("written");
}

main().catch((e) => { console.error(e); process.exit(1); });
