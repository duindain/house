<template>
    <div v-if="showCarousel">
        <Carousel :autoplay="8000" :wrap-around="true">
            <Slide v-for="slide in slides" :key="slide.id">
                <div class="carousel_item" v-on:click="openHouse(slide.houseId)" >
                    <div class="card" style="width: 70rem;">
                        <img v-bind:src="slide.url" class="card-img-top" alt="Image for house {{slide.id}}"/>
                        <div class="card-body">
                            <h5 class="card-title">{{slide.name}}</h5>
                        </div>
                    </div>
                </div>
            </Slide>
        </Carousel>
    </div>
</template>

<script>

import axios from 'axios'
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

export default {
    name: 'MainCarousel',
    components: {
        Carousel,
        Slide
    },  
    props: {
        showCarousel: {
            type: Boolean,
            required: true
        }
    },
    data() 
    {
        return {
            slides: [{'id':0,'name':'','houseId':0,'url':'images/Loading-GIF-Image-14.gif'}],
        }
    },
    created() 
    {
        this.getSlides();
    },
    methods: 
    {
        getSlides()
        {
            axios.get('includes/server_processing.php?slides=true').then((response) => 
            {
                console.log("mainCarousel: "+response); 
                this.slides = [];               
                for (let i = 0; i < response.data.length; ++i)
                {
                    var item = response.data[i];
                    item.url = decodeURIComponent(item.url);
                    this.slides.push(item);
                } 
            }).catch(function(error) 
            {
                // handle error
                console.log(error);
            });
        },
        openHouse(houseId) 
        {
            if(houseId > 0)
            {
                this.emitter.emit("openHouse", houseId);
                console.log("mainCarousel: open house " + houseId);
            }            
        }
    }
}
</script>