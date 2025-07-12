<script lang="ts">
  import { onMount } from "svelte";
</script>

<div class="page">
  <slot />
</div>

<style lang="scss">
  .page {
    padding: 0;
    overflow: auto;
    max-height: 100vh;

    @media (max-width: 640px) {
      padding: 160px 15px 0;
    }
  }
</style>
