<template>
    <div class="wrap">
        <div class="center">
            <div class="inp">
                <van-field
                    :value="value"
                    placeholder="输入文件夹名称"
                    :border="false"
                    @change="onChange"
                />
            </div>
            <div class="btn">
                <van-button type="primary" color="#3399ff" block>确定</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
    },
    methods:{

    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .inp{
            margin-top: 30px;
        }
        .btn{
            padding: 30rpx;
            margin-top: 30px;
        }
    }
</style>