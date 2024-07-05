<template>
    <div class="wrap">
        <div class="module" v-if="idx==1">
            <div class="box" @click="getWrite(3)">
                <p class="name">日报</p>
                <!-- <p class="imgs"></p>
                <p class="text">日报</p> -->
                <div class="text_box">
                    <p class="text">今日完成工作</p>
                    <p class="desc">请输入</p>
                </div>
                <div class="text_box">
                    <p class="text">未完成工作</p>
                    <p class="desc">请输入</p>
                </div>
                <div class="text_box">
                    <p class="text">需协调工作</p>
                    <p class="desc">请输入</p>
                </div>
            </div>
            <div class="box" @click="getWrite(2)">
                <p class="name">周报</p>
                <div class="text_box">
                    <p class="text">本周完成工作</p>
                    <p class="desc">请输入</p>
                </div>
                <div class="text_box">
                    <p class="text">本周工作总结</p>
                    <p class="desc">请输入</p>
                </div>
                <div class="text_box">
                    <p class="text">下周工作计划</p>
                    <p class="desc">请输入</p>
                </div>
            </div>
            <div class="box" @click="getWrite(1)">
                <p class="name">月报</p>
                <div class="text_box">
                    <p class="text">本月工作内容</p>
                    <p class="desc">请输入</p>
                </div>
                <div class="text_box">
                    <p class="text">本月工作总结</p>
                    <p class="desc">请输入</p>
                </div>
                <div class="text_box">
                    <p class="text">下月工作计划</p>
                    <p class="desc">请输入</p>
                </div>
            </div>
            <!-- <div class="box active">
                <p class="imgs"></p>
                <p class="text">添加模板</p>
            </div> -->
        </div>
        <div class="seeJournal" v-if="idx==0">
            <div class="search">
                <van-search :value=" search " @change="changeSearch" placeholder="请输入搜索关键词" />
            </div>
            <div class="navTab">
                <div class="tab">
                    <van-tabs :active="active" color="#3399ff" @change="clickTabs" :swipeable="true" title-active-color="#3399ff">
                        <!-- <van-tab title="全部"></van-tab>
                        <van-tab title="未读(2)"></van-tab>
                        <van-tab title="我发出的"></van-tab>
                        <van-tab title="我收到的"></van-tab>
                        <van-tab title="日报"></van-tab>
                        <van-tab title="周报"></van-tab> -->
                        <van-tab :title="item.name" :name="item.scope" v-for="(item,index) in tagList" :key="index"></van-tab>
                    </van-tabs>
                </div>
                <div class="more" @click="getOpenScreen">
                    <i-icon type="other" size="20" color="#3399ff" />
                </div>
            </div>
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
                    {{item.ContentBody}}
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
                        阅读数量&nbsp;&nbsp;{{item.ReadQty}}
                    </div>
                    <div class="btn">
                        <i class="iconfont icon-pinglun"></i>
                        评论</div>
                    <div class="btn" @click.stop="getLike(item)" :class="{'active':item.HasLike!='false'}">
                        <i class="iconfont icon-zan" :class="{'active':item.HasLike!='false'}"></i>
                        <span v-if="item.HasLike=='false'" >
                            赞
                        </span>
                        <span v-if="item.HasLike!='false'">{{item.LikeQty}}</span>
                    </div>
                </div>
            </div>
            <van-divider v-if="isMoreShow" contentPosition="center">没有更多了~</van-divider>
        </div>
        <van-action-sheet
            :show="show"
            :round="false"
            z-index="9999"
            cancel-text="取消"
            @close="onClose"
            @cancel="onClose"
        >
            <div class="sheetWrap">
                <p @click="getFavor">收藏</p>
                <p @click="getDelete">删除</p>
            </div>
        </van-action-sheet>
        <van-popup
            :show="screenShow"
            :closeable="false"
            position="bottom"
            custom-style="height: 100%;background:#f4f4f4;"
            @close="onClose"
            @touchmove.stop.prevent="moveHandle"
            v-if="idx==0"
        >
            <div class="popup_wrap">
                <div class="moduleScreen">
                    <p class="label">按模版筛选</p>
                    <div class="boxB">
                        <p class="btn" :class="{'active':num==0}" @click="setTab(0)">日报</p>
                        <p class="btn" :class="{'active':num==1}" @click="setTab(1)">周报</p>
                        <p class="btn" :class="{'active':num==2}" @click="setTab(2)">月报</p>
                    </div>
                </div>
                <div class="approvalPeople" @click="getApproval">
                    <p class="name">
                        审批人
                    </p>
                    <p class="icon">
                        <span class="text">{{text}}</span>
                        <i-icon type="add" color="#3399ff" size="20" />
                    </p>
                </div>
                <div class="timeBox">
                    <picker mode="date" :value="startTime" @change="changeStartTime">
                        <van-cell-group>
                            <van-field
                                label="开始时间"
                                :value="startTime"
                                placeholder="请选择"
                                :border="false"
                                :readonly="true"
                                input-align="right"
                            />
                        </van-cell-group>
                    </picker>
                    <picker mode="date" :value="endTime" @change="changeEndTime">
                        <van-cell-group>
                            <van-field
                                label="结束时间"
                                :value="endTime"
                                placeholder="请选择"
                                :border="false"
                                :readonly="true"
                                input-align="right"
                            />
                        </van-cell-group>
                    </picker>
                </div>
                <div class="switch">
                    <p class="label">未读</p>
                    <van-switch :checked="checked" @change="onChangeSwitch" size="24px" />
                </div>
                <div class="popFooter" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                    <div class="box_wrap">
                        <div class="btn cancel" @click="getCancelPop">取消</div>
                        <div class="btn" @click="getComplete">完成</div>
                    </div>
                </div>
            </div>
        </van-popup>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box_wrap">
                <div class="box" :class="{'active':idx==index}" v-for="(item,index) in tabList" :key="index" @click="setTabActive(item,index)">
                    <p>
                        <i class="iconfont" :class="item.icon"></i>
                    </p>
                    <p>{{item.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { splitName } from '@/utils/splitName';
import {mapState,mapMutations} from 'vuex';
import {message} from '@/utils/message';
export default {
    data(){
        return {
            tabList:[
                {
                    icon:"icon-kanrizhi",
                    name:"看日志"
                },
                {
                    icon:"icon-xierizhi",
                    name:"写日志",
                },
                {
                    icon:"icon-tongji",
                    name:"统计"
                },
                {
                    icon:"icon-shezhi",
                    name:"设置"
                }
            ],
            tagList:[
                {
                    name:"全部",
                    scope:'all'
                },
                {
                    name:"未读",
                    scope:'read'
                },
                {
                    name:"我发出的",
                    scope:'me'
                },
                {
                    name:"我收到的",
                    scope:'get'
                },
                {
                    name:"日报",
                    scope:'me',
                    type:'3'
                },
                {
                    name:"周报",
                    scope:'me',
                    type:'2'
                }
            ],
            idx:0,
            active:"标签 1",
            list:[],
            show:false,
            search:"",
            isPage:false,
            pageNumber:1,
            pageSize:20,
            screenShow:false,
            num:0,
            startTime:"",
            endTime:"",
            checked:false,
            scope:'all',
            type:'',
            WorklogId:"",
            status:'',
            isMoreShow: false
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        userId(){
            return wx.getStorageSync('userId');
        },
        ...mapState({
            selectListName:state=>{
                return state.mailList.selectListName;
            }
        }),
        text(){
            let str = '';
            if(this.selectListName!=''){
                str =  `${this.selectListName[0].FullName}等${this.selectListName.length}人`
            }
            return str;
        }
    },
    onLoad(){
        if(this.idx==0){
            this.getQuery();
        }
    },
    methods:{
        clickTabs(e){
            this.pageNumber = 1;
            this.scope = e.mp.detail.name;
            let index = e.mp.detail.index;
            this.status = '';
            this.startTime = '';
            this.endTime = '';
            if(index==4||index==5){
                this.type = this.tagList[index].type;
            }
            this.getQuery();
        },
        getWrite(type){
            const url = '/pages/journalModule/writeJournal/main?type='+type;
            wx.navigateTo({url:url});
        },
        setTabActive(item,index){
            this.idx = index;
            wx.setNavigationBarTitle({
                title: item.name
            })
            if(index==0){
                this.getQuery();
            }
        },
        changeSearch(e){
            this.search = e.mp.detail;
            this.getQuery();
        },
        getMore(item){
            this.WorklogId = item.WorklogId;
            this.show = true;
        },
        onClose(){
            this.show = false;
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.journal.del,
                    id:this.WorklogId
                }
            }).then(res=>{
                let that = this;
                message.toast({
                    title:res.msg,
                    delta:0,
                    success:()=>{
                        setTimeout(() => {
                            that.show = false;
                            that.getQuery();
                        }, 1000);
                    }
                })
            })
        },
        getFavor(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.journal.favor,
                    contentId:this.WorklogId,
                    isFavor:true
                }
            }).then(res=>{
                message.toast({
                    title:res.msg,
                    delta:0,
                    success:()=>{
                        this.show = false;
                    }
                })
            })
        },
        // 筛选
        getComplete(){
            this.screenShow = false;
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.journal.query,
                    SessionKey:this.sessionkey,
                    // owningUser:this.userId,
                    search:this.search,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                    scope:this.scope,
                    type:this.type,
                    startTime:this.startTime,
                    endTime:this.endTime,
                    status:this.status
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
                    id:item.Id,
                    ObjTypeCode:5500,
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
        getDetail(item){
            const url = '/pages/journalModule/detail/main?id='+item.Id;
            wx.navigateTo({url:url});
        },
        setTab(idx){
            this.num = idx;
        },
        getApproval(){
            const url = '/pages/publics/mailList/main';
            wx.navigateTo({url:url});
        },
        changeStartTime(e){
            this.startTime = e.mp.detail.value;
        },
        changeEndTime(e){
            this.endTime = e.mp.detail.value;
        },
        onChangeSwitch(e){
            this.checked = e.mp.detail;
            if(this.checked){
                this.status = 1;
            }else {
                this.status = 2;
            }
        },
        getOpenScreen(){
            this.screenShow = true;
        },
        getCancelPop(){
            this.screenShow = false;
        },
        moveHandle(){},
        getPreviewImage(item,v){
            var path = v.path;
            var temp = item.imgs.map(one=>one.path);
            wx.previewImage({
                current: path, // 当前显示图片的http链接
                urls: temp
                // 需要预览的图片http链接列表
            })
        }
    },
    onPullDownRefresh() {
        this.pageNumber = 1;
        this.isMoreShow = false;
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
.wrap{
    width: 100%;
    height: 100%;
    .module{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        padding: 36rpx 46rpx;
        .box{
            width: 32%;
            height: 180px;
            padding: 30rpx 15rpx;
            background: #fff;
            box-shadow: 0 2rpx 16rpx 0 rgba(21,54,83,.2);
            .name{
                font-size: 28rpx;
                font-weight: bold;
                color: #333333;
                padding-bottom: 20rpx;
            }
            .text_box{
                margin-top: 20rpx;
                .text{
                    color: #707070;
                    font-size: 20rpx;
                }
                .desc{
                    font-size: 18rpx;
                    color: #cacaca;
                }
            }
            
            // .imgs{
            //     width: 96rpx;
            //     height: 96rpx;
            //     border-radius: 5rpx;
            //     background: #ccc;
            // }
            // .text{
            //     font-size: 24rpx;
            //     color: #666666;
            //     text-align: center;
            //     margin-top: 17rpx;
            // }
        }
    }
    .seeJournal{
        padding-bottom: 100px;
        .search{
            border-bottom: 1rpx solid #ebedec;
        }
        .navTab{
            display: flex;
            border-bottom: 1rpx solid #ebedec;
            .tab{
                flex: 1;
                .van-tab{
                    line-height: 99rpx!important;
                }
                .van-tabs__wrap {
                    height: 99rpx!important;
                    line-height: 99rpx!important;
                }
            }
            .more{
                width: 94rpx;
                height: 99rpx;
                color: rgba(80, 80, 80, 1);
                background-color: rgba(255, 255, 255, 1);
                font-size: 10rpx;
                line-height: 150%;
                box-shadow: -12rpx 0rpx 9rpx 0rpx rgba(0, 0, 0, 0.05);
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9;
            }
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
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
        z-index: 99;
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
    .popup_wrap{
        z-index: 999;
        .moduleScreen{
            margin-top: 28rpx;
            padding: 28rpx 33rpx;
            background: #fff;
            .label{
                font-size: 22rpx;
                color: #999999;
                padding-bottom: 28rpx; 
            }
            .boxB{
                display: flex;
                .btn{
                    width: 214rpx;
                    height: 83rpx;
                    background: #f3f5f4;
                    border-radius: 7rpx;
                    color: #333333;
                    font-size: 26rpx;
                    text-align: center;
                    line-height: 83rpx;
                    margin-right: 20rpx;
                }
                .btn.active{
                    color: #3399ff;
                    background: #dfeffe;
                }
            }
        }
        .approvalPeople{
            margin-top: 33rpx;
            background: #fff;
            padding: 33rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name{
                font-size: 32rpx;
                color: #666666;
            }
            .icon{
                span{
                    font-size: 22rpx;
                    color: #333333;
                }
            }
        }
        .timeBox{
            margin-top: 33rpx;
            .van-cell__title{
                font-size: 32rpx!important;
                color: #666666!important;
            }
        }
        .switch{
            margin-top: 33rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 33rpx;
            color: #666666;
            font-size: 32rpx;
            background: #fff;
        }
        .popFooter{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 99;
            padding: 21rpx 33rpx;
            .box_wrap{
                display: flex;
                justify-content: space-between;
                padding: 24rpx 0;
                .btn{
                    width: 328rpx;
                    height: 83rpx;
                    line-height: 83rpx;
                    text-align: center;
                    font-size: 33rpx;
                    color: #fff;
                    background: #3399ff;
                    border-radius: 5rpx;
                }
                .cancel{
                    color: #333;
                    background: #f3f3f3;
                    border:1rpx solid #dadcdb;
                }
            }
        }
    }
}
</style>