<template>
    <div class="wrap">
        <div class="center">
            <div class="content">
                <div class="row">
                    <div class="avatar">
                        <p>{{info && info.name || ''}}</p>
                    </div>
                    <div class="rBox">
                        <div class="top">
                            <p class="name">{{info && info.OwningUserName || ''}}</p>
                        </div>
                        <div class="info">
                            {{info && info.DeptName || ''}}    {{info && info.CreatedOn || ''}}
                        </div>
                    </div>
                </div>
                <p class="text">
                    {{info && info.ContentBody || ''}}
                </p>
            </div>
            <div class="container">
                <div class="comment_wrap">
                    <div class="row_box">
                        <div class="tabs">
                            <p :class="{'active':idx==index}" v-for="(item,index) in tabs" :key="index" @click="getTab(item,index)">
                                {{item.name}} {{item.num}}
                            </p>
                        </div>
                        <!-- <div class="zan">
                            <p>赞 {{info.LikeQty}}</p>
                        </div> -->
                    </div>
                    <div class="comment" v-if="idx==0">
                        <div class="box" v-for="(item,index) in list" :key="index">
                            <div class="avatar">{{item.name}}</div>
                            <div class="left_cont">
                                <div class="name">
                                    <p>{{item.CreatedByName}}</p>
                                    <p class="num" @click="getLikeItem(item)">
                                        <i class="iconfont icon-zan"></i>
                                        <span v-if="item.LikeQty>0">
                                            {{item.LikeQty}}
                                        </span>
                                    </p>
                                </div>
                                <p class="text">{{item.Comment}}</p>
                                <p class="info">{{item.DeptName}}    {{item.CreatedOn}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="comment" v-if="idx==1">
                        <div class="box" v-for="(item,index) in readList" :key="index">
                            <div class="avatar">{{item.name}}</div>
                            <div class="left_cont">
                                <div class="name">
                                    <p>{{item.CreatedByName}}</p>
                                </div>
                                <p class="info">{{item.DeptName}}    {{item.CreatedOn}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="comment" v-if="idx==2">
                        <div class="box" v-for="(item,index) in likeList" :key="index">
                            <div class="avatar">{{item.name}}</div>
                            <div class="left_cont">
                                <div class="name">
                                    <p>{{item.CreatedByName}}</p>
                                </div>
                                <p class="info">{{item.DeptName}}    {{item.CreatedOn}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <div class="btn">
                    <i class="iconfont icon-chuanyue"></i>
                    阅读数量 {{info && info.ReadQty}}
                </div>
                <div class="btn"  @click="getComment">
                    <i class="iconfont icon-pinglun"></i>
                    评论</div>
                <div class="btn" @click.stop="getLike">
                    <i class="iconfont icon-zan"></i>
                    赞
                    <span></span>
                </div>
            </div>
        </div>
        <div class="keyboard" v-if="isFocus" :style="{'bottom':keyboardHeight+'px'}" catchtouchmove="true">
            <div class="inp_box">
                <p>
                    <input type="text" v-model="comment" :hold-keyboard="keyboard" :auto-focus="true" :adjust-position="false" @blur="getBlur">
                </p>
                <p @click.stop="getSubmit">发送</p>
            </div>
        </div>
    </div>
</template>
<script>
import {splitName} from '@/utils/splitName';
import {message} from '@/utils/message';
export default {
    data(){
        return {
            idx:0,
            keyboardHeight:"",
            isFocus:false,
            id:"",
            PageSize:20,
            pageNumber:1,
            keyboard:true,
            list:[],
            info:{},
            UserStatics:{},
            Comment:"",
            tabs:[
                {
                    name:"评论",
                    num:""
                },
                {
                    name:"已读",
                    num:"" 
                },
                {
                    name:"赞",
                    num:""
                }
            ],
            readList:[],
            likeList:[]
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onLoad(options){
        console.log('options:', options)
        this.id = options.id;
        wx.onKeyboardHeightChange(res => { //监听键盘高度变化
            console.log(res.height,'res');
            this.keyboardHeight = res.height;
        })
        this.getDetail();
        this.queryComment();
    },
    methods:{
        // 点赞列表
        getLikeQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.journal.likeQuery,
                    SessionKey:this.sessionkey,
                    id:this.id
                }
            }).then(res=>{
                this.likeList = res.listData;
                this.likeList.map(item=>{
                    item.name = splitName(item.CreatedByName);
                    return item;
                })
            })
        },
        queryReadQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    Sessionkey:this.sessionkey,
                    method:this.$api.journal.query,
                    scope:'read',
                    id:this.id
                }
            }).then(res=>{
                this.readList = res.listData;
                this.readList.map(item=>{
                    item.name = splitName(item.CreatedByName);
                    return item;
                })
            })
        },
        queryComment(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.queryComment,
                    SessionKey:this.sessionkey,
                    scope:"Comment",
                    CommentId:this.id,
                    PageSize:this.PageSize,
                    pageNumber:this.pageNumber,
                    objTypeCode:5500
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    item.name = splitName(item.CreatedByName);
                    return item;
                })
            })
        },
        getTab(item,index){
            this.idx = index;
            if(this.idx==0){
                this.queryComment();
            }else if(index==1){
                this.queryReadQuery();
            }else if(index==2){
                this.getLikeQuery();
            }
        },
        getComment(){
            this.isFocus = true;
        },
        getBlur(e){
            this.isFocus = false;
        },
        getFocus(){
            this.isFocus = true;
        },
        getDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.journal.detail,
                    SessionKey:this.sessionkey,
                    Id:this.id
                }
            }).then(res=>{
                this.info = res.listData;
                this.info.name = splitName(this.info.OwningUserName);
                this.tabs[0].num = this.info.CommentQty;
                this.tabs[1].num = this.info.ReadQty;
                this.tabs[2].num = this.info.LikeQty;
            })
        },
        getLike(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.like,
                    SessionKey:this.sessionkey,
                    id:this.id,
                    ObjTypeCode:5500,
                    action:'like'
                }
            }).then(res=>{
                if(res.status===1){
                    wx.showToast({
                        title:res.msg,
                        icon:"none",
                        duration:2000
                    })
                }
            })
        },
        getSubmit(){
            this.keyboard = true;
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.comment,
                    SessionKey:this.sessionkey,
                    objectid:this.id,
                    comments:this.comment,
                    objTypeCode:5500
                }
            }).then(res=>{
                this.queryComment();
                this.isFocus = false;
            })
        },
        getLikeItem(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.like,
                    SessionKey:this.sessionkey,
                    objectid:5500,
                    id:item.CommentId,
                    action:'like'
                }
            }).then(res=>{
                message.toast({
                    title:res.msg,
                    delta:0,
                    success:()=>{
                        setTimeout(()=>{
                            this.queryComment();
                        },1000)
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss">
@font-face {
    font-family: 'iconfont';
    src: url('data:font/truetype;charset=utf-8;base64,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') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-web-icon-:before {
  content: "\e6e7";
}

.icon--sixin:before {
  content: "\e612";
}

.icon-xiepinglun:before {
  content: "\e7d3";
}

.icon-wode_huaban:before {
  content: "\e613";
}

.icon-pinglun:before {
  content: "\e73c";
}

.icon-fenxiang:before {
  content: "\e7de";
}

.icon-zan:before {
  content: "\e611";
}
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .content{
            padding: 26rpx 33rpx;
            background: #fff;
            margin-top: 33rpx;
            .row{
                display: flex;
                align-items: center;
                .avatar{
                    width: 75rpx;
                    height: 75rpx;
                    line-height: 75rpx;
                    text-align: center;
                    border-radius: 50%;
                    background: #3399ff;
                    font-size: 21rpx;
                    color: #fff;
                }
                .rBox{
                    flex: 1;
                    margin-left: 20rpx;
                    .top{
                        display: flex;
                        justify-content: space-between;
                        .name{
                            font-size: 28rpx;
                            color:#333333;
                        }
                    }
                    .info{
                        font-size: 22rpx;
                        color: #999999;
                    }
                }
            }
            .text{
                padding: 28rpx 0;
                font-size: 28rpx;
                color: #333333;
            }
        }
        .container{
            padding-bottom: 150rpx;
            .comment_wrap{
                margin-top: 17rpx;
                background: #fff;
                .row_box{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #e2e3e5;
                    padding: 0 38rpx;
                    font-size: 29rpx;
                    color: #333333;
                    font-weight: bold;
                    .tabs{
                        display: flex;
                        p{
                            width: 146rpx;
                            text-align: center;
                            padding: 30rpx 0;
                        }
                        p.active{
                            border-bottom: 4rpx solid #3399ff;
                        }
                    }
                }
                .comment{
                    padding: 0 38rpx;
                    .box:last-child .left_cont{
                        border: none;
                    }
                    .box{
                        display: flex;
                        // padding: 26rpx 0;
                        .avatar{
                            width: 75rpx;
                            height: 75rpx;
                            line-height: 75rpx;
                            text-align: center;
                            border-radius: 50%;
                            background: #3399ff;
                            font-size: 21rpx;
                            color: #ffffff;
                            margin-top: 26rpx;
                        }
                        .left_cont{
                            flex: 1;
                            margin-left: 20rpx;
                            padding: 26rpx 0;
                            border-bottom: 1rpx solid #e2e3e5;
                            .name{
                                font-size: 28rpx;
                                color: #3399ff;
                                display: flex;
                                justify-content: space-between;
                                .num{
                                    color: #999999;
                                    font-size:25rpx;
                                    display: flex;
                                    align-items: center;
                                    span{
                                        margin-left: 10rpx;
                                    }
                                }
                                .num.active{
                                    color: #ff6666;
                                }
                            }
                            .text{
                                font-size: 32rpx;
                                color: #333333;
                                padding: 10rpx 0;
                            }
                            .info{
                                font-size: 22rpx;
                                color: #644d4d;
                            }
                        }
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
                display: flex;
                padding: 24rpx 0;
                justify-content: space-around;
                align-content: center;
                .btn{
                    display: flex;
                    align-items: center;
                    font-size: 28rpx;
                    color: #526992;
                    i{
                        margin-right: 20rpx;
                    }
                }
            }
        }
        .keyboard{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .inp_box{
                display: flex;
                padding: 19rpx 25rpx;
                align-items: center;
                p:nth-child(1){
                    flex: 1;
                    input{
                        width: 100%;
                        height: 67rpx;
                        background: #f3f5f4;
                        font-size: 28rpx;
                    }
                }
                p:nth-child(2){
                    width: 100rpx;
                    font-size: 28rpx;
                    color: #3399ff;
                    text-align: center;
                }
            }
        }
    }
</style>