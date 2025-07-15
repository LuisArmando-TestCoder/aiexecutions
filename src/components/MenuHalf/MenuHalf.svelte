<script lang="ts">
  import X from "../X/X.svelte";
  import scroll from "../scroll.ts";

  export let isChecked = false; // Export isChecked as a prop, default to false
</script>

<div class="menu-half {isChecked ? 'open' : 'closed'}">
  <nav>
    <ul class="menu-half--list">
      <li class="menu-half--list-item home">
        <a
          class="menu-half--sub-anchor menu-half--anchor"
          href="#why"
onclick={() => {
            scroll("why")
            isChecked = false;
          }}>W H Y</a
        >
      </li>
      <li class="menu-half--list-item home">
        <a
          class="menu-half--sub-anchor menu-half--anchor"
          href="#how"
onclick={() => {
            scroll("how")
            isChecked = false;
          }}>H O W</a
        >
      </li>
      <li class="menu-half--list-item home">
        <a
          class="menu-half--sub-anchor menu-half--anchor"
          href="#what"
onclick={() => {
            scroll("what")
            isChecked = false;
          }}>W H A T</a
        >
      </li>
      <li class="menu-half--list-item home">
        <a
          class="menu-half--sub-anchor menu-half--anchor"
          href="#us"
onclick={() => {
            scroll("us")
            isChecked = false;
          }}>Us</a
        >
      </li>
    </ul>
  </nav>
</div>

<div class="menu-half-x">
  <X {isChecked} trigger={(ic) => (isChecked = !ic)} />
</div>

<style lang="scss">
  @use "./MenuHalf.scss";
</style>
