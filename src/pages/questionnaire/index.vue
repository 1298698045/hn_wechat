<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="待填写"></i-tab>
            <i-tab key="tab2" title="我创建"></i-tab>
            <i-tab key="tab3" title="历史问卷"></i-tab>
        </i-tabs>
        <div class="center" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
            <div class="content">
                <div class="row">
                    <div class="Avatar">{{item.newName || ''}}</div>
                    <div class="info_r">
                        <p class="name">
                            {{item.CreatedByName || ''}}
                        </p>
                        <p class="text">
                            {{item.DeptName || ''}}   {{item.time || ''}}
                        </p>
                    </div>
                </div>
                <div class="title">{{item.Name}}</div>
                <div class="box">
                    <p class="time">
                        <i class="iconfont icon-shijian-copy"></i>
                        {{item.endTime}} 截止</p>
                    <p class="num">
                        <i class="iconfont icon-canyuren"></i>
                        <span class="active">{{item.NumOfResponses}}</span>
                        <span>&nbsp;/&nbsp;{{item.NumOfInvitationsSent}}</span>
                        <!-- {{item.NumOfResponses+'/'+item.NumOfInvitationsSent}} -->
                    </p>
                </div>
            </div>
        </div>
        <van-divider v-if="isMoreShow" contentPosition="center">没有更多了~</van-divider>
    </div>
</template>
<script>
import {splitName} from '@/utils/splitName';
export default {
    data(){
        return {
            current:"tab1",
            scope:0,
            pageNumber:1,
            pageSize:25,
            list:[],
            isPage: false,
            isMoreShow: false
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onLoad(){
        // this.getQuery();
    },
    onShow(){
        this.getQuery();
    },
    methods:{
        handleChange(e){
            this.current = e.mp.detail.key;
            this.pageNumber = 1;
            this.isMoreShow = false;
            if(this.current=='tab1'){
                this.scope = 0;
            }else if(this.current=='tab2'){
                this.scope = 100;
            }else {
                this.scope = 2;
            }
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.survey.query,
                    SessionKey:this.sessionkey,
                    scope:this.scope,
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber
                }
            }).then(res=>{
                if(this.list.length>0 &&res.listData==""){
                    this.isMoreShow = true;
                }
                if(res.listData == "") {
                    this.isPage = false
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
                    const time = item.CreatedOn.replace(/T/g,' ');
                    const endTime = item.EndDate.replace(/T/g,' ');
                    this.$set(item,'time',time);
                    this.$set(item,'endTime', endTime)
                    item.newName = splitName(item.CreatedByName);
                    return item;
                })
            })
        },
        getDetail(item){
            if(item.AudienceStatusCode==0){
                const url = '/pages/questionnaire/detail/main?id='+item.SurveyId;
                wx.navigateTo({url:url});
            }else {
                const url = '/pages/questionnaire/preview/main?id='+item.SurveyId;
                wx.navigateTo({url:url});
            }
        }
    },
    // 下拉刷新
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
@import '../../../static/css/vote.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            .content{
                padding: 0 33rpx 34rpx 33rpx;
                background: #fff;
                margin-top: 21rpx;
                .row{
                    display: flex;
                    align-items: center;
                    padding: 30rpx 0;
                    .Avatar{
                        width: 75rpx;
                        height: 75rpx;
                        line-height: 75rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 24rpx;
                    }
                    .info_r{
                        flex: 1;
                        margin-left: 25rpx;
                        .name{
                            font-size: 29rpx;
                            color: #333333;
                            padding-bottom: 21rpx;
                        }
                        .text{
                            font-size: 22rpx;
                            color: #999999;
                        }
                    }
                }
                .title{
                    font-size: 33rpx;
                    color: #333333;
                    font-weight: bold;
                }
                .box{
                    display: flex;
                    padding: 28rpx 21rpx;
                    align-items: center;
                    background: #f8f8f8;
                    margin-top: 28rpx;
                    justify-content: space-between;
                    p{
                        font-size: 24rpx;
                        color: #999999;
                        display: flex;
                        align-items: center;
                        i{
                            margin-right: 10rpx;
                        }
                    }
                    .num{
                        display: flex;
                        margin-left: 20rpx;
                        align-items: center;
                        span{
                            font-size: 24rpx;
                            color: #999999;
                        }
                        .active{
                            font-size: 35rpx;
                            color: #3399ff;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
</style>