<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <p class="title">{{info.Subject}}</p>
                <!-- 上下页 -->
                <!-- <p class="iconWrap">
                    <i-icon type="packup" color="#3399ff" size="20" />
                    <i-icon type="unfold" color="#3399ff" size="20" />
                </p> -->
            </div>
            <div class="cont" v-if="show">
                <p class="">发件人：<span>{{info.FromName}}</span></p>
                <!-- 邮箱 -->
                <!-- <p class="email">weihui@fenghuang.com</p> -->
                <div v-for="(item,index) in info.toUsers" :key="index">
                    <p class="mar">收件人：<span>{{item.name}}</span></p>
                    <!-- <p class="email">zhanglp@fenghuang.com</p> -->
                </div>
                <div>
                    <p class="mar">收件人：<span>{{info.ToUserNames}}</span></p>
                    <!-- <p class="email">zhanglp@fenghuang.com</p> -->
                </div>
                <p class="mar">&nbsp;&nbsp;&nbsp;时间：<span>{{info.Date}}</span></p>
                <div class="bottomBtn">
                    <p v-if="encolsureSize==0">&nbsp;</p>
                    <p class="ellipsis" v-if="encolsureSize>0">&nbsp;&nbsp;&nbsp;附件：<i class="iconfont icon-fujian"></i><span>{{encolsureSize==1?enclosure[0].Name:encolsureSize+'个'}}</span></p>
                    <p class="show" @click="getHide">
                        <span v-if="!info.IsRead"></span>
                        <i class="iconfont icon-shoucang11 color" v-if="isXing" :class="{'active':isXing}"></i>
                        隐藏
                    </p>
                </div>
            </div>
            <div class="contActive" v-else-if="!show">
                <div>
                    <p class="radius">{{fromName}}</p>
                </div>
                <div>
                    <p class="name">{{info.FromName}}
                        <i class="iconfont icon-fujian"  v-if="encolsureSize>0"></i>
                        <span v-if="encolsureSize>0">{{encolsureSize}}个</span>
                    </p>
                    <p class="time">{{info.Date}}</p>
                </div>
                <div>
                    <p @click="getShow">
                        <span v-if="!info.IsRead"></span>
                        <!-- <i class="iconfont icon-shoucang2 color" v-if="!isXing"></i> -->
                        <i class="iconfont icon-shoucang11 color" v-if="isXing" :class="{'active':isXing}"></i>
                        详情</p>
                </div>
            </div>
        </div>
        <div class="center">
            <wxParse :content="content" v-if="content!=''" />
            <!-- <p>{{content}}</p> -->
        </div>
        <div class="content" :class="{'active':isModelmes,'lenActive':enclosure.length>3}">
            <div class="box" v-for="(item,index) in enclosure" :key="index" @click="getFiles(item)">
                <div>
                    <p>
                        <img v-if="item.FileExtension=='.png'||item.FileExtension=='.jpg'||item.FileExtension=='.webp'" :src="item.DownloadLinkUrl" alt="">
                        <img v-else-if="item.FileExtension=='.rar'" :src="photoUrl+'rar.png'" alt="">
                        <img v-else-if="item.FileExtension=='.txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
                        <img v-else-if="item.FileExtension=='.pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                        <img v-else-if="item.FileExtension=='.ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
                        <img v-else-if="item.FileExtension=='.word' || item.FileExtension=='.doc' || item.fileExtension=='.docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
                        <img v-else-if="item.FileExtension.indexOf('xls')!=-1" :src="photoUrl+'xls.png'" alt="">
                    </p>
                </div>
                <div>
                    <p class="name">{{item.Name}}{{item.FileExtension}}</p>
                    <p class="time">{{item.CreatedOn}}   {{item.FileSize}}</p>
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
        <van-action-sheet z-index="10000" :round="false" safe-area-inset-bottom cancel-text="取消" @close="getClose" @cancel="getCancel" :show="screenShow">
            <scroll-view scroll-x="true" class="scroll">
                <div class="sheetContent">
                    <div class="box" @click="getMoveEmail">
                        <p>
                            <i class="iconfont icon-yidongdao"></i>
                        </p>
                        <!-- <p>
                            <img src="https://oawx.hnca.org.cn/img/wechat/Folders.png" alt="">
                        </p> -->
                        <p>移动到</p>
                    </div>
                    <!-- <div class="box">
                        <p>
                            <img src="https://oawx.hnca.org.cn/img/wechat/rar.png" alt="">
                        </p>
                        <p>拒收</p>
                    </div> -->
                    <div class="box" @click="getSetread">
                        <p>
                            <i class="iconfont icon-weiduyoujian"></i>
                        </p>
                        <p>标为未读</p>
                    </div>
                    <div class="box">
                        <p>
                            <i class="iconfont icon-huifuquanbu1"></i>
                        </p>
                        <p>回复全部</p>
                    </div>
                    <div class="box">
                        <p>
                            <i class="iconfont icon-zhuanfa"></i>
                        </p>
                        <p>转发</p>
                    </div>
                    <div class="box" @click="getThoroughDel">
                        <p>
                            <i class="iconfont icon-shanchu"></i>
                        </p>
                        <p>彻底删除</p>
                    </div>
                    <!-- <div class="box" @click="getMoveEmail">
                        <p>
                            <img src="https://oawx.hnca.org.cn/img/wechat/Image.png" alt="">
                        </p>
                        <p>移动到</p>
                    </div> -->
                </div>
            </scroll-view>
        </van-action-sheet>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <p @click="addCollection(isXing)">
                    <i class="iconfont icon-shoucang2 color" v-if="!isXing"></i>
                    <i class="iconfont icon-shoucang11 color" v-else :class="{'active':isXing}"></i>
                </p>
                <p @click="getDelete">
                    <i class="iconfont icon-shanchu color"></i>
                </p>
                <p @click="getShare">
                    <i class="iconfont icon-huifu1 color"></i>
                </p>
                <p @click="getOpenSheet">
                    <i class="iconfont icon-elipples color"></i>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import wxParse from 'mpvue-wxparse';
// const openFile = require('../../../utils/openFiles');
import getOpenFiles from '@/utils/openFiles';
export default {
    components:{
        wxParse
    },
    data(){
        return  {
            show:false,
            isShow:false,
            actions:[
                { name: '回复', color: '07c160' },
                // { name: '全部回复', color: '07c160' },
                { name: '转发', color: '07c160',openType:"share" }
            ],
            screenShow:false,
            starShow:false,
            starActions:[
                { name: '添加星标', color: '07c160' },
                { name: '标为未读', color: '07c160' }
            ],
            fromName:"",
            emailId:"",
            ltags:"",
            info:{},
            content:"",
            enclosure:[],
            encolsureSize:"",
            sessionkey:"",
            isXing:false,
            photoUrl:""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        openImgs(){
            let temp = [];
            this.enclosure.forEach(item=>{
                if(item.FileExtension.indexOf('jpg')!=-1||item.FileExtension.indexOf('png')!=-1||item.FileExtension.indexOf('webp')!=-1){
                    temp.push(item.DownloadLinkUrl);
                }
            })
            return temp;
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.photoUrl = this.$api.photo.url;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.emailId = options.emailId;
        this.ltags = options.ltags;
        this.getQuery();
        // this.contentDetail();
        // this.enclosureQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"email.info.allget",
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    ltags:this.ltags
                }
            }).then(res=>{
                this.info = res.data;
                if(this.info.FromName.length>=3){
                    this.fromName = this.info.FromName.substr(1);
                }else {
                    this.fromName = this.info.FromName;
                }
                this.isXing = this.info.IsStar;
                this.content = this.info.Content;
                this.enclosure = this.info.AttachFiles;
                this.encolsureSize = this.info.AttachFiles.length;
                // if(this.info.starEmail==1){
                //     this.isXing = true;
                // }else {
                //     this.isXing = false;
                // }
            })
        },
        contentDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.contentbody,
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    ltags:this.ltags
                }
            }).then(res=>{
                this.content = res;
            })
        },
        // 附件列表
        enclosureQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.attachfilesList,
                    SessionKey:this.sessionkey,
                    id:this.emailId                    
                }
            }).then(res=>{
                this.enclosure = res.listData;
                this.encolsureSize = res.listData.length;
            })
        },
        getFiles(item){
            item.link = item.DownloadLinkUrl;
            item.fileExtension = item.FileExtension;
            let openImgs = JSON.stringify(this.openImgs);
            getOpenFiles(item,openImgs);
        },
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
        // 彻底删除
        getThoroughDel(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.thoroughDel,
                    SessionKey:this.sessionkey,
                    ids:this.emailId,
                    ltags:this.ltags,
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:'none',
                    duration:2000,
                    success:res=>{
                        wx.navigateBack({
                            delta:1
                        })
                    }
                })
            })
        },
        handleSelect(e){
            let name = e.mp.detail.name;
            if(name=='回复'){
                const url = "/pages/email/replyEmail/main?emailId="+this.emailId+'&ltags='+this.ltags;
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
            if(name=='添加星标'){
                this.addCollection();
            }else if(name=='标为未读'){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                        data:{
                            method:this.$api.email.setread,
                            SessionKey:this.sessionkey,
                            Id:this.emailId,
                            action:0
                        }
                }).then(res=>{
                    wx.showToast({
                        title:res.msg,
                        icon:'success',
                        duration:2000
                    })
                    
                })
            }
        },
        // 标记已读、未读
        getSetread(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                    data:{
                        method:this.$api.email.setread,
                        SessionKey:this.sessionkey,
                        Id:this.emailId,
                        action:0
                    }
            }).then(res=>{
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000
                })
                this.screenShow = false;
                this.getQuery();
                
            })
        },
        // 添加星标
        addCollection(isXing){
            let IsStar = '';
            if(isXing){
                IsStar = 0;
            }else {
                IsStar = 1;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.starMark,
                    SessionKey:this.sessionkey,
                    Id:this.emailId,
                    IsStar:IsStar
                }
            }).then(res=>{
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            that.getQuery();
                        },1000)
                    }
                })
            })
        },
        getDelete(){
            let that = this;
            wx.showModal({
                title: '提示',
                content: '确定删除邮件？',
                success:res=>{
                    if (res.confirm) {
                    console.log('用户点击确定')
                        that.deleteEmail();
                    } else if (res.cancel) {
                    console.log('用户点击取消')
                    }
                }
            })
        },
        deleteEmail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.mailboxDel,
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    mailbox:this.ltags
                }
            }).then(res=>{
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1
                            })
                        },1000)
                    }
                })
            })
        },
        getMoveEmail(){
            const url = '/pages/email/moveEmail/main?id='+this.emailId;
            wx.navigateTo({url:url});
        },
        getOpenSheet(){
            this.screenShow = true;
        },
        getCancel(){
            this.screenShow = false;
        },
        getClose(){
            this.screenShow = false;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/emaiIcon.css';
    // @import '../../../../static/css/public.scss';
    @import url("~mpvue-wxparse/src/wxParse.css");
    page{
        background: #fff;
    }
    .wrap{
        width: 100%;
        .header{
            width: 100%;
            border-bottom: 1rpx solid #eaeeed;
            .row{
                display: flex;
                padding: 20rpx ;
                justify-content:space-between;
                .title{
                    font-size: 32rpx;
                    color: #333333;
                    font-weight: bold;
                }
            }
            .cont{
                padding: 0 20rpx 20rpx 20rpx;
                font-size: 28rpx;
                p{
                    color: #999999;
                    font-size: 28rpx;
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
                .bottomBtn{
                    display: flex;
                    justify-content: space-between;
                    .ellipsis{
                        display: flex;
                        align-items: center;
                        i{
                            color: #fc6464;
                        }
                        span{
                            display: inline-block;
                            width: 300rpx;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .show{
                        color: #3399ff;
                        display: flex;
                        align-items: center;
                        .color{
                            color: #3399ff;
                            font-size: 25rpx;
                            margin-right: 10rpx;
                        }
                        .color.active{
                            color: #ecd464;
                        }
                        span{
                            display: inline-block;
                            width: 15rpx;
                            height: 15rpx;
                            border-radius: 50%;
                            background: #ff6666;
                            margin-right: 10rpx;
                        }
                    }
                }
            }
            .contActive{
                padding: 0 20rpx 20rpx 20rpx;
                font-size: 28rpx;
                display: flex;
                .radius{
                    width: 75rpx;
                    height: 75rpx;
                    line-height: 75rpx;
                    font-size: 25rpx;
                    border-radius: 50%;
                    text-align: center;
                    background: #3399ff;
                    color: #fff;
                }
                div:nth-child(2){
                    flex: 1;
                    margin-left: 20rpx;
                    .name{
                        display: flex;
                        font-size: 28rpx;
                        i{
                            color: #fc6464;
                            margin-left: 20rpx;
                        }
                    }
                }
                div:nth-child(3){
                    p{
                        color: #3399ff;
                        margin-top: 20px;
                        display: flex;
                        align-items: center;
                        .color{
                            font-size: 25rpx;
                            margin-right: 10rpx;
                        }
                        .color.active{
                            color: #ecd464;
                        }
                        span{
                            display: inline-block;
                            width: 15rpx;
                            height: 15rpx;
                            border-radius: 50%;
                            background: #ff6666;
                            margin-right: 10rpx;
                        }
                    }
                }
                .time{
                    font-size: 28rpx;
                    color: #999999;
                }
            }
        }
        .center{
            padding: 20rpx;
            height: auto;
            // border-bottom: 1rpx solid #eaeeed;
            p{
                font-size: 28rpx;
                color: #333333;
            }
        }
        .content.active{
            bottom: 80px;
        }
        .content.lenActive{
            height: 450rpx;
            overflow: auto;
        }
        .content{
            width: 100%;
            position: fixed;
            bottom: 60px;
            .box{
                display: flex;
                align-items: center;
                padding: 0 20rpx;
                div:nth-child(1){
                    p{
                        width: 83rpx;
                        height: 83rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                div:nth-child(2){
                    width: 100%;
                    margin-left: 25rpx;
                    font-size: 28rpx;
                    padding: 30rpx 0;
                    border-bottom: 1rpx solid #eaeeed;
                    .name{
                        width: 500rpx;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        padding-bottom: 21rpx;
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .time{
                        font-size: 24rpx;
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
            .box{
                display: flex;
                padding: 30rpx 0;
                p{
                    flex: 1;
                    text-align: center;
                    .color{
                        color: #3399ff;
                        font-size: 20px;
                    }
                    .color.active{
                        color: #ecd464;
                    }
                }
            }
        }
        .scroll{
            background: #f4f4f4;
            .sheetContent{
                display: flex;
                // justify-content: space-around;
                background: #f4f4f4;
                padding: 30rpx 20rpx;
                .box{
                    margin-right: 41rpx;
                    p:nth-child(1){
                        width: 124rpx;
                        height: 124rpx;
                        background: #fff;
                        border-radius: 23rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        i{
                            font-size: 25px;
                            color: #666666;
                        }
                        img{
                            width: 80%;
                            height: 80%;
                            align-items: center;
                        }
                    }
                    p:nth-child(2){
                        font-size: 24rpx;
                        color: #666666;
                        text-align: center;
                        margin-top: 16rpx;
                    }
                }
            }
        }
    }
</style>