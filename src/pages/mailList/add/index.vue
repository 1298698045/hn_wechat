<template>
    <div class="wrap">
        <div class="content">
            <div class="box">
                <div class="imgWrap">
                    <img src="https://oawx.hnca.org.cn/img/wechat/Organization_system.png" alt="">
                </div>
                <div class="cont">
                    <p>创建团队</p>
                    <p class="text">团队/单位/组织</p>
                </div>
            </div>
            <div class="box">
                <div class="imgWrap">
                    <img src="https://oawx.hnca.org.cn/img/wechat/Join_team.png" alt="">
                </div>
                <div class="cont">
                    <p>创建团队</p>
                    <p class="text">团队/单位/组织</p>
                </div>
            </div>
        </div>
        <h3>添加好友</h3>
        <div class="content">
            <div class="box">
                <div class="imgWrap">
                    <img src="https://oawx.hnca.org.cn/img/wechat/Search.png" alt="">
                </div>
                <div class="cont">
                    <p>输入手机号/账号搜索</p>
                </div>
            </div>
            <div class="box">
                <div class="imgWrap">
                    <img src="https://oawx.hnca.org.cn/img/wechat/Scan.png" alt="">
                </div>
                <div class="cont">
                    <p>扫一扫加好友</p>
                </div>
            </div>
            <div class="box">
                <div class="imgWrap">
                    <img src="https://oawx.hnca.org.cn/img/wechat/AddPhone.png" alt="">
                </div>
                <div class="cont">
                    <p>添加手机联系人</p>
                </div>
            </div>
        </div>
        <div class="code">
            <p>我的二维码名片</p>
            <p class="imgWrap">
                <img src="https://oawx.hnca.org.cn/img/wechat/Rcode.png" alt="">
            </p>
        </div>
        <h3>添加同事</h3>
        <div class="content">
            <div class="box">
                <div class="imgWrap">
                    <img src="https://oawx.hnca.org.cn/img/wechat/Addmail.png" alt="">
                </div>
                <div class="cont">
                    <p>添加成员加入团队</p>
                </div>
            </div>
        </div>
        <h3>添加外部联系人</h3>
        <div class="content">
            <div class="box">
                <div class="imgWrap">
                    <img src="https://oawx.hnca.org.cn/img/wechat/05.6.External_Contacts_.png" alt="">
                </div>
                <div class="cont">
                    <p>添加外部联系人</p>
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
    @import '../../../../static/css/public.scss';
    .content{
        background: #fff;
        margin: 20rpx 0;
        padding:0 30rpx;
        .box{
            display: flex;
            .imgWrap{
                width: 100rpx;
                height: 100rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 50rpx;
                    height: 50rpx;
                }
            }
            .cont{
                width: 100%;
                display: flex;
                justify-content: space-between;
                font-size: 30rpx;
                border-bottom: 1rpx solid #e2e4e3;
                p{
                    line-height: 100rpx;
                }
                .text{
                    font-size: 12px;
                    color: #999999;
                }

            }
        }
        .box:last-child .cont{
            border: none;
        }
    }
    h3{
        font-size: 28rpx;
        color: #999999;
        padding:0 30rpx;
    }
    .code{
        padding: 0 30rpx;
        font-size: 12px;
        color: #999999;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        .imgWrap{
            width: 30rpx;
            height: 30rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>