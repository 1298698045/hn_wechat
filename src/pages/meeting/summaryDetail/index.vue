<template>
    <div class="wrap">
        <div class="header">
            <div class="l">
                <p>{{detailInfo.createdByName}}</p>
            </div>
            <div class="c">
                <p>{{detailInfo.createdByName}}</p>
                <p>{{detailInfo.owningUserName}}</p>
            </div>
            <div class="r">
                <p>2020年05月25日  14:00</p>
            </div>
        </div>
        <div class="center">
            <div class="content">
                <p class="title">{{detailInfo.name}}</p>
                <div class="cont">
                    {{detailInfo.MeetingSummary}}
                </div>
                <div class="fileWrap">
                    <div class="file" v-for="(item,index) in files" :key="index">
                        <div class="l">
                            <p>
                                <img :src="item.link" alt="">
                                <!-- <img src="https://oawx.hnca.org.cn/img/wechat/02.3.1.Word.png" alt=""> -->
                            </p>
                        </div>
                        <div class="r">
                            <p>{{item.name}}</p>
                            <p>31.2MB</p>
                        </div>
                    </div>
                </div>
                <p class="show">显示全部内容</p>
            </div>
            <div class="rowWrap" @click="getReceiver">
                <div class="l">
                    <i class="iconfont icon-richeng1"></i>
                </div>
                <div class="c">
                    邀请30人，全部已读
                </div>
                <div class="r">
                    <i-icon type="enter" color="#666666" size="20" />
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="boxWraps">
                <div class="box">
                    <p>
                        <i class="iconfont icon-richeng1"></i>
                    </p>
                    <p>
                        撤回
                    </p>
                </div>
                <div class="box" @click="getEdit">
                    <p>
                        <i class="iconfont icon-richeng1"></i>
                    </p>
                    <p>
                        修改
                    </p>
                </div>
                <div class="box">
                    <p>
                        <i class="iconfont icon-richeng1"></i>
                    </p>
                    <p>
                        删除
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            detailInfo:{},
            files:[],
            sessionkey:""
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        let detailInfo = JSON.parse(options.detailInfo);
        this.detailInfo = detailInfo;
        this.getFileQuery();
    },
    onShow(){

    },
    methods:{
        getReceiver(){
            const url = '/pages/meeting/receiver/main';
            wx.navigateTo({url:url});
        },
        getFileQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.attachfiles.getlist",
                    SessionKey:this.sessionkey,
                    pid:this.detailInfo.id,
                    ObjTypeCode:5004
                }
            }).then(res=>{
                console.log(res);
                this.files = res.listData;
            })
        },
        getEdit(){
            const url = '/pages/meeting/newSummary/main?content='+this.detailInfo.MeetingSummary+'&current='+'tab3'+'&Meetingid='+this.detailInfo.id;
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
            padding: 33rpx;
            background: #fff;
            align-items: center;
            .l{
                p{
                    width: 72rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    text-align: center;
                    background: #3399ff;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 24rpx;
                }
            }
            .c{
                flex: 1;
                margin-left: 25rpx;
                p:nth-child(1){
                    font-size: 32rpx;
                    color: #333333;
                }
                p:nth-child(2){
                    font-size: 26rpx;
                    color: #999999;
                }
            }
            .r{
                font-size: 24rpx;
                color: #a1a5aa;
            }
        }
        .center{
            padding-bottom: 100px;
            .content{
                background: #fff;
                padding: 0 33rpx 33rpx 33rpx;
                .title{
                    font-size: 34rpx;
                    color: #333333;
                    font-weight: bold;
                }
                .cont{
                    font-size: 34rpx;
                    color: #333333;
                }
                .show{
                    margin-top: 100rpx;
                    font-size: 30rpx;
                    color: #587396;
                }
                .fileWrap{
                    margin-top: 30rpx;
                    .file{
                        display: flex;
                        align-items: center;
                        padding: 19rpx;
                        background: #f2f3f4;
                        border-radius: 12rpx;
                        .l{
                            p{
                                width: 108rpx;
                                height: 108rpx;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    vertical-align: middle;
                                }
                            }
                        }
                        .r{
                            margin-left: 20rpx;
                            p:nth-child(1){
                                width: 300rpx;
                                font-size: 28rpx;
                                color: #333333;
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                                padding-bottom: 20rpx;
                            }
                            p:nth-child(2){
                                font-size: 24rpx;
                                color: #7e8184;
                            }
                        }
                    }
                }
            }
            .rowWrap{
                margin: 24rpx 0;
                display: flex;
                align-items: center;
                padding: 33rpx;
                background: #fff;
                .c{
                    flex: 1;
                    margin-left: 25rpx;
                    color: #333333;
                    font-size: 34rpx;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxWraps{
                display: flex;
                padding: 33rpx;
                justify-content: space-around;
                .box{
                    text-align: center;
                    font-size: 21rpx;
                    color: #3399ff;
                }
            }
        }
    }
</style>