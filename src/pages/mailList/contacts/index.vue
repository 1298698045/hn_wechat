<template>
    <div class="wrap">
        <div class="header">
            <van-search :value="keyWord" @change="changeSearch" placeholder="搜索：群组" />
        </div>
        <!-- <div class="rowWrap">
            <div class="lBox">
                <p>方圆</p>
            </div>
            <div class="cBox">
                <p>方圆</p>
                <p>财务</p>
            </div>
            <div class="rBox">
                <p>群主</p>
            </div>
        </div> -->
        <div class="center">
            <van-index-bar sticky @select="getSelect" :index-list="indexList">
                <view class="boxWrap" v-for="(item,index) in list" :key="index">
                    <van-index-anchor :index="item.title"></van-index-anchor>
                    <van-swipe-cell right-width="65" v-for="(v,i) in item.item" :key="i" @click="getDetail(v)">
                        <div class="row">
                            <div class="col_l">
                                <p>{{v.name}}</p>
                            </div>
                            <div class="col_r">
                                <p>{{v.FullName}}</p>
                                <p>{{v.DeptName}}</p>
                            </div>
                        </div>
                        <view slot="right" class="del" @click.stop="handleDel(v)">删除</view>
                    </van-swipe-cell>
                </view>
            </van-index-bar>
        </div>
        <div class="clues-add-button" @click="onCluesAddBtnClick" :class="{'active':isModelmes}">
            <i class="iconfont icon-icon-add-3-copy"></i>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            keyWord:"",
            indexList:['C','H','J','L','M','Q','R','S','X','Y','Z'],
            id:"",
            name:"",
            sessionkey:"",
            list:[]
        }
    },
    onShow(){
        this.getQueryList();
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.name = options.name;
        this.id = options.id;
        wx.setNavigationBarTitle({
            title: this.name
        })
        // this.getQueryList();
    },
    methods:{
        getQueryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.group.search",
                    SessionKey:this.sessionkey,
                    groupId:this.id
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                let indexList = [];
                this.list.forEach(item=>{
                    indexList.push(item.title);
                    item.item.map(v=>{
                        if(v.FullName.length>2){
                            v.name = v.FullName.substr(1);
                        }else {
                            v.name = v.FullName;
                        }
                        return v;
                    })
                })
                this.indexList = indexList;

            })
        },
        changeSearch(e){
            this.keyWord = e.mp.detail;
        },
        getSelect(e){
            console.log(e);
        },
        getDetail(v){
            const url = '/pages/mailList/cardInfo/main?id='+v.ValueId;
            wx.navigateTo({url:url});
        },
        // 删除人员
        handleDel(v){
            console.log(v,'v')
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data: {
                    method: this.$api.mailList.addUser,
                    SessionKey: this.sessionkey,
                    UserId: v.ValueId,
                    action: '-',
                    groupId: this.id
                }
            }).then(res=>{
                console.log(res);
                this.getQueryList();
            })
        },
        onCluesAddBtnClick(){
            const url = '/pages/publics/add_user/main?groupId='+this.id;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/icon.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .header{
            background: #fff;
        }
        .rowWrap{
            display: flex;
            background: #fff;
            padding: 24rpx 33rpx;
            align-items: center;
            .lBox{
                p{
                    width: 83rpx;
                    height: 83rpx;
                    line-height: 83rpx;
                    text-align: center;
                    background: #3399ff;
                    color: #fff;
                    font-size: 26rpx;
                    border-radius: 50%;
                }
            }
            .cBox{
                flex: 1;
                margin-left: 20rpx;
                p:nth-child(1){
                    font-size: 33rpx;
                    color: #333333;
                }
                p:nth-child(2){
                    font-size: 29rpx;
                    color: #999999;
                }
            }
            .rBox{
                p{
                    font-size: 24rpx;
                    color: #999999;
                }
            }
        }
        .center{
            .van-index-bar__index{
                color: #333333!important;
                font-size: 21rpx!important;
            }
            .boxWrap{
                .van-index-anchor{
                    color: #999999 !important;
                    font-size: 26rpx !important;
                }
                .row{
                    display: flex;
                    padding: 0 33rpx;
                    background: #fff;
                    align-items: center;
                    .col_l{
                        // padding: 20rpx 0;
                        p{
                            width: 83rpx;
                            height: 83rpx;
                            line-height: 83rpx;
                            text-align: center;
                            background: #3399ff;
                            color: #fff;
                            font-size: 26rpx;
                            border-radius: 50%;
                        }
                    }
                    .col_r{
                        flex: 1;
                        margin-left: 20rpx;
                        padding: 20rpx 0;
                        border-bottom: 2rpx solid #e2e4e3;
                        p:nth-child(1){
                            font-size: 33rpx;
                            color: #333333;
                        }
                        p:nth-child(2){
                            font-size: 29rpx;
                            color: #999999;
                        }
                    }
                }
                .del{
                    width: 130rpx;
                    height: 122rpx;
                    line-height: 122rpx;
                    text-align: center;
                    background: red;
                    color: #fff;
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
    }
</style>