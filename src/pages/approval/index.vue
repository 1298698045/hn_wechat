<template>
    <div class="wrap">
        <div class="header">
            <van-search :value="keyWord" placeholder="请输入搜索关键词" @click="getRouterUrl" @change="changeSearch" />
            <div class="boxWrap">
                <div class="box" @click="getMyApproval">
                    <p class="imgs">
                        <img src="https://oawx.hnca.org.cn/img/wechat/04.9.IApprove.png" alt="">
                    </p>
                    <p>我审批的</p>
                    <!-- <span>2</span> -->
                </div>
                <div class="box" @click="getMyLaunch">
                    <p class="imgs">
                        <img src="https://oawx.hnca.org.cn/img/wechat/04.9.ISend.png" alt="">
                    </p>
                    <p>我发起的</p>
                </div>
                <div class="box" @click="getCirculation">
                    <p class="imgs">
                        <img src="https://oawx.hnca.org.cn/img/wechat/04.9.Copyme.png" alt="">
                    </p>
                    <p>传阅</p>
                </div>
            </div>
        </div>
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
                    <scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh - 375rpx)" :scroll-into-view="'main-'+MainCur" @scroll="VerticalMain">
                        <div class="contWrap" v-for="(item,index) in list" :key="index" :id="'main-'+index">
                            <div class="title">{{item.Name}}</div>
                            <div class="cont">
                                <div class="row" v-for="(v,idx) in item.Items" :key="idx" @click="getLaunch(item,v)">
                                    <p>
                                        {{v.Name}}
                                    </p>
                                    <p>
                                        <i-icon type="enter" color="#dcdcdc" size="20" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </scroll-view>
                </div>
            </div>
        </div>
        <div class="footers" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box" :class="{'active':index==0}" @click="getProcess(0)">
                <p>
                    <i class="iconfont icon-shenpi"></i>
                </p>
                <p>首页</p>
            </div>
            <div class="box" :class="{'active':index==1}" @click="getProcess(1)">
                <p>
                    <i class="iconfont icon-xiaoshuai-copy"></i>
                </p>
                <p>流程效率</p>
            </div>
            <!-- <div class="box">
                <p>
                    <i class="iconfont icon-shezhi1"></i>
                </p>
                <p>设置</p>
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            keyWord:"",
            num:0,
            sessionkey:"",
            VerticalNavTop:0,
            MainCur:0,
            load: true,
            list:[],
            index:0
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onShow(){
        this.index = 0;
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        let list = [{}];
        for (let i = 0; i < 26; i++) {
            list[i] = {};
            list[i].name = String.fromCharCode(65 + i);
            list[i].id = i;
            list[i].item = [
                {
                    id:"1",
                    name:"20"
                },
                {
                    id:"1",
                    name:"20"
                },
                {
                    id:"1",
                    name:"20"
                },
                {
                    id:"1",
                    name:"20"
                },
                {
                    id:"1",
                    name:"20"
                }

            ]
        }
        this.list = list;
        console.log(this.list);
        this.getQuery();
    },
    methods:{
        getRouterUrl(){
            const url = '/pages/approval/search/main';
            wx.navigateTo({
                url:url
            })
        },
        changeSearch(e){
            this.keyWord = e.mp.detail;
            this.getQuery();
        },  
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.process.all.list",
                    SessionKey:this.sessionkey,
                    search:this.keyWord
                }
            }).then(res=>{
                console.log(res);
                this.list = res.data;
            })
        },
        changeTab(e){
            console.log(e);
            console.log(e.mp.currentTarget.id);
            this.num = e.mp.currentTarget.id;
            this.MainCur = e.mp.currentTarget.id;
            this.VerticalNavTop = (e.mp.currentTarget.id-1)*42;
        },
        VerticalMain(e){
            let that = this;
            let list = that.list;
            let tabHeight = 0;
            if(that.load){
                for (let i = 0; i < list.length; i++) {
                    let idx = list.findIndex(item=>this.list[i].Id==item.Id)
                    let view = wx.createSelectorQuery().select("#main-" + idx);
                    console.log(view,'999');
                    view.fields({
                        size: true
                    }, data => {
                        console.log(data,'---');
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
                console.log(scrollTop,list[i].top,list[i].bottom)
                if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                    let idx = list.findIndex(item=>this.list[i].Id==item.Id)
                    this.VerticalNavTop =  (idx - 2) * 42;
                    this.num = idx;
                    return false;
                }
            }
        },
        getMyApproval(){
            const url = '/pages/approval/my/main';
            wx.navigateTo({url:url});
        },
        getCirculation(){
            const url = '/pages/approval/circulation/main';
            wx.navigateTo({url:url});
        },
        getMyLaunch(){
            const url = '/pages/approval/launch/main';
            wx.navigateTo({url:url});
        },
        getLaunch(item,v){
            // const url = '/pages/approval/add/main?name='+item.Name+'&ProcessId='+item.ProcessId;
            wx.setStorageSync('EntityType',v.EntityType);
            const url = '/pages/approval/preAdd/main?Name='+v.Name+'&ProcessId='+v.ProcessId+'&departName='+item.Name+'&departId='+item.Id;
            wx.navigateTo({url:url});
        },
        getProcess(index){
            this.index = index;
            if(index==1){
                const url = '/pages/approval/process/main';
                wx.navigateTo({url:url});
            }
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/schedule.css';
    .wrap{
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        /* pages/component/nav/nav.wxss */
        .VerticalNav.nav {
            width: 200rpx;
            white-space: initial;
        }
        .VerticalMain{
            background-color: #f1f1f1;
        }
        .header{
            width: 100%;
            background: #fff;
            border-bottom: 1rpx solid #f6f7f8;
            // position: fixed;
            // top: 0;
            .boxWrap{
                display: flex;
                padding: 20rpx 0;
                .box{
                    flex: 1;
                    text-align: center;
                    position: relative;
                    .imgs{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img{
                            width: 64rpx;
                            height: 64rpx;
                            vertical-align: middle;
                        }
                    }
                    p{
                        font-size: 24rpx;
                        color: #666666;
                    }
                    span{
                        display: inline-block;
                        width: 42rpx;
                        height: 42rpx;
                        line-height: 42rpx;
                        text-align: center;
                        font-size: 26rpx;
                        background: #ff6666;
                        color: #fff;
                        border-radius: 50%;
                        position: absolute;
                        right: 25%;
                        top: -10rpx;
                    }
                }
            }
        }
        .center{
            flex: 1; 
            width: 100%;
            // height: 1000px;
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
                    flex: 1;
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
                            .row{
                                display: flex;
                                justify-content: space-between;
                                padding: 20rpx 33rpx;
                                font-size: 34rpx;
                                color: #333333;
                            }
                        }
                    }
                }
            }
        }
        .footers{
            width: 100%;
            background: #fff;
            display: flex;
            .box{
                flex: 1;
                text-align: center;
                font-size: 21rpx;
                padding: 20rpx 0;
                .iconfont{
                    font-size: 20px;
                    padding-bottom: 10rpx;
                }
            }
            .box.active{
                color: #3399ff;
            }
        }
    }
</style>