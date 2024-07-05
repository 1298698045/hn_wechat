<template>
    <div class="wrap">
        <div class="table">
            <div class="date">{{date}}</div>
            <div class="tr bg-w">
                <p class="th">日</p>
                <p class="th">一</p>
                <p class="th">二</p>
                <p class="th">三</p>
                <p class="th">四</p>
                <p class="th">五</p>
                <p class="th">六</p>
            </div>
            <swiper
                :current="current"
                @change="getCurrent"
                slidesPerView="2"
                :autoplay="false"
                class="swiper_wrap"
            >
                <block>
                    <swiper-item class="items" v-for="(item,idx) in currentList" :key="idx">
                        <div class="tr bg-g">
                            <div :class="{'active':tdIndex==index,'activeBack':v.isToday}" :id="'id_'+index" class="td" v-for="(v,index) in item" :key="index" @click="v.subject?getDetail(v,index):getNull()">
                                <div class="times"> 
                                    <p class="day">{{v.day}}</p>
                                    <p class="lunar" :class="{'active':v.Sat}" v-if="v.lunar||v.Sat">{{v.Sat?v.Sat:v.lunar.IDayCn}}</p>
                                </div>
                                <p class="cont_a" v-for="(sel,i) in v.tagList" :key="i" v-if="i<3&&v.day">
                                    <span class="radius gre" v-if="sel"></span>
                                    <span class="text">{{sel.subject}}</span>
                                </p>
                                <p class="mo" v-if="v.tagList?v.tagList.length>3:false">还有{{v.tagList.length-3}}项...</p>
                                <div class="td_active">
                                    <p class="icon" @click.stop="getDel(v,index)">
                                        <van-icon name="cross" size="20" color="#999999" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </swiper-item>
                </block>
            </swiper>
            <div class="td_Modal" :style="{top:modalHeight+'px'}" v-if="isModal">
                <div class="cont_data" v-for="(item,index) in ModalData" :key="index" @click="getRouteDetail(item)">
                    <p class="rad"></p>
                    <div class="cont">
                        <p class="name">{{item.subject}}</p>
                        <p class="time">09:00-10:00</p>
                    </div>
                </div>
                <div class="newAdd" @click="getAddSchedule">
                    <i class="iconfont icon-tianjia"></i>
                    <span>新建日程</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import calendar from '@/utils/Calendar-lunar';
export default {
    name:'MonthTable',
    props:['listData'],
    data(){
        return {
            list:[],
            date:"",
            current:1,
            currentList:[],
            currDay:"",
            endDay:"",
            tdIndex:-1,
            modalHeight:0,
            isModal:false,
            ModalData:[],
            currDate:""
        }
    },
    watch:{
        listData(val){
            console.log(val,'watch')
            this.list = val;
        }
    },
    onLoad(){
        // console.log(this.getCurrentMonthFirst(),this.getCurrentMonthLast());
        let date = new Date();
        let y = date.getFullYear() 
        let m = date.getMonth()+1;
        let d = date.getDate();
        this.date = `${y}-${m}-${d}`;
        let currDay = new Date(this.getCurrentMonthFirst()).getDay();
        let endDay = new Date(this.getCurrentMonthLast()).getDate();
        this.currDay = currDay;
        this.endDay = endDay;
        // this.now();
    },

    onShow(){
       this.$nextTick(()=>{
            setTimeout(() => {
                // this.list = this.$parent.list;
                this.now();
            }, 500);
        }) 
    },
    mounted(){
        this.$nextTick(()=>{
            setTimeout(() => {
                // this.list = this.$parent.list;
                this.now();
            }, 500);
        })
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    methods:{
        getNull(){
            this.isModal = false;
            this.tdIndex = -1;
        },
        getRouteDetail(item){
            const url = "/pages/schedule/detail/main?id="+item.id;
            wx.navigateTo({url:url});
        },
        getAddSchedule(){
            const url = "/pages/schedule/newSchedule/main?currDate="+this.currDate;
            wx.navigateTo({url:url});
        },
        getCurrent(e){
            let current = e.mp.detail.current;
            this.tdIndex = -1;
            this.isModal = false;
            if(current == this.currentList.length-1){
                this.current = current;
                let date = this.currentList[current][0].date;
                let d = this.getNextMonth(date);
                let nT = d.split('-');
                let start = this.getMonthStartDate(nT[0],nT[1]);
                let dayNum = this.getMonthDays(new Date(date.replace(/-/g,'/')).getFullYear(),new Date(date.replace(/-/g,'/')).getMonth());
                let currDay = new Date(start).getDay();
                let next = this.setDate(currDay,dayNum,d);
                this.currentList.push(next);
                this.date = date;
                setTimeout(() => {
                    this.getAddList(currDay,dayNum)
                }, 100);
                
            }else if(current==0){
                this.current = current;
                let date = this.currentList[this.current][0].date;
                let d2 = this.getPreMonth(date);
                let nT2 = d2.split('-');
                let start2 = this.getMonthStartDate(nT2[0],nT2[1]);
                let dayNum2 = this.getMonthDays(new Date(date.replace(/-/g,'/')).getFullYear(),new Date(date.replace(/-/g,'/')).getMonth());
                let currDay2 = new Date(start2).getDay();
                let pre = this.setDate(currDay2,dayNum2,d2);
                this.currentList.unshift(pre);
                this.current = 1;
                this.date = date;
                setTimeout(() => {
                    this.getAddList(currDay2,dayNum2)
                }, 100);
            }else {
                this.current = current;
                this.date = this.currentList[current][0].date;
            }
            let ndate = this.date;
            let ny = new Date(ndate.replace(/-/g,'/')).getFullYear();
            let nm = new Date(ndate.replace(/-/g,'/')).getMonth()+1;
            let startTime = this.getMonthStartDate(ny,nm);
            let endTime = this.getMonthEndDate(ny,nm);
            this.getMonthQuery(startTime,endTime);
            // this.$emit('change',{
            //     date:this.date,
            //     current:current
            // })
        },
        onday(){
            let date = new Date(this.date.replace(/-/g,'/')); //获取日期  日期是2020-07 写成你自己的
            let CurrentDate = "";
            let year = date.getFullYear();
            let month = (date.getMonth()) < 10 ? "0" +(date.getMonth()) : (date.getMonth()); //自动补0
            if(month<1){
                CurrentDate = (year - 1) + "-" + "12"
            }else{
                CurrentDate = year + "-" + month
            }
            return CurrentDate;
        },
        nextday(){
            let date = new Date(this.date.replace(/-/g,'/'));
            let CurrentDate = "";
            let year = date.getFullYear();
            let month = (date.getMonth() + 1 + 1) < 10 ? "0" +(date.getMonth() + 1 + 1) : (date.getMonth() + 1 + 1);
            if(month>12){
                CurrentDate = (year + 1) + "-" + "01"
            }else{
                CurrentDate = year + "-" + month
            }
            return CurrentDate;
        },
       async now(){
            let d = this.getPreMonth(this.date);
            let preTemp = d.split('-');
            let dayNum = this.getMonthDays(new Date(this.date.replace(/-/g,'/')).getFullYear(),new Date(this.date.replace(/-/g,'/')).getMonth());
            let d2 = this.getNextMonth(this.date);
            let nextTemp = d2.split('-');
            let start = this.getMonthStartDate(preTemp[0],preTemp[1]);
            let end = this.getMonthEndDate(preTemp[0],preTemp[1]);
            let nStart = this.getMonthStartDate(nextTemp[0],nextTemp[1]);
            let currDay = new Date(start).getDay();
            let endDay = new Date(preTemp[0],preTemp[1],0).getDate(); // 获取上月共有多少天
            let currDay2 = new Date(nStart).getDay();
            let pre = this.setDate(currDay,endDay,d);
            let now = this.setDate(this.currDay,this.endDay,this.date);
            let next = this.setDate(currDay2,dayNum,d2);
            this.currentList = [pre,now,next];
            let w = await  this.getAddList(this.currDay,this.endDay);
            let date = this.date;
            let y = new Date(date.replace(/-/g,'/')).getFullYear();
            let m = new Date(date.replace(/-/g,'/')).getMonth()+1;
            let startTime = this.getMonthStartDate(y,m);
            let endTime = this.getMonthEndDate(y,m);
            this.getMonthQuery(startTime,endTime);
        },
        getMonthQuery(startTime,endTime){
            console.log(this.current,startTime,endTime,'current---')
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"activity.events.search",
                    Sessionkey:this.sessionkey,
                    startTime:startTime,
                    endTime:endTime,
                    activityTypeCode:4201
                }
            }).then(res=>{
                this.list = res.listData;
                console.log(this.list,'888888888888888888888')
                this.currentList[this.current].forEach(one=>{
                    if(one.currDate){
                        console.log(one,'one')
                        this.$set(one,'tagList',[]);
                        this.$set(one,'isShow',false)
                        let isToday = this.isToday(one.currDate);
                        if(isToday){
                            this.$set(one,'isToday',isToday);
                        }
                        // console.log(isToday,'----=======')
                    }
                })
                console.log(this.currentList[this.current],'this.currentList[this.current]')
                this.list.forEach(item=>{
                    this.currentList[this.current].forEach(v=>{
                        if(v.currDate){
                            let isBook = this.nowInDateBetwen(item.scheduledStart.split(' ')[0],item.scheduledEnd.split(' ')[0],v.currDate);
                            console.log(isBook,'isBook')
                            if(isBook){
                                v.tagList.push(item);
                                this.$set(v,'subject',item.subject);
                            }
                        }
                    })
                })
                console.log(this.currentList[this.current],'123123123')
            })
        },
        getAddList(currDay,len){
            console.log(currDay,len);
        },
        // isToday(str,date){
        //     date = date.split(' ')[0];
        //     var d = new Date(str.replace(/-/g,"/"));
        //     var todaysDate = new Date(date.replace(/-/g,"/"));
        //     if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // },
        isToday(str){
            var d = new Date(str.replace(/-/g,"/"));
            var todaysDate = new Date();
            if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
                return true;
            } else {
                return false;
            }
        },
        // 判断是否是当前月
        getIsCurrMonth(ADate){
            let now=new Date(this.date.replace(/-/g,'/'));
            // let today=now.toISOString().substring(0,7);
            let today = now.getMonth()+1;
            console.log('判断本月:');
            console.log('本月日期:'+today);
            ADate = new Date(ADate.replace(/-/g,'/')).getMonth()+1;
            if(today==ADate){
                console.log('ADate本月');
                return true;
            }else{
                console.log('ADate非本月');
                return false;
            }
        },
        getComputation(d1,d2){
            var dateBegin = new Date(d1.replace(/-/g,'/'));//将-转化为/，使用new Date
            var dateEnd = new Date(d2.replace(/-/g,'/'));//将-转化为/，使用new Date
            var beginDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
            var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数
            console.log(beginDiff,beginDayDiff,'-')
            return beginDayDiff;
        },
        setDate(currDay,endDay,date){
            let myDate = new Date(date.replace(/-/g,'/'));
            let y = myDate.getFullYear();
            let m = myDate.getMonth()+1;
            let temp = [];
            for(var i=0; i<currDay; i++){
                temp.push({
                    date:date
                });
            }
            for(var j=0;j<endDay;j++){
                temp.push({
                    day:j+1,
                    date:date,
                    currDate:`${y}-${m}-${j+1}`,
                    month:m,
                    lunar:calendar.calendar.solar2lunar(y,m,j+1)
                });
            }
            temp.length = 42;
            let num = 42 - endDay - (currDay);
            if(num>14){
                temp.splice(temp.length-14,temp.length);
            }else if(num>7){
                temp.splice(temp.length-7,temp.length);
            }
            let lastNum = temp.length-endDay-currDay;
            temp.splice(endDay+currDay,lastNum);
            for(var i=0; i<lastNum; i++){
                temp.push({
                    date:date
                })
            }
            return temp;
        },
        // 获取当月的第一天
        getCurrentMonthFirst(){
            var date = new Date();
            date.setDate(1);
            var month = parseInt(date.getMonth()+1);
            var day = date.getDate();
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            return date.getFullYear() + '-' + month + '-' + day;
        },
        // 获取当月的最后一天
        getCurrentMonthLast(){
            var date=new Date();
            var currentMonth=date.getMonth();
            var nextMonth=++currentMonth;
            var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
            var oneDay=1000*60*60*24;
            var lastTime = new Date(nextMonthFirstDay-oneDay);
            var month = parseInt(lastTime.getMonth()+1);
            var day = lastTime.getDate();
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            return date.getFullYear() + '-' + month + '-' + day;
        },
        //获取上个月日期
        getLastMonth(){
            var date = new Date(this.date.replace(/-/g,'/')); 
            var year = date.getFullYear();
            var month = date.getMonth();
            if(month == 0){
                year = year -1;
                month = 12; 
            }
            return year+"-"+month+"-";
        },
        formatDate(date) {　　　 
        　 var myyear = date.getFullYear();　　 
        　 var mymonth = date.getMonth();
        　 var myweekday = date.getDate();　　　 
        　　　　 
        　 if(mymonth < 10){　　 
        　　　 mymonth = "0" + mymonth;　　 
        　 }　　　 
        　 if(myweekday < 10){　　 
        　　　 myweekday = "0" + myweekday;　　 
        　 }　　 
            if(mymonth =='00'){
                mymonth = '01';
            }
        　 return (myyear+"-"+mymonth + "-" + myweekday);　　　 
        },
        //获得某月的开始日期　　 
        getMonthStartDate(paraYear,paraMonth){　　
            // console.log(paraYear, paraMonth,'paraYear, paraMonth') 
        　 var monthStartDate = new Date(paraYear, paraMonth, 1);　　
        // console.log(this.formatDate(monthStartDate),'this.formatDate(monthStartDate)')　 
        　 return this.formatDate(monthStartDate);　　 
        },     　　 
        //获得某月的结束日期　　 
        getMonthEndDate(paraYear,paraMonth){
        　 var monthEndDate = new Date(paraYear,paraMonth, this.getMonthDays(paraYear,paraMonth));　　　 
        　 return this.formatDate(monthEndDate);　　 
        },
        //获得某月的天数　　 
        getMonthDays(paraYear,paraMonth){
            var d = new Date(paraYear, paraMonth, 0);
            return d.getDate();
// 　         var monthStartDate = new Date(paraYear, paraMonth, 1);　　　 
//         　 var monthEndDate = new Date(paraYear, paraMonth + 1, 1);　　　 
//         　 var　 days　 =　 (monthEndDate　 -　 monthStartDate)/(1000　 *　 60　 *　 60　 *　 24);　　　 
//         　 return days;　
        },
        getPreMonth(date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month) - 1;
            if (month2 == 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        },
        /**
         * 获取下一个月
         *
         * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
         */        
        getNextMonth(date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中的月的天数
            var year2 = year;
            var month2 = parseInt(month) + 1;
            if (month2 == 13) {
                year2 = parseInt(year2) + 1;
                month2 = 1;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
        
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        },
        // 判断某个时间是否在两个时间范围内
        nowInDateBetwen (d1,d2,currenDate) {
            //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
            // var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
            // var dateEnd = new Date(d2.replace(/-/g, "/"));//将-转化为/，使用new Date
            var dateBegin = new Date(d1.replace(/-/g,'/'));//将-转化为/，使用new Date
            var dateEnd = new Date(d2.replace(/-/g,'/'));//将-转化为/，使用new Date
            var dateNow = new Date(currenDate.replace(/-/g,'/'));//获取当前时间

            var beginDiff = dateNow.getTime() - dateBegin.getTime();//时间差的毫秒数       
            var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数

            var endDiff = dateEnd.getTime() - dateNow.getTime();//时间差的毫秒数
            var endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));//计算出相差天数
            if (endDayDiff < 0) {//已过期
                return false
            }
            if (beginDayDiff < 0) {//没到开始时间
                return false;
            }
            return true;
        }, 
        getDetail(v,index){
            this.tdIndex = index;
            this.currDate = v.currDate;
            let id = `id_${index}`;
            wx.createSelectorQuery().select('#'+id).boundingClientRect(rect=>{
                console.log(rect.top,'===')
                if(rect.top>200){
                    this.modalHeight = rect.top - 150;
                }else {
                    this.modalHeight = rect.top + 100;
                }
            }).exec()
            this.ModalData = v.tagList;
            this.isModal = true;
            // v.isShow = true;
        },
        getDel(v,index){
            console.log(v,'------------------')
            v.isShow = false;
            this.tdIndex = -1;
            this.isModal = false;
            this.ModalData = [];
            
        }
    }
}
</script>
<style lang="scss">
page{
    // background: #fff !important;
}
.wrap{
    padding-bottom: 80px;
    .table {
        border: 0px solid darkgray;
        background: #fff;
        .date{
            text-align: center;
            font-weight: bold;
            color: #333333;
            font-size: 30rpx;
            padding: 10rpx 0;
        }
        .tr {
            display: flex;
            width: 100%;
            align-items: center;
            .th{
                flex: 1;
                text-align: center;
                font-size: 24rpx;
                color: #7b8187;
            }
        }
        .bg-w{
            padding: 15rpx 0 25rpx 0;
            border-bottom: 1rpx solid #e2e3e5;
        }
        .swiper_wrap{
            height: 600px !important;
        }
        .bg-g{
            flex-wrap: wrap;
            .td{
                width: 14.27%;
                height: 200rpx;
                // background: red;
                border-right: 1rpx solid #e2e3e5;
                border-bottom: 1rpx solid #e2e3e5;
                box-sizing: border-box;
                position: relative;
                .times{
                    display: flex;
                    justify-content: space-between;
                    // text-align: center;
                    padding:10rpx 10rpx 0 10rpx;
                    align-items: center;
                    .day{
                        font-size: 33rpx;
                        color: #333333;
                        font-weight: bold;
                    }
                    .lunar{
                        // width: 30rpx;
                        // font-size: 24rpx;
                        // color: #999999;
                        font-size: 15rpx;
                        color: #a4a8ad;
                    }
                    .lunar.active{
                        color: #ff4444;
                    }
                }
                .cont_a{
                    padding: 3rpx 10rpx;
                    display: flex;
                    align-items: center;
                    white-space: normal;
                    word-break: break-all;
                    overflow: hidden;
                    .radius{
                        width: 8rpx;
                        height: 8rpx;
                        border-radius: 5rpx;
                        background: #52b55e;
                        display: inline-block;
                    }
                    .text{
                        font-size: 22rpx;
                        color: #333333;
                        margin-left: 5rpx;
                        width: 70rpx;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                .mo{
                    color:#999999;
                    font-size: 16rpx;
                    padding: 0 10rpx;
                }
                .td_active{
                    display: none;
                }
                
            }
            .td.activeBack{
                background: rgba(216,229,245,0.8);
                .times{
                    width: 90%;
                    margin: 0 auto;
                    background: #3399ff;
                    border-bottom: 10rpx;
                    margin-top: 5rpx;
                    border-radius: 10rpx;
                  .day,.lunar{
                      color: #fff;
                  }  
                }
                .cont_a .text{
                    color: #fff;
                }
            }
            .td.active{
                .td_active{
                    display: block;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(229, 229, 229, .8);
                    bottom: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .icon{
                        display: block;
                    }
                }
            }
        }
        .td_Modal{
            width: 350px;
            // height: auto;
            min-height: 150px;
            overflow: scroll;
            position: absolute;
            left: 12px;
            top: 0;
            background: #fff;
            z-index: 9999;
            border-radius: 8rpx;
            box-shadow: 0px 0px 23px 0px rgba(0, 0, 0, 0.2);
            .cont_data{
                display: flex;
                padding-left: 16rpx;
                border-radius: 8rpx;
                .rad{
                    width: 20rpx;
                    height: 20rpx;
                    border-radius: 50%;
                    background: #52b55e;
                    margin-top: 40rpx;
                }
                .cont{
                    flex: 1;
                    margin-left: 16rpx;
                    border-bottom: 1rpx solid #e2e3e5;
                    padding: 26rpx 0;
                    .name{
                        font-size: 28rpx;
                        color: #333333;
                    }
                    .time{
                        font-size: 24rpx;
                        color: #7b8187;
                    }
                }
            }
            .newAdd{
                padding: 40rpx 0 40rpx 48rpx;
                color: #3399ff;
                display: flex;
                align-items: center;
                span{
                    font-size: 30rpx;
                    margin-left: 12rpx;
                }
            }
        }
    }
}
</style>