<template>
    <div class="wrapper">
        <div class="header">
            <i-tabs :current="current" @change="handleChange">
                <i-tab key="tab1" title="正在使用的组"></i-tab>
                <i-tab key="tab2" title="全部组"></i-tab>
            </i-tabs>
        </div>
        <div class="center">
            <div class="tips">
                <p class="text">默认组</p>
                <p class="sort">
                    <van-icon name="sort" color="#3399ff" />
                    班次排序</p>
            </div>
            <div class="content">
                <div class="row" v-for="(item,index) in listData" :key="index">
                    <p class="shift_name">
                        {{item.Name}}<span>{{item.diffHour || ''}}小时</span>
                    </p>
                    <p class="time">
                        {{item.StartTime1}}-{{item.EndTime1}}
                    </p>
                </div>
                <!-- <p class="more">没有更多了</p> -->
            </div>
        </div>
        <div class="footer" @click="handleAddShift">
            <div class="btn" :class="{'active':isModelmes}">
                添加班次
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            current: 'tab1',
            page: 1,
            rows: 10,
            listData: [],
            isPage: false,
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey')
        }
    },
    onLoad(){
        this.getQuery();  
    },
    methods:{
        getQuery(){
            let url = this.$api.scheduling.shiftQuery
            if(this.current=='tab2'){
                url = this.$api.scheduling.shiftList
            }
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method: url,
                    SessionKey:this.sessionkey,
                    isPaginaTion: true,
                    page: this.page,
                    rows: this.rows
                }
            }).then(res=>{
                let result = []
                if(this.current=='tab2'){
                    if(this.page*this.rows<res.total){
                        this.isPage = true
                    }else {
                        this.isPage = false
                    }
                    if(this.page==1){
                        result = res.listData;
                    }else {
                        result = this.listData.concat(res.listData);
                    }
                }else {
                    if(this.page*this.rows<res.total){
                        this.isPage = true
                    }else {
                        this.isPage = false
                    }
                    if(this.page==1){
                        result = res.rows;
                    }else {
                        result = this.listData.concat(res.rows);
                    }
                }
                this.listData = result;
                let time = '2022-01-01 '
                this.listData.map(item=>{
                    var diffHour = this.getInervalHour(time+item.StartTime1,time+item.EndTime1)
                    item.diffHour = diffHour
                    return item;
                })
            })
        },
        getInervalHour(startDate, endDate) {
            startDate = new Date(startDate.replace(/-/g,'/'));
            endDate = new Date(endDate.replace(/-/g,'/'));
            var ms = endDate.getTime() - startDate.getTime();
            if (ms < 0) return 0;
            return Math.floor(ms/1000/60/60);
        },
        handleChange(e){
            this.current = e.mp.detail.key
            this.page = 1;
            this.listData = [];
            this.getQuery();
        },
        handleAddShift(){
            wx.navigateTo({
                url: '/pages/scheduling/shift/add_shift/main'
            })
        }
    },
    onPullDownRefresh() {
        this.page = 1;
        this.getQuery();
        wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if(this.isPage){
            this.page++;
            this.getQuery();
        }
    }
}
</script>
<style lang="scss">
    page{
        background: #fff;
    }
    .center{
        padding-bottom: 100px;
        .tips{
            padding: 20rpx 30rpx;
            box-sizing: border-box;
            background: #f4f4f4;
            display: flex;
            justify-content: space-between;
            font-size: 26rpx;
            .sort{
                color: #3399ff;
            }
        }
        .content{
            padding-left: 30rpx;
            box-sizing: border-box;
            .row{
                padding: 20rpx 0;
                box-sizing: border-box;
                border-bottom: 1rpx solid #e2e3e5;
                .shift_name{
                    font-size: 28rpx;
                    color: #333;
                    font-weight: bold;
                    span{
                        margin-left: 30rpx;
                        font-size: 20rpx;
                        display: inline-block;
                        width: 80rpx;
                        height: 30rpx;
                        line-height: 30rpx;
                        text-align: center;
                        background: rgba(51, 153, 255,.5);
                        color: #3399ff;
                        border-radius: 30rpx;
                    }
                }
                .time{
                    color: #333;
                    font-size: 24rpx;
                    padding-top: 10rpx;
                }
            }
            .more{
                font-size: 28rpx;
                color: #ccc;
                padding: 30rpx 0;
                text-align: center;
            }
        }
    }
    .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .btn{
                width: 100%;
                padding: 30rpx 0;
                background: #3399ff;
                color: #fff;
                text-align: center;
                font-size: 28rpx;
            }
            .btn.active{
                padding-bottom: 88rpx;
            }
        }
</style>