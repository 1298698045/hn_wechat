<template>
    <div class="mp-app">
        <div class="center">
            <div class="content">
                <div class="leftBox">
                    <scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="VerticalNavTop" style="height:calc(100vh - 375rpx)">
                        <div class="navBox" :class="{'active':num==index}" v-for="(item,index) in list" :key="index" @tap="changeTab" :id="index">
                            <div class="box">
                                <p class="solid" v-if="num==index"></p>
                                <p class="text">{{item.Name}}</p>
                            </div>
                        </div>
                    </scroll-view>
                </div>
                <div class="rightBox">
                    <scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh)" :scroll-into-view="'main-'+MainCur" @scroll="VerticalMain">
                        <div class="contWrap" v-for="(item,index) in list" :key="index" :id="'main-'+index">
                            <div class="title">{{item.Name}}</div>
                            <div class="cont">
                                <div class="row">
                                    <div class="box-child" v-for="(v,idx) in item.Items" :key="idx">
                                        <p class="avatar">

                                        </p>
                                        <p class="name">{{v.Name}}</p>
                                        <p class="depart">{{v.Name}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </scroll-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            num:0,
            sessionkey:"",
            VerticalNavTop:0,
            MainCur:0,
            load:true,
            list:[
                {
                    id:1,
                    Name:"院办",
                    Items:[
                        {
                            Name:'test'
                        },
                        {
                            Name:'test'
                        },
                        {
                            Name:'test'
                        },
                        {
                            Name:'test'
                        },
                        {
                            Name:'test'
                        }
                    ]
                },
                {
                    id:2,
                    Name:"财务科",
                    Items:[
                        {
                            Name:'test'
                        }
                    ]
                },
                {
                    id:3,
                    Name:"人事科",
                    Items:[
                        {
                            Name:'test'
                        }
                    ]
                },
                {
                    id:4,
                    Name:"医务科",
                    Items:[
                        {
                            Name:'test'
                        }
                    ]
                },
                {
                    id:5,
                    Name:"检察科",
                    Items:[
                        {
                            Name:'test'
                        }
                    ]
                },
                {
                    id:6,
                    Name:"门诊办",
                    Items:[
                        {
                            Name:'test'
                        }
                    ]
                }
            ]
        }
    },
    methods:{
        changeTab(e){
            this.num = e.mp.currentTarget.id;
            this.MainCur = e.mp.currentTarget.id;
            this.VerticalNavTop = (e.mp.currentTarget.id-1)*42;
        },
        VerticalMain(e){
            console.log(e);
            let that = this;
            let list = that.list;
            let tabHeight = 0;
            if(that.load){
                for (let i = 0; i < list.length; i++) {
                    let idx = list.findIndex(item=>this.list[i].id==item.id)
                    let view = wx.createSelectorQuery().select("#main-" + idx);
                    view.fields({
                        size: true
                    }, data => {
                        list[i].top = tabHeight;
                        tabHeight = tabHeight + data.height;
                        list[i].bottom = tabHeight;     
                    }).exec();
                }
                that.list = list;
                that.load = false;
            }
            let scrollTop = e.mp.detail.scrollTop + 20;
            for (let i = 0; i < list.length; i++) {
                if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                    let idx = list.findIndex(item=>this.list[i].id==item.id)
                    this.VerticalNavTop =  (idx - 1) * 42;
                    this.num = idx;
                    return false;
                }
            }
        },
    }
}
</script>
<style lang="scss">
    .mp-app{
        .center{
            width: 100%;
            // height: 100vh;
            background: #fff;
            overflow-y: scroll;
            .content{
                display: flex;
                .leftBox{
                    width: 200rpx;
                    background: #f6f7f8;
                    .navBox.active{
                        background: #fff;
                        color: #3399ff;
                    }
                    .navBox{
                        line-height: 42px;
                        // padding: 22rpx 0;
                        .box{
                            // padding: 35rpx 0;
                            display: flex;
                            align-items: center;
                            .solid{
                                width: 6rpx;
                                height: 48rpx;
                                background: #3399ff;
                                border-radius: 5rpx;
                            }
                            .text{
                                flex: 1;
                                font-size: 28rpx;
                                text-align: center;
                                color: #666666;
                            }
                        }
                    }
                }
                .rightBox{
                    width: 100%;
                    .contWrap{
                        .title{
                            font-size: 26rpx;
                            color: #a1a5aa;
                            padding: 16rpx 33rpx;
                            background: #f6f7f8;
                        }
                        .cont{
                            background: #fff;
                            .row::after{
                                content: '';
                                width: 139rpx;
                            }
                            .row{
                                display: flex;
                                justify-content: space-between;
                                flex-wrap: wrap;
                                padding: 40rpx 33rpx 20rpx 33rpx;
                                font-size: 34rpx;
                                color: #333333;
                                .box-child{
                                    width: 139rpx;
                                    background: #ccc;
                                    margin-bottom: 30rpx;
                                    .avatar{
                                        width: 139rpx;
                                        height: 139rpx;
                                        background: #3399ff;
                                    }
                                    .name{
                                        font-size: 29rpx;
                                        color: #333333;
                                        font-weight: bold;
                                        text-align: center;
                                        padding: 10rpx 0;
                                    }
                                    .depart{
                                        font-size: 26rpx;
                                        color: #999999;
                                        text-align: center;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>