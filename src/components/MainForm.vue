<template>
    <div v-if="showForm">
        <form id="add-a-property">
            <div class="row">
                <div class="col-10">
                    <h3>Property details</h3>            
                    <input id="houseid" type="hidden" />
                    <div class="container">
                        <div class="mb-3">
                            <label class="form-label" for="url">Url</label>                       
                            <div class="row">
                                <div class="col">
                                    <input id="url" v-model.trim="url" class="form-control" />
                                </div>
                                <div class="col-1" v-if="url">
                                    <a v-bind:href="url" class="form-control" target="_blank"><i class="fas fa-external-link-square-alt"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="name">Name</label>
                            <input id="name" v-model.trim="name" class="form-control"/>
                        </div>
                        <div class="mb-3">                
                            <label class="form-label" for="price">Price</label>
                            <input id="price" v-model.number="price" type="number" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="size">Size (hectares)</label>
                            <input id="size" v-model.number="size" type="number" class="form-control"/>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="address">Address</label>                            
                            <div class="row">
                                <div class="col">
                                <input id="address" v-model.trim="address" class="form-control"/>
                                </div>
                                <div class="col-1" v-if="address">
                                    <a v-bind:href="'https://maps.google.com/?q='+address" class="form-control" target="_blank"><i class="fas fa-map"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Lot and DP</label>                            
                            <div class="row">
                                <div class="col">
                                <input id="lot" v-model.number="lot" type="number" class="form-control"/>
                                </div>
                                <div class="col">
                                <input id="dp" v-model.trim="dp" class="form-control"/>
                                </div>
                                <div class="col-1" v-if="dp">
                                    <a v-bind:href="'https://maps.six.nsw.gov.au/?lot'+lot+'&section='+dp" class="form-control" target="_blank"><i class="fas fa-map-marker-alt"></i></a>
                                </div>
                            </div>
                        </div>      
                        <div class="mb-3">
                            <label class="form-label" for="size">Agent name</label>
                            <input id="size" v-model.trim="agentname" class="form-control"/>
                        </div>                     
                        <div class="mb-3">
                            <label class="form-label" for="size">Agent number</label>
                            <div class="row">
                                <div class="col">
                                    <input id="agentphone" v-model="agentnumber" type="tel" class="form-control" />
                                </div>
                                <div class="col-1" v-if="agentnumber">
                                    <a v-bind:href="'tel:'+agentnumber" class="form-control" target="_blank"><i class="fas fa-phone"></i></a>
                                </div>
                            </div>
                        </div>                     
                        <div class="mb-3">
                            <label class="form-label" for="rating">Rating</label>
                            <div class="col-12 border rounded pt-3">
                                <star-rating 
                                    v-model:rating="rating"
                                    v-bind:show-rating="false"
                                    v-bind:clearable="true"
                                    v-bind:star-size="35"
                                    v-bind:animate="true"
                                    v-bind:glow="5"
                                    v-bind:max-rating="8"/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="tagsSelector" class="form-label">Tags</label>
                            <div class="col-12">
                                <vue-select 
                                    multiple
                                    searchable
                                    taggable
                                    clear-on-select
                                    clear-on-close
                                    search-placeholder="Type to add new tags"
                                    v-model="selectedtags"
                                    :options="existingtags"
                                    @search:input="handleInput" />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Property state</label>
                            <div class="col-12">
                                <vue-select 
                                    v-model="propertystate" 
                                    :options="propertystates" 
                                    label-by="name"
                                    value-by="id" />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="notes">Notes</label>
                            <textarea id="notes" v-model.trim="notes" class="form-control"></textarea>
                        </div>                    
                    </div>          
                </div>
                <div class="col-2 border rounded pt-3">
                    <picture-input 
                        ref="pictureInput"
                        @change="onChangedImage"
                        @remove="onRemovedImage"
                        size="10" 
                        radius="4"
                        button-class="btn btn-secondary"
                        :prefill="images"
                        :removable="true" 
                        :custom-strings="{
                            upload: '<h1>Bummer!</h1>',
                            drag: 'Drag a image or click to browse'
                        }" />
                </div>
            </div>
            <div class="row">
                <div class="col-10">
                    <button type='button' class='btn btn-warning save-property' @click='upsertProperty'>Save</button>
                    <button type='button' class='btn btn-warning remove-property' @click='removeProperty' v-if="showDeleteHouse">Remove</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>

import axios from 'axios'
import PictureInput from 'vue-picture-input';
import StarRating from 'vue-star-rating'
import VueNextSelect from 'vue-next-select'
import 'vue-next-select/dist/index.css'

export default {
    name: 'MainForm',
    components: {
        PictureInput,
        StarRating,
        'vue-select' : VueNextSelect,
    },
    props: {
        showForm: {
            type: Boolean,
            required: true
        }
    },
    data() 
    {
        return {
            houseid: '',
            name: '',
            url: '',
            price: '',
            address: '',
            lot: 0,
            dp: '',
            images: '',
            notes: '',
            agentname: '',
            prevValue: '',
            propertystate: null,
            size: 0,
            agentnumber: 0,
            rating: 0,
            existingtags: [],
            selectedtags: [],
            propertystates: [],            
            showDeleteHouse: false,
        }
    },
    mounted() 
    { 
        this.emitter.on("addNewHouse", () => 
        {
            console.log("MainForm: addNewHouse");
            this.addNewHouse();
        }); 
        this.emitter.on("openHouse", (houseId) => 
        {
            console.log("MainForm: openHouse houseId:" + houseId);
            this.openHouse(houseId);
        });        
    },
    created() 
    {
        this.getAvailableTags();
        this.getAvailableStates();
    },
    methods: 
    {
        handleInput(inputEvent) 
        {
            this.removeTemporaryOption(inputEvent)
            this.addTemporaryOption(inputEvent)
        },
        removeTemporaryOption(inputEvent) 
        {
            if (this.selectedtags.includes(this.prevValue) === false) 
            {
                this.existingtags = this.existingtags.filter(option => option !== this.prevValue);
            }
            this.prevValue = inputEvent.target.value;
        },
        addTemporaryOption(inputEvent) 
        {
            const input = inputEvent.target.value;
            if (input === '') 
                return;
            if (this.existingtags.includes(input)) 
                return;
            this.existingtags.push(input);
        },
        getAvailableTags() 
        {     
            axios.get('includes/server_processing.php?attributes=true').then((response) => 
            {
                console.log("MainForm: "+response);
                for (let i = 0; i < response.data.length; ++i)
                {
                    var item = response.data[i];
                    this.existingtags.push(item.name);
                }            
            }).catch(function(error) 
            {
                // handle error
                console.log(error);
            });
        },
        getAvailableStates()
        {
            axios.get('includes/server_processing.php?states=true').then((response) => 
            {
                console.log("MainForm: "+response);
                this.propertystates = response.data;
            }).catch(function(error) 
            {
                // handle error
                console.log(error);
            });
        },
        addNewHouse() 
        {
            console.log("MainForm: add new house");
            this.emitter.emit("showPropertyForm", true);
            this.showDeleteHouse = false;
            this.houseid = '';
            this.url = '';
            this.name = '';            
            this.address = '';
            this.lot = 0;
            this.dp = '';
            this.images = '';
            this.notes = '';
            this.agentname = '';
            this.prevValue = '';
            this.price = 0;
            this.size = 0;
            this.agentnumber = 0;
            this.rating = 0;
            this.propertystate = this.propertystates[0];
            this.selectedtags = [];
        },
        removeProperty(id) 
        {
            //this.deleteHouse(id);
            this.emitter.emit("deleteHouse", id);
        },
        openHouse(id) 
        {
            if (id > 0) 
            {
                console.log("MainForm: open house for id " + id);
                axios.get('includes/server_processing.php?houseid=' + id).then((response) => 
                {
                    console.log("MainForm: "+response);
                    if (response.data != null) 
                    {
                        this.emitter.emit("showPropertyForm", true);
                        this.showDeleteHouse = true;
                        this.houseid = id;
                        this.url = response.data.url != null ? decodeURIComponent(response.data.url) : null;
                        this.name = response.data.name;
                        this.price = response.data.price;
                        this.size = response.data.size;
                        this.address = response.data.address;
                        this.lot = response.data.lot;
                        this.dp = response.data.dp;
                        this.agentname = response.data.agentname;
                        this.agentnumber = response.data.agentnumber;
                        this.propertystate = response.data.propertystate;
                        this.rating = response.data.rating;
                        this.images = response.data.images != null ? decodeURIComponent(response.data.images) : null;
                        this.notes = response.data.notes;
                        this.selectedtags = response.data.tags != null ? response.data.tags.map(function(item) { return item["name"]; }) : null;
                    }                    
                }).catch(function(error) 
                {
                    console.log("MainForm: "+error);
                });
            }
        },
        upsertProperty()
        {
            if (isEmpty(this.name) == false) 
            {
                var data = {
                    houseid: this.houseid,
                    url: this.url,
                    name: this.name,
                    price: this.price,
                    size: this.size,
                    address: this.address,
                    lot: this.lot,
                    dp: this.dp,
                    agentname: this.agentname,
                    agentnumber: this.agentnumber,
                    propertystate: this.propertystate,
                    rating: this.rating,
                    tags: this.selectedtags,
                    images: this.images,
                    notes: this.notes,                    
                };            
                axios.post('includes/server_processing.php?upsertproperty=true', data).then((response) =>
                {
                    if (response.data.saved == true) 
                    {
                        console.log("MainForm: House saved, refreshing left nav and hiding house form");
                        this.emitter.emit("showPropertyForm", false);
                        //Refresh left nav
                        this.emitter.emit("updatePropertyList");
                       console.log("MainForm: Update property list in left nav now");
                    }
                    console.log("MainForm: "+response);
                }).catch(function(error) 
                {
                    // handle error
                    console.log("MainForm: "+error);
                });
            }
        },
        onChangedImage(image)
        {
            console.log('MainForm: New picture selected! '+image?.name);
            if (this.$refs.pictureInput.file)
            {
                console.log('MainForm: Picture loaded.');
                this.images = "filename::" +this.$refs.pictureInput.file.name + "::" + this.$refs.pictureInput.image;
            }
        },
        onRemovedImage()
        {
            console.log('MainForm: Removed image ');
            this.images = null;
        }
    }
}

function isEmpty(str) {
    return (!str || str.length === 0);
}

</script>
