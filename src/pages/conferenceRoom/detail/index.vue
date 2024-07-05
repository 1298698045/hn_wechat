<template>
    <div class="wrap">
        <div class="nav">
            <div class="lBox">
                <h3>{{info.Name}}</h3>
                <p class="rowText">
                    投影<span>/</span>
                    话筒<span>/</span>
                    电脑<span>/</span>
                    电子屏<span>/</span>
                    其他
                </p>
                <p class="icon">
                    <i class="iconfont icon-canyuren-copy">可容纳{{info.Capacity}}人</i>
                </p>
            </div>
            <div class="rBox">
                <p class="img_box">
                    <img :src="imgUrl+'03.3.1conference.png'" alt="">
                </p>
            </div>
        </div>
        <div class="header">
                <div class="lBox">
                    <picker mode="date" fields="month" @change="bindDateChange">
                        <div>
                            <p class="month">{{month}}月</p>
                            <p class="year">{{year}}年</p>
                        </div>
                    </picker>
                </div>
            <div class="rBox">
                <scroll-view class="scroll-view-list" :scroll-left="scrollLeft" scroll-with-animation="true" @scrolltoupper="getScrolltoupper" @scrolltolower="getScrolltolower" scroll-x="true" style="width: 100%">
                    <view class="swiper-item" v-for="(item,index) in everyDay" :key="index"  @click="getSwitchDay(item,index)">
                        <div class="box">
                            <div>
                                <!-- <p class="week">{{item.day}}</p>
                                <p class="day" :class="{active:num==index}">{{item.month}}</p> -->
                                <p class="week">{{item.weekDay}}</p>
                                <p class="day" :class="{active:dayIdx==index}">{{item.day}}</p>
                            </div>
                        </div>
                    </view>
                </scroll-view>
            </div>
        </div>
        <div class="center">
            <div class="content">
                <!-- <checkbox-group :value="result" @change="onChange">
                    <checkbox class="checkbox" color="#3399ff" :class="item.checked?'active':''" :checked="item.checked" :value="item.id" v-for="(item,index) in list" :key="index" >
                        <div class="row" :style="{'width':width+'px'}">
                            <p class="time">{{item.startTime}} ~ {{item.endTime}}</p>
                            <p class="text">{{''}}</p>
                        </div>
                    </checkbox>
                </checkbox-group> -->
                <van-checkbox-group :value="result" @change="onChange">
                    <van-checkbox :custom-class="item.className" :disabled="item.checkedcode" :name="item.id" v-for="(item,index) in list" :key="index">
                        <div class="row" :style="{'width':width+'px'}">
                            <p class="time">{{item.startTime}} ~ {{item.endTime}}</p>
                            <p class="text">{{item.status==1?'已过期':item.status==2?'已被我预定':'未预定'}}</p>
                        </div>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <van-button type="primary" @click="getCancel" color="#f3f3f3" :disabled="disabled" custom-class="btn black" block>取消</van-button>
                <van-button type="primary" @click="getSubmit" color="#3399ff" :disabled="disabled" custom-class="btn" block>立即预约</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            dayIdx:0,
            year:"",
            month:"",
            day:"",
            currentMonth:"",
            lastDay:"",
            month: "",
            everyDay: [],
            scrollLeft:0,
            listData:[
                {
                    day:"日",
                    month:"1"
                },
                {
                    day:"一",
                    month:"2"
                },
                {
                    day:"二",
                    month:"3"
                },
                {
                    day:"三",
                    month:"4"
                },
                {
                    day:"四",
                    month:"5"
                },
                {
                    day:"五",
                    month:"6"
                },
                {
                    day:"六",
                    month:"7"
                },
                {
                    day:"六",
                    month:"7"
                },
                {
                    day:"六",
                    month:"7"
                },
                {
                    day:"六",
                    month:"7"
                },
                {
                    day:"六",
                    month:"7"
                },
                {
                    day:"六",
                    month:"7"
                }
            ],
            num:0,
            result: [],
            list:[],
            width:"",
            disabled:true,
            id:"",
            date:"",
            info:{},
            name:"",
            ScheduledStart:"",
            ScheduledEnd:"",
            timestamp:"",//当前时间戳
            currenDayNow:"", // 当前日期
            className:"checkbox",
            sessionkey:""
        }
    },
    computed:{
        imgUrl(){
            return this.$api.photo.url;
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.timestamp = Date.parse(new Date());
        var currenMyDate = new Date();     //获取当前年份(2位)
        var currenYear=currenMyDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var currenMonth=currenMyDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var currenDay=currenMyDate.getDate();        //获取当前日(1-31)
        this.currenDayNow=currenYear+'-'+(currenMonth+1)+"-"+currenDay;
        this.width = wx.getSystemInfoSync().windowWidth-60;
        this.id = options.id;
        this.name = options.name;
        this.date = options.date;
        let myDate = new Date();
        this.year = myDate.getFullYear();
        this.month = myDate.getMonth()+1;
        this.day = myDate.getDate();
        this.currentMonth = myDate.getMonth()+1;
        this.scrollLeft = this.day * 50;
        let date = new Date(), month = date.getMonth()+1;
        this.getEveryDay(date, month);
        this.getQuery();
        // this.list = this.getCountDate();
    },
    onShow(){
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meetingroom.reservation.get",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    date:`${this.year}-${this.month}-${this.day}`
                }
            }).then(res=>{
                console.log(res);
                this.info = res.listData[0];
                let reserves = res.reserves;
                this.list = this.getCountDate();
                // console.log(this.list,'list');
                let date = `${this.year}-${this.month}-${this.day}`;
                this.list.forEach(item=>{
                    let time = date + ' '+ item.endTime+':00';
                    let timestamp = this.getTargetTime(time);
                    if(timestamp<this.timestamp){
                        this.$set(item,'status',1);
                        this.$set(item,'checkedcode',true);
                    }
                })
                reserves.forEach(item=>{
                    let startIdx = '';
                    let endIdx = '';
                    this.list.forEach((v,index)=>{
                        if(item.ScheduledStartTime==v.startTime){
                            startIdx = index;
                            this.$set(v,'status',2)
                            this.$set(v,'className','active');
                            this.$set(v,'checkedcode',true);
                        }
                        if(item.ScheduledEndTime==v.endTime){
                            endIdx = index;
                            // console.log(v,'9999999');
                            this.$set(v,'status',2)
                            this.$set(v,'className','active');
                            this.$set(v,'checkedcode',true);
                        }
                    })
                    console.log(startIdx,endIdx,'-------')
                   let arr =  this.list.slice(startIdx,endIdx);
                   console.log(arr);
                   arr.forEach(item=>{
                        this.$set(item,'status',2)
                        this.$set(item,'className','active');
                        this.$set(item,'checkedcode',true);
                   })
                })
                console.log(this.list,'----------')
            })
        },
        getTargetTime(t){
            var d = t.split(" ")[0],
                h = t.split(" ")[1],
                date = new Date()

            date.setYear(d.split("-")[0])
            date.setMonth(d.split("-")[1] - 1)
            date.setDate(d.split("-")[2])

            date.setHours(h.split(":")[0])
            date.setMinutes(h.split(":")[1])
            date.setSeconds(h.split(":")[2])
            return date.getTime()    
        },
        onChange(e){
            console.log(e);
            this.result = e.mp.detail;
            let selectData = [];
            for(var i = 0; i < this.list.length; i++){
                this.list[i].checked = false;
                if(this.list[i].status==0){
                    this.list[i].className = 'checkbox';
                }
                for(var j=0; j < this.result.length; j++){
                    if(this.list[i].id==this.result[j]){
                        this.list[i].checked = true;
                        this.list[i].className = 'select';
                        selectData.push({
                            startTime:this.list[i].startTime,
                            endTime:this.list[i].endTime,
                            id:this.list[i].id
                        })
                        break;
                    }
                }
            }
            let arr = [];
            if(selectData!=''){
                selectData.forEach(item=>{
                    arr.push(item.id);
                })
                let max = Math.max(...arr);
                let min = Math.min(...arr);
                const minData = selectData.find((item)=>item.id==min);
                this.ScheduledStart = minData.startTime;
                const maxData = selectData.find((item)=>item.id==max);
                this.ScheduledEnd = maxData.endTime;
                console.log(this.ScheduledStart,this.ScheduledEnd);
            }

            if(this.result!=''){
                this.disabled = false;
            }else {
                this.disabled = true;
            }
        },
        bindDateChange(e){
            let value = e.mp.detail.value;
            let val = value.split('-');
            this.year = val[0];
            this.month = val[1].replace(/^0/, '');
            let date = new Date(this.year);
            this.getEveryDay(date, this.month);
        },
        monthChange(date) {
            this.getEveryDay(date, date.getMonth());
        },
        getEveryDay(date, month) {
            //设置月份
            date.setMonth(month);
            //设置一个月的某一天-这里设置为零则取到的日期中的天就会是当月的最后一天（比如，二月份就是28或29，其他月份就是30或31），方便下边的循环
            date.setDate(0);
            let dayArry = [];
            //获取月份的某一天
            let day = date.getDate();

            for (let i = 1; i <= day; i++) {
                date.setDate(i);   //如果只获取当前选择月份的每一天，则不需要date.setDate(i)只需dayArry.push(i)即可，其中date.setDate(i)是设置当前月份的每一天
                // dayArry.push(i + ' ' + this.getWeekday(date.getDay()));   //选中月份的每一天和当天是星期几

                dayArry.push({
                    day:i,
                    weekDay:this.getWeekday(date.getDay())
                })
            }
            this.everyDay = dayArry;
            console.log(this.month,month);
            if(this.currentMonth==month){
                let index = this.everyDay.findIndex((item)=>item.day===this.day);
                console.log(index);
                this.dayIdx = index;
                this.scrollLeft = this.day * 50;
            }else {
                this.dayIdx = 0;
                this.scrollLeft = 0;
            }
            console.log(this.everyDay,this.scrollLeft,'day');
        },
        getWeekday(day){
            return ["日", "一", "二", "三", "四", "五", "六"][day];
        },
        getSwitchDay(item,index){
            console.log(item);
            this.day = item.day;
            this.dayIdx = index;
            this.result = [];
            this.list = [];
            this.getQuery();
        },
        getCountDate(){
            let total = 24;
            let temp = [];
            let arr = [];
            for (let i = 1; i < 23; i++){
                let hour = i;
                if(i<10){
                   hour= '0'+i;
                }else {
                    hour = i;
                }

                let curr = `${hour}:00`;
                let half = `${hour}:30`;
                let next = ''
                if(i<9){
                    next = `0${i+1}:00`
                }else {
                    next = `${i+1}:00`
                }
                // let next = `${hour + 1}:00`;
                // console.log(`${curr}-${half}`);
                // console.log(`${half}-${next}`);
                arr.push(`${curr}-${half}`,`${half}-${next}`);
            }
            let id = 0;
            arr.forEach(item=>{
                let time = item.split('-');
                let startTime = time[0];
                let endTime = time[1];
                id++;
                temp.push({
                    startTime:startTime,
                    endTime:endTime,
                    status:0,
                    checked:false,
                    id:id,
                    className:"checkbox"
                })
            })
            console.log(temp)
            return temp;
        },
        getCancel(){
            this.result = [];
            wx.navigateBack({
                delta: 1
            })
        },
        getSubmit(){
            if(!this.disabled){
                let date = `${this.year}-${this.month}-${this.day}`;
                const url = '/pages/conferenceRoom/appointment/main?date='+date+'&ResourceId='+this.id+'&ScheduledStart='+this.ScheduledStart+'&ScheduledEnd='+this.ScheduledEnd+'&name='+this.name;
                wx.navigateTo({url:url});
            }
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/icon.css';
    @import '../../../../static/css/conference.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .nav{
            background: #fff;
            padding: 29rpx 33rpx;
            border-bottom: 2rpx solid #ebedec;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .lBox{
                h3{
                    font-size: 33rpx;
                    color: #333333;
                    font-weight: bold;
                }
                .rowText{
                    font-size: 26rpx;
                    color: #666666;
                    padding: 10rpx 0;
                    span{
                        font-size: 22rpx;
                        color: #cccccc;
                    }
                }
                .icon{
                    i{
                        font-size: 26rpx;
                        color: #666666;
                    }
                }
            }
            .rBox{
                .img_box{
                    width: 200rpx;
                    height: 150rpx;
                    border-radius: 12rpx;
                    border: 1rpx solid #e4e4e5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                        width: 71rpx;
                        height: 71rpx;
                    }
                }
            }
        }
        .header{
            display: flex;
            background: #fff;
            border-bottom: 2rpx solid #ebedec;
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
            .content{
                background: #fff;
                .select{
                    width: 100%;
                    padding: 33rpx;
                    border-bottom: 1rpx solid #ebedec;
                    background-color: rgba(229, 229, 229, 1);
                    .row{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .time{
                            font-size: 31rpx;
                            color: #333333;
                        }
                        .text{
                            font-size: 19rpx;
                            color: #666666;
                        }
                    }
                }
                .active{
                    width: 100%;
                    padding: 33rpx;
                    border-bottom: 1rpx solid #ebedec;
                    background-color: rgba(234, 244, 253, 1);
                    .row{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .time{
                            font-size: 31rpx;
                            color: #333333;
                        }
                        .text{
                            font-size: 19rpx;
                            color: #666666;
                        }
                    }
                }
                .checkbox{
                    width: 100%;
                    padding: 33rpx;
                    border-bottom: 1rpx solid #ebedec;
                    .row{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .time{
                            font-size: 31rpx;
                            color: #333333;
                        }
                        .text{
                            font-size: 19rpx;
                            color: #666666;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box{
                display: flex;
                justify-content: space-around;
                padding: 20rpx 0;
                .btn{
                    width: 328rpx;
                }
                .black{
                    color: #333333 !important;
                }
            }
        }
    }
</style>