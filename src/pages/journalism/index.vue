<template>
    <div class="wrap">
        <div class="fixed">
            <van-search :value="keyValue" placeholder="搜索" @change="getSearch" />
            <!-- <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
            </swiper> -->
            <div class="header">
                <div class="left">
                    <i-tabs i-class="itab" :current="current_scroll" scroll @change="handleChangeScroll">
                        <i-tab :key="item.ItemId" :title="item.ItemName" v-for="(item,index) in tagLists"></i-tab>
                    </i-tabs>
                </div>
                <div class="right" @click="getOpenModal">
                    <i class="iconfont icon-gengduo"></i>
                    <!-- <i-icon type="other" size="20" color="#3399ff" /> -->
                </div>
            </div>
        </div>
        <div class="center">
            <div v-for="(item,index) in listData" :key="index"  @click="getDetail(item)">
                <div class="content" v-if="item.CoverDisplay==''">
                    <p class="h1" :class="item.IsRead?'active':''">{{item.Title}}</p>
                    <div class="rowText">
                        <!-- <span class="re" :class="item.IsRead?'active':''">热点</span> -->
                        <span v-if="item.IsTop==true" class="isTop">置顶</span>
                        <span :class="item.IsRead?'active':''">{{item.BusinessUnit.DisplayName}}</span>
                        <span :class="item.IsRead?'active':''" v-if="item.ReadCount>0">{{item.ReadCount}}&nbsp;阅读</span>
                        <span :class="item.IsRead?'active':''" v-if="item.CommentCount>0">{{item.CommentCount}}&nbsp;评论</span>
                        <span :class="item.IsRead?'active':''">{{item.time}}</span>
                    </div>
                </div>
                <div class="contRight" v-if="item.CoverDisplay=='RightTitle'">
                    <div class="text">
                        <p class="h3" :class="item.IsRead?'active':''">
                            {{item.Title}}
                        </p>
                        <div class="spans">
                            <!-- <span :class="item.IsRead?'active':''">热</span> -->
                            <span v-if="item.IsTop==true" class="isTop">置顶</span>
                            <span :class="item.IsRead?'active':''">{{item.BusinessUnit.DisplayName}}</span>
                            <span :class="item.IsRead?'active':''" v-if="item.ReadCount>0">{{item.ReadCount}}&nbsp;阅读</span>
                            <span :class="item.IsRead?'active':''" v-if="item.CommentCount>0">{{item.CommentCount}}&nbsp;评论</span>
                            <span :class="item.IsRead?'active':''">{{item.time}}</span>
                        </div>
                    </div>
                    <div class="imgBox" v-if="item.Images!=''">
                        <img :src="item.Images[0].ThumbnailUrl" alt="">
                    </div>
                </div>
                <div class="contType" v-if="item.CoverDisplay=='LeftTitle'">
                    <div class="text">
                        <h2>{{item.Title}}</h2>
                        <!-- <h2>同志职务任免的通知</h2> -->
                        <p>
                            <span>{{item.BusinessUnit.DisplayName}}</span>
                            <span v-if="item.ReadCount>0">{{item.ReadCount}}&nbsp;阅读 </span>
                            <span v-if="item.CommentCount>0">{{item.CommentCount}}&nbsp;评论 </span>
                            <span>{{item.time}}</span>
                         </p>
                    </div>
                    <div class="imgs">
                        <p v-if="item.Images!=''">
                            <img :src="item.Images[0].ThumbnailUrl" alt="">
                        </p>
                    </div>
                </div> 
                <div class="manyImgs" v-if="item.CoverDisplay=='BelowGrid'">
                    <h3>{{item.Title}}</h3>
                    <p>
                        <span v-if="item.IsTop==true" class="isTop">置顶</span>     
                        <span>{{item.BusinessUnit.DisplayName}}</span>
                        <span v-if="item.ReadCount>0">{{item.ReadCount}}&nbsp;阅读</span>  
                        <span v-if="item.CommentCount>0">{{item.CommentCount}}&nbsp;评论</span>    
                        <span>{{item.time}}</span>             
                    </p>
                    <div class="box" v-if="item.Images!=''">
                        <p v-for="(v,idx) in item.Images" :key="idx">
                            <img :src="v.ThumbnailUrl" alt="">
                        </p>
                    </div>
                </div>
                <div class="maxImgs" v-if="item.CoverDisplay=='BelowTitleBigImg'">
                    <h3>{{item.Title}}</h3>
                    <p>
                        <span v-if="item.IsTop==true" class="isTop">置顶</span>  
                        <span>{{item.BusinessUnit.DisplayName}}</span>
                        <span v-if="item.ReadCount>0">{{item.ReadCount}}&nbsp;阅读</span> 
                        <span v-if="item.CommentCount>0">{{item.CommentCount}}&nbsp;评论</span>
                        <span>{{item.time}}</span>                                   
                    </p>
                    <div class="imgWrap" v-if="item.Images!=''">
                        <img :src="item.Images[0].ThumbnailUrl" alt="">
                    </div>
                </div>
            </div>
        </div>
        <!-- 二期版本 -->
        <!-- <div class="footerX"  :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="boxWrap">
                <div class="box" v-for="(item,index) in listName" :key="index" @click="getCheckName(index)">
                    <p>
                        <i class="iconfont" :class="item.icon" :style="{'color':numberIdx==index?'#3399ff':''}" style="font-size:44rpx;"></i>
                    </p>
                    <p :class="{'active':numberIdx==index}">{{item.name}}</p>
                </div>
            </div>
        </div> -->
         <van-popup
            :show="showPopup"
            z-index="9999"
            position="center"
            custom-style="width: 100%;height: 100%;overflow: scroll;"
            
        >
            <div class="popupWrap">
                <div class="headerPopup">
                    <div class="l">
                        <p>我的频道<span>点击进入频道</span></p>
                        
                    </div>
                    <div class="r">
                        <p @click="getCancel">取消</p>
                        <p @click="getEdit" v-if="!isEdit">编辑</p>
                        <p @click="getEdit" v-if="isEdit">完成</p>
                    </div>
                </div>
                <div class="popupCont">
                    <div class="box" :class="item.DefaultFolders=='True'?'default':numIdx==index?'active':item.name==''?'actives':''" v-for="(item,index) in MyChannel" :key="index">
                        <p  @click="getSelect(item,index)">{{item.ItemName}}
                        </p>
                        <span class="icon" v-if="isEdit&&item.DefaultFolders=='False'" @click="getClose(item,index)">
                            <i-icon type="close" color="#fff" />
                        </span>
                        <!-- <van-icon name="close" custom-class="icon" v-if="isEdit&&item.DefaultFolders=='False'" @click="getClose(item,index)" /> -->
                    </div>
                </div>
                <div class="headerPopup">
                    <div class="l">
                        <p>频道推荐<span>点击添加频道</span></p>
                    </div>
                </div>
                <div class="editWrap">
                    <p class="box" :class="item.name==''?'actives':''" v-for="(item,index) in selectTagList" :key="index" @click="getSelectTop(item,index)"><i-icon type="add" />{{item.ItemName}}</p>
                </div>
            </div>
        </van-popup>
        <div class="clues-add-button" v-if="!showPopup" @click="onCluesAddBtnClick" :class="{'active':isModelmes}">
            <i class="iconfont icon-icon-add-3-copy"></i>
        </div>
    </div>
</template>
<script>
import { mapState,mapMutations,mapActions,mapGetters } from 'vuex';
import {getDate} from '../../utils/changeDate';
export default {
    data(){
        return {
            keyValue:"",
            current_scroll:"",
            current_name:"",
            current:"homepage",
            showPopup:false,
            num:0,

            // list:['推荐','热点','院办','人事','财务','医务','护理','总务','信息','后勤',
            //     '监察室','质控办','临床药学','制度文件','教学管理','科教科','医保办','健康管理',
            //     '护理','门诊','通知','工会','',''
            // ],
            numIdx:-1,
            list:[],
            // selectList:[],
            isEdit:false,
            listData:[],
            id:"",
            tagLists:[],
            tagId:"",
            listName:[
                {
                    icon:"icon-xinwen",
                    name:"新闻"
                },
                {
                    icon:"icon-shipin",
                    name:"视频"
                },
                {
                    icon:"icon-guanzhu",
                    name:"关注"
                },
                {
                    icon:"icon-wo",
                    name:"我的"
                }
            ],
            numberIdx:0,
            isPage:false,
            pageNumber:1,
            pageSize:15,
            total:"",
            contentTypeCode:"",
            sessionkey:"",
            title:""
        }
    },
    onShow(){
        this.pageNumber = 1;
        // this.getQuery();
        this.getMyTag().then(res=>{
            // if(this.current_name == '未读'){
                // 未读
                // this.getUnQuery()
            // }else {
                this.getQuery();
            // }
        });
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());    
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.contentTypeCode = options.contentTypeCode;
        this.title = options.title;
        wx.setNavigationBarTitle({
            title: this.title
        })
        this.pageNumber = 1;
        // this.selectList = [];
        this.isEdit = false;
        this.showPopup = false;
        // this.getMyTag().then(res=>{
        //     this.getQuery();
        // });
        wx.getSystemInfo({
            success: (res) => {
                console.log(res)
                let modelmes = res.model; //手机品牌
                console.log('手机品牌', modelmes)
                if (modelmes.indexOf('iPhone X') != -1) {　　//XS,XR,XS MAX均可以适配,因为indexOf()会将包含'iPhone X'的字段都查出来
                }
            },
        })
    },
    computed:{
        ...mapState({
            imgUrl:state=>{
                return state.user.imgUrl;
            },
            selectTagList:state=>{
                return state.user.selectTagList
            },
            MyChannel:state=>{
                return state.user.MyChannel
            }
        }),
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
        // ...mapGetters(['selectTagList'])
    },
    methods:{
        ...mapActions([
            'queryTag',
            'addTag',
            'delete'
        ]),
        getSearch(e){
            console.log(e);
            this.keyValue = e.mp.detail;
            this.getQuery();
        },
      async  getMyTag(){
         const ret = await  this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.my.channel",
                    SessionKey:this.sessionkey,
                    contentTypeCode:this.contentTypeCode
                }
            }).then(res=>{
                console.log(res);
                this.tagLists= res.rows;
                this.tagLists.splice(0, 0, {ItemName:'未读',ItemId: 0});
                this.current_scroll = this.tagLists[0].ItemId;
                this.current_name = this.tagLists[0].ItemName;
                // this.tagLists.unshift({
                //     ItemName: '未读'
                // })
            })
            return ret;
        },
        getUnQuery() {
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method: this.$api.journalism.unread,
                    SessionKey: this.sessionkey,
                    contentTypeCode:this.contentTypeCode
                }
            }).then(res=>{
                let response = res.actions[0].returnValue;
                let {Data, totalCount} = response;
                this.total = totalCount;
                if(this.pageNumber*this.pageSize<=this.total){
                    this.isPage = true;
                }else {
                    this.isPage = false;
                }
                let result = [];
                if(this.pageNumber==1){
                    result = Data;
                }else {
                    result = this.listData.concat(Data);
                }
                this.listData = result;
                this.listData.map(item=>{
                    const time = getDate(item.CreatedOn.replace(/-/g,"/"));
                    item.time = time;
                    return time;
                })
                console.log('listData:', this.listData);
            })
        },
        getQuery(){
            let method = this.$api.journalism.newQuery;
            if(this.current_name == '未读'){
                method = this.$api.journalism.unread;
            }else if(this.current_name == '推荐'){
                method = this.$api.journalism.recommend;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    // method:"news.getlist.search",
                    method: method,
                    SessionKey:this.sessionkey,
                    Tag:this.current_name,
                    contentTypeCode:this.contentTypeCode,
                    PageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                    search:this.keyValue
                }
            }).then(res=>{
                let response = res.actions[0].returnValue;
                let {Data, totalCount} = response;
                this.total = totalCount;
                if(this.pageNumber*this.pageSize<=this.total){
                    this.isPage = true;
                }else {
                    this.isPage = false;
                }
                let result = [];
                if(this.pageNumber==1){
                    result = Data;
                }else {
                    result = this.listData.concat(Data);
                }
                this.listData = result;
                this.listData.map(item=>{
                    const time = getDate(item.CreatedOn.replace(/-/g,"/"));
                    item.time = time;
                    return time;
                })
                console.log('listData:', this.listData);
            })
        },
        handleChangeScroll(e){
            this.current_scroll = e.mp.detail.key;
            console.log(this.current_scroll,this.tagLists)
            let v = this.tagLists.find(item=>item.ItemId==this.current_scroll);
            this.current_name = v.ItemName;
            this.pageNumber = 1;
            this.getQuery();
        },
        handleChange(e){
            this.current = e.mp.detail.key;
        },
        getOpenModal(){
            this.isEdit = false;
            this.queryTag();
            this.numIdx = -1;
            this.showPopup = true;
        },
        onClose(){
            this.showPopup = false;
        },
        getEdit(){
            this.isEdit = !this.isEdit;
        },
        getCancel(){
            // this.isEdit = false;
            this.showPopup = false;
        },
        getClose(item,index){
            this.delete(item.ValueId);
            setTimeout(()=>{
                this.queryTag();
                this.getMyTag();
            },1000)
        },
        ...mapMutations([
            'updateId',
            'deleteTag',
            'getContentTypeCode'
        ]),
        getSelectTop(item,index){
            this.addTag(item.ItemId).then(()=>{
                setTimeout(()=>{
                    this.queryTag();
                    this.getMyTag();
                },1000)
            });
        },
        getSelect(item,index){
            this.tagId = item.ValueId;
            this.numIdx = index;
            this.current_name = item.ItemName;
            this.current_scroll = item.ItemId; // 频道
            this.showPopup = false;
            this.getQuery();
        },
        onCluesAddBtnClick(){
            this.getContentTypeCode(this.contentTypeCode)
            const url = '/pages/journalism/releaseNewsTwo/main';
            wx.navigateTo({url:url});
        },
        // 详情
        getDetail(item){
            this.id = item.ContentId;
            this.updateId(item.ContentId);
            const url = "/pages/journalism/detail/main?id="+item.ContentId;
            wx.navigateTo({url:url});
        },
        getCheckName(index){
            this.numberIdx = index;
        }
    },
        // 下拉刷新
    onPullDownRefresh() {
        // this.current_scroll = '推荐';
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
@import '../../../static/css/icon.css';
page{
    background: #fff;
}
    .wrap{
        width: 100%;
        height: 100%;
        .fixed{
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 9999;
        }
        .van-search__content{
            background: #eceeed!important;
        }
        .i-tabs-tab-title-current{
            font-size: 16px !important;
        }
        .header{
            width: 100%;
            overflow: hidden;
            display: flex;
            .left{
                width: 90%;
                font-size: 31rpx;
                .itab{
                    // font-size: 34rpx !important;
                    // font-weight: bold !important;
                }
            }
            .right{
                flex: 1;
                min-width: 0;
                background: #fff;
                // box-shadow:darkgrey 0 0 0 10rpx;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: -5rpx 0rpx 9rpx 0rpx rgba(0, 0, 0, 0.05);
                opacity: .9;
                border-bottom: 1rpx solid #eceeed;

                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
        .center{
            padding-bottom: 100px;
            margin-top: 192rpx;
            .content{
                padding: 30rpx;
                border-bottom: 1rpx solid #eceeed;
                background: #fff;
                .h1{
                    font-size: 38rpx;
                    // font-weight: bold;
                    color: #333333;
                    padding-bottom: 8rpx;
                }
                .h1.active{
                    color: #999999;
                }
                .rowText{
                    span{
                        font-size: 25rpx;
                        display: inline-block;
                        margin-right:  10rpx;
                    }
                    span.active{
                        color: #999999;
                    }
                    .isTop{
                        color: #ff6666 !important;
                    }
                    .re{
                        font-size: 24rpx;
                        color: #ff6666;
                        // border:1rpx solid #ff6666;
                        // display: inline-block;
                        // padding: 5rpx;
                        // width: 25rpx;
                        // text-align: center;
                        // border-radius: 2rpx;
                        // margin-left: 0;
                        // margin-right: 10rpx;
                    }
                    // span:nth-child(2),span:nth-child(5){
                    //     color: #999999;
                    // }
                    span{
                        color: #999999;
                    }
                }
            }
            .contRight{
                padding: 27rpx 30rpx;
                display: flex;
                background: #fff;
                border-bottom: 1rpx solid #eceeed;
                .text{
                    flex: 1;
                    margin-right: 20rpx;
                    position: relative;
                    .h3{
                        font-size: 38rpx;
                        // font-weight: bold;
                        padding-bottom: 8rpx;
                    }
                    .h3.active{
                        color: #999999;
                    }
                    .spans{
                        // position: absolute;
                        // bottom: 0;
                        span{
                            font-size: 25rpx;
                            color: #999999;
                            margin-right: 10rpx;
                        }
                        .isTop{
                            color: #ff6666 !important;
                        }
                    }
                }
                .imgBox{
                    width: 223rpx;
	                height: 153rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                        border-radius: 7rpx;
                    }
                }
            }
            .contType{
                padding: 30rpx;
                display: flex;
                background: #fff;
                border-bottom: 1rpx solid #eceeed;
                .text{
                    width: 70%;
                    h2{
                        font-size: 38rpx;
                        // font-weight: bold;
                    }
                    p{
                        font-size: 25rpx;
                        color: #333333;
                        margin-top: 10rpx;
                        span{
                            color: #999999;
                        }
                    }
                }
                .imgs{
                    width: 30%;
                    p{
                        width: 90%;
                        height: 60px;
                        img{
                            width: 100%;
                            height: 100%;
                            border-radius: 7rpx;
                        }
                    }
                }
            }
            .manyImgs{
                padding: 30rpx;
                background: #fff;
                border-bottom: 1rpx solid #eceeed;
                h3{
                    font-size: 38rpx;
                    // font-weight: bold;
                    color: #999999;
                }
                p{
                    font-size: 25rpx;
                    color: #999999;
                    .isTop{
                        color: #ff6666 !important;
                    }
                }
                .box{
                    display: flex;
                    padding-top: 10rpx;
                    p{
                        width: 33%;
                        height: 60px;
                        margin-right: 10rpx;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            .maxImgs{
                padding: 30rpx;
                background: #fff;
                border-bottom: 1rpx solid #eceeed;
                h3{
                    font-size: 38rpx;
                    // font-weight: bold;
                    color: #999999;
                }
                p{
                    font-size: 25rpx;
                    color: #999999;
                    margin-top: 14rpx;
                    .isTop{
                        color: #ff6666 !important;
                    }
                    span{
                        margin-right: 10rpx;
                    }
                }
                .imgWrap{
                    width: 100%;
                    height: 386rpx;
                    padding-top: 10rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                        border-radius: 7rpx;
                    }
                }
            }
        }
        .popupWrap{
            padding: 30rpx;
            .headerPopup{
                margin: 20rpx 0 30rpx 0;
                display: flex;
                align-self:flex-end;
                font-size: 28rpx;
                .l{
                    flex: 1;
                    font-size: 29rpx;
                    span{
                        font-size: 22rpx;
                        line-height: 2;
                        color: #999999;
                        margin-left: 20rpx;
                    }
                }
                .r{
                    display: flex;
                    p{
                        width: 97rpx;
	                    height: 46rpx;
                        // padding: 0 20rpx;
                        border-radius: 23rpx;
                        text-align: center;
                        line-height: 46rpx;
                        font-size: 25rpx;
                        border:1rpx solid #3399ff;
                        color: #3399ff;
                    }
                    p:nth-child(1){
                        margin-right: 15px;
                    }
                }
            }
            .popupCont{
                display: flex;
                flex-wrap: wrap;
                // justify-content: space-between;
                flex-direction: row;
                .box{
                    width: 156rpx;
                    height: 83rpx;
                    // border:1rpx solid #3399ff;
                    border-radius: 7rpx;
                    background: #f3f5f4;
                    // margin: 10rpx 0;
                    color: #333333;
                    font-size: 26rpx;
                    line-height:83rpx;
                    text-align: center;
                    position: relative;
                    // margin-right: 6rpx;
                    margin: 9rpx;
                    .icon{
                        display: inline-block;
                        width: 35rpx;
                        height: 35rpx;
                        line-height: 35rpx;
                        background: #9c9c9c;
                        text-align: center;
                        position: absolute;
                        top: -12rpx;
                        right: -12rpx;
                        font-size: 21rpx;
                        border-radius: 50%;
                    }
                }
                .box.active{
                    color: #3399ff;
                }
                .box.actives{
                    background: #fff;
                }
                .box.default{
                    background: #f3f5f4;
                    color: #999999;
                }
            }
            .editWrap{
                display: flex;
                flex-wrap: wrap;
                // justify-content: space-between;
                flex-direction: row;
                .box{
                    width: 156rpx;
                    height: 83rpx;
                    border-radius: 7rpx;
                    background: #fff;
                    // margin-right: 10rpx;
                    // margin-top: 10rpx;
                    color: #333333;
                    font-size: 12px;
                    line-height: 83rpx;
                    text-align: center;
                    box-shadow: 0rpx 0rpx 23rpx 0rpx rgba(0, 0, 0, 0.2);
                    // margin-right: 6rpx;
                    margin: 9rpx;
                    
                }
                .box.actives{
                    box-shadow: none;
                }
            }
        }
        .clues-add-button {
            position: fixed;
            right: 20px;
            // bottom: 80px;
            bottom: 40px;
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
        .clues-add-button.active{
            // bottom: 100px;
        }
        .footerX{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #f9f9f9;
            padding-bottom: 20rpx;
            .boxWrap{
                display: flex;
                // text-align: center;
                justify-content: space-around;
                align-items: center;
                padding: 20rpx 0;
                .box{
                    p:nth-child(1){
                        color: #a4a4a4;
                        text-align: center;
                        font-size: 44rpx;
                    }
                    p:nth-child(2){
                        font-size: 22rpx;
                        color: #a1a5a6;
                    }
                    p:nth-child(2).active{
                        color: #3399ff;
                    }
                }
            }
        }
    }
</style>