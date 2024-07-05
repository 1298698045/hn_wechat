<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <p class="title">回复：绍兴第二医院</p>
                <p class="iconWrap">
                    <i-icon type="packup" />
                    <i-icon type="unfold" />
                </p>
            </div>
            <div class="cont" v-if="show">
                <p class="">发件人：<span>卫辉</span></p>
                <p class="email">weihui@fenghuang.com</p>
                <p class="mar">收件人：<span>张丽萍</span></p>
                <p class="email">zhanglp@fenghuang.com</p>
                <p class="mar">时间：2019年2月14日  10:30</p>
                <div class="bottom">
                    <p>附件：<i-icon type="accessory" color="#fc6464" /><span>2</span></p>
                    <p class="show" @click="getHide">
                        <i-icon type="collection_fill" color="#ecd464" />
                        隐藏
                    </p>
                </div>
            </div>
            <div class="contActive" v-else-if="!show">
                <div>
                    <p class="radius">卫辉</p>
                </div>
                <div>
                    <p>卫辉<i-icon type="accessory" color="#fc6464" />2</p>
                    <p class="time">2019/2/14  10:30</p>
                </div>
                <div>
                    <p @click="getShow">详情</p>
                </div>
            </div>
        </div>
        <div class="center">
            <p>关于绍兴</p>
            <h3>-------------原始邮件-------------</h3>
            <div class="ycshow" @click="getShowCont">
                隐藏引用<i-icon type="packup" v-if="showCont" /><i-icon type="unfold" v-if="!showCont" />
            </div>
            <div class="contBox" v-if="showCont">
                <p>发件人：<span>张丽萍</span></p>
                <p>发送时间：<span>"2019年2月14日   10:30</span></p>
                <p>收件人：<span>卫辉</span></p>
                <p>主题：<span>回复：关于绍兴第二医院</span></p>
            </div>
        </div>
        <div class="content">
            <div class="box">
                <div>
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/Shared_files.png" alt="">
                    </p>
                </div>
                <div>
                    <p>事假的审批流程.xls</p>
                    <p class="time">2019/2/14  17:56   31.2MB</p>
                </div>
            </div>
            <div class="box">
                <div>
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/Shared_files.png" alt="">
                    </p>
                </div>
                <div>
                    <p>事假的审批流程.xls</p>
                    <p class="time">2019/2/14  17:56   31.2MB</p>
                </div>
            </div>
        </div>
        <van-action-sheet
            :round="false"
            :show="starShow"
            :actions="starActions"
            cancel-text="取消"
            @close="starClose"
            @cancel="starCancel"
            @select="starSelect"
        />
        <van-action-sheet
        :round="false"
        :show="isShow"
        :actions="actions"
        cancel-text="取消"
        @close="handleClose"
        @cancel="hadleCancel"
        @select="handleSelect"
        />
        <van-action-sheet z-index="10000" :round="false" safe-area-inset-bottom cancel-text="取消" @close="getClose" @cancel="getCancel" :show="screenShow" title="筛选">
            <div class="sheetContent">
                <div class="box">
                    <p>
                        <img :src="pathUrl+'/img/wechat/Folders.png'" alt="">
                    </p>
                    <p>彻底删除</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="pathUrl+'/img/wechat/rar.png'" alt="">
                    </p>
                    <p>拒收</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="pathUrl+'/img/wechat/Image.png'" alt="">
                    </p>
                    <p>移动到</p>
                </div>
            </div>
        </van-action-sheet>
        <div class="footer">
            <p @click="getOpenStar"><i-icon type="collection_fill" size="25" color="#3399ff" /></p>
            <p><i-icon type="collection_fill" size="25" color="#3399ff" /></p>
            <p @click="getShare"><i-icon type="collection_fill" size="25" color="#3399ff" /></p>
            <p @click="getOpenSheet"><i-icon type="collection_fill" size="25" color="#3399ff" /></p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return  {
            show:false,
            isShow:false,
            actions:[
                { name: '回复', color: '07c160' },
                { name: '全部回复', color: '07c160' },
                { name: '转发', color: '07c160',openType:"share" }
            ],
            screenShow:false,
            starShow:false,
            starActions:[
                { name: '添加星标', color: '07c160' },
                { name: '标位未读', color: '07c160' }
            ],
            showCont:false
        }
    },
    computed:{
        pathUrl(){
            return this.$api.pathUrl;
        }
    },
    methods:{
        getShow(){
            this.show = true;
        },
        getHide(){
            this.show = false;
        },
        getShare(){
            this.isShow = true;
        },
        handleClose(){
            this.isShow = false;
        },
        hadleCancel(){
            this.isShow = false;
        },
        handleSelect(e){
            let name = e.mp.detail.name;
            if(name=='回复'){
                const url = "/pages/email/replyEmail/main";
                wx.navigateTo({url:url});
            }

        },
        getOpenStar(){
            this.starShow = true;
        },
        starCancel(){
            this.starShow = false;
        },
        starClose(){
            this.starShow = false;
        },
        starSelect(e){
            let name = e.mp.detail.name;

        },
        getOpenSheet(){
            this.screenShow = true;
        },
        getCancel(){
            this.screenShow = false;
        },
        getClose(){
            this.screenShow = false;
        },
        getShowCont(){
            this.showCont = !this.showCont;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    page{
        background: #fff;
    }
    .wrap{
        .header{
            width: 100%;
            border-bottom: 1rpx solid #eaeeed;
            .row{
                display: flex;
                padding: 20rpx ;
                justify-content:space-between;
                .title{
                    font-size: 28rpx;
                    font-weight: bold;
                }
            }
            .cont{
                padding: 0 20rpx 20rpx 20rpx;
                font-size: 28rpx;
                p{
                    color: #999999;
                    span{
                        color: #333333;
                    }
                }
                .email{
                    margin-left: 60px;
                }
                .mar{
                    margin-top: 10rpx;
                }
                .bottom{
                    display: flex;
                    justify-content: space-between;
                    .show{
                        color: #3399ff;
                    }
                }
            }
            .contActive{
                padding: 0 20rpx 20rpx 20rpx;
                font-size: 28rpx;
                display: flex;
                div:nth-child(2){
                    flex: 1;
                    margin-left: 20rpx;
                }
                div:nth-child(3){
                    p{
                        color: #3399ff;
                        margin-top: 20px;
                    }
                }
                .time{
                    color: #999999;
                }
            }
        }
        .center{
            padding: 20rpx;
            height: 200px;
            border-bottom: 1rpx solid #eaeeed;
            p{
                font-size: 28rpx;
                color: #333333;
            }
            h3{
                padding: 20rpx;
                font-size: 12px;
            }
            .ycshow{
                padding:5rpx;
                color:#999999;
                font-size: 12px;
                margin: 10rpx 0 10rpx 10rpx;
            }
            .contBox{
                width: 85%;
                margin: 0 auto;
                padding:20rpx 30rpx ;
                background: #f4f4f4;
                border-radius: 10px;
                p{
                    font-size: 24rpx;
                    color: #333333;
                    font-weight: bold;
                    span{
                        font-weight: normal;
                    }
                }
            }
        }
        .content{
            width: 100%;
            position: fixed;
            bottom: 60px;
            .box{
                display: flex;
                padding: 30rpx 20rpx;
                div:nth-child(1){
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                div:nth-child(2){
                    width: 100%;
                    margin-left: 20rpx;
                    font-size: 28rpx;
                    border-bottom: 1rpx solid #eaeeed;
                    .time{
                        font-size: 12px;
                        color: #999999;
                    }
                }
            }
            .box:last-child div:nth-child(2){
                border: none;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            border-top: 1rpx solid #eaeeed;
            display: flex;
            padding: 30rpx 0;
            p{
                flex: 1;
                text-align: center;
            }
        }
        .sheetContent{
            display: flex;
            // justify-content: space-around;
            background: #f4f4f4;
            padding: 30rpx 20rpx;
            .box{
                margin-right: 20rpx;
                p:nth-child(1){
                    width: 120rpx;
                    height: 120rpx;
                    background: #fff;
                    border-radius: 10rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 80%;
                        height: 80%;
                        align-items: center;
                    }
                }
                p:nth-child(2){
                    font-size: 12px;
                    text-align: center;
                }
            }
        }
    }
</style>