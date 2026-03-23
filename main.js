const CHARS_DARK = ' .`,:;-~=+<>i!lI?/|)(1}{][rcvzXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
const CHARS_LIGHT = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`. ';

let rotX = 0, rotY = 0;
let isDragging = false;
let lastMX = 0, lastMY = 0;
let animId = null;
let currentColor = '#00ff41';
let cols = 72, rows = 36;

const scene = document.getElementById('scene');
const asciiEl = document.getElementById('ascii');
const vid = document.getElementById('vid');
const cnv = document.getElementById('cnv');
const ctx = cnv.getContext('2d');

/* ---------------- 3D ROTATION ---------------- */

function applyTransform() {
  asciiEl.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function resetRotation() {
  rotX = 0;
  rotY = 0;
  applyTransform();
}

/* Mouse */
scene.addEventListener('mousedown', e => {
  isDragging = true;
  lastMX = e.clientX;
  lastMY = e.clientY;
  scene.style.cursor = 'grabbing';
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;

  rotY += (e.clientX - lastMX) * 0.4;
  rotX -= (e.clientY - lastMY) * 0.4;

  rotX = Math.max(-70, Math.min(70, rotX));
  rotY = Math.max(-80, Math.min(80, rotY));

  lastMX = e.clientX;
  lastMY = e.clientY;

  applyTransform();
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  scene.style.cursor = 'grab';
});

/* Touch */
scene.addEventListener('touchstart', e => {
  isDragging = true;
  lastMX = e.touches[0].clientX;
  lastMY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

scene.addEventListener('touchmove', e => {
  if (!isDragging) return;

  rotY += (e.touches[0].clientX - lastMX) * 0.4;
  rotX -= (e.touches[0].clientY - lastMY) * 0.4;

  rotX = Math.max(-70, Math.min(70, rotX));

  lastMX = e.touches[0].clientX;
  lastMY = e.touches[0].clientY;

  applyTransform();
  e.preventDefault();
}, { passive: false });

scene.addEventListener('touchend', () => {
  isDragging = false;
});

/* ---------------- CONTROLS ---------------- */

document.getElementById('density').addEventListener('input', function () {
  cols = parseInt(this.value);
  rows = Math.round(cols * 0.45);
  document.getElementById('densVal').textContent = cols;
});

function setColor(color, btn) {
  currentColor = color;
  asciiEl.style.color = color;

  document.querySelectorAll('.clr-btn').forEach(b => {
    b.classList.remove('active');
  });

  btn.classList.add('active');
}

/* ---------------- ASCII LOGIC ---------------- */

function pixelToChar(brightness) {
  const invert = document.getElementById('invertChk').checked;
  const chars = invert ? CHARS_LIGHT : CHARS_DARK;

  const index = Math.floor(brightness * (chars.length - 1));
  return chars[index];
}

/* ---------------- CAMERA ---------------- */

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    });

    vid.srcObject = stream;
    await vid.play();

    document.getElementById('startScreen').style.display = 'none';
    asciiEl.style.display = 'block';
    document.getElementById('controls').style.display = 'flex';

    startRender();

  } catch (err) {
    const startScreen = document.getElementById('startScreen');
    startScreen.innerHTML = `
      <div class="error">
        camera access denied<br>
        <span>please allow camera permission and reload</span>
      </div>
    `;
  }
}

/* ---------------- RENDER LOOP ---------------- */

function startRender() {
  function frame() {
    if (vid.readyState < 2) {
      animId = requestAnimationFrame(frame);
      return;
    }

    cnv.width = cols;
    cnv.height = rows;

    ctx.save();

    // mirror image
    ctx.translate(cols, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(vid, 0, 0, cols, rows);

    ctx.restore();

    const data = ctx.getImageData(0, 0, cols, rows).data;

    let output = '';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

        output += pixelToChar(brightness);
      }
      output += '\n';
    }

    asciiEl.textContent = output;

    animId = requestAnimationFrame(frame);
  }

  animId = requestAnimationFrame(frame);
}