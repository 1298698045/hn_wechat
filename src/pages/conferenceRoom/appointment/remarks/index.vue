<template>
    <div class="wrap">
        <div class="center">
            <div class="content">
                <textarea v-model="remarks" name="" id="" cols="30" rows="10" placeholder="输入内容描述"></textarea>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <van-button type="primary" color="#f3f3f3" :disabled="disabled" custom-class="btn black" block>取消</van-button>
                <van-button type="primary" color="#3399ff" :disabled="disabled" custom-class="btn" block>完成</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            remarks:"",
            // disabled:true
        }
    },
    computed:{
        disabled(){
            return this.remarks ? this.disabled = false : true;
        }
    },
    onLoad(){

    },
    methods:{

    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            background: #fff;
            .content{
                width: 90%;
                margin: 35rpx auto;
                textarea{
                    width: 100%;
                    height: 300px;
                    padding: 20rpx 0;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box{
                display: flex;
                justify-content: space-around;
                padding: 20rpx 0;
                .btn{
                    width: 328rpx;
                }
                .black{
                    color: #333333 !important;
                }
            }
        }
    }
</style>