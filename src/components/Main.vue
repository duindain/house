<template>
    <div class="col-10">
        <div class='col-9' id='add-property-example' v-if="showAddPropertyForm">
            <h3>New Property</h3>
            <form id="add-a-property">
                <input id="houseid" type="hidden" />
                <label for="url">Url</label>
                <input id="url" v-model.trim="url" />
                <a v-bind:href="url"><i class="fas fa-external-link-square-alt"></i></a>
                <br/>
                <label for="name">Name</label>
                <input id="name" v-model.trim="name" />
                <br/>
                <label for="price">Price</label>
                <input id="price" v-model.number="price" type="number" />
                <br/>
                <label for="size">Size</label>
                <input id="size" v-model.number="size" type="number" />
                <br/>
                <label for="address">Address</label>
                <input id="address" v-model.trim="address" />
                <br/>
                <label for="marketPriceMin">Market Price min</label>
                <input id="marketPriceMin" v-model.number="marketPriceMin" type="number" />
                <br/>
                <label for="marketPriceMax">Market Price max</label>
                <input id="marketPriceMax" v-model.number="marketPriceMax" type="number" />
                <br/>
                <label for="rating">Rating</label>
                <input id="rating" v-model.trim="rating" type="number" />
                <br/>
                <label for="tags">Tags</label>
                <smart-tagz 
                    @keypress.enter.prevent 
                    @click.prevent 
                     autosuggest
                     editable
                     inputPlaceholder="Select features ..." 
                     :allowPaste="{delimiter: ','}" 
                     :allowDuplicates="false" 
                     :defaultTags="selectedtags"
                     :sources="existingtags"
                     :maxTags="20" 
                     :theme="{
                        primary: '#545454',
                        background: '#bdbdbd',
                        tagTextColor: '#fff',
                     }" />
                <br/>
                <label for="images">Images</label>
                <input id="images" v-model.trim="images" />
                <br/>
                <label for="notes">Notes</label>
                <textarea id="notes" v-model.trim="notes"></textarea>
                <br/>
                <button type='button' class='btn btn-warning save-property' @click='upsertProperty'>Save</button>
                <button type='button' class='btn btn-warning remove-property' @click='removeProperty' v-if="showDeleteHouse">Remove</button>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { SmartTagz } from "smart-tagz";
import "smart-tagz/dist/smart-tagz.css";

export default {
  name: 'main',
  components: {
    SmartTagz,
  },  
  data() {
        return {
            houseid: '',
            name: '',
            url: '',
            price: '',
            address: '',
            images: '',
            notes: '',
            size: 0,
            marketPriceMin: 0,
            marketPriceMax: 0,
            ourPrice: 0,
            rating: 0,
            existingtags: [],
            selectedtags: [],
            showAddPropertyForm: true,
            showDeleteHouse: false,
        }
    },
  mounted() { 
    this.emitter.on("addNewHouse", () => {
        console.log("Main: addNewHouse");
        this.addNewHouse()}
      
    ); 
    this.emitter.on("openHouse", (houseId) => {
         console.log("Main: openHouse houseId:"+houseId);
      this.openHouse(houseId)
    });
  },
  created() {
    this.getAvailableTags();
  },
    methods: {
      getAvailableTags() {     
        axios.get('house/includes/server_processing.php?attributes=true').then((response) => {
            console.log("Main: "+response);
            //this.existingtags = [];
            for (let i = 0; i < response.data.length; ++i) {
                var item = response.data[i];
                this.existingtags.push(item.name);
            }            
        }).catch(function(error) {
            // handle error
            console.log(error);
        });
    },
        addNewHouse() {
            console.log("Main: add new house");
            this.showAddPropertyForm = true;
            this.showDeleteHouse = false;
            this.houseid = '';
            this.url = '';
            this.name = '';            
            this.address = '';
            this.images = '';
            this.notes = '';
            this.price = 0;
            this.size = 0;
            this.marketPriceMin = 0;
            this.marketPriceMax = 0;
            this.rating = 0;
            this.selectedtags = [];
        },
        removeProperty(id) {
            this.deleteHouse(id);
            this.emitter.emit("deleteHouse", id);
        },
        openHouse(id) {
            if (id > 0) {
                console.log("Main: open house for id " + id);
                axios.get('house/includes/server_processing.php?houseid=' + id).then((response) => {
                    console.log("Main: "+response);
                    if (response.data != null) {
                        this.showAddPropertyForm = true;
                        this.showDeleteHouse = true;
                        this.houseid = id;
                        this.url = response.data.url;
                        this.name = response.data.name;
                        this.price = response.data.price;
                        this.size = response.data.size;
                        this.address = response.data.address;
                        this.marketPriceMin = response.data.marketPriceMin;
                        this.marketPriceMax = response.data.marketPriceMax;
                        this.rating = response.data.rating;
                        this.images = response.data.images;
                        this.notes = response.data.notes;
                        this.selectedtags = response.data.tags;
                    }                    
                }).catch(function(error) {
                    // handle error
                    console.log("Main: "+error);
                });
            }
        },
        upsertProperty() {
            if (isEmpty(this.name) == false) {
                axios.post('house/includes/server_processing.php?upsertproperty=true', {
                    houseid: this.houseid,
                    url: this.url,
                    name: this.name,
                    price: this.price,
                    size: this.size,
                    address: this.address,
                    marketPriceMin: this.marketPriceMin,
                    marketPriceMax: this.marketPriceMax,
                    rating: this.rating,
                    tags: this.selectedtags.join(","),
                    images: this.images,
                    notes: this.notes,                    
                }).then((response) => {
                    if (response.data.saved == true) {
                        console.log("Main: House saved, refreshing left nav and hiding house form");
                        this.showAddPropertyForm = false;
                        //Refresh left nav
                        this.emitter.emit("updatePropertyList");
                       console.log("Main: Update property list in left nav now");
                    }
                    console.log("Main: "+response);
                }).catch(function(error) {
                    // handle error
                    console.log("Main: "+error);
                });
            }
        },
        tagsOnChanged(tags) {
            console.log("Main: tags changed " + tags);
        }
    }
}
function isEmpty(str) {
    return (!str || str.length === 0);
}
</script>