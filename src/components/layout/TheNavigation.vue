<template>
  <header class="header d-flex flex-md-column">
    <div class="branding d-flex justify-content-center align-items-center">
      <img src="@/assets/dollar-solid.png" alt="dollar" />
    </div>
  </header>
</template>

<script setup></script>

<style lang="scss" scoped>
.header {
  z-index: 99;
  background-color: $black-soft;

  @media (min-width: 768px) {
    min-width: 7rem;
    min-height: 100%;
    border-radius: 0 2rem 0 0;
  }

  .branding {
    background-color: $purple;
    border-radius: 0 2rem 0 0;
    padding: 2.5rem;

    img {
      height: 3rem;
    }
  }
}
</style>
