<template>
    <div class="calendar">
        <div class="header">
            <swiper class="date_swiper" @change="changeSwiper" :autoplay="false" interval="3000" :circular="false" :current="current">
                <swiper-item class="date_item"></swiper-item>
                <swiper-item class="date_item">
                    <div class="box_date">
                        <div class="item" v-for="(val,key,index) in list" :key="index">
                            <p class="week">{{val.week}}</p>
                            <p class="day">{{val.day}}</p>
                        </div>
                    </div>
                </swiper-item>
                <swiper-item class="date_item"></swiper-item>
            </swiper>
        </div>
        <div class="center">
            <div class="container">
                <div class="content_item"  v-for="(val,key,index) in list" :key="index">
                    <div class="row" v-for="(self,idx) in val.children" :key="idx" @click="handleDetail(self)">
                        <span class="name">
                            {{self.Subject}}
                        </span>
                        <!-- <img :src="imgUrl+self.PriorityCode.iconUrl" alt=""> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="banner">
            <swiper class="swiper" @change="changeSwiper" :autoplay="false" interval="3000" :circular="false" :current="current" next-margin="20px" previous-margin="20px">
                <swiper-item class="swiper_item" v-for="(item,i) in banners" :key="i">
                    <div class="box" v-for="(val,key,index) in list" :key="index">
                        <p class="time">
                            <i class="iconfont icon-kaishi1"></i>
                            时间：{{val.time}}</p>
                        <template v-if="val.children.length>0">
                            <div class="child">
                                <p class="title"  v-for="(v,idx) in val.children" :key="idx" @click="handleDetail(v)">
                                    {{v.Subject}}
                                    <img :src="imgUrl+v.PriorityCode.iconUrl" alt="">
                                </p>
                            </div>
                        </template>
                        <template v-else>
                            <div class="empty">
                                暂无任务
                            </div>
                        </template>
                    </div>
                </swiper-item>
            </swiper>
        </div> -->
    </div>
</template>
<script>
var moment = require('moment');
export default {
    name: "calendarTask",
    data(){
        return {
            current: 1,
            times: [],
            projectId: "ee35bacd-8991-439d-9038-5db96744234e",
            listData: [],
            list: [],
            index: 0,
            date: '',
            banners:['','','']
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        startTime(){
            return Object.keys(this.times)[0]
        },
        endTime(){
            return Object.keys(this.times)[2]
        },
        imgUrl(){
            return "https://oawx.hnca.org.cn/static/img";
        }
    },
    onLoad(){
        this.date = this.currentDate();
        this.times = this.getLastThreeDays();
        this.getQuery();
    },
    methods:{
        changeSwiper(e){
            this.current = e.mp.detail.current;
            if(this.current==0){
                this.index -= 3;
            }else if(this.current==2){
                this.index += 3;
            }
            this.times = this.getLastThreeDays(this.index);
            console.log(this.current,'current');
            this.getQuery();
        },
        handleDetail(item){
            wx.navigateTo({
                url: '/pages/task/detail_task/main?id='+item.id+'&projectId='+this.projectId
            })
        },
        getQuery(){
            let filterQuery = "\nStatusCategoryId\tneq\t3";
            let message = {
                actions: [
                    {
                        params: {
                            projectId: this.projectId,
                            scheduledStart: this.startTime,
                            ScheduledEnd: this.endTime,
                            showClosedItem: false,
                            filterQuery: filterQuery,
                            owningUser: ""
                        }
                    }
                ]
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.calendarTask,
                    SessionKey: this.sessionkey,
                    message: JSON.stringify(message)
                }
            }).then(res=>{
                console.log(res);
                this.listData = res.data.list.nodes;
                this.listData.forEach(item=>{
                    item.fields.forEach(self=>{
                        if(self.fieldKey == 'ScheduledEnd' || self.fieldKey == 'ScheduledStart'){
                            this.$set(item,self.fieldKey,self.dateTime);
                        }
                        if(self.fieldKey == 'Subject'){
                            this.$set(item,self.fieldKey,self.textValue)
                        }
                        if(self.fieldKey == 'PriorityCode'){
                            this.$set(item,self.fieldKey,{
                                name: self.name,
                                iconUrl: self.iconUrl,
                                id: self.id
                            })
                        }
                    })
                })
                console.log(this.listData,'listData')
                // let children = []
                this.listData.forEach(item=>{
                        // console.log(key,'=========')
                        if(item.ScheduledStart && item.ScheduledEnd){
                            for(var key in this.times){
                                    // console.log('开始时间', item)
                                    let isBook = this.isDuringDate(item.ScheduledStart,item.ScheduledEnd,key);
                                    // console.log(isBook,'isBook')
                                    if(isBook){
                                        console.log(this.times[key].children)
                                        // if(this.times[key].children.length>0 && this.times[key].children.some(v=>item.id==v.id)){
                                        //     return false;
                                        // }else {
                                            this.times[key].children.push(item);
                                        // }
                                    }
                            }
                        }else if(item.ScheduledStart == null && item.ScheduledEnd){
                            // console.log('结束时间',item)
                            // if(this.times[item.ScheduledEnd].children.some(v=>item.id==v.id)){
                            //     return false;
                            // }else {
                                this.times[item.ScheduledEnd].children.push(item)
                            // }
                        }
                    // this.times[item.ScheduledEnd].children.push(item)
                    // this.times.forEach(v=>{
                    //     if(item.ScheduledEnd == v.time){
                    //         console.log('idx:',v, item.Subject)
                    //         children.push(item) || [];
                    //         this.$set(v,'children',children);
                    //         // console.log('idx:',idx)
                    //         // this.times.splice(idx,1,{
                    //         //     children: children
                    //         // })
                    //     }
                    // })
                })
                console.log('this.times',this.times)
                this.list = this.times;
                this.current = 1;
            })
        },
        // 是否在某个时间段范围内
        isDuringDate(beginDateStr,endDateStr,curDateStr){
            var curDate = new Date(curDateStr);
            var beginDate = new Date(beginDateStr);
            var endDate = new Date(endDateStr);
            if(curDate >= beginDate && curDate <= endDate){
                return true;
            }else {
                return false;
            }
        },
        getLastThreeDays(){
            let oneDayTime = 24 * 60 * 60 * 1000;
            let currenDate = new Date(this.date);
            let currenTime = currenDate.getTime() + oneDayTime*this.index;
            let nextTime = currenTime + oneDayTime;
            let prevTime = currenTime - oneDayTime;
            
            let currDate = this.formDate(currenTime);
            let nextDate = this.formDate(nextTime);
            let prevDate = this.formDate(prevTime);
            var weekday = ['周日','周一','周二','周三','周四','周五','周六']
            // console.log(prevDate, currDate, nextDate)
            return {
                [prevDate]:{
                    time: prevDate,
                    week: weekday[new Date(prevDate).getDay()],
                    day: new Date(prevDate).getDate(),
                    children:[]
                },
                [currDate]:{
                    time: currDate,
                    week: weekday[new Date(currDate).getDay()],
                    day: new Date(currDate).getDate(),
                    children:[]
                },
                [nextDate]:{
                    time: nextDate,
                    week: weekday[new Date(nextDate).getDay()],
                    day: new Date(nextDate).getDate(),
                    children:[]
                }
            }
        },
        formDate(date){
            let d = new Date(date);
            let yyyy = d.getFullYear();
            let mm = d.getMonth() + 1;
            let dd = d.getDate();
            if (mm >= 1 && mm <= 9) {
                mm = "0" + mm;
            }
            if (dd >= 0 && dd <= 9) {
                dd = "0" + dd;
            }
            let time = `${yyyy}-${mm}-${dd}`
            return time;
        },
        currentDate(){
            let d = new Date();
            let yyyy = d.getFullYear();
            let mm = d.getMonth() + 1;
            let dd = d.getDate();
            if (mm >= 1 && mm <= 9) {
                mm = "0" + mm;
            }
            if (dd >= 0 && dd <= 9) {
                dd = "0" + dd;
            }
            let time = `${yyyy}-${mm}-${dd}`
            return time;
        }
    }
}
</script>
<style lang="scss">
.calendar{
    .header{
        background: #fff;
        box-shadow: 0 2rpx 10rpx 0 rgba(0,0,0,.1);
        border-bottom: 1rpx solid #e2e3e5;
        .date_swiper{
            height: 120rpx;
            .date_item{
                .box_date{
                    display: flex;
                    padding: 20rpx 0;
                    .item{
                        flex: 1;
                        text-align: center;
                        color: #333;
                        .week{
                            font-size: 24rpx;
                        }
                        .day{
                            width: 50rpx;
                            height: 50rpx;
                            line-height: 50rpx;
                            font-weight: bold;
                            text-align: center;
                            border-radius: 50%;
                            margin: 0 auto;
                        }
                    }
                    .item:nth-child(2) .day{
                        background: #3399ff;
                        color: #fff;
                        
                    }
                }
            }
        }
    }
    .center{
        margin-top: 20rpx;
        .container{
            display: flex;
            .content_item{
                flex: 1;
                // border-right: 1rpx solid #e2e3e5;
                .row{
                    flex: 1;
                    padding: 20rpx ;
                    // border-bottom: 1rpx solid #e2e3e5;
                    // border-right: 1rpx solid #e2e3e5;
                    font-size: 24rpx;
                    color: #333;
                    background: #fff;
                    box-sizing: border-box;
                    margin: 10rpx 5rpx;
                    border-radius: 5rpx;
                    box-shadow: 0 2rpx 10rpx 0 rgba(0,0,0,0.1);
                    .name{
                        width: 100%;
                        height: 68rpx;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    img{
                        width: 40rpx;
                        height: 40rpx;
                    }
                }
            }
        }
    }
    .banner{
        // height: 500rpx;
        position: relative;
        margin: 20rpx 0;
        .swiper{
            height: calc(100vh - 190rpx);
            .swiper_item{
                padding: 0 20rpx;
                box-sizing: border-box;
                .box{
                    border-radius: 20rpx;
                    // height: 100% !important;
                    background: #fff;
                    overflow: hidden;
                    padding: 20rpx;
                    box-sizing: border-box;
                    margin-bottom: 20rpx;
                    .time{
                        font-size: 28rpx;
                        color: #666;
                        padding-bottom: 20rpx;
                        border-bottom: 1rpx solid #e2e3e5;
                        display: flex;
                        align-items: center;
                        i{
                            padding-right: 10rpx;
                        }
                    }
                    .child{
                        .title{
                            line-height: 1.2;
                            font-size: 28rpx;
                            padding: 20rpx 0;
                            display: flex;
                            justify-content: space-between;
                            img{
                                width: 40rpx;
                                height: 40rpx;
                                margin-left: 10rpx;
                            }
                        }
                    }
                    .empty{
                        padding: 20rpx 0;
                        color: #999;
                    }
                }
            }
        }
    }
}
</style>