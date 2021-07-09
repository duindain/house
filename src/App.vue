<template>
  <div class="container-fluid">
    <div class="row mx-auto">    
      <LeftNav/>
      <Main/>
    </div>
  </div>
</template>

<script>
import LeftNav from './components/LeftNav.vue'
import Main from './components/Main.vue'
import { defineComponent } from "vue";

export default defineComponent({
  name: "Basic",
  components: {
    LeftNav,
    Main
  }
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
