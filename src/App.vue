<template>
  <div class="container">
    <div class="row align-items-start">    
      <LeftNav msg="boo"/>
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

//LeftNav.methods.updatePropertyList();

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
