<template>
    <div class="wrap">
        <div class="header">
            <div class="cont">
                <div class="imgs">
                    <img :src="imgUrl+'03.3.1.Signin_Succes.png'" alt="">
                    <!-- <img :src="imgUrl+'03.3.1.Signin_fail.png'" alt=""> -->
                </div>
                <p class="text">签到成功</p>
            </div>
        </div>
        <div class="center">
            <div class="content">
                <div class="row">
                    <p>
                        签到时间
                    </p>
                    <p>08:32</p>
                </div>
                <div class="row">
                    <p>
                        会议时间
                    </p>
                    <p>05月25日 周一 09:00 - 10:00</p>
                </div>
            </div>
        </div>
        <div class="meetingBottom">     
            <div class="meetingWrap" @click="getDetail">
                <div class="meeting">
                    会议详情
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            id:"",
            sessionkey:""
        }
    },
    computed:{
        imgUrl(){
            return this.$api.photo.url;
        }
    },
    onLoad(options){
        // let qrCode = decodeURIComponent(options.scene);
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.id = options.id;
        this.getQuery();
        this.getSignIn();
    },
    methods:{
        getSignIn(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.meeting.signIn,
                    SessionKey:this.sessionkey,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.meeting.detail,
                    SessionKey:this.sessionkey,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getDetail(){
            const url = '/pages/meeting/detail/main?id='+this.id;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .header{
            display: flex;
            justify-content: center;
            .cont{
                text-align: center;
                .imgs{
                    width: 173rpx;
                    height: 173rpx;
                    margin: 56rpx 0;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
                .text{
                    font-size: 32rpx;
                    color: #333333;
                }
            }
        }
        .center{
            margin-top: 56rpx;
            padding: 0 85rpx;
            .content{
                border-top: 2rpx solid #d7dadc;
                padding: 28rpx 0;
                .row{
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 28rpx;
                    p{
                        font-size: 28rpx;
                        color: #999999;
                    }
                }
            }
        }
        .meetingBottom{
            width: 100%;
            position: fixed;
            bottom: 50px;
            .meetingWrap{
                flex:0 0 auto;
                display: flex;
                justify-content: center;
                .meeting{
                    width: 456rpx;
                    height: 84rpx;
                    line-height: 84rpx;
                    border-radius: 5rpx;
                    text-align: center;
                    background: #fff;
                    font-size: 35rpx;
                    color: #ee8332;
                    border: 1rpx solid #ee8332;
                }
            }
        }
    }
</style>