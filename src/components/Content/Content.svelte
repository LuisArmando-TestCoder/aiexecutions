<script>
  import { gsap } from 'gsap';

  /**
   * Svelte action – fades & slides elements in when they enter the viewport
   */
  export function reveal(node) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(40px)';

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(node, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
        observer.unobserve(node);
      }
    }, { threshold: 0.25 });

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<style lang="scss">
:global(body) {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
  background: linear-gradient(-45deg, #0a0a0a, #111111, #0d0d0d, #141414);
  background-size: 400% 400%;
  animation: gradientShift 18s ease-in-out infinite;
  color: #fefeef;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ─────────────────────────────────────────
   GRID LAYOUT
───────────────────────────────────────── */
.grid {
  z-index: 1;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  width: 100%;
  --height: 30vh;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  min-height: var(--height);
  align-items: center;
}

.row:nth-child(even) .text { order: 2; }
.row:nth-child(even) .image { order: 1; }

.text {
  padding: 5vw;
  color: var(--color-background-inversion)
}

.image {
  min-height: calc(var(--height) * 4);
  background-size: cover;
  background-position: left;
  background-attachment: fixed;
}

/* Example Pexels image backgrounds – swap for your own */
.image-1 { background-image: none; }
.image-2 { background-image: url('https://images.pexels.com/photos/4227871/pexels-photo-4227871.jpeg'); }
.image-3 { background-image: url('https://images.pexels.com/photos/16129703/pexels-photo-16129703.jpeg'); }
.image-4 { background-image: url('https://images.pexels.com/photos/6324287/pexels-photo-6324287.jpeg'); }

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }
  .row .text,
  .row .image {
    order: initial !important;
  }
}

/* ─────────────────────────────────────────
   TYPOGRAPHY & ELEMENTS
───────────────────────────────────────── */
h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  line-height: 1.1;
  margin: 0 0 1.2em;
  letter-spacing: -0.02em;
}

h2 {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin: 0 0 1.2em;
}

ul, ol { margin: 0; padding-left: 1.25em; }
li { margin-bottom: 1em; line-height: 1.5; }
p { margin-bottom: 1.5em; line-height: 1.6; }
</style>

<article class="grid">
  <!-- Row 1 -->
  <section class="row">
    <div class="text">
      <h1 use:reveal>Why AI Executions?</h1>
    </div>
    <div class="image image-1" aria-hidden="true"></div>
  </section>

  <!-- Row 2 -->
  <section class="row">
    <div class="image image-2" aria-hidden="true"></div>
    <div class="text">
      <ul>
        <li use:reveal>Most people with great ideas get stuck, not because they lack talent, but because they don’t know where to start, or which path to choose.</li>
        <li use:reveal>We help business owners grow their companies in a way that sets them free from running the company day‑to‑day.</li>
        <li use:reveal>If a business falls apart without the owner, it’s not a business, it’s a job.</li>
        <li use:reveal>We turn job‑trapped founders into owners, so they can use their minds for what humans do best: explore.</li>
      </ul>
    </div>
  </section>

  <!-- Row 3 -->
  <section class="row">
    <div class="text">
      <h2 use:reveal>How do we do it?</h2>
      <ol>
        <li use:reveal>We take your ideas and build them into real systems, fast.</li>
        <li use:reveal>We organize and automate your business so it works without you.</li>
        <li use:reveal>We grow the business by multiplying your reach, without multiplying your work.</li>
        <li use:reveal>We continuously refine and improve the system so it runs smoother, better, and stronger over time.</li>
      </ol>
    </div>
    <div class="image image-3" aria-hidden="true"></div>
  </section>

  <!-- Row 4 -->
  <section class="row">
    <div class="image image-4" aria-hidden="true"></div>
    <div class="text">
      <h2 use:reveal>What are we?</h2>
      <p use:reveal>We are a private equity firm. But instead of giving you money, we give you systems, automation, and execution, and then scale your business.</p>
      <p use:reveal>Sure, capital scales effort, but systems—systems scale leverage.</p>
    </div>
  </section>
</article>
