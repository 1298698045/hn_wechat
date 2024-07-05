<template>
    <div class="wrap">
        <div class="container">
            <div class="header">
                <div class="textWrap">
                    <h3>
                        张丽萍
                    </h3>
                    <p>绍兴第二医院   信息中心</p>
                </div>
                <div class="name">
                    <p>丽萍</p>
                </div>
            </div>
            <div class="content">
                <div class="imgWrap">
                    <img src="data:image/png;base64,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" alt="">
                </div>
                <p>扫一扫二维码，收下我的名片</p>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <p>
                    保存到手机
                </p>
                <p class="share">分享</p>
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
        .container{
            width: 683rpx;
            height: auto;
            background: #fff;
            border-radius: 14rpx;
            margin: 56rpx auto;
            .header{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 35rpx;
                .textWrap{
                    h3{
                        color: #333333;
                        font-size: 40rpx;
                        font-weight: bold;
                    }
                    p{
                        font-size: 28rpx;
                        color: #999999;
                    }
                }
                .name{
                    p{
                        width: 83rpx;
                        height: 83rpx;
                        line-height: 83rpx;
                        border-radius: 50%;
                        text-align: center;
                        background: #3399ff;
                        color: #fff;
                        font-size: 26rpx;
                    }
                }
            }
            .content{
                border-top: 1rpx solid #e2e4e3;
                padding:80rpx 0; 
                .imgWrap{
                    width: 405rpx;
                    height: 405rpx;
                    margin: auto;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
                p{
                    font-size: 28rpx;
                    color: #999999;
                    text-align: center;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 35rpx;
            .box{
                display: flex;
                justify-content: space-between;
                padding: 0 35rpx;
                p{
                    font-size: 33rpx;
                    width: 330rpx;
                    height: 83rpx;
                    text-align: center;
                    line-height: 83rpx;
                    background: #fff;
                    background-color: rgba(255, 255, 255, 1);
                    box-shadow: rgba(218, 220, 219, 1) solid 5rpx;
	                border-radius: 5rpx;
                    color: #333333;
                }
                .share{
                    background: #3399ff;
                    color: #fff;
                }
            }
        }
    }
</style>