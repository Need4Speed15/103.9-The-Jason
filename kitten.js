(() => {
  const width = 128;
  const height = 104;
  const rail = document.createElement('div');
  rail.className = 'kitten-rail';

  const canvas = document.createElement('canvas');
  canvas.className = 'kitten-character';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'kitten-toggle';
  toggle.setAttribute('aria-label', 'Pause kitten animation');
  toggle.setAttribute('aria-pressed', 'false');
  toggle.title = 'Pause kitten animation';
  toggle.innerHTML = '<span aria-hidden="true"></span>';
  rail.append(canvas, toggle);
  document.body.append(rail);
  document.body.classList.add('has-kitten');

  const ink = '#66362e';
  const ginger = '#ec9458';
  const gold = '#ffbd7c';
  const stripe = '#c76c45';
  const cream = '#fff0d6';
  const pink = '#f59493';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  function shape(trace, fill, stroke = ink, line = 2) {
    ctx.beginPath();
    trace();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = line;
      ctx.stroke();
    }
  }

  function oval(x, y, rx, ry, fill, stroke = null, tilt = 0) {
    shape(() => ctx.ellipse(x, y, rx, ry, tilt, 0, Math.PI * 2), fill, stroke);
  }

  function curve(draw, color, line) {
    shape(draw, null, color, line);
  }

  function paw(x, y, tilt = 0) {
    oval(x, y, 7.6, 4.9, cream, ink, tilt);
    curve(() => {
      ctx.moveTo(x + 1.5, y + 2);
      ctx.lineTo(x + 2, y + 4);
      ctx.moveTo(x + 4.5, y + 1.3);
      ctx.lineTo(x + 5.1, y + 3);
    }, '#cc8d74', .8);
  }

  function limb(rootX, rootY, endX, endY, bend, fur, tilt = 0) {
    const trace = () => {
      ctx.moveTo(rootX, rootY);
      ctx.quadraticCurveTo((rootX + endX) / 2 + bend, (rootY + endY) / 2, endX, endY);
    };
    curve(trace, ink, 11.5);
    curve(trace, fur, 8);
    paw(endX + 1, endY, tilt);
  }

  function tail(x, y, sway, front) {
    const tipX = x - (front ? 31 : 30);
    const tipY = y - 28 + sway * 5;
    const trace = () => {
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - 28, y + 8, tipX - 15, tipY + 9, tipX, tipY);
    };
    curve(trace, ink, 11.8);
    curve(trace, ginger, 8.3);
    curve(() => {
      ctx.moveTo(tipX - 6, tipY + 4);
      ctx.quadraticCurveTo(tipX - 3, tipY + 1.4, tipX, tipY);
    }, cream, 7.2);
  }

  function ear(side) {
    ctx.save();
    ctx.scale(side, 1);
    shape(() => {
      ctx.moveTo(9, -12);
      ctx.quadraticCurveTo(17, -24, 26, -26);
      ctx.quadraticCurveTo(29, -21, 25, -7);
      ctx.closePath();
    }, gold);
    shape(() => {
      ctx.moveTo(15, -13);
      ctx.quadraticCurveTo(20, -21, 24, -22);
      ctx.quadraticCurveTo(25, -19, 22, -12);
      ctx.closePath();
    }, pink, null);
    ctx.restore();
  }

  function face(x, y, angle, eyesClosed, profile) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ear(-1);
    ear(1);

    shape(() => {
      ctx.moveTo(0, -18);
      ctx.bezierCurveTo(17, -20, 27, -5, 26, 6);
      ctx.bezierCurveTo(26, 17, 14, 24, 0, 24);
      ctx.bezierCurveTo(-14, 24, -26, 17, -26, 6);
      ctx.bezierCurveTo(-27, -5, -17, -20, 0, -18);
      ctx.closePath();
    }, gold);

    curve(() => {
      for (const x of [-7, 0, 7]) {
        ctx.moveTo(x, -16.4);
        ctx.quadraticCurveTo(x * .82, -12, x * .55, -9 - Math.abs(x) * .23);
      }
    }, '#d97b4e', 2.4);
    oval(-18, 10, 4.8, 2.7, '#ef987e', null, .16);
    oval(18, 10, 4.8, 2.7, '#ef987e', null, -.16);
    oval(-6 + profile, 13, 8.5, 6.1, cream, null, .16);
    oval(6 + profile, 13, 8.5, 6.1, cream, null, -.16);

    for (const side of [-1, 1]) {
      const eyeX = 10.8 * side + profile * .7;
      if (eyesClosed) {
        curve(() => {
          ctx.moveTo(eyeX - 4, 4);
          ctx.quadraticCurveTo(eyeX, -.2, eyeX + 4, 4);
        }, ink, 2);
      } else {
        oval(eyeX, 2.4, 5.4, 7, '#55302c', null, side * -.06);
        oval(eyeX, 5.5, 3.7, 2.6, '#9c5e39');
        oval(eyeX - 1.6, -.2, 1.85, 2, '#fff9ed');
        oval(eyeX + 1.7, 3.8, .8, .9, '#fff0d6');
      }
    }

    ctx.save();
    ctx.translate(profile, 0);
    shape(() => {
      ctx.moveTo(-3.1, 10.5);
      ctx.quadraticCurveTo(0, 8.4, 3.1, 10.5);
      ctx.quadraticCurveTo(2.3, 13.2, 0, 13.9);
      ctx.quadraticCurveTo(-2.3, 13.2, -3.1, 10.5);
    }, '#a85253', null);
    curve(() => {
      ctx.moveTo(0, 14);
      ctx.lineTo(0, 15.4);
      ctx.quadraticCurveTo(-3, 19, -6, 15.8);
      ctx.moveTo(0, 15.4);
      ctx.quadraticCurveTo(3, 19, 6, 15.8);
    }, ink, 1.15);
    ctx.restore();

    for (const side of [-1, 1]) {
      curve(() => {
        ctx.moveTo(side * 17, 11);
        ctx.quadraticCurveTo(side * 24, 9, side * 31, 11);
        ctx.moveTo(side * 17, 14.2);
        ctx.quadraticCurveTo(side * 24, 13.5, side * 30, 16.5);
      }, '#864e3b', 1);
    }
    ctx.restore();
  }

  function walk(time) {
    const cycle = time * 12;
    const bob = Math.cos(cycle * 2) * 1.15;
    const step = (x, y, phase, fur) => {
      const stride = Math.sin(cycle + phase);
      const lift = Math.max(0, Math.cos(cycle + phase));
      limb(x, y + bob, x + stride * 8, 94 - lift * 5, -stride * 2, fur, stride * .16);
    };

    tail(43, 67 + bob, Math.sin(cycle * .5), false);
    step(51, 73, 1.3, '#c87348');
    step(79, 74, 4.1, '#c87348');
    oval(60, 71 + bob, 28, 18, ginger, ink, -.08);
    oval(67, 78 + bob, 20, 9, '#ffc18b');
    curve(() => {
      ctx.moveTo(43, 58 + bob);
      ctx.quadraticCurveTo(49, 63 + bob, 48, 67 + bob);
      ctx.moveTo(52, 55 + bob);
      ctx.quadraticCurveTo(57, 60 + bob, 56, 64 + bob);
    }, stripe, 2.6);
    step(44, 77, 4.4, ginger);
    step(77, 78, 1.1, gold);
    face(86, 47 + bob, Math.sin(cycle) * .022 - .04, time % 3.8 > 3.66, 2.1);
  }

  function front(time, dancing) {
    const beat = dancing ? time * Math.PI * 2 / 1.12 : 0;
    const sway = dancing ? Math.sin(beat) : 0;
    const bounce = dancing ? Math.abs(Math.cos(beat)) * 2.5 : 0;
    const center = 66 + sway * 5;
    const bodyY = 72 - bounce;

    tail(center - 14, bodyY + 7, Math.sin(beat), true);
    for (const side of [-1, 1]) {
      const weight = dancing ? Math.max(0, side * Math.sin(beat)) : 0;
      const footX = 66 + side * (14 + 4.5 * weight);
      limb(center + side * 10, bodyY + 14, footX, 94 - 5 * weight, side * 1.5, ginger, side * .13);
    }
    oval(center, bodyY, 21, 23, ginger, ink, sway * .16);
    oval(center, bodyY + 4, 12, 15, cream, null, sway * .1);
    for (const side of [-1, 1]) {
      const swing = dancing ? side * Math.sin(beat) : 0;
      limb(center + side * 15, bodyY - 4, center + side * (19 + 4 * swing), bodyY + 12 - swing * 7,
        side * 2, gold, side * .26 * swing);
    }
    face(center, bodyY - 26, dancing ? sway * .085 : -.06, dancing && time % 4.1 > 3.96, 0);
  }

  function draw(time, pose) {
    ctx.clearRect(0, 0, width, height);
    oval(64, 99, 43, 3.5, '#0209126e');
    ctx.save();
    if (pose === 'walk') {
      if (direction === -1) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      walk(time);
    } else {
      front(time, pose === 'dance');
    }
    ctx.restore();
  }

  let distance = 0;
  let limit = 0;
  let direction = 1;
  let phase = 0;
  let frame = 0;
  let previousTime = null;
  let userPaused = false;
  let lastClearanceCheck = 0;

  function position() {
    canvas.style.transform = 'translateX(' + distance + 'px)';
  }

  function checkClearance() {
    const bounds = canvas.getBoundingClientRect();
    const controls = 'a, button, input, textarea, select, label';
    const overlapsControl = [.32, .65, .84].some((offset) => {
      const target = document.elementFromPoint(bounds.left + bounds.width * offset, bounds.top + bounds.height * .67);
      return target?.closest(controls);
    });
    canvas.classList.toggle('kitten-over-control', overlapsControl);
  }

  function measure() {
    const backingScale = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(width * backingScale);
    canvas.height = Math.round(height * backingScale);
    ctx.setTransform(backingScale, 0, 0, backingScale, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    limit = Math.max(0, rail.clientWidth - canvas.offsetLeft - canvas.offsetWidth);
    distance = Math.min(distance, limit);
    position();
    draw(phase, rail.dataset.pose);
    checkClearance();
  }

  function animate(timestamp) {
    const delta = previousTime === null ? 0 : Math.min((timestamp - previousTime) / 1000, .05);
    previousTime = timestamp;
    phase += delta;
    if (rail.dataset.pose === 'walk') {
      distance += direction * 61 * delta;
      if (distance >= limit || distance <= 0) {
        distance = Math.min(limit, Math.max(distance, 0));
        direction = distance === 0 ? 1 : -1;
      }
      position();
    }
    draw(phase, rail.dataset.pose);
    if (timestamp - lastClearanceCheck > 120) {
      checkClearance();
      lastClearanceCheck = timestamp;
    }
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    const paused = userPaused || motion.matches;
    const pose = paused ? 'rest' : document.body.hasAttribute('data-playing') ? 'dance' : 'walk';
    if (rail.dataset.pose !== pose) {
      rail.dataset.pose = pose;
      phase = 0;
    }
    toggle.hidden = motion.matches;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.title = userPaused ? 'Resume kitten animation' : 'Pause kitten animation';
    if (paused || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = null;
      draw(0, pose);
    } else if (!frame) {
      frame = requestAnimationFrame(animate);
    }
  }

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    sync();
  });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['data-playing'] });
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('scroll', checkClearance, { passive: true });
  window.addEventListener('resize', measure);
  sync();
  measure();
})();
