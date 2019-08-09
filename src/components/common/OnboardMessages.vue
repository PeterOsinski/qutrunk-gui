<template>
    <div class="row">
        <div class="offset-xl-3 col-xl-6 col-sm-12" style="text-align: center">
            <div class="alert bg-teal text-white alert-rounded" v-if="$storage.counters.queue === 0 && $storage.counters.token === 0">
                <span class="font-weight-semibold"></span> It seem that you are just starting,
                <router-link :to="{name:'queues'}">create queue</router-link> and then
                <router-link :to="{name:'access_tokens'}">access token</router-link>
                to start sending and receiving messages!
            </div>
            <div class="alert bg-teal text-white alert-rounded" 
            v-if="$storage.counters.queue > 0 && $storage.counters.token === 0 && $route.name !== 'access_tokens'">
                <span class="font-weight-semibold"></span> You already have a queue but you also need an <router-link :to="{name:'access_tokens'}">access token</router-link> to start sending and receiving messages!
            </div>
            <div class="alert bg-teal text-white alert-rounded" 
            v-if="$storage.counters.queue === 0 && $storage.counters.token > 0 && $route.name !== 'queues'">
                <span class="font-weight-semibold"></span> You already have an access token, but don`t have any <router-link :to="{name:'queues'}">queue</router-link>. Queues are transport layer for your messages!
            </div>
        </div>
    </div>
</template>