<template>
  <div class="wrap">
    <div class="header_flex">
      <div class="header">
        <div class="lBox">
          <i-tabs :current="current" @change="handleChange">
              <i-tab key="tab1" title="列表"></i-tab>
              <i-tab key="tab2" title="日"></i-tab>
              <i-tab key="tab3" title="月"></i-tab>
          </i-tabs>
        </div>
        <div class="rBox">
          <p><i-icon type="search" size="20" /></p>
        </div>
      </div>
    </div>
    <div class="calendar_top" v-if="current!='tab3'">
      <SwiperCalendar ref="childSwiper" @change="getChangeSwiper" />
      <!-- <div class="calendar" v-if="current=='tab1'">
        <lxCalendar ref="child" @change="changeDate"></lxCalendar>
      </div> -->
      <div class="rowTime">
        <p @click="getBackTime" v-if="!isToday">
          <i class="iconfont icon-jintian"></i>
        </p>
        <p v-else></p>
        <p>{{date}} {{weekDay}}</p>
      </div>
    </div>
    <div class="center"  v-if="current=='tab1'">
      <div class="content" v-for="(item,index) in listData" :key="index">
        <div class="lBox">
          <!-- <p class="time">25</p>
          <p class="day">周一</p> -->
          <p class="month">{{item.MonthName}}</p>
        </div>
        <div class="rBox">
          <div v-for="(item1,idx1) in item.WeekList" :key="idx1">
            <div v-for="(item2,idx2) in item1.DayList" :key="idx2" v-if="item1.DayList!=''">
              <div class="steps" v-for="(item3,idx3) in item2.ItemList" :key="idx3" @click="getDetail(item3)">
                <div class="l">
                    <p class="radius" :class="{'active':item3.RegardingObjectId!=''}"></p>
                    <p class="solid"></p>
                </div>
                <div class="r">
                  <p class="title">{{item3.Subject}}
                  </p>
                  <p class="time">{{item3.ScheduledStart}}-{{item3.ScheduledEnd}}</p>
                </div>
              </div>
            </div>
            <div class="weekInfo" else>
              <p>{{item1.WeekInfo}}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="content" v-for="(item,index) in 2" :key="index">
        <div class="lBox">
          <p class="month">6月</p>
        </div>
        <div class="rBox">
          <div class="box">
            <p>第24周 06月07日 - 06月13日</p>
            <p>第24周 06月07日 - 06月13日</p>
            <p>第24周 06月07日 - 06月13日</p>
          </div>
        </div>
      </div> -->
    </div>
    <day-table v-if="current=='tab2'" :dayList="dayList" :chooseDate="date" scrollHeight="height:calc(100vh)" @bookMeeting='bookMeeting($event)'>  </day-table>
    <div class="contDate" v-if="current=='tab3'">
      <MonthTable :listData="list" />
      <!-- <Calendar
      :months="months"
      :value="calDate"
      @next="next"
      @prev="prev"
      :events="events"
      lunar
      :weekSwitch="false"
      :clean="true"
      @select="selectDate"
      @selectMonth="getDateInfo"
      ref="calendar"
    /> -->
      <div class="cont">
        <div class="row" v-for="(item,index) in currentList" :key="index">
          <div class="lBox">
            <p>11:00</p>
            <p>12:00</p>
          </div>
          <div class="rBox">
            <p class="title">{{item.Subject}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="clues-add-button" v-if="!showPopup" @click="onCluesAddBtnClick">
          <!-- <i class="iconfont icon-icon-add-3-copy"></i> -->
          <van-icon name="plus" size="20px" color="#fff" />
      </div>
    <vue-tab-bar
          @fetch-index="clickIndexNav"
          :selectNavIndex="selectNavIndex"
          :needButton="needButton"
          :handButton="handButton"
          :btnText="btnText">
      </vue-tab-bar>
  </div>
</template>
<script>
import lxCalendar from '../../components/lx-calendar/lx-calendar';
import dayTable from '../../components/luoxiao-dayTable/dayTable';
import Calendar from 'mpvue-calendar'
import SwiperCalendar from '../../components/schedule/swiperTime';
import vueTabBar from '../../components/vueTabBar';
import MonthTable from '../../components/MonthTable';
export default {
  components:{
      lxCalendar,
      dayTable,
      Calendar,
      SwiperCalendar,
      vueTabBar,
      MonthTable
  },
  data(){
    return {
      current:"tab1",
      steps: [
        {
          text: 'X-线学、放射安全性和骨密度测量的质量保证',
          desc: '09:00-10:00',
        }
      ],
      active:0,
      currentDate:"",
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      disabledarr: ['2018-6-27','2018-6-25'],
      value: [2018,6,7],
      calDate:[],
      begin:[2016,1,1],
      end:[2020,1,1],
      events: {'2020-6-7':'今日备注', '2018-6-8':'一条很长的明日备注'},
      sessionkey:"",
      date:"",
      listData:[],
      id:"",
      dayList:[],
      currentList:[],
      endDate:"",
      selectNavIndex:1,
      needButton:false,
      handButton:'',
      btnText:'',
      list:[]
    }
  },
  computed:{
    weekDay(){
      let str = '';
      const arr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
      let day = new Date(this.date.replace(/-/g,'/')).getDay();
      str = arr[day];
      return str;
    },
    currentDay(){
      let myDate = new Date();
      let y = myDate.getFullYear();
      let m = myDate.getMonth()+1;
      let d = myDate.getDate();
      return `${y}-${m}-${d}`;
    },
    isToday() {
      //Code goes here.
        var d = new Date(this.date.toString().replace(/-/g,"/"));
        var todaysDate = new Date();
        if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
            return true;
        } else {
            return false;
        }
    }
  },
  onLoad(){
    wx.hideTabBar();
    let myDate = new Date();
    let y = myDate.getFullYear();
    let m = myDate.getMonth()+1;
    let d = myDate.getDate();
    this.date = `${y}-${m}-${d}`;
    this.calDate = [y,m,d];
    this.transformationDate(this.date,3);
    let sessionkey = wx.getStorageSync('sessionkey');
    this.sessionkey = sessionkey;
    this.getQuery();
  },
  mounted(){
    // console.log(this.$refs.childSwiper.nowDate,'1');
  },
  onShow(){
    this.getQuery();
  },
  methods:{
    changeHandle(e){
      console.log(e);
      let date = e.date;
      let y = new Date(date.replace(/-/g,'/')).getFullYear();
      let m = new Date(date.replace(/-/g,'/')).getMonth()+1;
      this.getDateInfo(m,y);
    },
    getBackTime(){
      console.log('1231231232132');
      this.$refs.childSwiper.getReturn();
    },
    getChangeSwiper(e){
      console.log(e);
      this.date = e.nowDate;
      if(this.current=='tab1'){
        this.transformationDate(this.date,3);
        this.getQuery();
      }else if(this.current=='tab2'){
        this.getDayQuery();
      }
    },
      transformationDate(date,month){
        var strDate;
        var oldDate= this.strToDate(date.replace(/-/g,'/'));
        var newDate = this.strToDate(date.replace(/-/g,'/'));
        newDate.setMonth(newDate.getMonth() + month);
        var yy1 = newDate.getFullYear();
        var mm1 = newDate.getMonth()+1;//因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
        var dd1 = newDate.getDate();
        if (mm1 < 10 ) {
            mm1 = '0'+ mm1;
        }
        if (dd1 < 10) {
          dd1 = '0' + dd1;
        }
        //预计结束日期=开始日期+期限
        if(oldDate.getDate()==newDate.getDate()){  //月末,getDaysInMonth()获取该月的最后一天
        var strDate= yy1+"-"+mm1+"-"+dd1;
          }else{
        var strDate= yy1+"-"+newDate.getMonth()+"-"+new Date(yy1,newDate.getMonth(),0).getDate(); 
          }    
        console.log(strDate);
        this.endDate = strDate;
    },
    strToDate(str){
      var val=Date.parse(str);
      var newDate=new Date(val);
      return newDate;
    },
    getQuery(){
      // console.log(this.date,this.endDate,'-----')
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          method:"activity.events.group.search",
          Sessionkey:this.sessionkey,
          // date:this.date,
          isMonthList:true,
          startDate:this.date,
          endDate:this.endDate

        }
      }).then(res=>{
        console.log(res);
        this.listData = res.data;
        // let temp  = [];
        // this.listData.forEach(item=>{
        //   temp.push({
        //     text:item.subject,
        //     desc:item.scheduledStart+'~'+item.scheduledEnd
        //   })
        // })
        // this.steps = temp;
        // this.active = this.listData.length;
        // this.id = this.listData[0].id;
      })
    },
    handleChange(e){
      this.current = e.mp.detail.key;
      this.getBackTime();
      if(this.current=='tab1'){
        this.getQuery();
      }else if(this.current=='tab2'){
        this.getDayQuery();
      }else if(this.current=='tab3'){
        let m = new Date().getMonth()+1;
        let y = new Date().getFullYear();
        // this.getDateInfo(m,y);
      }
    },
    getDayQuery(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          method:"activity.event.getlist",
          Sessionkey:this.sessionkey,
          date:this.date
        }
      }).then(res=>{
        console.log(res);
        this.dayList = res.listData;
      })
    },
    changeDate(e){
      // console.log(e);
      // this.currentDate = e.fulldate;
      // this.date = e.fulldate;
      // this.transformationDate(this.date,3);
      // this.getQuery();
    },
    bookMeeting(e){
      console.log(e,'121323');
      const url = '/pages/schedule/newSchedule/main?startTime='+e.startTime+'&endTime='+e.endTime;
      wx.navigateTo({url:url});
    },
    getDateInfo(month,year){
      console.log(year,month,'123');
      let startTime = this.getMonthStartDate(year,month-1);
      let endTime = this.getMonthEndDate(year,month);
      console.log(startTime,endTime);
      this.getMonthQuery(startTime,endTime);
    },
    getMonthQuery(startTime,endTime){
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
        console.log(res);
        // let list = res.listData.map(item=>{
        //   let date = item.createdOn.split(' ')[0];
        //   console.log(date);
        //   return date;
        // })
        this.list = res.listData;
        let list = res.listData.map(item=>({
          date:item.scheduledStart.split(' ')[0],
          subject:item.subject
        }))
        console.log(list,'list');
        let obj = {};
        let str = '';
        for(var key in list){
          console.log(list[key].date);
          let date = new Date(list[key].date);
          let y = date.getFullYear();
          let m = date.getMonth()+1;
          let d = date.getDate();
          let keyName = `${y}-${m}-${d}`
          obj[keyName] = list[key].subject!=''?list[key].subject:'暂无';
        }
        console.log(obj,'obj');
        
        this.events = obj;
      })
    },
    //获得某月的开始日期　　 
    getMonthStartDate(paraYear,paraMonth){　　 
    　 var monthStartDate = new Date(paraYear, paraMonth, 1);　　　 
    　 return this.formatDate(monthStartDate);　　 
    },
    //获得某月的结束日期　　 
    getMonthEndDate(paraYear,paraMonth){ 
    　 var monthEndDate = new Date(paraYear,paraMonth, this.getMonthDays(paraYear,paraMonth));　　　 
    　 return this.formatDate(monthEndDate);　　 
    },
    getMonthDays(paraYear,paraMonth){　　 
    　 var monthStartDate = new Date(paraYear, paraMonth, 1);　　　 
    　 var monthEndDate = new Date(paraYear, paraMonth, 1);　　　 
    　 var　 days　 =　 (monthEndDate　 -　 monthStartDate)/(1000　 *　 60　 *　 60　 *　 24);　　　 
    　 return　 days;　　　 
    },
    formatDate(date) {　　　 
    　 var myyear = date.getFullYear();　　 
    　 var mymonth = date.getMonth()+1;　　 
    　 var myweekday = date.getDate();　　　 
    　　　　 
    　 if(mymonth < 10){　　 
    　　　 mymonth = "0" + mymonth;　　 
    　 }　　　 
    　 if(myweekday < 10){　　 
    　　　 myweekday = "0" + myweekday;　　 
    　 }　　 
    　 return (myyear+"-"+mymonth + "-" + myweekday);　　　 
    },
    selectDate(e,v){
      console.log(e,v);
      if(v.event!=''){
        this.$httpWX.get({
          url:this.$api.message.queryList,
          data:{
            method:"activity.events.group.search",
            Sessionkey:this.sessionkey,
            isMonthList:false,
            startData:v.date,
            endData:v.date
          }
        }).then(res=>{
          console.log(res);
          this.currentList = res.data;
          res.data.map(item=>({
            
          }))
        })
      }
    },
    getDetail(item){
      if(item.RegardingObjectId!=''){
        const url = "/pages/meeting/detail/main?id="+item.RegardingObjectId;
        wx.navigateTo({url:url});
      }else {
        const url = "/pages/schedule/detail/main?id="+item.Id;
        wx.navigateTo({url:url});
      }
    },
    getToday(){
      this.$refs.child.getDefault(this.currentDay);
      this.date = this.currentDay;
      this.transformationDate(this.date,3);
      this.getQuery();
    },
    onCluesAddBtnClick(){
      const url = "/pages/schedule/newSchedule/main";
      wx.navigateTo({url:url});
    }
  }
}
</script>
<style lang="scss">
// @import '../../../static/css/icon.css';
  .wrap{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .header_flex{
      width: 100%;
      position: fixed;
      top: 0;
      z-index: 9999;
      .header{
        display: flex;
        background: #fff;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2rpx solid #e2e3e5;
        .lBox{
          width: 50%;
        }
        .rBox{
          padding-right: 33rpx;
        }
      }
    }
    .calendar_top{
      margin-top: 43px;
    }
    .calendar{
      background: #fff;
    }
    .rowTime{
      // text-align: center;
      margin-top: 16rpx;
      padding: 15rpx 31rpx;
      font-size: 30rpx;
      color: #333333;
      border-bottom: 2rpx solid #e2e3e5;
      display: flex;
      align-items: center;
      background: #fff;
      p:nth-child(1){
        i{
          color: #3399ff;
        }
      }
      p:nth-child(2){
        flex: 1;
        text-align: center;
      }
    }
    .center{
      background: #fff;
      padding-bottom: 80px;
      .content{
        display: flex;
        padding: 10rpx 33rpx;
        .lBox{
          .time{
            font-size: 39rpx;
            color: #3399ff;
          }
          .day{
            font-size: 24rpx;
            color: #3399ff;
          }
          .month{
            font-size: 56rpx;
            color: #333333;
            font-weight: bold;
          }
        }
        .rBox{
          flex: 1;
          width: 100%;
          margin-top: 20rpx;
          .weekInfo{
            margin: 20px 0 10rpx 25px;
            p{
              font-size: 28rpx;
              color: #7b8187;
              margin-bottom: 19rpx;
            }
          }
          .steps{
            display: flex;
            margin-left: 25px;
            .l{
              width: 20rpx;
              .radius{
                width: 20rpx;
                height: 20rpx;
                border-radius: 50%;
                background: #52b55e;
              }
              .radius.active{
                background: #ee8332;
              }
              .solid{
                width: 2rpx;
                height: 120rpx;
                background: #e2e3e5;
                margin: 0 auto;
              }
            }
            .r{
              margin-left: 20rpx;
                .title{
                  font-size: 28rpx;
                  color: #333333;
                }
                .time{
                  font-size: 24rpx;
                  color: #7b8187;
                  margin-top: 10rpx;
                }
              }
          }
          .van-step__title{
            view:nth-child(1){
              font-size: 28rpx;
              color: #333333;
            }
            view:nth-child(2){
              font-size: 24rpx;
              color: #7b8187;
            }
          }
          .van-step--vertical:after{
            border:none;
          }
          .box{
            margin-left: 20rpx;
            margin-top: 50px;
            p{
              padding: 19rpx 0;
              font-size: 28rpx;
              color: #7b8187;
            }
          }
        }
      }
    }
    .contDate{
      margin-top: 43px;
      .cont{
        width: 100%;
        background: #fff;
        .row:last-child{
          border: none;
        }
        .row{
          display: flex;
          padding: 10rpx 50rpx;
          border-bottom: 2rpx solid #e2e3e5;
          .lBox{
            border-right: 2rpx solid #3399ff;
            padding-right: 30rpx;
            p{
              font-size: 24rpx;
              color: #666666;
            }
            p:nth-child(1){
              padding-bottom: 10rpx;
            }
          }
          .rBox{
            margin-left: 30rpx;
            .title{
              font-size: 28rpx;
              color: #333333;
            }
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
        i{
            font-size: 35rpx;
        }

    }
  }
</style>