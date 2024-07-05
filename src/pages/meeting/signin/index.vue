<template>
    <div class="wrap">
        <div class="qrCode">
            <div class="border">
                <img class="code" :src="qrUrl" alt="">
                <!-- <img class="code" src="https://dss2.bdstatic.com/6Ot1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab" alt=""> -->
                <img class="horn" src="https://oawx.hnca.org.cn/img/wechat/horn.png" alt="">
            </div>
        </div>
        <div class="content">
            <div class="row">
                <div class="left">
                    <p>开始时间：05月25日 周一 09:00</p>
                </div>
                <p class="r">暂无人签到</p>
            </div>
            <div class="row">
                <div class="left">
                    <p>允许未收到邀请的人签到</p>
                    <p class="min">未收到邀请的人签到后将自动加入会议</p>
                </div>
                <p><van-switch :checked="checked" size="24px" @change="onChange" /></p>
            </div>
            <div class="row">
                <div class="left">
                    <p>使用动态二维码签到</p>
                    <p class="min">有效防止签到作弊</p>
                </div>
                <p><van-switch :checked="signCheck" size="24px" @change="onChangeSign" /></p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    data(){
        return {
            checked:true,
            signCheck:false,
            sessionkey:"",
            id:"",
            qrUrl:""
        }
    },
    computed:{
        ...mapState[{
            imgUrl:state=>{
                return state.user.imgUrl
            }
        }]
    },
    onLoad(options){
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.id = options.id;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.meeting.qrCode,
                    SessionKey:this.sessionkey,
                    path:'pages/meeting/signResult/main?id='+this.id,
                    width:430
                }
            }).then(res=>{
                console.log(res);
                this.qrUrl = res.data;
            })
        },
        onChange(e){
            this.checked = e.mp.detail;
        },
        onChangeSign(e){
            this.signCheck = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .qrCode{
            background: #fff;
            padding: 80rpx 0 140rpx 0;
            .border{
                width: 526rpx;
                height: 526rpx;
                margin: 0 auto;
                border: 16rpx solid #141f2b;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                .code{
                    width: 451rpx;
                    height: 451rpx;
                    vertical-align: middle;
                }
                .horn{
                    width: 49rpx;
                    height: 61rpx;
                    position: absolute;
                    left: -16rpx;
                    bottom: -77rpx;
                }
            }
        }
        .content{
            margin-top: 16rpx;
            background: #fff;
            padding-left: 33rpx;
            .row:nth-child(2),.row:nth-child(3){
                padding: 25rpx 33rpx;
            }
            .row:last-child{
                border: none;
            }
            .row{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 42rpx 33rpx;
                border-bottom: 2rpx solid #e3e3e3;
                .left{
                    font-size: 32rpx;
                    color: #333333;
                    .min{
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
                .r{
                    font-size: 24rpx;
                    color: #3399ff;
                }
            }
        }
    }
</style>