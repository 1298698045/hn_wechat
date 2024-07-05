<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <p>考勤组名称</p>
                <p>
                    <input class="inp" type="text">
                </p>
            </div>
            <div class="rowTwo">
                <p>参与考勤人员</p>
                <p><i-icon type="enter" size="20" color="#cccccc" /></p>
            </div>
        </div>
        <h3>考勤组人员</h3>
        <div class="container">
            <div class="content">
                <div class="rowWrap">
                    <div class="l">
                        <p>参与考勤部门</p>
                        <p>新员工入职自动加入本考勤组</p>
                    </div>
                    <div>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
                <div class="rowWrap">
                    <div class="l">
                        <p>参与考勤人员</p>
                    </div>
                    <div>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
                <div class="rowWrap">
                    <div class="l">
                        <p>无需考勤人员</p>
                    </div>
                    <div>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
            </div>
            <h3>考勤地点(满足地点或Wi-Fi任一项即可打卡)</h3>
            <div class="content">
                <div class="rowWrap active">
                    <div class="l">
                        <p>添加办公地点</p>
                        <p>在此范围内即可打卡</p>
                    </div>
                    <div class="r">
                        <p>
                            <i-icon type="add" color="#3399ff" size="20" />
                        </p>
                    </div>
                </div>
                <div class="rowWrap">
                    <div class="l">
                        <p>100米</p>
                        <p>允许打卡范围</p>
                    </div>
                    <div>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
            </div>
            <h3> </h3>
            <div class="content">
                <div class="rowWrap active">
                    <div class="l">
                        <p>添加办公Wi-Fi</p>
                        <p>连上指定Wi-Fi即可打卡</p>
                    </div>
                    <div class="r">
                        <p>
                            <i-icon type="add" color="#3399ff" size="20" />
                        </p>
                    </div>
                </div>
                <div class="rowWrap">
                    <div class="l">
                        <p>TP-LINK_728B</p>
                        <p>24:de:c6:8f:cb:b2</p>
                    </div>
                    <div>
                        <i-icon type="close" color="#cccccc" size="20" />
                    </div>
                </div>
            </div>
            <h3> </h3>
            <div class="content">
                <div class="rowWrap">
                    <div class="l">
                        <p>高级设置</p>
                    </div>
                    <div>
                        <i-icon type="enter" color="#cccccc" size="20" />
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <van-button type="primary" color="#3399ff" block>保存考勤组</van-button>
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
    @import '../../../../static/css/public.scss';
    .wrap{
        .header{
            margin-top: 35rpx;
            .row{
                padding: 33rpx 33rpx;
                display: flex;
                background: #fff;
                border-bottom: 2rpx solid #e2e4e3;
                p{
                    font-size: 32rpx;
                    color: #333333;
                }
                p:nth-child(2){
                    margin-left: 20rpx;
                    .inp{

                    }
                }
            }
            .rowTwo{
                padding: 33rpx 33rpx;
                display: flex;
                justify-content: space-between;
                background: #fff;
            }
        }
        h3{
            padding: 33rpx;
            font-size: 26rpx;
            color: #999999;
        }
        .container{
            padding-bottom: 80px;
        }
        .content{
            .rowWrap{
                display: flex;
                justify-content: space-between;
                padding: 33rpx 33rpx;
                align-items: center;
                background: #fff;
                border-bottom: 2rpx solid #e2e4e3;
                .l{
                    p:nth-child(1){
                        font-size: 32rpx;
                        color: #333333;
                    }
                    p:nth-child(2){
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
            }
            .active{
                .l{
                    p:nth-child(1){
                        font-size: 32rpx;
                        color: #3399ff;
                    }
                }
                .r{
                    p{
                        width: 62rpx;
                        height: 62rpx;
                        line-height: 63rpx;
                        text-align: center;
                        border-radius: 50%;
                        border: 1rpx dashed #3399ff;
                    }
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