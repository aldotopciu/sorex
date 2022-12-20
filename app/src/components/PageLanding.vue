<script setup>
import { WalletMultiButton, WalletModalProvider, WalletDisconnectButton } from '@solana/wallet-adapter-vue-ui'
import { ref, watchEffect } from 'vue'
import { useWallet } from '@solana/wallet-adapter-vue'
import { useWorkspace } from '@/composables'
import axios from 'axios'
import process from 'process'

const { connected } = useWallet()
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
    <div>
        <div class="landing my-5 py-5" v-if="!connected">
            <div class="text-center">
                <h1>Benvenuto a SoRex</h1>
                <p class="text-muted">
                    Per poter giocare, bisogna prima connettere il tuo wallet Solana. <br>
                    Clicca <a href="/wallet/guida">qui</a> per seguire la guida per la connessione del wallet.
                </p>

                <!-- Connect Wallet -->
                <wallet-modal-provider>
                    <wallet-multi-button class="connect-button"></wallet-multi-button>
                </wallet-modal-provider>
            </div>
        </div>
        <div class="home mb-5 p-3 pb-5" v-if="connected">
            <div class="d-flex justify-content-between">
                <h5>Saldo: <b id="token-balance">{{tokens ? tokens : 0}} SoRex</b></h5>
                <div class="d-flex">
                <WalletDisconnectButton class="d-none" id="logout-button"/>
                <p class="btn btn-dark btn-sm" @click="logout()">Disconnetti</p>
                <router-link :to="{ name: 'Skins' }">
                    <h5 class="mx-3" title="Caratteri" style="cursor:pointer"><img src="/burger.png" alt="Skins" style="height: 30px;width:30px"></h5>
                </router-link>
                </div>  
            </div>
            <div class="text-center my-5 pt-5">
                <h4 class="mb-4">Premi il bottone per giocare (costo: 3 SoRex)</h4>
                <img style="height: 100px;width:100px;cursor:pointer" src="/play.png" alt="Play" @click="play">
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PageLanding',
  methods: {
    logout(){
      document.getElementById('logout-button').click();
    },
    play(){
        location.href = location.href + 'play'
        location.reload();
    }
  },
}
</script>
