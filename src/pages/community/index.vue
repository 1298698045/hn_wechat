<template>
    <div class="wrap">
        <div class="center" v-if="activeIdx==0">
            <div class="content" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                <div class="row">
                    <div class="avatar">
                        <p>{{item.name}}</p>
                    </div>
                    <div class="rBox">
                        <div class="top">
                            <p class="name">{{item.OwningUserName}}</p>
                            <p @click.stop="getMore(item)"><i-icon type="more" color="#999999" size="20" /></p>
                        </div>
                        <div class="info">
                            {{item.DeptName}}    {{item.CreatedOn}}
                        </div>
                    </div>
                </div>
                <p class="text">
                    {{item.Description}}
                </p>
                <div class="imgList">
                    <div class="imgs">
                        <van-image v-for="(v,i) in item.imgs" :key="i" @click.stop="getPreviewImage(item,v)" width="100" height="100" :src="v.path" />
                    </div>
                </div>
                <p class="location" v-if="item.Location">
                    <i class="iconfont icon-dizhi"></i>
                    {{item.Location}}
                </p>
                <div class="more_btn">
                    <div class="btn">
                        <i class="iconfont icon-chuanyue"></i>
                        阅读数量 {{item.NumOfForward}}
                    </div>
                    <div class="btn">
                        <i class="iconfont icon-pinglun"></i>
                        评论 {{item.NumOfComment}}</div>
                    <div class="btn" @click.stop="getLike(item)" :class="{'active':item.HasLike!='false'}">
                        <i class="iconfont icon-zan" :class="{'active':item.HasLike!='false'}"></i>
                        <span v-if="item.HasLike=='false'" >
                            赞
                        </span>
                        <span>{{item.NumOfLike}}</span>
                    </div>
                </div>
            </div>
            <van-divider v-if="isMoreShow" contentPosition="center">没有更多了~</van-divider>
        </div>
        <CommunityMy v-if="activeIdx==2" />
        <!-- <Drag v-if="activeIdx==1" /> -->
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box_wrap">
                <div class="box" :class="{'active':activeIdx==0}" @click="getBottomTab(0)">
                    <p>
                        <i class="iconfont icon-xierizhi"></i>
                    </p>
                    <p>首页</p>
                </div>
                <!-- <div class="box">
                    <p>
                        <i class="iconfont icon-kanrizhi"></i>
                    </p>
                    <p>私信</p>
                </div> -->
                <div class="box" :class="{'active':activeIdx==1}" @click="getBottomTab(1)">
                    <p>
                        <i class="iconfont icon-kanrizhi"></i>
                    </p>
                    <p>消息</p>
                </div>
                <div class="box" :class="{'active':activeIdx==2}" @click="getBottomTab(2)">
                    <p>
                        <i class="iconfont icon-shezhi"></i>
                    </p>
                    <p>我的</p>
                </div>
            </div>
            <div class="clues-add-button" v-if="activeIdx==0" @click="getWriteJournal" :class="{'active':isModelmes}">
                <i class="iconfont icon-icon-add-3-copy"></i>
            </div>
        </div>
        <van-action-sheet
            :show="show"
            :round="false"
            z-index="999"
            cancel-text="取消"
            @close="onClose"
            @cancel="onClose"
        >
            <div class="sheetWrap">
                <p>收藏</p>
                <p @click="getDelete">删除</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import {splitName} from '@/utils/splitName';
import CommunityMy from '@/components/community/communityMy';
import Drag from '@/components/Drag';
export default {
    components:{
        CommunityMy,
        Drag
    },
    data(){
        return {
            isPage:false,
            pageNumber:1,
            pageSize:25,
            list:[],
            show:false,
            id:"",
            activeIdx:0,
            isMoreShow: false
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
    onLoad(){
        Object.assign(this.$data,this.$options.data())
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.query,
                    SessionKey:this.sessionkey,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize
                }
            }).then(res=>{
                if(this.list.length>0&&res.listData==""){
                    this.isMoreShow = true;
                }
                if(res.listData==""){
                    this.isPage = false;
                }else {
                    this.isPage = true;
                }
                let result = [];
                if(this.pageNumber==1){
                    result = res.listData;
                }else {
                    result = this.list.concat(res.listData);
                }
                this.list = result;
                this.list.map(item=>{
                    item.name = splitName(item.OwningUserName);
                    return item;
                })
            })
        },
        getLike(item){
            let action = 'like';
            if(item.HasLike=='false'){
                action = 'like'
            }else {
                action = 'dislike';
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.like,
                    SessionKey:this.sessionkey,
                    id:item.ChatterId,
                    ObjTypeCode:6000,
                    action:action
                }
            }).then(res=>{
                if(res.status==1){
                    wx.showToast({
                        title:res.msg,
                        icon:"none",
                        duration:2000,
                        success:()=>{
                            setTimeout(()=>{
                                this.getQuery();
                            },1000)
                        }
                    })
                }
            })
        },
        getMore(item){
            this.id = item.ChatterId;
            this.show = true;
        },
        onClose(){
            this.show = false;
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.del,
                    SessionKey:this.sessionkey,
                    Id:this.id
                }
            }).then(res=>{
                console.log(res);
                if(res.status==1){
                    wx.showToast({
                        title:res.msg,
                        icon:"success",
                        duration:2000
                    })
                }
                this.show = false;
                this.getQuery();
            })
        },
        getDetail(item){
            const url = '/pages/community/detail/main?id='+item.ChatterId+'&DeptName='+item.DeptName
            +'&NumOfLike='+item.NumOfLike+'&NumOfComment='+item.NumOfComment;
            wx.navigateTo({url:url});
        },
        getWriteJournal(){
            const url = '/pages/community/sendDynamic/main';
            wx.navigateTo({url:url});
        },
        getPreviewImage(item,v){
            var path = v.path;
            var temp = item.imgs.map(one=>one.path);
            wx.previewImage({
                current: path, // 当前显示图片的http链接
                urls: temp
                // 需要预览的图片http链接列表
            })

        },
        getBottomTab(idx){
            this.activeIdx = idx;
            if(activeIdx==0){
                this.pageNumber = 1;
                this.isMoreShow = false;
                this.getQuery();
            }
        }
    },
    onPullDownRefresh() {
        this.pageNumber = 1;
        this.getQuery();
        wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if(this.isPage){
            this.pageNumber++;
            this.getQuery();
        }
    }
}
</script>
<style lang="scss">
@import '../../../static/css/journal.css';
@import '../../../static/css/icon.css';
.wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            padding-bottom: 100px;
        }
        .content{
            padding: 0 33rpx;
            background: #fff;
            margin-top: 33rpx;
            .row{
                display: flex;
                align-items: center;
                padding-top: 26rpx;
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
                            font-size: 32rpx;
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
                font-size: 32rpx;
                color: #333333;
                border-bottom: 1rpx solid #e2e3e5;
            }
            .imgList{
                padding: 10rpx 0;
                .imgs{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                }
                .imgs::after{
                    content: '';
                    width: 100px;
                }
            }
            .location{
                font-size: 28rpx;
                color: #666666;
                padding-top: 10rpx;
                display: flex;
                align-items: center;
                i{
                    padding-right: 20rpx;
                }
            }
            .more_btn{
                font-size: 28rpx;
                color: #526992;
                padding: 24rpx 0;
                display: flex;
                justify-content: space-around;
                .btn{
                    display: flex;
                    align-items: center;
                    .iconfont{
                        margin-right: 20rpx;
                    }
                    .iconfont.active{
                        color: #FF6666;
                    }
                }
                .btn.active{
                    color: #FF6666;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box_wrap{
                display: flex;
                padding: 24rpx 0;
                .box{
                    flex: 1;
                    text-align: center;
                    font-size: 22rpx;
                    color: #a1a5a6;
                }
                .box.active{
                    color: #3399ff;
                }
            }
        }
        .clues-add-button {
            position: fixed;
            right: 20px;
            bottom: 80px;
            // bottom: 40px;
            background: #049bfb;
            width: 48px;
            height: 48px;
            z-index: 1002;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0rpx 5rpx 12rpx 0rpx rgba(0, 0, 0, 0.3);
            i{
                font-size: 35rpx;
            }

        }
        .sheetWrap{
            background: #fff;
            p{
                text-align: center;
                font-size: 28rpx;
                padding: 30rpx 0;
                border-bottom: 1rpx solid #e2e3e5;
                color: #3399ff;
            }
        }
    }
</style>