<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <div class="deppartment">
                    <p class="name">内科</p>
                    <p class="detail_text">详情
                        <i-icon type="enter" />
                    </p>
                </div>
                <div class="create">
                    创建者：我
                    <span>编号：230107</span>
                </div>
            </div>
            <div class="depart">
                <div class="line">
                    <p class="lable">
                        科室人员
                    </p>
                    <p class="total">
                        共2人
                        <i-icon type="enter" />
                    </p>
                </div>
                <div class="invitation">
                    <div class="avatar">

                    </div>
                    <p class="btn">邀请人员</p>
                </div>
            </div>
        </div>
        <div class="center">
            <div class="panel">
                <h3 class="title">排班管理</h3>
                <div class="box_wrap">
                    <div class="shift">
                        <div class="left" @click="handleShift">
                            排班
                        </div>
                        <div class="right">
                            <div class="box" @click="handleShiftAdmin">
                                班次管理
                            </div>
                            <div class="box" @click="handleShiftSetting">
                                排班设置
                            </div>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="box">审批</div>
                        <div class="box">统计</div>
                        <div class="box">导出</div>
                    </div>
                </div>
            </div>
            <div class="panel">
                <h3 class="title">排班学习</h3>
                <div class="box_wrap">
                    <div class="shift">
                        <div class="left">
                        </div>
                        <div class="rightCopy">
                        </div>
                    </div>
                </div>
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
    methods:{
        // 排班
        handleShift(){
            wx.navigateTo({
                url: '/pages/scheduling/departScheduling/main'
            })
        },
        // 班次管理
        handleShiftAdmin(){
            wx.navigateTo({
                url: '/pages/scheduling/shift/main'
            })
        },
        handleShiftSetting(){
            wx.navigateTo({
                url: '/pages/scheduling/shift_setting/main'
            })
        }
    }
}
</script>
<style lang="scss">
page{
    background: #fff;
}
    .wrap{
        .header{
            margin: 20rpx;
            background: #fff;
            border-radius: 10rpx;
            box-shadow: 0px 0px 10rpx 0px rgba(0, 0, 0, 0.2);
            .row{
                padding: 20rpx 20rpx 10rpx;
                box-sizing: border-box;
                border-bottom: 1rpx solid #e2e3e5;
                .deppartment{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 24rpx;
                    .name{
                        font-size: 28rpx;
                        font-weight: bold;
                        color: #333;
                    }
                    .detail_text{
                        color: #999;
                    }
                }
                .create{
                    font-size: 24rpx;
                    color: #333;
                    padding-top: 20rpx;
                    span{
                        padding-left: 50rpx;
                    }
                }
            }
            .depart{
                padding: 20rpx 30rpx 30rpx 20rpx;
                .line{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 26rpx;
                }
                .invitation{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 20rpx;
                    .btn{
                        font-size: 30rpx;
                        color: #3399ff;
                        padding: 10rpx 20rpx;
                        border-radius: 30rpx;
                        border: 1rpx solid #3399ff;
                    }
                }
            }
        }
        .center{
            padding: 20rpx;
            box-sizing: border-box;
            .panel{
                margin-bottom: 20rpx;
                .title{
                    font-size: 30rpx;
                    font-weight: bold;
                    color: #333;
                    padding-bottom: 20rpx;
                }
                .box_wrap{
                    .shift{
                        display: flex;
                        justify-content: space-between;
                        .left{
                            width: 49%;
                            height: 200rpx;
                            line-height: 200rpx;
                            background: #3399ff;
                            font-size: 28rpx;
                            color: #fff;
                            text-align: center;
                            border-radius: 5rpx;
                        }
                        .rightCopy{
                            width: 49%;
                            height: 200rpx;
                            line-height: 200rpx;
                            background: #3399ff;
                            font-size: 28rpx;
                            color: #fff;
                            text-align: center;
                            border-radius: 5rpx;
                        }
                        .right{
                            width: 49%;
                            .box{
                                height: 90rpx;
                                line-height: 90rpx;
                                text-align: center;
                                font-size: 28rpx;
                                color: #fff;
                                background: #3399ff;
                                border-radius: 5rpx;
                            }
                            .box:last-child{
                                margin-top: 20rpx;
                            }
                        }
                    }
                    .flex{
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20rpx;
                        .box{
                            flex: 1;
                            height: 100rpx;
                            line-height: 100rpx;
                            font-size: 28rpx;
                            color: #333;
                            background: #f4f4f4;
                            text-align: center;
                            border-radius: 5rpx;
                        }
                        .box:nth-child(2){
                            margin: 0 20rpx;
                        }
                    }
                }
            }
        }
    }
</style>