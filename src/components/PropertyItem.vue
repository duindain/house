<template>
  <li class="list-group-item" :class="{ active: index == currentIndex }" :key="index">
    <button class="btn btn-link" @click.prevent="$emit('openHouse', 'boop')">{{ title }}</button>
    <button class="btn btn-outline-secondary" @click.prevent="$emit('remove', 'deleteHouse')"><i class="fas fa-trash-alt"></i></button>
  </li>
</template>

<script>
export default {
  props: ['title','index'],
  emits: ['remove', 'openHouse', 'deleteHouse']
}
</script>


<style lang="stylus" scoped>
li
  display flex
  margin 5px 0

  span
    flex 1
  
  button
    border 1px solid orange
    background orange 
    color white
    font-size 0.8rem
    padding 2px 4px
    cursor pointer

    &:hover
      border-color #ff8100
      background #ff8100
</style>