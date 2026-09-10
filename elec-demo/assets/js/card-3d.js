/**
 * ============================================================================
 * 3D SERVICE CARD TILT & SPECULAR HIGHLIGHT SCRIPT
 * ============================================================================
 * Provides smooth 60fps cursor-driven 3D tilt, parallax depth, specular light
 * positioning, and angle rotation for the spectrum border.
 * ============================================================================
 */

(function init3DCards() {
  // Guard for server environments or reduced motion
  if (typeof window === 'undefined') return;

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isFinePointer || prefersReduced) return;

  document.addEventListener('DOMContentLoaded', () => {
    const cardWrappers = document.querySelectorAll('.card-3d-wrap');

    cardWrappers.forEach(wrap => {
      const card = wrap.querySelector('.service-card-3d');
      if (!card) return;

      let rafId = null;
      let targetRx = 0;
      let targetRy = 0;
      let targetTy = 0;
      let targetTz = 0;
      let currentRx = 0;
      let currentRy = 0;
      let currentTy = 0;
      let currentTz = 0;
      let isHovered = false;

      function updateCardTransform() {
        if (!isHovered) {
          // Smooth return to neutral
          currentRx += (0 - currentRx) * 0.15;
          currentRy += (0 - currentRy) * 0.15;
          currentTy += (0 - currentTy) * 0.15;
          currentTz += (0 - currentTz) * 0.15;

          if (Math.abs(currentRx) < 0.05 && Math.abs(currentRy) < 0.05) {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
            card.style.setProperty('--ty', '0px');
            card.style.setProperty('--tz', '0px');
            cancelAnimationFrame(rafId);
            rafId = null;
            return;
          }
        } else {
          // Smooth interpolation towards mouse target
          currentRx += (targetRx - currentRx) * 0.2;
          currentRy += (targetRy - currentRy) * 0.2;
          currentTy += (targetTy - currentTy) * 0.2;
          currentTz += (targetTz - currentTz) * 0.2;
        }

        card.style.setProperty('--rx', `${currentRx.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${currentRy.toFixed(2)}deg`);
        card.style.setProperty('--ty', `${currentTy.toFixed(2)}px`);
        card.style.setProperty('--tz', `${currentTz.toFixed(2)}px`);

        rafId = requestAnimationFrame(updateCardTransform);
      }

      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Subtle professional tilt limits (max ~8 degrees)
        targetRx = (0.5 - y) * 14;
        targetRy = (x - 0.5) * 14;
        targetTy = -6;
        targetTz = 10;

        // Specular light coordinates
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);

        // Dynamic angle for the spectrum conic gradient
        const deltaX = x - 0.5;
        const deltaY = y - 0.5;
        const angleDeg = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
        card.style.setProperty('--border-angle', `${angleDeg.toFixed(1)}deg`);

        if (!isHovered) {
          isHovered = true;
          if (!rafId) {
            rafId = requestAnimationFrame(updateCardTransform);
          }
        }
      });

      wrap.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRx = 0;
        targetRy = 0;
        targetTy = 0;
        targetTz = 0;
        if (!rafId) {
          rafId = requestAnimationFrame(updateCardTransform);
        }
      });
    });
  });
})();
