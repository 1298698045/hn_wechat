<template>
    <div>
        <button @click="getRun">获取步数</button>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    onLoad(){

    },
    methods:{
        getRun(){
            wx.getWeRunData({
                success (res) {
                    // 拿 encryptedData 到开发者后台解密开放数据
                    const encryptedData = res.encryptedData;
                    console.log(encryptedData,'encrypteDate')
                }
            })
        }
    }
}
</script>