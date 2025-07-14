<script lang="ts">
  import * as THREE from 'three';
  import ChosenShader from "../components/ShaderToy/ChosenShader/ChosenShader.svelte";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { writable } from "svelte/store";
  import Loader from "../components/Loader/Loader.svelte";
  import ThemeChanger from "../components/ThemeChanger/ThemeChanger.svelte";
  import Canvas from "../components/Canvas/Canvas.svelte";
  import Model from '../components/Canvas/Model.ts';
  import canvasesState from 'scene-preset/lib/state/canvases.js';
  import Page from '../components/systems/wrappers/Page/Page.svelte';
  import Centered from '../components/systems/wrappers/Centered/Centered.svelte';
  import MarkdownText from '../components/systems/texts/MarkdownText/MarkdownText.svelte';
  import Content from '../components/Content/Content.svelte';

  /* ------------------------------------------------------------------
   * State                                                              
   * ----------------------------------------------------------------*/
  let lastScrollY = 0;
  const isScrollingDown = writable(false);

  const the_scale = 200;
  let objects: THREE.Object3D[] = [];
  const loaded = writable(false);

  /** Raw mouse position */
  const mouse = writable<{ x: number; y: number }>({ x: 0, y: 0 });
  /** Smoothly‑interpolated mouse (chases `mouse`) */
  const smoothMouse = writable<{ x: number; y: number }>({ x: 0, y: 0 });
  /** Offset from screen‑center derived from `smoothMouse` */
  const offset = writable<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // util ­– linear interpolation
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  /* ------------------------------------------------------------------
   * Scroll & mouse listeners                                           
   * ----------------------------------------------------------------*/
  function handleScroll() {
    const currentScrollY = window.scrollY;
    let scrollingDownValue = false;
    if (Math.abs(currentScrollY - lastScrollY) > 10) {
      scrollingDownValue = currentScrollY > lastScrollY && currentScrollY > 50;
    }
    if (currentScrollY < lastScrollY || currentScrollY <= 50) {
       scrollingDownValue = false;
    }
    isScrollingDown.set(scrollingDownValue);
    lastScrollY = currentScrollY;
  }

  let cleanup = () => {};

  onMount(() => {
    if (!browser) return; // Guard against SSR

    /* ---------------------------- Mouse -----------------------------*/
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    const onMove = (event: MouseEvent) => {
      mouse.set({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    /* ------ Animation loop that eases `smoothMouse` toward `mouse` --*/
    let rawTarget = { x: 0, y: 0 };
    const unsubMouse = mouse.subscribe(v => (rawTarget = v));

    let smoothVal = { x: 0, y: 0 };
    const unsubSmooth = smoothMouse.subscribe(v => (smoothVal = v));

    function frame() {
      // 1. Ease the "chaser" toward the raw mouse
      smoothMouse.update(curr => ({
        x: lerp(curr.x, rawTarget.x, 0.1),
        y: lerp(curr.y, rawTarget.y, 0.1)
      }));

      // 2. Convert that to an offset from the viewport centre
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      offset.set({
        dx: (smoothVal.x - centerX) / 30, // tweak divisor for strength
        dy: (smoothVal.y - centerY) / 30
      });

      requestAnimationFrame(frame);
    }
    frame();

    /* -------------------------- Cleanup -----------------------------*/
    cleanup = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", handleScroll);
      unsubMouse();
      unsubSmooth();
    };
  });

  onDestroy(() => cleanup());
</script>

<ChosenShader />
<ThemeChanger visible={false} />

<Canvas
  setup={async (state: typeof canvasesState) => {
    const { object3D } = await Model("./models/modern_vase/scene.gltf");

    objects = ("A" /* AO */.split("").map((_, i) => {
      const obj = object3D.clone();
      obj.position.y += 2.5;
      obj.rotation.x = Math.PI / 2 + Math.PI * (i % 2);
      obj.scale.set(the_scale * 2, the_scale * 2, the_scale * 2);
      obj.position.z += 75 + the_scale / 4 + i * (the_scale / 2) + (the_scale / 4) * (i % 2);

      state.scene.add(obj);
      return obj;
    }));
  }}
  animate={({ scene }) => {
    objects.forEach((obj, i) => {
      /* movimiento base ---------------------------------------------------- */
      obj.position.z -= 0.5;
      obj.rotation.y -= 0.002 * Math.sign(i % 2 - 0.5);
      obj.scale.y += 0.75;

      /* ---- “destiny from center” (acercamiento suave) ------------------- */
      const distanceFromCenter = (window.innerWidth / 2 - $mouse.x) / 200;

      // log-mapping para obtener el destino (evita disparos lineales bruscos)
      const destiny =
        Math.log1p(Math.abs(distanceFromCenter)) * Math.sign(distanceFromCenter);

      // interpolación suave hacia ese destino
      obj.position.x = lerp(obj.position.x, destiny, 0.05);

      /* limpieza ----------------------------------------------------------- */
      if (obj.position.z < -obj.scale.y) {
        objects.pop();
        scene.remove(obj);
        console.log("The thing was deleted");
      }
    });
  }}
/>

<Loader callback={(hasLoaded: boolean) => {
  setTimeout(() => {
    console.log("hasLoaded", hasLoaded)
    loaded.set(hasLoaded);
  }, 1000);
}} />

<Page>
  {#key $loaded}
    <Centered>
      <div class="title-wrapper">
        <div class="title">
          <MarkdownText canReveal={$loaded}>Σxecutions</MarkdownText>
        </div>
        <!-- Shadow now moves via translate, not left/top -->
        <div class="shadow title" style="transform: translate3d({$offset.dx}px, {$offset.dy}px, 0);">
          <MarkdownText canReveal={$loaded}>Σxecutions</MarkdownText>
        </div>
      </div>
    </Centered>
  {/key}

  <div class="disclaimer">
    <a class="anchor" href="https://www.internationalrelocationpartner.com/">
      <MarkdownText canReveal={$loaded}>
        Subsidiary of International Relocation Partner LLC
      </MarkdownText>
    </a>
  </div>

</Page>
<div style="{$loaded ? '' : 'display: none'}">
  <Content />
</div>

<style lang="scss">
  @use "./styles/everything.scss";

  .title-wrapper {
    position: relative;
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    filter: blur(4px);
    opacity: 0.4;
    will-change: transform;
    z-index: -1;
  }

  :global(.title) {
    & :global(span span) {
      font-size: min(5vw, 5vh) !important;
      text-shadow: 1px 0 black;
    }
  }

  .anchor {
    color: lightblue;
  }
  .disclaimer {
    position: fixed;
    bottom: 15px;
    left: 0;
    right: 0;
    text-align: center;
    transform: scale(0.5);
  }
</style>
