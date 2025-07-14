<script lang="ts">
    import { writable } from "svelte/store";
  import MenuHalf from "../MenuHalf/MenuHalf.svelte";
  import ThemeChanger from "../ThemeChanger/ThemeChanger.svelte";

  let menuOpen = false;
  let headerVisible = writable(true); // Regular boolean variable

  // Logic: Show only if authenticated AND not scrolling down (using store value)
</script>

<header class="nav-header">
  <nav class="nav" style:top={$headerVisible ? '0' : '-87px'}>
    <div class="menu {menuOpen ? 'open' : ''}">
      <section class="menu-section left">
        <a
          class="menu-item hide-on-mobile"
          href="#why"
          >Why</a
        >
        <a
          class="menu-item hide-on-mobile"
          href="#what"
          >What</a
        >
        <a
          class="menu-item hide-on-mobile"
          href="#how"
          >How</a
        >
        <a
          class="menu-item hide-on-mobile"
          href="#us"
          >Us</a
        >
        <section class="menu-x hide-on-desktop interactive">
          <ThemeChanger visible={true} />
        </section>
      </section>
      <section class="menu-section right">
        <div class="menu-x hide-on-desktop interactive">
          <MenuHalf bind:isChecked={menuOpen} />
        </div>

        <section class="menu-x hide-on-mobile interactive">
          <ThemeChanger visible={true} />
        </section>
      </section>
    </div>
  </nav>
</header>

<style lang="scss">
  @use "Header.scss";
</style>
