<template>
    <div class="wrap">
        <div class="nav">
            <p class="time">2020年8月</p>
            <p class="money">9,996.05</p>
            <p class="text">实发金额总和（元）</p>
        </div>
        <div class="center">
            <div class="content">
                <div class="title">
                    <h3>基本信息</h3>
                </div>
                <div class="info">
                    <div class="row">
                        <p class="name">姓名</p>
                        <p class="value">张丽萍</p>
                    </div>
                    <div class="row">
                        <p class="name">部门</p>
                        <p class="value">信息中心</p>
                    </div>
                    <div class="row">
                        <p class="name">员工工号</p>
                        <p class="value">zlp3312</p>
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="title">
                    <h3>基本信息</h3>
                    <p>
                        金额合计
                        <span>11,470.00</span>
                    </p>
                </div>
                <div class="info">
                    <div class="row">
                        <p class="name">姓名</p>
                        <p class="value">张丽萍</p>
                    </div>
                </div>
                <div class="contWrap">
                    <div class="rowItem" @click="getShowCont">
                        <p class="name">工资收入</p>
                        <p class="value">小计
                            <span>1,408.00</span>
                            <i-icon type="unfold" color="#666666" size="15" />
                        </p>
                    </div>
                    <div class="rows" v-if="isBook" v-for="(item,index) in 5" :key="index">
                        <p class="name">岗位工资</p>
                        <p class="value">590.00</p>
                    </div>
                </div>
                <!-- <div class="info">
                    <div class="row">
                        <p class="name">姓名</p>
                        <p class="value">张丽萍</p>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            isBook:true
        }
    },
    methods:{
        getShowCont(){
            this.isBook = !this.isBook;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-bottom: 20px;
        .nav{
            width: 100%;
            height: 267rpx;
            background: #3399ff;
            text-align: center;
            color: #ffffff;
            .time{
                font-size: 24rpx;
                padding: 31rpx 0;
            }
            .money{
                font-size: 72rpx;
                font-weight: bold;
            }
            .text{
                font-size: 22rpx;
                opacity: .5;
            }
        }
        .center{
            padding: 0 33rpx;
            .content{
                width: 100%;
                background: #fff;
                border-radius: 6rpx;
                padding: 0 27rpx;
                margin-top: 29rpx;
                .title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    h3{
                        font-size: 32rpx;
                        color: #333333;
                        font-weight: bold;
                        padding: 21rpx 0;
                    }
                    p{
                        font-size: 28rpx;
                        color: #666666;
                        span{
                            font-weight: bold;
                            color: #ff6666;
                        }
                    }
                }
                .info{
                    .row{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 23rpx 0;
                        .name{
                            font-size: 28rpx;
                            color: #666666;
                        }
                        .value{
                            font-size: 28rpx;
                            font-weight: bold;
                            color: #333333;
                        }
                    }
                }
                .contWrap{
                    .rowItem{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 23rpx 0;
                        background: #fafbfd;
                        .name{
                            font-size: 28rpx;
                            color: #333333;
                            font-weight: bold;
                        }
                        .value{
                            font-size: 26rpx;
                            color: #666666;
                            span{
                                color: #333333;
                                font-weight: bold;
                                margin: 0 10rpx;
                            }
                        }
                    }
                    .rows{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 23rpx 0;
                        .name{
                            font-size: 28rpx;
                            color: #666666;
                        }
                        .value{
                            font-size: 28rpx;
                            font-weight: bold;
                            color: #333333;
                        }
                    }
                }
            }
        }
    }
</style>