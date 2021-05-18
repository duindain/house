<template>
    <div class="col-2">
        <h3>Properties</h3>
        <div id="properties-list-example" class="demo">
            <ul class="list-group">
                <property-item 
                    v-for="(property, index) in houses" 
                    v-bind:key="property.id" 
                    v-bind:title="property.title" 
                    v-on:click="openHouse(property.id)" 
                    v-on:remove="houses.splice(index, 1)">
                </property-item>
            </ul>
        </div>
        <div class='row'>
            <div class='col-2'>
                <button type='button' class='btn btn-warning add-property' v-on:click="addNewHouse()">Add new</button>
            </div>
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
  mounted() { 
      this.emitter.on("deleteHouse", (houseId) => { 
        this.deleteHouse(houseId)
    });    
      this.emitter.on("updatePropertyList", () => { 
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
    methods: {
        addNewHouse() {
            console.log("LeftNav: Add new house");
            this.emitter.emit("addNewHouse");
        },
        openHouse(event) {
            this.currentIndex = event;
            this.emitter.emit("openHouse", event);
            console.log("LeftNav: open house ? " + event);
        },
        deleteHouse(houseId) {
            this.currentIndex = -1;
            console.log("LeftNav: delete house ? id:" + this.id+" houseId:"+houseId);
        },
        updatePropertyList() {
            axios.get('house/includes/server_processing.php?houselist=true').then((response) => {                
                console.log("LeftNav: "+response);
                for (let i = 0; i < response.data.length; ++i) {
                    var item = response.data[i];
                    this.houses.push({
                        id: item.id,
                        title: item.name
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