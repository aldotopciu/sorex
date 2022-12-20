<script setup>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import { ref, watchEffect } from 'vue'
import { useWorkspace } from '@/composables'
import axios from 'axios'
import process from 'process'

const workspace = useWorkspace()
const {wallet} = workspace
const tokens = ref(null)
watchEffect(async () => {
    if(wallet.value){
        const response = await axios({
            url: process.env.VUE_APP_NETWORK,
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: [
                {
                jsonrpc: "2.0",
                id: 1,
                method: "getTokenAccountsByOwner",
                params: [
                    wallet.value.publicKey.toBase58(),
                    {
                    mint: process.env.VUE_APP_TOKEN_PK,
                    },
                    {
                    encoding: "jsonParsed",
                    },
                ],
                }
            ]
        });
        if(response.data[0].result){
            tokens.value = response.data[0].result.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        }
    }
})
</script>

<template>
<div class="skins mb-5 p-3 pb-5">
      <div class="d-flex justify-content-between">
        <h5>Saldo: <b>{{tokens ? tokens : 0}} SoRex</b></h5>
        <div>
            <router-link :to="{ name: 'Landing' }">
                <button class="btn btn-dark">&laquo; Indietro</button>
            </router-link>
        </div>   
      </div>
      <div>
        <div class="d-flex justify-content-center pt-5 my-5">
            <div class="col-8">
            <carousel :items-to-show="5">
                <slide :key="1" class="d-inline">
                <div class="caracter text-center">
                    <div class="caracter-title">
                    Tyrannosaurus Rex
                    </div>
                    <div class="caracter-image">
                    <img style="width:100%" src="/dinos/Tyrannosaurus_Rex.png" alt="Rex">
                    </div>
                    <div class="caracter-price">
                    </div>
                </div>
                <div class="caracter-buttons text-center mt-3 pb-1">
                    <button class="btn btn-outline-success">Selezionato</button>
                </div>
                </slide>
                <slide :key="2" class="d-inline">
                <div class="caracter text-center">
                    <div class="caracter-title">
                    Brontosaurus
                    </div>
                    <div class="caracter-image">
                    <img style="width:100%" src="/dinos/Brontosaurus.png" alt="Rex">
                    </div>
                    <div class="caracter-price">
                    </div>
                </div>
                <div class="caracter-buttons text-center mt-3 pb-1">
                    <button class="btn btn-success">Seleziona</button>
                </div>
                </slide>
                <slide :key="3" class="d-inline">
                <div class="caracter text-center">
                    <div class="caracter-title">
                    Stegosaurus
                    </div>
                    <div class="caracter-image">
                    <img style="width:100%" src="/dinos/Stegosaurus.png" alt="Rex">
                    </div>
                    <div class="caracter-price">
                    44 SoRex
                    </div>
                </div>
                <div class="caracter-buttons text-center mt-3 pb-1">
                    <button class="btn btn-primary">Acquista</button>
                </div>
                </slide>
                <slide :key="4" class="d-inline">
                <div class="caracter text-center">
                    <div class="caracter-title">
                    Triceratops
                    </div>
                    <div class="caracter-image">
                    <img style="width:100%" src="/dinos/Triceratops.png" alt="Rex">
                    </div>
                    <div class="caracter-price">
                    55 SoRex
                    </div>
                </div>
                <div class="caracter-buttons text-center mt-3 pb-1">
                    <button class="btn btn-primary">Acquista</button>
                </div>
                </slide>
                <slide :key="5" class="d-inline">
                <div class="caracter text-center">
                    <div class="caracter-title">
                    Parasaurolophus
                    </div>
                    <div class="caracter-image">
                    <img style="width:100%" src="/dinos/Parasaurolophus.png" alt="Rex">
                    </div>
                    <div class="caracter-price">
                    77 SoRex
                    </div>
                </div>
                <div class="caracter-buttons text-center mt-3 pb-1">
                    <button class="btn btn-primary">Acquista</button>
                </div>
                </slide>
                <slide :key="6" class="d-inline">
                <div class="caracter text-center">
                    <div class="caracter-title">
                    Velociraptor
                    </div>
                    <div class="caracter-image">
                    <img style="width:100%" src="/dinos/Velociraptor.png" alt="Rex">
                    </div>
                    <div class="caracter-price">
                    88 SoRex
                    </div>
                </div>
                <div class="caracter-buttons text-center mt-3 pb-1">
                    <button class="btn btn-primary">Acquista</button>
                </div>
                </slide>
            </carousel>
            </div>
        </div>
      </div>
    </div>
</template>
