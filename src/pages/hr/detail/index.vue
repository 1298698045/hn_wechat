<template>
    <div class="wrap">
        <web-view :src="webUrl" v-if="webUrl!=''"></web-view>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:"",
            webUrl:""
        }
    },
    onLoad(options){
        let instanceId = options.instanceId;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.webUrl = `${this.$api.public.url}/wf/HandleWfInstance.aspx?sessionKey=${sessionkey}&instanceId=${instanceId}`;
    }
}
</script>
<style lang="scss">
    
</style>