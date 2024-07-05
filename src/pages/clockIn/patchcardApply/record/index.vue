<template>
    <div class="wrap">
        <div class="rowWrap" v-for="(item,index) in 5" :key="index" @click="getDetail">
            <p class="title">补卡班次</p>
            <div class="cont">
                2019-05-13,星期一,默认班次,上班时间09:00  补卡时间
            </div>
            <div class="bot">
                <p>2019.05.22</p>
                <p>审批中</p>
            </div>
        </div>
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
        getDetail(){
            const url = '/pages/clockIn/patchcardApply/record/detail/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .rowWrap{
            background: #fff;
            padding: 33rpx;
            margin-bottom: 35rpx;
            .title{
                font-size: 33rpx;
                color: #333333;
            }
            .cont{
                font-size: 28rpx;
                color: #666666;
                padding: 20rpx 0;
            }
            .bot{
                display: flex;
                justify-content: space-between;
                align-items: center;
                p:nth-child(1){
                    color: #666666;
                    font-size: 28rpx;
                }
                p:nth-child(2){
                    font-size: 22rpx;
                    color: #ff9237;
                    border-radius: 21rpx;
                    border: 7rpx solid #ff9237;
                    padding: 1rpx 10rpx;
                }
            }
        }
    }
</style>