<template>
    <div class="wrap">
        <div class="content">
            <div class="row">
                <p class="title">选择需导出的报表</p>
                <p class="cont">月度汇总<i-icon type="enter" color="#cccccc" /></p>
            </div>
            <div class="row">
                <p class="title">开始时间</p>
                <picker mode="date" :value="startDate" @change="startDateChange">
                    <p class="cont">{{startDate}}<i-icon type="enter" color="#cccccc" /></p>
                </picker>
            </div>
            <div class="row">
                <p class="title">结束时间</p>
                <picker mode="date" :value="endDate" @change="endDateChange">
                    <p class="cont">{{endDate}}<i-icon type="enter" color="#cccccc" /></p>
                </picker>
            </div>
            <div class="row">
                <p class="title">查询人群</p>
                <p class="contWrap"><span>全医院</span><span>员工</span></p>
            </div>
            <div class="textWrap">
                <p>1、导出的结果中，若查看不到假期、外出、出差、加班、调休，请进行 <span>绑定审批单</span>；</p>
                <p>2、在电脑上打开考勤管理后台oa.Hospital.com，也可以导出考勤数据。</p>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <van-button type="primary" color="#3399ff" block>导出报表</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            startDate:"2020-04-01",
            endDate:"2020-04-30"
        }
    },
    methods:{
        startDateChange(e){
            this.startDate = e.mp.detail.value;
        },
        endDateChange(e){
            this.endDate = e.mp.detail.value;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .content{
            .row{
                padding: 20rpx 33rpx;
                display: flex;
                justify-content: space-between;
                border-bottom: 1rpx solid #eceeed;
                background: #fff;
                .title{
                    font-size: 32rpx;
                    color: #666666;
                }
                .cont{
                    font-size: 31rpx;
                    color: #333333;
                }
                .contWrap{
                    span{
                        display: inline-block;
                        width: 124rpx;
                        height: 58rpx;
                        line-height: 58rpx;
                        font-size: 25rpx;
                        text-align: center;
                        background: #3399ff;
                        color: #fff;
                    }
                    span:nth-child(1){
                        border-top-left-radius: 5rpx;
                        border-bottom-left-radius: 5rpx;
                        border: 5rpx solid #3399ff;
                        box-shadow: border-box;
                    }
                    span:nth-child(2){
                        color: #3399ff;
                        background: #fff;
                        border:5rpx solid #3399ff;
                        box-shadow: border-box;
                        border-top-right-radius: 5rpx;
                        border-bottom-right-radius: 5rpx;
                    }
                }
            }
            .row:last-child{
                border: none;
            }
            .textWrap{
                padding: 33rpx;
                p{
                    font-size: 24rpx;
                    color: #999999;
                    span{
                        color: #3399ff;
                    }
                }
                p:nth-child(2){
                    margin-top: 10rpx;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box{
                padding: 10rpx 33rpx;
            }
        }
    }
</style>