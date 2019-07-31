<template>
    <v-card height="105px"  class="mb-2 collection-card" hover :data-id="collection.id" >
        <v-layout>
            <v-flex xs3>
                <router-link :to="'/collection/' + collection.id">
                <v-img
                    :src="collection.thumbnail.url"
                    :alt="collection.collection.text"
                    max-height="80px"          
                    contain 
                    class="ma-1 collection-image"
                    lazy-src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMS40AP/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAFAAUAMBIgACEQEDEQH/xAAbAAADAQADAQAAAAAAAAAAAAAEBQYDAAEHAv/EAEEQAAEDAgQDBQQIBAMJAAAAAAECAxEEBQAGITESE0EiUWGBoRVxkfAHFCMyQrHB4SQlM1JigvEWJjZDRFVyc4P/xAAYAQADAQEAAAAAAAAAAAAAAAABAgMEAP/EACARAQEAAgMAAQUAAAAAAAAAAAEAAhEhMUEiEjJhkfD/2gAMAwEAAhEDEQA/AKfNSIzIouDsfW0mIjSGvDfp8cIXW0+xm1QYUyudzolWnj1Bw3z1VWy25keera+rS6otr5FNQ80oA3/ENwkdO7TEpU5ty0mgRTfW76RC+AptcaLjUAue75jGBxd8WwyNRLzRVk6/8R4VtPMABOxMvfoonrtga1MQ7XSqQl2VaSdVt/v8MH2u4ZdrspZhUh+9JZD9OF8dAlCwpXNCQlPHChE9RsN5wvor9lxDj60IzM6XFAHhtiRsqT/zP8Os7YDizGRJc3sqGXeW3twrCge1AStZiYPcPiBixzW6hrNqwtQSlV0dk93ZVJ09wxLXW7Zcq6FLDrOa0pWVq4xakQZUSTq70n8sPc5V9hfzLVl5WYw5S1zxcLNuDrZUCtKgFBewKjr4eGCi3CbsHEK+vNPJO1YEzvpwtwficMMsgPZWuinNBzaZR6iAHTsZ7u44TozDlqmbSgu5iIS6lyF2obykgf1OvB64ZWy/ZcZyTXvM11zRTCqp2eYbZ20r4HCDw8wyIB1kQY7xE3DLXU7mUclkqzNcGR2gKxpCeGdfszp18O8eePrLaUu5ibbJSft2tYnUKUYPyMapueV2bq9VOXm4QX0PKS5alIjhRw8JhZjUkz5Y1yw7YF5hplU16qHluVSAAbe4kcUnslUmN49wGKadSbKx+kFoKzhVlIAIVTlQGhiF7/lt34lMxtIbXaFhKSTSNI1AP9hnXFn9IB4M33ATJJpwSruJWJ9DtiOzZxBNpUJUAygpKv8A5+sGdunhio/IpnU0A/3Vvq20wRW25UBUH+osTP6eHjgy1oIFKlQJlGvWVFK4/MYBZIGUMw8Z4Saq2jb8XNVhtScQSASApKRIMT+PfTXY7eGJZ+E+PsuvqUotTSYKgikc3GxgnbBrrSg/etDKrlcExPfUPx+h8sC5oARZmlrVJ+puAwNyCR06Tg27FTdwviUyCitqVzqN3XD+uAfbH2EujrZab40lLXtBglUdxHT18jhRa1A5BrVtgCLhS7RBJW8nBF/URZ2z2E/xrBMdSSD5iTHmMZWcAZFqQlIH8zpoAkgSXoHjE/prg64uGKqGUJcr1j7xfcIUsjWEJEeUA7dfAYKykyg1TYCAEoq1QIgfcbA9P9RjC4QbZVq04+a6ZA3lA026z86YMydrcG+AgkVykqJ6EJbkfAeGIG/pqPcy+kVl1WdKgssurBDJPCkkEguj4woftiJvrNU+mzhFNVyikQHIbUYVDcA6eB9ffj1HP6Kpy9rDNxuVMlLCilFNWOspCiuJIQoA79de7EVl964uW9l+svd9UpVVy59qPmUdvpxa7HXXQY1jrmzHVnRUVU/lfMjYpn4VUUShxNnUJUtRiN4E+gwVTl5FSpLjL/EUb8JgwpZ+P7YzyxdrtVWy+tu3m7LH8Jylrq3eJAWXJUkkyJHDsYMYAulZe2bdRuN3+9NvPq/7g6oCW1Efi2kD44XI51uYYnMrNQ/amUt0761cDwhLZOvEY/PDbNqHU3O/kMOkKedIUEzPbG3f+LTxwjrKi8M5fZfGYr6KtbaCT7QcIBkT+L0xUXJNe9dsxq9tXhoNvOlpDde6kI+0UAEpBgDQadw0xN4Dmpy+UxXNO/VkNOMuqAr6aUBJOg5c6d3pqfHHVmp3GslKTUNqQn2rRrIIKY1cUZn8/XB4qbsm7tMpzBeuQaQOwa1wni4ZmZwxu9bd6S0vtU16u3F7QbSHFVJUtKeSuU8R6TBjvjBXyAakBQXMv1YWhQWhfBoO8Ng+s/DB+Q1RVsBQUlSqxxKQRE/cPw089MAVNdfRUqQ3mS9JKQCZqSdhJGo9/TDLL9Rd1X2nD95uLqUVhaU268SlQHBoR5mMTMR43Or3qsc6Ki6mUj7idDqfvK6nXEDaniLOvlkBKLglJjrJIO3XtHfFxndfHe6VkJlCmSskkDZY6bDc/Ix51YnosF2WskrZrmHgZiJcSdfnpjTqzkZlwpVbr4psgFSqOCpWp7agNjJPa/0wJftbFahA7QR8eSTPpgzLXE5T39SUwSikIB/9xE/M+eAbxUMqy7a3isFsqCOIGO0GVA+fTAT5f34nI64hP+z1MhavuoSAvaTxCRPjJ+HhizWAvMl+MEBK1aDqeaRv874i7rwrydTPpMlYSAeLcc0fpiydUE3vMLwnhQtZMbwl4z+RxLImOqfqP+JB1P1VR9/YGDcwJD1M6VSf5k1IJEkco6E+eBCmcxJ5nDBpTG23LR674MuSkKS8pEgIuAJB/wALKD5/ewHj9THdLOL46xbqR2CVEGIjugeE+WHlhSBmJhCUf9epWggjQEek4nVrKFoStWpUoRMf2p3/AMo+GKLL6uLNdKZkqqlmfANaR4aenvwuPZNmcVHneupKKu51Rb11TjVGp0FNRy5SFCU/dV75xLv11jt9AHEWJ9TFSQpYTWjcJChpyvHQ76YofpBa5rrm32trcQAN9VI11+dcQL6CqyUpdgBpTYUABP8AST8+YnGoBsxVllutkqzdG/YdSzx07LzhNUCHBzYSB2BsTM+WOfVLBUcuhTaqjgZ5i0g1KQApKigwODX9/gjy1K/aSkohKrYgSD/a+2Jj3yNfftGHXEhFdVuBKpW6+kyYBBfnWN9Yj3+OBkadTa43D3ausdny8tT1jq3LeyFApTWajgXt/TEGR89WuaLpa7XfrgzUW+tWt8uqWW3wAocxRMgo7wSNTv1wjzWyh3Jl1KtXUKUqANAC+F+enFr7vMr6RlFObmkKTKCmo1H/AJq6f5vTxwrqOPLFPV1mp69VSbdWrqEoWkKFQDEQkkynbQDx09+NnrjaKjLlzrBb6sJo67kuo5ySpay2iCnSI4SkdNumFFciamuTKuyFJAHWVoUfA9dP2xk6A3kLMDgAJcuyFSmTMoZBjy/LCOIkRdkDcLxYKerbSq1VriinjBFQkcIK1JBiD1Pr11w4yvc7bUZio26a1vNrW84EOKqQ5wkJkmODXQgYhLs8Hbgw3ICF8uRM6F10/oPhiqyYUHNFpUgCAuqKiTEEJAOvl7scYmp8m//Z"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs9>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/collection/' + collection.id">                   
                      <div :title="collection.collection.text" class="secondary--text text--lighten-1 collection-name subheading font-weight-medium pointer">{{ collection.collection.text }}</div>
                    </router-link>
                    <div>                    
                      <v-progress-linear class="ma-0 mt-1 mb-1" :color="collection.percentComplete == 100 ? 'green' : 'secondary'" height="6" :value="collection.percentComplete" ></v-progress-linear>
                      </div>
                    <div class="caption accent--text">
                      <v-icon
                        v-if="collection.isLocked"
                        style="float:left;"
                        title="Collection is locked!"
                        small
                        color="warning"
                      >lock</v-icon>                       
                      <span title="Releases Count">{{ collection.collectionCount | padNumber3 }}</span> | <span title="Releases Found Count">{{ collection.collectionFoundCount | padNumber4 }}</span>
                    </div>
                    <div v-if="listNumber" class="caption accent--text"><span title="Rank/Number in Collection">&num;{{ listNumber | padNumber3 }} of {{ collection.collectionCount | padNumber3 }}</span></div>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'CollectionCard',
    props: {
        collection: Object,
        listNumber: Number
    },
    methods: {
    },
    computed: {
    },
    data: () => ({
        //isFavorite: false
    })
}
</script>

<style>
    .collection-card .v-progress-linear {
        border-radius: 5px;
    }
</style>