<template>
    <div class="wrap">
        <div class="header">
            <div class="rows">
                <div class="avatar"></div>
                <div class="cont_info">
                    <p class="name">碧池</p>
                    <p class="code_depart">
                        <span class="code">
                            工号3493
                        </span>
                        <span class="depart">
                            临床科 · 主任医师
                        </span>
                    </p>
                </div>
                <div class="tag">
                    <span>在编</span>    
                </div>
            </div>
            <div class="jd_wrap">
                <div class="box">
                    <p class="label">擅长：</p>
                    <p class="desc">
                        血液疾病、多发性骨髓瘤、干细胞移植。
                    </p>
                </div>
                <div class="box marginTop">
                    <p class="label">个人经历：</p>
                    <p class="desc">
                        毕业后在绍兴第二医院工作至今，10余年的临床实践，有丰富的临床经验。
                    </p>
                </div>
            </div>
        </div>
        <div class="center">
            <div class="content">
                <p class="title">荣誉称号</p>
                <div class="block">
                    <p class="label">名称</p>
                    <p class="name">2017年先进医务工作者</p>
                    <div class="flex">
                        <div class="l">
                            <p class="dept">授予单位</p>
                            <p class="organizer">绍兴第二医院</p>
                        </div>
                        <div class="r">
                            <p class="dept">获奖时间</p>
                            <p class="organizer">2017/04</p>
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
    }
}
</script>
<style lang="scss">
    .wrap{
        .header{
            padding: 0 33rpx;
            background: #fff;
            .rows{
                padding: 25rpx 0;
                border-bottom: 1rpx solid #e2e4e3;
                display: flex;
                .avatar{
                    width: 83rpx;
                    height: 83rpx;
                    border-radius: 12rpx;
                    background: #ccc;
                }
                .cont_info{
                    flex: 1;
                    margin-left: 31rpx;
                    .name{
                        font-size: 33rpx;
                        font-weight: bold;
                        color: #333333;
                    }
                    .code_depart{
                        .code{
                            color: #a2a2a2;
                            font-size: 21rpx;
                            border: 1rpx solid #a2a2a2;
                            padding: 0 5rpx;
                        }
                        .depart{
                            font-size: 29rpx;
                            color: #999999;
                            margin-left: 23rpx;
                        }
                    }
                }
                .tag{
                    span{
                        font-size: 18rpx;
                        color: #39c1b3;
                        border: 4rpx solid #39c1b3;
                    }
                }
            }
            .jd_wrap{
                padding: 35rpx 0;
                .box{
                    .label{
                        font-size: 29rpx;
                        color: #333333;
                        font-weight: bold;
                    }
                    .desc{
                        font-size: 29rpx;
                        color: #999999;
                    }
                }
                .marginTop{
                    margin-top: 30rpx;
                }
            }
        }
        .center{
            .content{
                .title{
                    font-size: 26rpx;
                    color: #999999;
                    padding: 19rpx 33rpx;
                }
                .block{
                    background: #fff;
                    padding: 31rpx 33rpx;
                    .label{
                        font-size:24rpx;
                        color: #999999;
                    }
                    .name{
                        margin-top: 21rpx;
                        color: #333333;
                        font-size: 32rpx;
                    }
                    .flex{
                        margin-top: 60rpx;
                        display: flex;
                        .l,.r{
                            flex: 1;
                            .dept{
                                font-size: 24rpx;
                                color: #999999;
                            }
                            .organizer{
                                font-size: 31rpx;
                                color: #333333;
                                margin-top: 22rpx;
                            }
                        }
                        .l{
                            border-right: 1rpx solid #e2e3e5;
                        }
                        .r{
                            margin-left: 26rpx;
                        }
                    }
                }
            }
        }
    }
</style>