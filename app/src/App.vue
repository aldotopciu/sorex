<script setup>
import { useRoute } from 'vue-router'
import {
    getPhantomWallet,
    getBitpieWallet,
    getBloctoWallet,
    getCoin98Wallet,
    getLedgerWallet,
    getMathWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolflareWebWallet,
    getSolletWallet,
    getSolletExtensionWallet,
    getSolongWallet
  } from '@solana/wallet-adapter-wallets'
import { WalletProvider } from '@solana/wallet-adapter-vue'
import WorkspaceProvider from '@/components/WorkspaceProvider'

const route = useRoute()
const wallets = 
    [
      getPhantomWallet(),
      getBitpieWallet(),
      getBloctoWallet(),
      getCoin98Wallet(),
      getLedgerWallet(),
      getMathWallet(),
      getMathWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getSolflareWebWallet(),
      getSolletWallet(),
      getSolletExtensionWallet(),
      getSolongWallet()
    ];

</script>

<template>
    <wallet-provider :wallets="wallets" auto-connect>
        <workspace-provider>
            <div class="content">
                <div class="d-none">{{route}}</div>
                <router-view></router-view>
            </div>
        </workspace-provider>
    </wallet-provider>
</template>

<style>
.connect-button{
  display: inline;
  background-color: black!important;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%!important;
}
.caracter {
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.5);
  border-radius: 5%;
  height: 200px;
  margin-left: 4%;
  margin-right: 4%;
  border: solid 1px black;
}
.caracter-image{
  height: 150px;
  vertical-align: middle;
  display: table-cell;
}
.caracter-image img {
  max-height: 100%;
}
</style>
