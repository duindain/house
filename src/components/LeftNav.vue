<template>
    <div class="col-2">
        <div class='row'>
            <h3>Properties</h3>
            <div id="properties-list-example" class="demo mr-1">
                <ul class="list-group">
                    <property-item 
                        v-for="(property, index) in houses" 
                        :index="index"
                        :key="property.id"
                        :isselected="currentIndex == property.id"
                        v-bind:title="property.title" 
                        v-bind:rating="property.rating"
                        v-bind:propertystate="property.propertystate"
                        v-on:click="openHouse(property.id)" 
                        v-on:remove="deleteHouse(property.id, index)">
                    </property-item>
                </ul>
            </div>
        </div>
        <div class='row'>
            <button type='button' class='btn btn-warning add-property' v-on:click="addNewHouse()">Add new</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import PropertyItem from "./PropertyItem.vue"

export default {
    name: 'leftnav',
    created()
    {
        console.log("LeftNav: created Left Nav");
        this.updatePropertyList();
    },
    mounted() 
    { 
        this.emitter.on("deleteHouse", (houseId) => 
        { 
            this.deleteHouse(houseId)
        });    
        this.emitter.on("updatePropertyList", () => 
        { 
            this.updatePropertyList()
        });
    },
    components: {
        PropertyItem
    },
    data() {
        return {
            houses: [],
            currentIndex: -1,
        }
    },
    methods:
    {
        addNewHouse()
        {
            console.log("LeftNav: Add new house");
            this.currentIndex = -1;
            this.emitter.emit("addNewHouse");
        },
        openHouse(event) 
        {
            this.currentIndex = event;
            this.emitter.emit("openHouse", event);
            console.log("LeftNav: open house ? " + event);
        },
        deleteHouse(houseId, index) 
        {
            console.log("LeftNav: delete house list id:" + this.id + " houseId:" + houseId);
            axios.post('includes/server_processing.php?removeHouse=true', { houseid: houseId }).then((response) =>
            {
                if (response.data.deleted == true)
                {
                    console.log("LeftNav: House deleted, refreshing left nav and hiding house form");
                    
                    if(index >= 0)
                    {
                        this.houses.splice(index, 1);
                    }
                    else
                    {
                        this.emitter.emit("closeForm");
                        this.updatePropertyList();
                        console.log("LeftNav: Close form");
                    }            
                    this.currentIndex = -1;            
                }
                console.log("LeftNav: "+response);
            }).catch(function(error) {
                // handle error
                console.log("LeftNav: "+error);
            });
        },
        updatePropertyList()
        {
            axios.get('includes/server_processing.php?houselist=true').then((response) => {                
                console.log("LeftNav: "+response);
                this.houses = [];
                for (let i = 0; i < response.data.length; ++i) {
                    var item = response.data[i];
                    this.houses.push({
                        id: item.id,
                        title: item.name,
                        propertystate: item.propertystate,
                        rating: item.rating
                    });
                }
                this.currentIndex = -1;
            }).catch((error) => {
                // handle error
                console.log("LeftNav: "+error);
            });
        }
    }
}
</script>

<style lang="stylus" scoped>
</style>