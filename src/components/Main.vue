<template>
    <div id='add-property-example' class="col-10">        
        <MainForm :showForm="showAddPropertyForm"/>
        <MainCarousel :showCarousel="showAddPropertyForm == false"/>
    </div>    
</template>
<script>

import MainForm from './MainForm.vue'
import MainCarousel from './MainCarousel.vue'

export default {
    name: 'main',
    components: {
        MainForm,
        MainCarousel
    },
    data() 
    {
        return {
            showAddPropertyForm: false,
        }
    },
    mounted() 
    {
        this.emitter.on("closeForm", () => 
        { 
            console.log("Main: closeForm event detected, setting show form to false");
            this.showAddPropertyForm = false;
        });
        this.emitter.on("showPropertyForm", (show) => 
        {
            console.log("Main: showPropertyForm event detected, setting show form to "+show);
            this.showAddPropertyForm = show;
        });
    }
}
</script>