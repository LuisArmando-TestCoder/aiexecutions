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

  let lastScrollY = 0;
  const isScrollingDown = writable(false);

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

  const the_scale = 200;
  let objects: THREE.Object3D[] = [];
  const loaded = writable(false);
  const mouse = writable<{ x: number; y: number }>({ x: 0, y: 0 });

  onMount(() => {
    if (browser) {
      lastScrollY = window.scrollY;
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("mousemove", (event: MouseEvent) => {
        mouse.set({ x: event.clientX, y: event.clientY });
      });
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("scroll", handleScroll);
    }
  });

  // util ­– linear interpolation
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
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
  setTimeout(() => loaded.set(hasLoaded), 1000);
}} />

<Page>
  <Centered>
    <MarkdownText canReveal={$loaded}>Σxecutions</MarkdownText>
  </Centered>
</Page>

<div class="disclaimer">
  <a class="anchor" href="https://www.internationalrelocationpartner.com/">
    <MarkdownText canReveal={$loaded}>
      Subsidiary of International Relocation Partner LLC
    </MarkdownText>
  </a>
</div>

<style lang="scss">
  @use "./styles/everything.scss";

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
