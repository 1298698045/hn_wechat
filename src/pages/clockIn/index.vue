<template>
  <div class="wrap">
    <div v-if="current=='homepage'">
      <div v-if="boxShow">
        <div class="header">
          <div class="nav">
            <div class="radiusLeft">
              <p>{{userInfo.fullName}}</p>
            </div>
            <div class="info">
              <p class="name">{{userInfo.fullName}}</p>
              <p class="group">考勤组：{{userInfo.deptName}}</p>
            </div>
            <div class="time">
              <picker mode="date" :value="startTime" @change="changeTime">
                <p>
                  {{startTime}}
                  <i-icon type="unfold" color="#546484" />
                </p>
              </picker>
            </div>
          </div>
        </div>
        <div class="center">
          <div class="record"  :class="index!=0?'top':''" v-for="(item,index) in list.attendData" :key="index">
            <div class="leftLine">
              <p class="minRadius" :class="item.status==0?'blue':''"></p>
              <span class="spans"></span>
            </div>
            <div class="rightCont">
              <p class="checktime">{{item.CheckType=='0'?'上班打卡':item.CheckType=='1'?'下班打卡':item.CheckType=='2'?'外勤上班':item.CheckType=='3'?'外勤下班':''}}{{item.OnTime}}</p>
              <p class="weight" v-if="item.CheckTime!=''">打卡时间{{item.CheckTime}}
                <span v-if="item.AbnormalCode=='1'">迟到</span>
                <span v-if="item.AbnormalCode=='2'">早退</span>
                <span class="waiqin" v-if="item.CheckType=='3'||item.CheckType=='2'">外勤</span>
              </p>
              <p class="adress" v-if="item.Location!=''">
                <i class="iconfont icon-dizhi"></i>
                <i class="iconfont icon-anquan"></i>
                <!-- <i-icon type="coordinates" color="#999999;" /> -->
                <span>{{item.Location}}</span>
              </p>
              <div class="toWrap">
                <p class="toUpdate" v-if="item.CheckTime!=''&&item.IsUpdate==true&&isToUpdate" @click="getToUpdate(item)">更新打卡<i-icon type="enter" /></p>
                <p class="toUpdate" v-if="item.CheckTime!=''&&(item.AbnormalCode=='1'||item.AbnormalCode=='2')&&item.Remark!=''" @click="getSeeComment(item)">查看备注<i-icon type="enter" /></p>
              </div>
              <!-- 缺卡 -->
              <div class="queKa" v-if="item.AbnormalCode=='3'">
                <span>缺卡</span>
                <p class="apply" @click="getApplyClock(item)">申请打卡<i-icon type="enter" /></p>
              </div>
              <!-- 无法打开unableCode==0 -->
              <div class="roundWrap" v-if="item.status==0||item.unableCode==0">
                <!-- <div class="round" :class="item.timestamp==0?'zaotui':item.overTime==0?'zaotui':''" @click="getClockIn(item)"> -->
                <div class="round" :class="back" @click="item.unableCode!=0?getClockIn(item):''">
                  <div>
                    <p class="pm">
                      {{item.CheckTypeName}}
                      <!-- {{item.timestamp==0?'早退打卡':item.CheckType=='0'?'上班打卡':item.CheckType=='1'?'下班打卡':item.CheckType=='2'?'外勤上班':item.CheckType=='3'?'外勤下班':''}} -->
                      </p>
                    <p class="time">{{time}}</p>
                  </div>
                </div>
              </div>
              <div class="clockInAdress"  v-if="item.status==0||item.unableCode==0">
                <p v-if="rangeStatus">
                  <span>
                    <i-icon type="right" />
                  </span>
                  已进入考勤范围:{{building}}
                </p>
                <p v-if="!rangeStatus">当前不在考勤范围内</p>
              </div>
            </div>
          </div>
          <!-- <div class="textWrap">
            <p v-if="rangeStatus">
              <span>
                <i-icon type="right" />
              </span>
              已进入考勤范围:{{address}}
            </p>
            <p v-if="!rangeStatus">当前不在考勤范围内</p>
          </div> -->
        </div>
      </div>
      <!-- 地图 -->
      <div v-if="!boxShow">
        <mapCom :longitude="longitude" :latitude="latitude" :adress="address" :clockInStatus="clockInStatus" :WorkShiftId="WorkShiftId" :sessionkey="SessionKey" @childFn="getQueryData" />
      </div>
    </div>

    <apply v-if="current=='apply'" />
    <statistics :attendAdmin="attendAdmin" v-if="current=='statistics'" />
    <newSetting v-if="current=='setting'" :DistanceRange="DistanceRange" @childFn="getIsShow"></newSetting>
    <!-- <setting v-if="current=='setting'" /> -->
    <div class="footer" v-if="boxShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
      <div>
        <i-tab-bar :current="current" color="#049bfb" @change="handleChange">
            <i-tab-bar-item key="homepage" :img="imgUrl+'04.2.1.Clock_1.png'" :current-img="imgUrl+'04.2.1.Clock_2.png'" title="打卡"></i-tab-bar-item>
            <i-tab-bar-item key="apply" :img="imgUrl+'04.2.1.Apply_1.png'" :current-img="imgUrl+'04.2.1.Apply_2.png'" title="申请"></i-tab-bar-item>
            <i-tab-bar-item key="statistics" :img="imgUrl+'04.2.1.Statistics_1.png'" :current-img="imgUrl+'04.2.1.Statistics_2.png'" title="统计"></i-tab-bar-item>
            <i-tab-bar-item v-if="attendAdmin" key="setting" :img="imgUrl+'04.2.1.Setup_1.png'" :current-img="imgUrl+'04.2.1.Setup_2.png'" title="设置"></i-tab-bar-item>
        </i-tab-bar>
      </div>
    </div>

    <!-- 早退打卡 -->
    <van-popup
      :show="leaveShow"
      position="center"
      custom-style="width:80%;height: auto;border-radius:7rpx;"
      @cancel="getCancel"
      @close="onClose"
    >
      <div class="popupWrap">
        <h3>{{popupTitle}}</h3>
        <div class="cont">
          <div class="row">
            <p>打卡时间：</p>
            <p>{{everyDayTime}}</p>
          </div>
          <div class="row">
            <p>打卡地点：</p>
            <p>{{address}}</p>
          </div>
        </div>
        <div class="textValue">
          <textarea class="textarea" v-model="Description" placeholder="请填写打卡备注（选填）" placeholder-class="placeholder" name="" id="" cols="30" rows="10"></textarea>

          <div class="imgs">
            <div class="box" v-if="imgList==''" @click="getChooseImage">
              <i class="iconfont icon-tupian"></i>
            </div>
            <div class="box" else v-for="(item,index) in imgList" :key="index">
              <img :src="item" alt="">
            </div>
          </div>
        </div>
        <div class="bottompop" v-if="popupStatus==true">
          <p @click="getNoClockIn">不打卡</p>
          <p @click="getSubmit">确定</p>
        </div>
        <h3 class="submit" @click="getSubmit" v-if="!popupStatus">提交</h3>
      </div>
    </van-popup>

    <!-- 查看备注 -->
    <van-popup
      :show="comentShow"
      position="center"
      custom-style="width:80%;height: auto;border-radius:7rpx;"
      @cancel="getCloseComent"
      @close="getCloseComent"
    >
      <div class="popupWrap">
        <h3>打卡备注</h3>
        <div class="cont">
          <div class="row">
            <p>打卡时间：</p>
            <p>{{commentTime}}</p>
          </div>
          <div class="row">
            <p>打卡地点：</p>
            <p>{{commentLocation}}</p>
          </div>
        </div>
        <div class="textValue">
          <textarea class="textarea" v-model="commentRemark" :disabled="true" placeholder-class="placeholder" name="" id="" cols="30" rows="10"></textarea>
        </div>
        <h3 class="submit" @click="getCloseComent">关闭</h3>
      </div>
    </van-popup>


    <van-popup
      :show="successShow"
      position="center"
      custom-style="width:80%;height: auto;border-radius:7rpx;"
      @close="getSuccessClose"
    >
      <div class="successWrap">
        <div class="img">
          <img :src="popupImg" alt="">
        </div>
        <p class="text" :style="{'color':colorClass}">{{CheckTypeName}}成功</p>
        <p class="time" :style="{'color':colorClass}">{{everyDate}}</p>
        <p class="min">{{tipsText}}</p>
      </div>
      <div class="foot" @click="getMyKnow">
        我知道了
      </div>
    </van-popup>
  </div>
</template>
<script>
import { timing } from "@/utils/clockTime";
import statistics from '../../components/clockIn/statistics';
import apply from '../../components/clockIn/apply';
import setting from '../../components/clockIn/setting';
import newSetting from '../../components/clockIn/newSetting';
import QQMapWX from '../../utils/qqmap-wx-jssdk.js';
import mapCom from '../../components/clockIn/mapCom';
var qqmapsdk = new QQMapWX({
    key: 'UVRBZ-UN2WU-KMJV6-2DAPJ-JW5QE-C5BYC' // 必填
});  
 

export default {
  components:{
    apply,
    statistics,
    setting,
    mapCom,
    newSetting
  },
  data() {
    return {
        am:"",
        yearTime:"",
        monthTime:"",
        dayTime:"",
        hoursTima:"",
        minvteTime:"",
        secondTime:"",
        current:"homepage",
        time:"",
        timer:null,
        startTime:"",
        userInfo:{},
        list:{},
        latitude:"",
        longitude:"",
        nowtime:"",
        everyDayTime:"",
        isTime:null,
        SessionKey:"207A11C0-12E3-4F7E-8033-F61B6883FFD8",
        // SessionKey:"5d884846-1d19-449d-b4e2-1b5a83623a41",
        leaveShow:false,
        imgList:[],
        Description:"",
        CheckType:"",
        WorkShiftId:"",
        AbnormalCode:"",
        OnTime:"",
        successShow:false,
        everyDate:"",
        CheckTypeName:"",
        AttendanceEmpId:"",
        // clockInStatus:"",
        clockInCode:"",
        address:"",
        everyNowTime:"", // 当前时间
        distanceList:[],// 所有地点的距离
        DistanceRange:"",
        rangeStatus:false,
        boxShow:true,
        back:"",
        popupTitle:"",
        popupImg:"",
        clockInStatus:"",
        popupStatus:"",
        colorClass:"",
        Distance:"",
        tipsText:"",
        comentShow:false,
        commentTime:"",
        commentLocation:"",
        commentRemark:"",
        comentShow:"",
        attendAdmin:'',
        isGroup:false,
        building:"",
        timeNull:null,
        isToUpdate:false // 判断是否为今日
    };
  },
  computed:{
    isModelmes(){
      return wx.getStorageSync('isModelmes');
    },
    imgUrl(){
      return this.$api.photo.url;
    },
    currentTime(){
      let time = new Date().getTime();
      return time;
    }
  },
  watch:{
    
  },
  onLoad() {
      let sessionkey = wx.getStorageSync('sessionkey');
      this.SessionKey = sessionkey;
      this.current = 'homepage';
      this.rangeStatus = false;
      this.boxShow = true;
      this.getTime();
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth()+1;
      let day = date.getDate();
      this.startTime = `${y}-${m}-${day}`;
      // this.getLocation();
      this.numtap();
      this.getPrivilege();
      this.getLocation().then(()=>{
        this.getUserInfo().then(()=>{
          this.getQuery();
        });
      })
      this.getTimer();
      // wx.getConnectedWifi({
      //   success:res=>{
      //     console.log(res,'12312332');
      //   },
      //   fail:error=>{
      //     console.log(error);
      //   }
      // })
  },
  onUnload(){
    clearTimeout(this.timer);
    clearInterval(this.timeNull);
  },
  methods: {
    // 实时刷新
    getTimer(){
      this.timeNull = setInterval(()=>{
        this.getLocation().then(()=>{
          this.getUserInfo().then(()=>{
            this.getQuery();
          });
        })
      },10000)
    },
    getPrivilege(){
        this.$httpWX.get({
            url:this.$api.message.queryList,
            data:{
                method:this.$api.clockIn.privilege,
                SessionKey:this.SessionKey
            }
        }).then(res=>{
            console.log(res);
            this.attendAdmin = res.data.attendAdmin;
        })
    },
    getIsShow(val){
      this.boxShow = val;
    },
    getQueryData(val){
      console.log(val,'debugger')
      this.boxShow = val.status;
      this.Description = val.Description;
      if(this.clockInCode==2&&this.clockInStatus==7){
        this.popupTitle = '确定要打早退卡吗？';
        this.leaveShow = true;
      }else {
        this.getSubmit();
      }
      
    },
    getTime(){
    //  setInterval(()=>{
        //new Date() new一个data对象，当前日期和时间
        //toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
        this.nowtime = (new Date()).getTime();
        this.everyDayTime = this.nowtime;
        // console.log(this.everyDayTime,'123123');
        // this.nowtime = new Date().toLocaleString();
      // },1000)
    },
    getUserInfo(){
      return new Promise((resolve,reject)=>{
        this.$httpWX.get({
          url:this.$api.message.queryList,
          data:{
            method:"sys.userinfo.get",
            SessionKey:this.SessionKey     
          },
          loadingOption:{
              loading:false
          }
        }).then(res=>{
          this.userInfo = res.data[0];
          resolve();
        })
      })
    },
    isToday(str){
        var d = new Date(str.replace(/-/g,"/"));
        var todaysDate = new Date();
        if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
            return true;
        } else {
            return false;
        }
    },
    getQuery(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          method:"hr.attend.empdaily.get",
          SessionKey:this.SessionKey,
          AttendDate:this.startTime
        },
        loadingOption:{
            loading:false
        }
      }).then(res=>{
        this.isToUpdate = this.isToday(this.startTime); // 判断是否为今日
        this.distanceList = [];
        this.list = res.data;
        this.DistanceRange = res.data.globalSettings.DistanceRange;
        this.list.locations.forEach(item=>{
          const distance = this.getDistance(this.latitude,this.longitude,item.Latitude,item.Longitude);
          console.log(distance*1000,'距离');
          this.distanceList.push(distance*1000);
        })
        // 在考勤范围内true 在考勤范围外false
        try{
          this.distanceList.forEach(item=>{
            if(item<this.DistanceRange){
              this.Distance = item;
              this.rangeStatus = true;
              // console.log(this.distanceList,'distanceList')
              const index = this.distanceList.findIndex(one=>one==this.Distance);
              // console.log('indexindex',index);
              this.building = this.list.locations[index].Name;
              throw new Error ('EndIterative');
            }else {1
              this.Distance = item;
              this.rangeStatus = false;
            }
          })
        } catch (e){
          console.log(e,'error')
        }
        console.log(this.rangeStatus,'在考勤范围内')
        try{
          this.list.attendData.forEach(item=>{
            // console.log(item.AttendDate+' '+item.OnTime,'AbnormalCode');
            var stringTime = item.AttendDate.replace(/-/g,'/')+' '+item.OnTime;
            var timestamp = Date.parse(new Date(stringTime));
            // this.everyDayTime 当前时间戳
            // timestamp 0:早退 1:正常
            if(item.AbnormalCode=='-1'&&this.everyDayTime<timestamp&&item.CheckType==1){
              this.$set(item,'timestamp',0);
            }else{
              this.$set(item,'timestamp',1);
            }
            // 上班打卡 overTime 0:迟到 1:未迟到
            if(item.AbnormalCode=='-1'&&item.CheckType==0&&this.everyDayTime>timestamp){
              this.$set(item,'overTime',0);
            }else {
              this.$set(item,'overTime',1);
            }
            var CheckTypeName = '';
            var clockInStatus = '';
            // status 0:上班打卡1:下班打卡2:迟到打卡3:早退打卡4:外勤上班打卡5:外勤下班打卡6:迟到外勤打卡7:早退外勤打卡
            if(item.AbnormalCode=='-1'&&item.timestamp=='0'&&item.CheckType=='1'&&this.rangeStatus==false){
              if(this.isGroup){
                // 早退外勤打卡
                CheckTypeName = '外勤打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.$set(item,'clockInCode',2);
                this.$set(item,'checkTypeCode',3)
                this.back = 'waiqin';
                clockInStatus = 7;
                this.$set(item,'clockInStatus',clockInStatus);
              }else {
                CheckTypeName = '无法打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.back = 'unable';
                item.unableCode = 0;
                // return false;
                throw Error();
              }
            }else if(item.AbnormalCode=='-1'&&item.timestamp=='0'&&item.CheckType=='1'&&this.rangeStatus==true){
              // CheckTypeName = '早退打卡';
              CheckTypeName = '下班打卡'
              this.$set(item,'CheckTypeName',CheckTypeName);
              this.$set(item,'clockInCode',2);
              this.$set(item,'checkTypeCode',1);
              // this.back = 'zaotui';
              this.back = 'round';
              clockInStatus = 3;
              this.$set(item,'clockInStatus',clockInStatus);
            }else if(item.AbnormalCode=='-1'&&item.CheckType=='0'&&item.overTime==1&&this.rangeStatus==true){
              CheckTypeName = '上班打卡';
              this.$set(item,'CheckTypeName',CheckTypeName);
              this.$set(item,'clockInCode',0)
              this.$set(item,'checkTypeCode',0)
              this.back = 'round';
              clockInStatus = 0;
              this.$set(item,'clockInStatus',clockInStatus);
            }else if(item.AbnormalCode=='-1'&&item.CheckType=='0'&&item.overTime==1&&this.rangeStatus==false){
              if(this.isGroup){
                // 外勤上班打卡
                CheckTypeName = '外勤打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.$set(item,'clockInCode',0);
                this.$set(item,'checkTypeCode',2)
                this.back = 'waiqin'
                clockInStatus = 4;
                this.$set(item,'clockInStatus',clockInStatus);
              }else {
                CheckTypeName = '无法打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.back = 'unable';
                item.unableCode = 0;
                // return false;
                throw Error();
              }
            }else if(item.AbnormalCode=='-1'&&item.CheckType=='0'&&item.overTime==0&&this.rangeStatus==false){
              if(this.isGroup){
                // 迟到外勤打卡
                CheckTypeName = '迟到打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.$set(item,'clockInCode',1);
                this.$set(item,'checkTypeCode',2)
                this.back = 'zaotui';
                clockInStatus = 6;
                this.$set(item,'clockInStatus',clockInStatus);              
              }else {
                CheckTypeName = '无法打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.back = 'unable';
                item.unableCode = 0;
                throw Error();
                // return false;
              }
            } else if(item.AbnormalCode=='-1'&&item.CheckType=='0'&&item.overTime==0&&this.rangeStatus==true){
              CheckTypeName = '迟到打卡';
              this.$set(item,'CheckTypeName',CheckTypeName);
              this.$set(item,'clockInCode',1);
              this.$set(item,'checkTypeCode',0)
              this.back = 'zaotui';
              clockInStatus = 2;
              this.$set(item,'clockInStatus',clockInStatus);              
            }else if(item.AbnormalCode=='-1'&&item.CheckType=='1'&&this.rangeStatus==true){
              CheckTypeName = '下班打卡'
              this.$set(item,'CheckTypeName',CheckTypeName);
              this.$set(item,'clockInCode',0)
              this.$set(item,'checkTypeCode',1)
              this.back = 'round';
              clockInStatus = 1;
              this.$set(item,'clockInStatus',clockInStatus);              
            }else if(item.AbnormalCode=='-1'&&item.CheckType=='1'&&this.rangeStatus==false){
              if(this.isGroup){
                // 外勤下班打卡
                CheckTypeName = '外勤打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.$set(item,'clockInCode',0);
                this.$set(item,'checkTypeCode',3)
                this.back = 'waiqin';
                clockInStatus = 5;
                this.$set(item,'clockInStatus',clockInStatus);
              }else {
                CheckTypeName = '无法打卡';
                this.$set(item,'CheckTypeName',CheckTypeName);
                this.back = 'unable';
                item.unableCode = 0;
                // return false;
                throw Error();
              }
            }else if(item.AbnormalCode=='-1'&&item.CheckType=='2'){
              if(this.isGroup){
                CheckTypeName = '外勤上班'
                this.$set(item,'CheckTypeName',CheckTypeName);
              }
            }else if(item.AbnormalCode=='-1'&&item.CheckType=='3'){
              if(this.isGroup){
                CheckTypeName = '外勤下班'
                this.$set(item,'CheckTypeName',CheckTypeName);
              }
            }
            if(item.CheckType==0&&item.CheckTime==""&&item.AbnormalCode=='-1'){
              this.$set(item,'status',0);
              throw new Error('End')
            }else if(item.CheckType==1&&item.CheckTime==""&&item.AbnormalCode=='-1'){
              this.$set(item,'status',0);
              throw new Error('End')
            }
          })
        }catch(e){

        }
        console.log(this.list.attendData,'处理的数据');
      })
    },
    getLocation(){
      return new Promise((resolve,reject)=>{
        let that = this;
         wx.getSetting({
          success: (res) => {
            // console.log(JSON.stringify(res))
            // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
            // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
            // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
            if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '拒绝授权',
                      icon: 'none',
                      duration: 1000
                    })
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (dataAu) {
                        if (dataAu.authSetting["scope.userLocation"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //再次授权，调用wx.getLocation的API
                          
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else if (res.authSetting['scope.userLocation'] == undefined) {
              //调用wx.getLocation的API
              wx.getLocation({
                type: 'gcj02',
                success (res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                  that.latitude = latitude;
                  that.longitude = longitude;
                  qqmapsdk.reverseGeocoder({
                    success:res=>{
                      that.address = res.result.address;
                      // that.address = res.result.formatted_addresses.recommend;
                      resolve();
                    }
                  })
                }
              })
            }
            else {
              //调用wx.getLocation的API
              wx.getLocation({
                type: 'gcj02',
                success (res) {
                  console.log(res,'location')
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                  
                  that.latitude = latitude;
                  that.longitude = longitude;
                  qqmapsdk.reverseGeocoder({
                    location:{
                      latitude:latitude,
                      longitude:longitude
                    },
                    success:res=>{
                      console.log(res);
                      that.address = res.result.address;
                      // that.address = res.result.formatted_addresses.recommend;
                      resolve();
                    }
                  })
                }
              })
            }
          }
        })
        
      })
    },
    changeTime(e){
      let value = e.mp.detail.value;
      if(new Date(value).getTime()<=this.currentTime){
        this.startTime = e.mp.detail.value;
        this.getQuery();
      }else {
        wx.showToast({
          title:'不能选择未来的日子',
          icon:'none',
          duration:2000
        })
      }
      // console.log(new Date(this.startTime).getTime(),this.currentTime,'-------');
    },
    //分割字符方法，
    timestr(){
      var that = this;
      var date = new Date();
      var yearTime = date.getFullYear(); //年
      var monthTime =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1; //月
      var dayTime = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //日
      var hoursTima =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //时
      var minvteTime =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //分
      var secondTime =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
      // console.log("当前时间："+ yearTime+'-'+monthTime+'-'+dayTime+'--'+hoursTima+":"+minvteTime+":"+ secondTime);
      var nowdatassss =
        yearTime +
        "-" +
        monthTime +
        "-" +
        dayTime +
        "--" +
        hoursTima +
        ":" +
        minvteTime +
        ":" +
        secondTime;
      if (hoursTima > 12 && hoursTima < 20) {
          that.am = "下午";
      } else if (hoursTima > 20 && hoursTima < 24) {
          that.am = "晚上";
      } else if (hoursTima > 0 && hoursTima < 6) {
          that.am = "半夜";
      } else if (hoursTima > 6 && hoursTima < 12) {
          that.am = "上午";
      }
      that.nowdatassss = nowdatassss;
      // 以下的数字，都要先将他们转化成字符串，不然，for循环的时候，他会按照数字去循环
      // 将时间拆开，这样写的原因是，时分秒之间得有分隔符，这样写的话好处理
      that.yearTime = yearTime.toString();//年
      that.monthTime = monthTime.toString();
      that.dayTime = dayTime.toString();
      that.hoursTima = hoursTima.toString();
      that.minvteTime = minvteTime.toString();
      that.secondTime = secondTime.toString();
      // console.log(that.yearTime,that.monthTime,that.dayTime,that.hoursTima,that.minvteTime,that.secondTime);
      that.time = `${that.hoursTima}:${that.minvteTime}:${that.secondTime}`;
    },
    // 计时器的方法
    numtap() {
      var that = this;
      that.timestr();
      that.timer = setInterval(function() {
        that.timestr();
      }, 1000);
    },
    /*   
      * Lat1 Lung1 表示A点经纬度，Lat2 Lung2 表示B点经纬度； a=Lat1 – Lat2 为两点纬度之差 b=Lung1  
      * -Lung2 为两点经度之差； 6378.137为地球半径，单位为千米；  计算出来的结果单位为千米。 
      * 通过经纬度获取距离(单位：千米)    
      * @param lat1    
      * @param lng1    
      * @param lat2    
      * @param lng2 
      * @return 
      */  
    getDistance(lat1, lng1, lat2, lng2) {  
        let EARTH_RADIUS = 6378.137;  
        let radLat1 = this.rad(lat1);  
        let radLat2 = this.rad(lat2);  
        let a = radLat1 - radLat2;  
        let b = this.rad(lng1) - this.rad(lng2);  
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +  
            Math.cos(radLat1) * Math.cos(radLat2) *  
            Math.pow(Math.sin(b / 2), 2)));  
        s = s * EARTH_RADIUS;  
        //s = Math.round(s * 10000d) / 10000d;  
        s = Math.round(s * 10000) / 10000;  
        //s = s * 1000; //乘以1000是换算成米  
        return s;  
    },  
    rad(d) {  
        return d * Math.PI / 180.0;  
    },
    handleChange(e){
        this.current = e.mp.detail.key;
        let name = '打卡';
        if(this.current=='homepage'){
          name = '打卡'
          this.getTimer();
        }else if(this.current=='apply'){
          name = '申请'
          clearInterval(this.timeNull);
        }
        else if(this.current=='statistics'){
          name = '统计'
          clearInterval(this.timeNull);
        }else if(this.current=='setting'){
          name = '设置'
          clearInterval(this.timeNull);
        }
        wx.setNavigationBarTitle({
          title: name
        })
    },
    // 查看备注 
    getSeeComment(item){
      this.commentTime = `${item.AttendDate} ${item.CheckTime}`;
      this.commentLocation = item.Location;
      this.commentRemark = item.Remark==''?'无备注信息':item.Remark;
      this.comentShow = true;
      // wx.showModal({
      //   title: '查看备注',
      //   content: item.Remark,
      //   success (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
    },
    // 关闭备注modal
    getCloseComent(){
      this.comentShow = false;
    },
    // 更新打卡
    getToUpdate(item){
      let that = this;
      console.log(item);
      wx.getLocation({
        type: 'gcj02',
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          that.latitude = latitude;
          that.longitude = longitude;
        }
      })
      that.AbnormalCode = item.AbnormalCode;
      // that.CheckType = item.checkTypeCode;
      that.CheckType = item.CheckType;
      that.WorkShiftId = item.WorkShiftId;
      that.OnTime = item.OnTime;
      that.AttendanceEmpId = item.AttendanceEmpId; // 更新打卡
      that.clockInCode = item.AbnormalCode;
      // that.clockInStatus = 5;
      console.log(item.clockInCode,'clockInCode');
      if(item.CheckType==0){
        that.CheckTypeName = '上班打卡';
      }else if(item.CheckType==1){
        that.CheckTypeName = '下班打卡';
      }else if(item.CheckType==2){
        that.CheckTypeName = '外勤上班';
      }else if(item.CheckType==3){
        that.CheckTypeName = '外勤下班';
        // this.boxShow = false;
        // return ;
      }
      wx.showModal({
        title: '',
        content: '确定要更新此次打卡记录吗？',
        success:(res)=>{
          if (res.confirm) {
            that.list = {};
            that.getSubmit();
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 打卡
    getClockIn(item){
      console.log(item);
      this.Description = '';
      this.AbnormalCode = item.AbnormalCode;
      this.CheckType = item.checkTypeCode;
      this.WorkShiftId = item.WorkShiftId;
      this.OnTime = item.OnTime;
      this.CheckTypeName = item.CheckTypeName;
      this.clockInCode = item.clockInCode;
      this.clockInStatus = item.clockInStatus;
      if(item.clockInCode==2){
        this.popupTitle = '确定要打早退卡吗？';
        this.popupStatus = true;
      }else {
        this.popupTitle = this.CheckTypeName+'备注';
      }
      let myDate = new Date();
      let h = myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours(); //时
      let m = myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes(); //分
      let s = myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds(); //秒
      this.everyDayTime = `${h}:${m}:${s}`;

      if(this.rangeStatus==false){
        this.boxShow = false;
      }else if(item.timestamp==0){
        this.leaveShow = true;
      }else if(item.overTime==0){
        this.leaveShow = true;
      } else {
        this.getSubmit();
      }
      
    },
    // 不打卡
    getNoClockIn(){
      this.leaveShow = false;
    },
    getSubmit(){
      let that = this;
      qqmapsdk.reverseGeocoder({
        success:res=>{
          console.log(res);
          that.address = res.result.address;
        }
      })
      var date = new Date();
      var year = date.getFullYear();

      var month = date.getMonth()+1;
      var day = date.getDate();
      var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //时
      var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //分
      var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
      var OnTime = `${hour}:${minute}:${second}`;
      // if(this.AbnormalCode=='-1'){
        this.$httpWX.get({
          url:this.$api.message.queryList,
          data:{
            method:"hr.attend.work.checkin",
            SessionKey:this.SessionKey,
            checkType:this.CheckType,
            Location:that.address,
            AttendDate:this.startTime,
            OnTime:this.OnTime,
            CheckTime:this.time,
            WorkShiftId:this.WorkShiftId,
            Longitude:this.longitude,
            Latitude:this.latitude,
            Distance:this.Distance,
            file:"",
            Description:this.Description,
            id:this.AttendanceEmpId,
            AbnormalCode:this.clockInCode,
            BuildingName: this.building
          }
        }).then(res=>{
          console.log(res);
          console.log(this.clockInCode,this.CheckType,'123123123123');
          if(this.CheckType==0||this.CheckType==2){
            this.tipsText = '开心工作，从此刻开启';
          }else if(this.CheckType==1||this.CheckType==3){
            this.tipsText = '工作辛苦了，好好休息';
          }
          if((this.clockInCode==0&&this.CheckType==0)||(this.clockInCode==0&&this.CheckType==1)){
            this.popupImg = 'https://oawx.hnca.org.cn/img/wechat/Clock_in.png';
            this.colorClass = '#3399ff';
          }else if((this.clockInCode==0&&this.CheckType==2)||(this.clockInCode==0&&this.CheckType==3)){
            this.popupImg = 'https://oawx.hnca.org.cn/img/wechat/04.2.1.Clock_in.png';
            this.colorClass = '#57b987';
          }else {
            this.popupImg = 'https://oawx.hnca.org.cn/img/wechat/04.2.1.Clock_in_早退打卡成功.png';
            this.colorClass = '#fe943e';
          }
          this.leaveShow = false;
          if(res.status==1){
            this.everyDate = `${hour}:${minute}`;
            this.successShow = true;
          }
        })
      // }
    },
    getSuccessClose(){
      this.successShow = false;
    },
    getMyKnow(){
      this.successShow = false;
      this.getQuery();
    },
    getCancel(){
      this.leaveShow = false;
    },
    onClose(){
      this.leaveShow = false;
    },
    // 申请打卡
    getApplyClock(item){
      const url = '/pages/clockIn/patchcardApply/main';
      wx.navigateTo({url:url});
    },
    // 早退打卡选择图片
    getChooseImage(){
      let that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          that.imgList = tempFilePaths;
          wx.uploadFile({
              url: "https://oawx.hnca.org.cn/rest?method="+'file.attachfiles.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.AttendanceEmpId+'&objTypeCode='+'30090',
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                  'user': 'test'
              },
              success (res){
                  console.log(res);
                  const data = res.data
              }
          })
        }
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
      this.getLocation().then(()=>{
        this.getUserInfo().then(()=>{
          this.getQuery();
        });
      })
      wx.stopPullDownRefresh();
  },
};
</script>
<style lang="scss" scoped>
// @import "../../../static/css/public.scss";
// @import "../../../static/css/icon.css";
@import "../../../static/css/clockIn.css";
page{
  background: #fff;
}
.wrap {
  .header {
    background: #fff;
    border-bottom: 1rpx solid #eceeed;
    .nav {
      display: flex;
      padding: 20rpx 33rpx;
      align-items: center;
      background: #fff;
      .radiusLeft {
        width: 72rpx;
        height: 72rpx;
        line-height: 72rpx;
        text-align: center;
        border-radius: 50%;
        font-size: 22rpx;
        color: #fff;
        background: #3399ff;
      }
      .info {
        flex: 1;
        margin-left: 20rpx;
        .name {
          color: #333333;
          font-size: 34rpx;
        }
        .group {
          color:#7d8081;
          font-size: 27rpx;
        }
      }
      .time {
        color: #526992;
        font-size: 24rpx;
      }
    }
  }
  .center{
    background: #fff;
    padding: 51rpx 0;
    height: 100vh;
    .record.top{
      margin-top: -20rpx;
    }
    .record:last-child{
      // background: red;
      .leftLine{
       .spans{
        //  display: none;
          background: #fff;
       } 
      }
    }
    .record{
      display: flex;
      padding: 0 29rpx;
      .leftLine{
        text-align: center;
        margin-top: 10rpx;
        .minRadius{
          width: 17rpx;
          height: 17rpx;
          border-radius: 50%;
          background: #b2b2b2;
        }
        .blue{
          background: #3399ff;
        }
        .spans{
          width: 2rpx;
          height: 333rpx;
          background: #e0e0e0;
          display: inline-block;
          text-align: center;
        }
      }
      .rightCont{
        margin-left: 20rpx;
        width: 100%;
        position: relative;
        .checktime{
          color: #666666;
          font-size: 28rpx;
        }
        .weight{
          font-size: 32rpx;
          font-weight: bold;
          color: #333333;
          padding: 20rpx 0;
          span{
            display: inline-block;
            width: 72rpx;
	          height: 40rpx;
            line-height: 40rpx;
            text-align: center;
            font-size: 25rpx;
            border: 3rpx solid #ff9237;
            color: #ff9237;
            border-radius: 5rpx;
          }
          span:nth-child(1){
            margin-right: 20rpx;
          }
          .waiqin{
            font-size: 25rpx;
            border: 2rpx solid #0ebc7f;
            color: #0ebc7f;
          }
        }
        .adress{
          padding-bottom: 10rpx;
          display: flex;
          .icon-anquan{
            color: #74b48c;
            font-size: 28rpx;
          }
          .icon-dizhi{
            color: #9c9c9c;
            font-size: 28rpx;
          }
          span{
            font-size: 25rpx;
            color: #999999;
          }
        }
        .toWrap{
          display: flex;
          .toUpdate{
            color: #526992;
            font-size: 25rpx;
          }
        }
        .queKa{
          span{
            display: inline-block;
            width: 72rpx;
	          height: 40rpx;
            line-height: 40rpx;
            text-align: center;
            font-size: 25rpx;
            color: #ff9237;
            border:2rpx solid #ff9237;
            border-radius: 5rpx;
            margin: 20rpx 0;
            font-weight: bold;
          }
          .apply{
            font-size: 25rpx;
            color: #526992;
          }
        }
        .roundWrap{
          display: flex;
          justify-content: center;
          .round{
            width: 250rpx;
            height: 250rpx;
            background: #229bfa;
            border-radius: 50%;
            font-size: 36rpx;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 30px;
            box-shadow: 0rpx 10rpx 30rpx rgba(34, 155, 250, 0.4);
            background-image: linear-gradient(to bottom, #72b8f9, #5096f3);
            .time{
              font-size: 31rpx;
              opacity: .6;
            }
          }
          .round.zaotui{
            background: #ff9237;
            // box-shadow: 0rpx 70rpx 117rpx 0rpx rgba(254, 150, 61, 0.3);
            box-shadow: 0rpx 10rpx 30rpx rgba(254, 150, 61, 0.4);
            background-image: linear-gradient(to bottom, #f8be5a, #fe9941);
          }
          .round.waiqin{
            background: #0ebc7f;
            // box-shadow: 0rpx 70rpx 117rpx 0rpx rgba(21, 190, 131, 0.3);
            box-shadow: 0rpx 10rpx 30rpx rgba(21, 190, 131, 0.4);
            background-image: linear-gradient(to bottom, #72e4b1, #59bc8a);

          }
          .round.unable{
            box-shadow: 0rpx 12rpx 47rpx 0rpx rgba(134, 161, 205, 0.3);
            background-color: #687aa4;
            background-image: linear-gradient(to bottom , #849eca,#5d6c95);
          }
        }
        .clockInAdress{
          width: 100%;
          position: absolute;
          bottom: 20rpx;
          text-align: center;
          font-size: 24rpx;
          color: #666666;
          p{
            margin-right: 30px;
          }
        }
      }
    }
    .clockIn{
      display: flex;
      justify-content: center;
      .round{
        width: 250rpx;
        height: 250rpx;
        background: #229bfa;
        border-radius: 50%;
        font-size: 36rpx;
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        .time{
          font-size: 31rpx;
          opacity: .6;
        }
      }
    }
    .textWrap{
      color: #666666;
      font-size: 24rpx;
      text-align: center;
      margin: 47rpx 0;
      p{
        span{
          width: 24rpx;
          height: 24rpx;
          line-height: 24rpx;
          display: inline-block;
          text-align: center;
          background: #229bfa;
          border-radius: 50%;
          color: #fff;
        }
      }
    }
  }
  .footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
    }
  .popupWrap{
    h3{
      text-align: center;
      font-size: 35rpx;
      color: #333333;
      padding: 42rpx 0;
      border-bottom: 1rpx solid #e2e4e3;
    }
    .submit{
      font-size: 32rpx;
      color: #3399ff;
      border-top: 1rpx solid #e2e4e3;
    }
    .bottompop{
      display: flex;
      border-top: 2rpx solid #e2e4e3;
      p{
        flex: 1;
        font-size: 32rpx;
        color: #229bfa;
        text-align: center;
        padding: 33rpx 0;
      }
      p:nth-child(1){
        border-right: 2rpx solid #e2e4e3;
      }
    }
    .cont{
      padding: 35rpx 21rpx;
      border-bottom: 1rpx solid #e2e4e3;
      .row{
        display: flex;
        p:nth-child(1){
          color: #888888;
          font-size: 33rpx;
        }
        p:nth-child(2){
          color: #333333;
          font-size: 33rpx;
          flex: 1;
        }
      }
    }
    .textValue{
      padding: 19rpx 21rpx;
      .textarea{
        width: 100%;
        height: 149rpx;
        background: #fff;
        font-size: 33rpx;
      }
      .placeholder{
        color: #666666;
      }
      .imgs{
        .box{
          width: 115rpx;
          height: 115rpx;
          border: 7rpx solid #e4e4e4;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          img{
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }
          i{
            font-size: 30px;
            color: #999999;
          }
        }
      }
    }
  }
  .successWrap{
    padding: 70rpx 73rpx;
    text-align: center;
    .img{
      width: 100%;
      height: 236rpx;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .text{
      font-size: 35rpx;
      color: #3399ff;
    }
    .time{
      font-size: 122rpx;
      color: #3399ff;
      padding: 20rpx 0 40rpx 0;
    }
    .min{
      font-size: 26rpx;
      color: #666666;
    }
  }
    .foot{
      border-top: 1rpx solid #e2e4e3;
      text-align: center;
      padding: 35rpx 0;
      text-align: center;
      color: #229bfa;
    }
}
</style>