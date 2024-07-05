<template>
    <div class="wrapper">
        <div class="center">
            <div class="panel">
                <picker @change="changeCompany" :value="typeIdx" :range="company">
                    <van-cell title="工时单位" is-link :value="company[companyIdx]">
                        <van-icon slot="right-icon" name="arrow" class="custom-icon" />
                    </van-cell>
                </picker>
            </div>
            <div class="panel">
                <picker @change="changeShiftPattern" :value="shiftPatternIdx" :range="shiftPattern">
                    <van-cell title="排班模式" is-link :value="shiftPattern[shiftPatternIdx]">
                        <van-icon slot="right-icon" name="arrow" class="custom-icon" />
                    </van-cell>
                </picker>
                <picker @change="changeWeek" :value="weekIdx" :range="week">
                    <van-cell title="每周第一天" is-link :value="week[weekIdx]">
                        <van-icon slot="right-icon" name="arrow" class="custom-icon" />
                    </van-cell>
                </picker>
            </div>
            <div class="panel">
                <van-cell title="排班周期预览" :value="'周一至周日'">
                </van-cell>
            </div>
        </div>
        <div class="footer">
            <div class="row">
                <p class="btn" :class="{'active':isModelmes}">保存</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            company: ['小时','天'],
            companyIdx: 0,
            shiftPattern:['周排班','2周排班','半月排班','月排班'],
            shiftPatternIdx: 0,
            week:['周一','周二','周三','周四','周五','周六','周日'],
            weekIdx: 0
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    methods:{
        changeCompany(e){
            this.typeIdx = e.mp.detail.value;
        },
        changeShiftPattern(e){
            this.shiftPatternIdx = e.mp.detail.value;
        },
        changeWeek(e){
            this.weekIdx = e.mp.detail.value;
        }
    }
}
</script>
<style lang="scss">
    .wrapper{
        .panel{
            margin-top: 20rpx;
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .row{
                display: flex;
                border-top: 1rpx solid #e2e3e5;
                .label{
                    font-size: 24rpx;
                    flex: 1;
                    padding: 30rpx 0 30rpx 20rpx;
                    text-align: center;
                    color: #3399ff;
                }
                .label.active{
                    padding-bottom: 40rpx;
                }
                .btn{
                    flex: 1;
                    padding: 30rpx 0;
                    background: #3399ff;
                    color: #fff;
                    font-size: 26rpx;
                    text-align: center;
                }
                .btn.active{
                    padding-bottom: 100rpx;
                }
            }
        }
    }
</style>