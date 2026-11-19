/**
 * DOM wiring for Apple-grade interactive Checkout Sheet / Dialog.
 * Uses spring maths from src/lib/spring.js.
 */
import { rubberband, project, releaseVelocity, evaluateSpring } from "./spring.js";

export function initCheckoutSheet({
  modalEl,
  backdropEl,
  panelEl,
  dragHandleEl,
  closeBtnEl,
  onOpen,
  onClose,
}) {
  let isOpen = false;
  let isDragging = false;
  let startY = 0;
  let startX = 0;
  let currentY = 0;
  let sheetHeight = 0;
  let isIntentDetermined = false;
  let isVerticalDrag = false;
  let samples = [];
  let animId = null;
  let activeTrigger = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isMobile() {
    return window.innerWidth < 640;
  }

  function setScrim(progress) {
    if (!backdropEl) return;
    const clamped = Math.max(0, Math.min(1, progress));
    backdropEl.style.opacity = clamped.toString();
  }

  function setPanelTranslateY(y) {
    currentY = y;
    if (panelEl) {
      panelEl.style.transform = `translateY(${y}px)`;
    }
    if (sheetHeight > 0) {
      const openRatio = Math.max(0, 1 - y / sheetHeight);
      setScrim(openRatio);
    }
  }

  function stopAnimation() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  function springTo(targetY, v0, zeta, response, onDone) {
    stopAnimation();
    if (prefersReducedMotion()) {
      setPanelTranslateY(targetY);
      if (onDone) onDone();
      return;
    }

    const startPos = currentY;
    const startTime = performance.now();

    function frame(now) {
      const tSec = (now - startTime) / 1000;
      const { position, velocity } = evaluateSpring(tSec, startPos, targetY, v0, zeta, response);
      setPanelTranslateY(position);

      const isSettled = Math.abs(position - targetY) < 0.5 && Math.abs(velocity) < 15;
      const isPastMaxTime = tSec > 0.65;

      if (isSettled || isPastMaxTime) {
        setPanelTranslateY(targetY);
        animId = null;
        if (onDone) onDone();
      } else {
        animId = requestAnimationFrame(frame);
      }
    }

    animId = requestAnimationFrame(frame);
  }

  // Pointer drag events for mobile bottom sheet
  function onPointerDown(e) {
    if (!isMobile() || !isOpen) return;
    // Allow dragging from dragHandleEl or header area
    stopAnimation();
    isDragging = true;
    isIntentDetermined = false;
    isVerticalDrag = false;
    startX = e.clientX;
    startY = e.clientY;
    sheetHeight = panelEl.offsetHeight || window.innerHeight * 0.8;
    samples = [{ y: currentY, t: performance.now() }];

    if (dragHandleEl) {
      try {
        dragHandleEl.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!isIntentDetermined) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isIntentDetermined = true;
        isVerticalDrag = Math.abs(dy) >= Math.abs(dx);
        if (!isVerticalDrag) {
          isDragging = false;
          return;
        }
      } else {
        return;
      }
    }

    if (!isVerticalDrag) return;

    // Direct manipulation: sheet tracks pointer 1:1
    let rawY = dy;
    let targetY = rawY;

    if (rawY < 0) {
      // Dragging upward past the top -> rubber-band
      targetY = rubberband(rawY, sheetHeight, 0.55);
    }

    samples.push({ y: targetY, t: performance.now() });
    if (samples.length > 20) samples.shift();

    setPanelTranslateY(targetY);
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;

    if (dragHandleEl) {
      try {
        dragHandleEl.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    if (!isVerticalDrag) return;

    // Compute velocity from the last 100ms
    const v = releaseVelocity(samples, 100);
    const projectedRestingY = project(currentY, v, 0.998);

    // If projected resting point is past 50% of the sheet height, or released with strong downward velocity
    const shouldClose = projectedRestingY > sheetHeight * 0.5 || v > 600;

    if (shouldClose) {
      // Spring closed (zeta = 1.0)
      springTo(sheetHeight, v, 1.0, 0.32, () => {
        finishClose();
      });
    } else {
      // Spring back open (zeta = 0.8)
      springTo(0, v, 0.8, 0.30);
    }
  }

  function open(triggerEl = null) {
    stopAnimation();
    activeTrigger = triggerEl;
    isOpen = true;
    modalEl.style.removeProperty("display");
    document.body.style.overflow = "hidden";

    sheetHeight = panelEl.offsetHeight || window.innerHeight * 0.8;

    if (isMobile()) {
      // Mobile bottom sheet entrance
      panelEl.style.transformOrigin = "bottom center";
      if (prefersReducedMotion()) {
        panelEl.style.transform = "none";
        setScrim(1);
      } else {
        setPanelTranslateY(sheetHeight);
        setScrim(0);
        // Spring from bottom to rest (0)
        springTo(0, 0, 1.0, 0.40);
      }
    } else {
      // Desktop dialog entrance: materialize from trigger element's center
      setScrim(1);
      if (triggerEl && !prefersReducedMotion()) {
        const rect = triggerEl.getBoundingClientRect();
        const panelRect = panelEl.getBoundingClientRect();
        const originX = rect.left + rect.width / 2 - (panelRect.left || window.innerWidth / 2 - 250);
        const originY = rect.top + rect.height / 2 - (panelRect.top || window.innerHeight / 2 - 200);
        panelEl.style.transformOrigin = `${originX}px ${originY}px`;
        panelEl.style.transition = "transform 380ms var(--spring-smooth, cubic-bezier(0.23, 1, 0.32, 1)), opacity 280ms ease-out";
        panelEl.style.opacity = "0";
        panelEl.style.transform = "scale(0.85) translateY(12px)";
        requestAnimationFrame(() => {
          panelEl.style.opacity = "1";
          panelEl.style.transform = "none";
        });
      } else {
        panelEl.style.transform = "none";
        panelEl.style.opacity = "1";
      }
    }

    if (onOpen) onOpen();
  }

  function finishClose() {
    isOpen = false;
    modalEl.style.display = "none";
    panelEl.style.transform = "";
    panelEl.style.opacity = "";
    document.body.style.overflow = "";

    if (activeTrigger && typeof activeTrigger.focus === "function") {
      activeTrigger.focus();
    }
    if (onClose) onClose();
  }

  function close() {
    if (!isOpen) return;
    stopAnimation();

    if (prefersReducedMotion()) {
      finishClose();
      return;
    }

    if (isMobile()) {
      sheetHeight = panelEl.offsetHeight || window.innerHeight * 0.8;
      springTo(sheetHeight, 0, 1.0, 0.28, finishClose);
    } else {
      panelEl.style.transition = "transform 180ms ease-in, opacity 140ms ease-in";
      panelEl.style.opacity = "0";
      panelEl.style.transform = "scale(0.92) translateY(8px)";
      if (backdropEl) {
        backdropEl.style.transition = "opacity 160ms ease-in";
        backdropEl.style.opacity = "0";
      }
      setTimeout(finishClose, 180);
    }
  }

  // Setup event listeners
  if (dragHandleEl) {
    dragHandleEl.addEventListener("pointerdown", onPointerDown);
    dragHandleEl.addEventListener("pointermove", onPointerMove);
    dragHandleEl.addEventListener("pointerup", onPointerUp);
    dragHandleEl.addEventListener("pointercancel", onPointerUp);
  }

  if (closeBtnEl) {
    closeBtnEl.addEventListener("click", close);
  }

  if (backdropEl) {
    backdropEl.addEventListener("click", close);
  }

  const handleKeydown = (e) => {
    if (e.key === "Escape" && isOpen) {
      close();
    }
  };
  document.addEventListener("keydown", handleKeydown);

  return {
    open,
    close,
    destroy() {
      stopAnimation();
      document.removeEventListener("keydown", handleKeydown);
    },
  };
}
