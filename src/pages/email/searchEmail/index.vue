<template>
    <div class="wrap">
        <div class="nav">
            <van-search :value="keyWord" @change="getChangeSearch" placeholder="请输入搜索关键词" />
        </div>
        <div class="header">
            <i-tabs :current="current" @change="handleChange">
                <i-tab key="tab1" title="全部"></i-tab>
                <i-tab key="tab2" title="发件人"></i-tab>
                <i-tab key="tab3" title="主题"></i-tab>
                <!-- <i-tab key="tab4" title="收件人"></i-tab> -->
            </i-tabs>
        </div>
        <div class="content">
            <div class="rowWrap" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                <div class="left">
                    <p class="radius">
                        {{item.name}}
                    </p>
                </div>
                <div class="center">
                    <div class="headRow">
                        <p class="name">
                            <span v-if="!item.isRead"></span>
                            {{item.fromName}}
                        </p>
                        <p class="time">
                            <i-icon type="collection_fill" color="#ecd464" v-if="item.starEmail=='1'" />
                            {{item.time}}
                        </p>
                    </div>
                    <p class="theme">{{item.subject?item.subject:'无主题'}}</p>
                    <p class="cont">此邮件没有文字内容</p>
                </div>
                <div class="right">
                    <!-- <p class="time">
                        <i-icon type="collection_fill" color="#ecd464" v-if="item.starEmail=='1'" />
                        {{item.time}}
                    </p> -->
                    <!-- <span>2</span> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {getDate} from '@/utils/changeDate.js';
export default {
    data(){
        return {
            current:'tab1',
            ltags:"Inbox",
            pageNumber:1,
            pageSize:25,
            list:[],
            keyWord:"",
            stype:"All",
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.basicinfoSearch,
                    SessionKey:this.sessionkey,
                    search:this.keyWord,
                    ltags:this.ltags,
                    stype:this.stype,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize                 
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    const time = getDate(item.createdOn.replace(/-/g,'/'));
                    if(item.fromName.length>2){
                        const name = item.fromName.substr(1);
                        item.name = name;
                    }else {
                        item.name = item.fromName;
                    }
                    item.time = time;
                    return item;
                })
                console.log(this.list);
            })
        },
        getDetail(item){
            const url = '/pages/email/detail/main?emailId='+item.emailId+'&ltags='+'Inbox';
            wx.navigateTo({url:url});
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.stype = 'All'
            }else if(this.current=='tab2'){
                this.stype = 'FromName';
            }else if(this.current=='tab3'){
                this.stype = 'Subject'
            }
            this.getQuery();
        },
        getChangeSearch(e){
            this.keyWord = e.mp.detail;
            this.getQuery();
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        .nav{
            background: #fff;
            .van-search__content{
                border-radius: 38rpx;
            }
        }
        .content{
            background: #fff;
            .rowWrap{
                display: flex;
                align-items: center;
                padding: 20rpx 33rpx;
                border-bottom: 2rpx solid #eaeeed;
                .left{
                    .radius{
                        width: 83rpx;
                        height: 83rpx;
                        line-height: 83rpx;
                        font-size: 25rpx;
                        border-radius: 50%;
                        text-align: center;
                        background: #3399ff;
                        color: #fff;
                    }
                }
                .center{
                    flex: 1;
                    margin-left: 20rpx;
                    .headRow{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .name{
                            font-size: 32rpx;
                            color: #333333;
                            font-weight: bold;
                            span{
                                width: 14rpx;
                                height: 14rpx;
                                border-radius: 50%;
                                background: #ff6666;
                                display: inline-block;
                            }
                        }
                        .time{
                            font-size: 24rpx;
                            color: #999999;
                        }
                    }
                    .theme{
                        font-size: 28rpx;
                        color: #333333;
                    }
                    .cont{
                        font-size: 26rpx;
                        color: #999999;
                    }
                }
                .right{
                    .time{
                        font-size: 24rpx;
                        color: #999999;
                    }
                    span{
                        font-size: 10px;
                            color: #333;
                            text-align: center;
                            background: #eceeed;
                            width: 31rpx;
	                        height: 33rpx;
                            display: inline-block;
                            float: right;
                    }
                }
            }
        }
    }
</style>