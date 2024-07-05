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
            // webUrl:"http://47.94.136.165:9009/wf/performRpt.aspx?sessionKey=2EC00CF2-A484-4136-8FEF-E2A2719C5ED6"
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.webUrl = `${this.$api.public.url}/wf/performRpt.aspx?sessionKey=${sessionkey}`;
        console.log(this.webUrl);
    }
}
</script>
<style lang="scss">
    
</style>