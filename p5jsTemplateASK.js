// Copyright (c) 2026 >> Andrew S Klug // ASK
// Licensed under the Apache License, Version 2.0

// =====================================================
// ASK p5.js template
// - safe ASK naming
// - full-window viewing mode or fixed output mode
// - square 2160 or 4K widescreen output
// - resize handling
// - click / drag interaction hooks
// - normalized helper utilities
// =====================================================

// =====================================================
// TOP-OF-FILE MODE SETTINGS
// =====================================================

// false = viewing mode >> use current browser window size
// true  = output mode  >> use fixed export dimensions
let outputASK = false;

// choose fixed output aspect when outputASK = true
// options: "square" or "widescreen"
let aspectModeASK = "widescreen";

const renderPresetsASK = {
  square: [2160, 2160],
  widescreen: [3840, 2160]
};

// =====================================================
// GLOBALS
// =====================================================

let colorBackgroundASK, color1ASK, color2ASK, color3ASK, color4ASK;
let sizeASK;
let weightASK = 0.0005;
let colorsASK = [];
let opacASK = 1;

let timeASK = 0;

let canvasWidthASK = 0;
let canvasHeightASK = 0;

// interaction state
let mousePressedASK = false;
let dragStartASK = null;
let dragCurrentASK = null;
let dragLengthASK = 0;
let dragVectorASK = { x: 0, y: 0 };

// optional containers
let layersASK = [];
let nodesASK = [];

// global view controls
let zoomASK = 1.0;
let centerXASK = 0.5;
let centerYASK = 0.5;

// =====================================================
// SETUP
// =====================================================

function setup() {
  updateCanvasSizeASK();
  createCanvas(canvasWidthASK, canvasHeightASK);

  pixelDensity(1);
  noFill();
  smooth();

  sizeASK = min(canvasWidthASK, canvasHeightASK);

  initColorsASK();
  renderColorsASK();
  setupASK();
}

// put sketch-specific setup here
function setupASK() {
  // example:
  // zoomASK = 1.25;
}

// =====================================================
// DRAW
// =====================================================

function draw() {
  background(colorBackgroundASK);

  pushASKView();

  // ---------------------------------
  // sketch-specific drawing goes here
  // ---------------------------------
  drawASK();

  // optional overlay / interaction preview
  drawASKOverlay();

  pop();

  timeASK += 0.02;
}

// put sketch-specific drawing here
function drawASK() {
  // example starter drawing
  strokeWeight(weightASK);
  stroke(red(color1ASK), green(color1ASK), blue(color1ASK), 255 * opacASK);

  let rowsASK = 120;
  let colsASK = 120;

  for (let jASK = 0; jASK < rowsASK; jASK++) {
    let vASK = map(jASK, 0, rowsASK - 1, -1, 1);

    beginShape();
    for (let iASK = 0; iASK < colsASK; iASK++) {
      let uASK = map(iASK, 0, colsASK - 1, -1, 1);

      let waveASK =
        0.18 * sin(uASK * 6.0 + timeASK) +
        0.08 * cos(vASK * 8.0 - timeASK * 1.2);

      let xASK = uASK * 0.35;
      let yASK = vASK * 0.35 + waveASK * 0.08;

      curveVertex(xASK, yASK);
    }
    endShape();
  }
}

function drawASKOverlay() {
  if (mousePressedASK && dragStartASK && dragCurrentASK) {
    stroke(red(color4ASK), green(color4ASK), blue(color4ASK), 180);
    strokeWeight(weightASK * 3.0);
    line(dragStartASK.x, dragStartASK.y, dragCurrentASK.x, dragCurrentASK.y);
  }
}

// =====================================================
// VIEW / NORMALIZED SPACE
// =====================================================

function pushASKView() {
  push();
  scale(canvasWidthASK, canvasHeightASK);
  translate(centerXASK, centerYASK);
  scale(zoomASK);
}

function screenToASK(pxASK, pyASK) {
  let nxASK = pxASK / canvasWidthASK;
  let nyASK = pyASK / canvasHeightASK;

  return {
    x: (nxASK - centerXASK) / zoomASK,
    y: (nyASK - centerYASK) / zoomASK
  };
}

function askToScreen(xASK, yASK) {
  return {
    x: (xASK * zoomASK + centerXASK) * canvasWidthASK,
    y: (yASK * zoomASK + centerYASK) * canvasHeightASK
  };
}

// =====================================================
// CANVAS SIZE HELPERS
// =====================================================

function updateCanvasSizeASK() {
  if (outputASK) {
    let presetASK = renderPresetsASK[aspectModeASK] || renderPresetsASK.widescreen;
    canvasWidthASK = presetASK[0];
    canvasHeightASK = presetASK[1];
  } else {
    canvasWidthASK = windowWidth;
    canvasHeightASK = windowHeight;
  }
}

function applyCanvasSizeASK() {
  updateCanvasSizeASK();
  resizeCanvas(canvasWidthASK, canvasHeightASK);
  sizeASK = min(canvasWidthASK, canvasHeightASK);
}

// =====================================================
// COLOR SYSTEM
// =====================================================

function initColorsASK() {
  colorsASK = [
    color(255, 255, 255),   // white
    color(139, 121, 162),   // smokey lavender 1
    color(164, 146, 200),   // warm lavender 2
    color(226, 211, 240),   // warm lavender 5
    color(139, 121, 162),   // smokey lavender 1
    color(132, 80, 155),    // smokey plum 1
    color(114, 85, 131),    // smokey plum 2
    color(190, 63, 246),    // violet 1
    color(193, 154, 216),   // warm lavender 1
    color(164, 146, 200),   // warm lavender 2
    color(174, 135, 194)    // warm lavender 4
  ];
}

function renderColorsASK() {
  colorBackgroundASK = random(colorsASK);
  color1ASK = random(colorsASK);
  color2ASK = random(colorsASK);
  color3ASK = random(colorsASK);
  color4ASK = random(colorsASK);

  let attemptsASK = 0;
  while (
    attemptsASK < 20 &&
    sameColorASK(colorBackgroundASK, color1ASK) &&
    sameColorASK(colorBackgroundASK, color2ASK) &&
    sameColorASK(colorBackgroundASK, color3ASK) &&
    sameColorASK(colorBackgroundASK, color4ASK)
  ) {
    color1ASK = random(colorsASK);
    color2ASK = random(colorsASK);
    color3ASK = random(colorsASK);
    color4ASK = random(colorsASK);
    attemptsASK++;
  }
}

function sameColorASK(colorAASK, colorBASK) {
  return (
    red(colorAASK) === red(colorBASK) &&
    green(colorAASK) === green(colorBASK) &&
    blue(colorAASK) === blue(colorBASK)
  );
}

// =====================================================
// INTERACTION
// =====================================================

function mousePressed() {
  mousePressedASK = true;
  dragStartASK = screenToASK(mouseX, mouseY);
  dragCurrentASK = screenToASK(mouseX, mouseY);
  dragLengthASK = 0;
  dragVectorASK = { x: 0, y: 0 };

  mousePressedASKHook();
}

function mouseDragged() {
  if (!mousePressedASK || !dragStartASK) return;

  dragCurrentASK = screenToASK(mouseX, mouseY);
  dragVectorASK = {
    x: dragCurrentASK.x - dragStartASK.x,
    y: dragCurrentASK.y - dragStartASK.y
  };

  dragLengthASK = dist(
    dragStartASK.x,
    dragStartASK.y,
    dragCurrentASK.x,
    dragCurrentASK.y
  );

  mouseDraggedASKHook();
}

function mouseReleased() {
  let wasClickASK = dragLengthASK < 0.015;

  mouseReleasedASKHook(wasClickASK);

  if (wasClickASK) {
    clickASK();
  }

  mousePressedASK = false;
  dragStartASK = null;
  dragCurrentASK = null;
  dragLengthASK = 0;
  dragVectorASK = { x: 0, y: 0 };
}

// default click behavior
function clickASK() {
  renderColorsASK();
}

// sketch-specific interaction hooks
function mousePressedASKHook() {}
function mouseDraggedASKHook() {}
function mouseReleasedASKHook(wasClickASK) {}

// =====================================================
// KEYBOARD
// =====================================================

function keyPressed() {
  if (key === "r" || key === "R") {
    renderColorsASK();
  }

  if (key === "c" || key === "C") {
    clearASK();
  }

  keyPressedASKHook();
}

function keyPressedASKHook() {}

function clearASK() {
  layersASK = [];
  nodesASK = [];
}

// =====================================================
// RESIZE
// =====================================================

function windowResized() {
  if (!outputASK) {
    applyCanvasSizeASK();
  }
  windowResizedASKHook();
}

function windowResizedASKHook() {}

// =====================================================
// OPTIONAL HELPERS
// =====================================================

function randomColorASK() {
  return random(colorsASK);
}

function colorLerpASK(colorAASK, colorBASK, amtASK, alphaASK = 255) {
  let mixedASK = lerpColor(colorAASK, colorBASK, amtASK);
  return color(
    red(mixedASK),
    green(mixedASK),
    blue(mixedASK),
    alphaASK
  );
}

function normalizedDirectionASK(xASK, yASK) {
  let magnitudeASK = sqrt(xASK * xASK + yASK * yASK);
  if (magnitudeASK === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: xASK / magnitudeASK,
    y: yASK / magnitudeASK
  };
}

function signedDistanceToLineASK(pointASK, originASK, directionASK) {
  return (
    -(pointASK.x - originASK.x) * directionASK.y +
    (pointASK.y - originASK.y) * directionASK.x
  );
}

function projectValueASK(valueASK, minInASK, maxInASK, minOutASK, maxOutASK) {
  return map(valueASK, minInASK, maxInASK, minOutASK, maxOutASK);
}
