<script lang="ts" context="module">
  export interface LinkItem {
    url: string;
    text: string;
  }
</script>

<script lang="ts">
  export let items: LinkItem[] = [];

  /** Return bare domain, without leading “www.” */
  const domain = (url: string): string =>
    new URL(url).hostname.replace(/^www\./, "");
</script>

<div class="wrapper">
  <div class="grid">
    {#each items as item (item.url)}
      <a
        class="grid-item"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <!-- Original label that shrinks & moves up -->
        <span class="label">{item.text}</span>

        <!-- Domain that fades in / out -->
        <span class="domain">{domain(item.url)}</span>
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  .wrapper {
    max-width: 1024px;
    margin: 25vh auto;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-auto-rows: 150px;
  }

  .grid-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: var(--color-background);
    text-decoration: none;

    &:not(:first-child) {
      border-left: 1px solid var(--color-background);
    }

    /* --- Text layers ---------------------------------- */
    .label,
    .domain {
      position: absolute;
      pointer-events: none;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    /* Initial states */
    .label {
      opacity: 1;
      transform-origin: center;
    }

    .domain {
      opacity: 0;
      transform: translateY(25px);   /* start slightly below */
    }

    /* Hover states */
    &:hover {
      cursor: pointer;
    }

    &:hover .label {
      transform: scale(0.5) translateY(-50px);
    }

    &:hover .domain {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
