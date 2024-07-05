<template>
    <div class="wrap">
        <div class="center">
            <div class="content">
                <div class="row">
                    <div class="avatar">
                        <p>{{info.name}}</p>
                    </div>
                    <div class="rBox">
                        <div class="top">
                            <p class="name">{{info.OwningUserName}}</p>
                        </div>
                        <div class="info">
                            {{DeptName}}    {{info.ModifiedOn}}
                        </div>
                    </div>
                </div>
                <p class="text">
                    {{info.Description}}
                </p>
            </div>
            <div class="container">
                <div class="comment_wrap">
                    <div class="row_box">
                        <div class="tabs">
                            <p :class="{'active':num==0}" @click="getNum(0)">评论 {{NumOfComment}}</p>
                            <p :class="{'active':num==1}" @click="getNum(1)">赞 {{NumOfLike}}</p>
                        </div>
                        <!-- <div class="zan">
                            <p>赞 {{NumOfLike}}</p>
                        </div> -->
                    </div>
                    <div class="comment" v-if="num==0">
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
                    <div class="comment" v-if="num==1">
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
                    阅读数量 {{info.NumOfForward}}
                </div>
                <div class="btn"  @click="getComment">
                    <i class="iconfont icon-pinglun"></i>
                    评论 {{info.NumOfComment}}</div>
                <div class="btn" @click.stop="getLike">
                    <i class="iconfont icon-zan"></i>
                    赞 {{info.NumOfLike}}
                    <span></span>
                </div>
            </div>
        </div>
        <div class="keyboard" v-if="isFocus" :style="{'bottom':keyboardHeight+'px'}" catchtouchmove="true">
            <div class="inp_box">
                <p>
                    <input type="text" v-model="content" :hold-keyboard="keyboard" :auto-focus="true" :adjust-position="false" @blur="getBlur">
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
            info:"",
            UserStatics:{},
            Comment:"",
            content:"",
            height:"",
            DeptName:'',
            NumOfLike:'',
            NumOfComment:'',
            num:0,
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
        this.id = options.id;
        this.DeptName = options.DeptName;
        this.NumOfLike = options.NumOfLike;
        this.NumOfComment = options.NumOfComment;
        this.height = wx.getSystemInfoSync().windowHeight;
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
                    objTypeCode:6000
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
            if(this.idx==1){
                this.queryComment();
            }
        },
        getComment(){
            this.isFocus = true;
            console.log(this.isFocus)
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
                    method:this.$api.community.detail,
                    SessionKey:this.sessionkey,
                    id:this.id
                }
            }).then(res=>{
                this.info = res.listData[0];
                this.info.name = splitName(this.info.OwningUserName);
            })
        },
        getLike(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.like,
                    SessionKey:this.sessionkey,
                    id:this.id,
                    ObjTypeCode:6000,
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
                    comments:this.content,
                    objTypeCode:6000
                }
            }).then(res=>{
                this.queryComment();
                this.content = '';
                this.isFocus = false;
            })
        },
        getLikeItem(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.like,
                    SessionKey:this.sessionkey,
                    objectid:6000,
                    id:item.ChatterId,
                    action:'like'
                }
            }).then(res=>{
                let that = this;
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
        },
        getNum(num){
            this.num = num;
            if(this.num==0){
                this.queryComment();
            }else {
                this.getLikeQuery();
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/journal.css';
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
                    // display: flex;
                    // justify-content: space-between;
                    // align-items: center;
                    border-bottom: 1rpx solid #e2e3e5;
                    padding: 0 38rpx;
                    font-size: 29rpx;
                    color: #333333;
                    font-weight: bold;
                    .tabs{
                        display: flex;
                        justify-content: space-between;
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