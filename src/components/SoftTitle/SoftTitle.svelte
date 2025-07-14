<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { writable } from "svelte/store";
  
    /* ------------------------------------------------------------------
     * ✨ Public props                                                    
     * ----------------------------------------------------------------*/
    /** Text that will be rendered with a CRT-style glitch + shadow */
    export let text: string = "Σxecutions";
    /** Delay (ms) before the title fades/flies in */
    export let appearDelay: number = 250;
    /** Duration (ms) of the entrance animation */
    export let transitionDuration: number = 700;
    /** Divisor controlling how far the shadow drifts (smaller ⇒ wilder) */
    export let offsetStrength: number = 30;
    /** Lerp factor for mouse smoothing → 0 = snappy, 1 = frozen */
    export let lerpFactor: number = 0.1;
  
    /* ------------------------------------------------------------------
     * 🧭 Mouse-driven shadow                                            
     * ----------------------------------------------------------------*/
    const mouse = writable<{ x: number; y: number }>({ x: 0, y: 0 });
    const smoothMouse = writable<{ x: number; y: number }>({ x: 0, y: 0 });
    const offset = writable<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  
    // visibility flag (plain variable → reactive)
    let visible = writable(false);

    visible.subscribe((a) => console.log("a", a))
  
    let cleanup = () => {};
    onMount(() => {
      if (!browser) return;
  
      /* --------------------------- Mouse -----------------------------*/
      let rawTarget = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => mouse.set({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", onMove, { passive: true });
      const unsubMouse = mouse.subscribe(v => (rawTarget = v));
  
      let smoothVal = { x: 0, y: 0 };
      const unsubSmooth = smoothMouse.subscribe(v => (smoothVal = v));
  
      function frame() {
        smoothMouse.update(curr => ({
          x: lerp(curr.x, rawTarget.x, lerpFactor),
          y: lerp(curr.y, rawTarget.y, lerpFactor)
        }));
  
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        offset.set({
          dx: (smoothVal.x - centerX) / offsetStrength,
          dy: (smoothVal.y - centerY) / offsetStrength
        });
  
        requestAnimationFrame(frame);
      }
      frame();
  
      /* --------------------------- Delay -----------------------------*/
      const timer = setTimeout(() => (visible.set(true)), appearDelay);
  
      /* -------------------------- Cleanup ----------------------------*/
      cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        unsubMouse();
        unsubSmooth();
        clearTimeout(timer);
      };
    });
  
    onDestroy(() => cleanup());
  </script>
  
  <h1
    class="glitch title {$visible ? 'visible' : ''}"
    data-text={text}
    style="--dx: {$offset.dx}px; --dy: {$offset.dy}px; --enter-duration: {transitionDuration}ms;"
  >
    <span aria-hidden="true">{text}</span>
    {text}
    <span aria-hidden="true">{text}</span>
  </h1>
  
  <style lang="scss">
    .glitch {
      /* Hidden state */
      opacity: 0;
      transform: translateY(20px);
      transition: opacity var(--enter-duration) cubic-bezier(0.55, 0, 0.1, 1),
        transform var(--enter-duration) cubic-bezier(0.55, 0, 0.1, 1);
    }
    .glitch.visible {
      opacity: 1;
      transform: translateY(0);
    }
  
    /* --------- Glitch visuals & animation ----------*/
    .glitch {
      font-size: min(5vw, 5vh);
      font-weight: 700;
      text-transform: uppercase;
      position: relative;
      color: var(--color-background);
      text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
        -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
        0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
      animation: glitch 500ms infinite;
  
      /* Pseudo–shadow */
      &::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        filter: blur(4px);
        opacity: 0.4;
        transform: translate3d(var(--dx, 0), var(--dy, 0), 0);
        pointer-events: none;
        text-shadow: inherit;
      }
    }
  
    .glitch span {
      position: absolute;
      top: 0;
      left: 0;
      color: var(--color-background);
    }
  
    .glitch span:first-child {
      animation: glitch 650ms infinite;
      clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
      transform: translate(-0.025em, -0.0125em);
      opacity: 0.8;
    }
  
    .glitch span:last-child {
      animation: glitch 375ms infinite;
      clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
      transform: translate(0.0125em, 0.025em);
      opacity: 0.8;
    }
  
    /* --------- Keyframes ----------*/
    @keyframes glitch {
      0% {
        text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
          -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
          -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
      }
      14%,
      100% {
        text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
          -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
          -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
      }
      15%,
      49% {
        text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
          0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
          -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
      }
      50%,
      99% {
        text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
          0.05em 0 0 rgba(0, 255, 0, 0.75),
          0 -0.05em 0 rgba(0, 0, 255, 0.75);
      }
    }
  
    @media (prefers-reduced-motion: reduce) {
      *,
      ::before,
      ::after {
        animation-delay: -1ms !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        background-attachment: initial !important;
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    }
  </style>
  