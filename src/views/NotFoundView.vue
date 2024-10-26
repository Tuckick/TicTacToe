<template>
  <div class="not-found-container">
    <img
      src="@/assets/images/page-not-found.svg"
      alt="not found page icon"
      class="not-found-img"
    />
    <h1>Page not found.</h1>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 36px;
}
.not-found-img {
  width: 50%;
  min-width: 200px;
  max-width: 500px;
}
</style>