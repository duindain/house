<template>
  <li class="list-group-item list-group-item-action " :class="{ active: isselected }" :key="index">
    <div class="card border-dark" style="col-10">
      <div class="card-body">
        <span class="card-title text-dark">{{title}}</span>
        <p class="card-text text-dark">
          <star-rating 
              v-model:rating="ratingv2"
              v-bind:show-rating="false"
              v-bind:clearable="false"
              v-bind:star-size="20"
              v-bind:animate="true"
              v-bind:glow="5"
              v-bind:max-rating="4"
              v-bind:read-only="true"/>
        </p>
        
        <div class="card-link justify-content-end">
          <p class="card-text text-dark"><small>{{propertystate}}</small> <button class="btn btn-warning float-right" @click.prevent="$emit('remove')" type="button"><i class="fas fa-trash-alt"></i></button></p>
         
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import StarRating from 'vue-star-rating'

export default {
  components: {
      StarRating  
  },
  props: ['rating','title','index','isselected','propertystate'],
  emits: ['remove', 'openHouse', 'deleteHouse','rating'],
  data() {
    return {ratingv2: 0}
  },
  mounted() {
    if(this.rating > 0)
    {      
      this.ratingv2 = this.rating / 2;    
    }
     console.log("PropertyItem.rating "+this.ratingv2+" for "+this.title);   
  },
}
</script>

<style lang="stylus" scoped>
</style>