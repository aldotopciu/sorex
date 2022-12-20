<template>
    <div class="p-5 text-center">
        <p>Pagina non trovata!</p>
        <router-link :to="{ name: 'Home' }" class="block text-black-200 hover:underline mt-2">
            Vai nella home
        </router-link>
    </div>
</template>
