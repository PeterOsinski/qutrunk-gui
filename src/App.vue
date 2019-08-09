<template>
    <div>
        <vue-progress-bar></vue-progress-bar>
        <div style="position:fixed; z-index:10000; right: 20px; top:40px;">
            <div v-if="$notify" v-for="msg in messages" :class="'alert bg-'+msg.type" style="box-shadow: 1px 1px 15px rgba(0,0,0,.7);">
                {{msg.text}}
                <i style="cursor:pointer" @click="$notify.close(msg.uuid)" class="icon-close2"></i>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {
            messages: [],
        }
    },
    mounted() {
        this.$api.setProgress(this.$Progress)
        this.$notify.setHandler((messages) => {
            this.messages = messages
        })
    }
}
</script>