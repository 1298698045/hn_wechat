<template>
    <div class="wrap">
        <div class="header">
                <picker mode="date" fields="month" @change="bindDateChange">
                    <div class="lBox">
                        <div>
                            <p class="month">{{month}}月</p>
                            <p class="year">{{year}}年</p>
                        </div>
                    </div>
                </picker>
                <div class="rBox">
                    <scroll-view class="scroll-view-list" :scroll-left="scrollLeft" @scroll="handleScroll" scroll-with-animation="true" @scrolltoupper="getScrolltoupper"	 @scrolltolower="getScrolltolower" scroll-x="true" style="width: 100%">
                        <view class="swiper-item" v-for="(item,index) in everyDay" :key="index" @click="getSwitchDay(item,index)" >
                            <div class="box">
                                <div>
                                    <p class="week">{{item.weekDay}}</p>
                                    <p class="day" :class="{active:dayIdx==index}">{{item.day}}</p>
                                </div>
                            </div>
                        </view>
                    </scroll-view>
                </div>
            </div>
        <div class="center">
            <!-- <picker @change="pickerStatus" :value="statusIdx" :range="statusList">
                <div class="pickers">
                    {{statusList[statusIdx]}}
                    <i-icon type="unfold" color="#999999" size="20" />
                </div>
            </picker> -->
            <div class="content" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                <div class="cont">
                    <div class="row">
                        <p>{{item.name}}</p>
                        <p class="tag" v-if="item.StatusCode!=1" :class="{'active':item.StatusCode==0}">{{item.StatusCode==0?'草稿':item.StatusCode==3?'已取消':item.StatusCode==2?'已结束':''}}</p>
                    </div>
                    <p class="rowText">时间：{{item.scheduledStart}}-{{item.scheduledEnd}}</p>
                    <p class="rowText">地址：{{item.location}}</p>
                    <p class="rowText">发起人：{{item.CreatedByName}} {{item.owningUserName}}</p>
                    <p class="rowText">备注：{{item.meetingContent}}</p>
                </div>
                <div class="bottomA" v-if="item.StateCode==0">
                    <p @click="getCancel(item)">取消预约</p>
                    <p @click="getApprovalDetail(item)">审批详情</p>
                </div>
                 <div class="bottomA" v-if="item.StateCode==1||item.StateCode==2">
                    <p @click="getApprovalDetail(item)">审批详情</p>
                </div>
            </div>
            <div class="empty" v-if="list.length==0">
                <img :src="pathUrl+'/img/wechat/metting_empty.svg'" alt="">
                <p class="text">
                    暂无会议数据
                </p>
            </div>
        </div>
        <div class="clues-add-button" @click="onCluesAddBtnClick">
            <van-icon name="plus" color="#fff" size="20px" />
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list:[
                {
                    Room:{
                        Name:"123"
                    },
                    StateCode:0,
                    ScheduledStartDate:"2020-07-08",
                    ScheduledStartTime:"08:00",
                    ScheduledEndTime:"09:00",
                    sessionkey:""
                }
            ],
            year:"",
            month:"",
            day:"",
            currentMonth:"",
            lastDay:"",
            month: "",
            everyDay: [],
            scrollLeft:0,
            timestamp:"",
            dayIdx:0,
            pageSize:100,
            pageNumber:1,
            scope:"",
            currenDayNow:"",
            statusList:[
                '未结束的',
                '已结束/取消/不参与的',
                '我发出的'
            ],
            statusIdx:0,
            currenScroll: ""
        }
    },
    computed:{
        pathUrl(){
            return this.$api.pathUrl;
        }
    },
    onLoad(){
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.timestamp = Date.parse(new Date());
        var currenMyDate = new Date();     //获取当前年份(2位)
        var currenYear=currenMyDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var currenMonth=currenMyDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var currenDay=currenMyDate.getDate();        //获取当前日(1-31)
        this.currenDayNow=currenYear+'-'+(currenMonth+1)+"-"+currenDay;
        let myDate = new Date();
        this.year = myDate.getFullYear();
        this.month = myDate.getMonth()+1;
        this.day = myDate.getDate();
        this.currentMonth = myDate.getMonth()+1;
        this.scrollLeft = this.day * 50;
        let date = new Date(), month = date.getMonth()+1;
        this.getEveryDay(new Date(this.year), month);
        this.getQuery();
    },
    onShow(){
        // this.scrollLeft = this.day * 50;
        // let date = new Date(), month = date.getMonth()+1;
        // this.getEveryDay(date, month);
        this.getQuery();
    },
    methods:{
        getEveryDay(date, month) {
            //设置月份
            date.setMonth(month);
            //设置一个月的某一天-这里设置为零则取到的日期中的天就会是当月的最后一天（比如，二月份就是28或29，其他月份就是30或31），方便下边的循环
            date.setDate(0);
            let dayArry = [];
            //获取月份的某一天
            let day = date.getDate();
            month = date.getMonth() + 1;
            console.log(day,this.day, month, '==================')
            for (let i = 1; i <= day; i++) {
                date.setDate(i);   //如果只获取当前选择月份的每一天，则不需要date.setDate(i)只需dayArry.push(i)即可，其中date.setDate(i)是设置当前月份的每一天
                // dayArry.push(i + ' ' + this.getWeekday(date.getDay()));   //选中月份的每一天和当天是星期几

                dayArry.push({
                    day:i,
                    weekDay:this.getWeekday(date.getDay())
                })
            }
            this.everyDay = dayArry;
            if(this.currentMonth==month){
                let index = this.everyDay.findIndex((item)=>item.day===this.day);
                console.log(index);
                this.dayIdx = index;
                this.scrollLeft = index * 50;
            }else {
                this.scrollLeft = this.currenScroll;
                this.dayIdx = 0;
                this.scrollLeft = 0;
            }
            console.log(this.everyDay,this.scrollLeft,'day');
        },
        handleScroll(e){
            this.currenScroll = e.mp.detail.scrollLeft;
        },
        getWeekday(day){
            return ["日", "一", "二", "三", "四", "五", "六"][day];
        },
        bindDateChange(e){
            let value = e.mp.detail.value;
            let val = value.split('-');
            this.year = val[0];
            this.month = val[1].replace(/^0/, '');
            this.day = 1;
            let date = new Date(this.year);
            this.getEveryDay(date, this.month);
            this.getQuery();
        },
        getSwitchDay(item,index){
            console.log(item);
            // let currenDay = new Date().getDate();
            // if(item.day<currenDay){
            //     wx.showToast({
            //         title:'过去日期不可选',
            //         icon:'none',
            //         duration:2000
            //     })
            // }else {
            //     this.day = item.day;
            //     this.dayIdx = index;
            //     this.getQuery();
            // }
            this.day = item.day;
            this.dayIdx = index;
            this.getQuery();
        },
        pickerStatus(e){
            this.statusIdx = e.mp.detail.value;
            this.scope = this.statusIdx==0?1:this.statusIdx==1?2:3;
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.meeting.query,
                    SessionKey:this.sessionkey,
                    startTime:`${this.year}-${this.month}-${this.day}`,
                    endTime:`${this.year}-${this.month}-${this.day}`,
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber,
                    // scope:this.scope
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        getDetail(item){
            const url = '/pages/meeting/detail/main?id='+item.valueId;
            wx.navigateTo({url:url});
        },
        onCluesAddBtnClick(){
            let date = new Date();
            let hour = date.getHours();
            let min = date.getMinutes();
            let ss = date.getSeconds();
            let startTime = `${this.year}-${this.month}-${this.day} ${hour}:${min}`;
            let nDate = new Date(startTime.replace(/-/g,'/'));
            let yy = nDate.getFullYear();
            let mm = nDate.getMonth()+1;
            let dd = nDate.getDate();
            let h = nDate.getHours();
            let nmin = nDate.getMinutes();
            let endTime = `${yy}-${mm}-${Number(h)=='23'?dd+1:dd} ${
                Number(h)=='23'?'00':
                Number(h) + Number(1)
            }:${nmin}`;
            const url = "/pages/schedule/newSchedule/main?meetingSign="+0+'&startTime='+startTime+'&endTime='+endTime;
            wx.navigateTo({url:url});
        }
    },
}
</script>
<style lang="scss">
    .wrap{
        .header{
            width: 100%;
            display: flex;
            background: #fff;
            border-bottom: 2rpx solid #ebedec;
            z-index: 999;
            position: fixed;
            top: 0;

            .lBox{
                width: 106rpx;
                height: 153rpx;
                text-align: center;
                background: #f3f3f3;
                display: flex;
                justify-content: center;
                align-items: center;
                .month{
                    font-size: 36rpx;
                    color: #3399ff;
                    font-weight: bold;
                    padding-bottom: 10rpx;
                }
                .year{
                    font-size: 19rpx;
                    color: #3399ff;
                }
            }
            .rBox{
                flex: 1;
                width: 80%;
                box-sizing: border-box;
                display: flex;
                white-space: nowrap;//这个属性很重要
                .swiper-item{
                    width: 106rpx;
                    height: 153rpx;
                    display: inline-block;
                    .box{
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        padding: 20rpx 0;
                        .week{
                            font-size: 19rpx;
                            color: #888888;
                        }
                        .day{
                            width: 61rpx;
                            height: 61rpx;
                            line-height: 61rpx;
                            text-align: center;
                            // background: #3399ff;
                            border-radius: 50%;
                            margin: 30rpx auto;
                            font-size: 31rpx;
                            color: #333333;
                            font-weight: bold;
                        }
                        .day.active{
                            background: #3399ff;
                            color: #fff;
                        }
                    }
                }
            }
        }
        .center{
            margin-top: 76px;
            .empty{
                width: 300rpx;
                // height: 300rpx;
                margin: 200rpx auto;
                img{
                    width: 100%;
                    height: 300rpx;
                }
                .text{
                    text-align: center;
                    font-size: 28rpx;
                    color: #333333;
                    padding-top: 20rpx;
                }
            }
            .pickers{
                padding: 32rpx 0;
                text-align: center;
                background: #fff;
                font-size: 26rpx;
                color: #999999;
            }
            h3{
                font-size: 26rpx;
                color: #999999;
                background: #f4f4f4;
                padding: 31rpx 33rpx;
            }
            .content{
                // margin-bottom: 35rpx;
                border-bottom: 1rpx solid #e2e3e5;
                background: #fff;
                .cont{
                    padding: 33rpx;
                    .row{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        p:nth-child(1){
                            font-size: 33rpx;
                            color: #333333;
                            font-weight: bold;
                        }
                        .tag{
                            width: 80rpx;
                            height: 42rpx;
                            line-height: 42rpx;
                            text-align: center;
                            border-radius: 7rpx;
                            font-size: 20rpx;
                            background: #ebecf2;
                            color: #999999;
                        }
                        .tag.active{
                            background: #ecf5fd;
                            color: #3399ff;
                        }

                    }
                    .rowText{
                        font-size: 24rpx;
                        color: #999999;
                        margin-top: 10rpx;
                    }
                }
                .bottomA{
                    display: flex;
                    background: #fff;
                    border-top: 2rpx solid #ebedec;
                    p{
                        flex: 1;
                        height: 97rpx;
                        line-height: 97rpx;
                        text-align: center;
                        color: #3399ff;
                        font-size: 28rpx;
                    }
                    p:nth-child(1){
                        border-right: 1rpx solid #ebedec;
                    }
                }
            }
        }
        .clues-add-button {
            position: fixed;
            right: 20px;
            bottom: 80px;
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
        }
    }
</style>