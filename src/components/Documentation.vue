<template>
    <div>
        <div class="content" style="padding: 0">
            <h2 v-if="show" style="padding:5px">Loading documentation...</h2>
            <iframe src="https://qutrunk.docs.stoplight.io/" @load="iframeLoaded" border="0" :style="'width:100%;height:'+this.getHeight()+'px;border:0'">
            </iframe>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                show: true
            }
        },
        methods: {
            iframeLoaded(){
                this.show = false
            },
            getHeight(){
                return window.innerHeight
            }
        }
    }
</script>