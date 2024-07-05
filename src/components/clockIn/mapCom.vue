<template>
  <div class="wrap">
    <map
      id="map"
      :longitude="longitude"
      :latitude="latitude"
      scale="14"
      :controls="controls"
      @controltap="controltap"
      :markers="markers"
      @markertap="markertap"
      :polyline="polyline"
      @regionchange="regionchange"
      show-location
      style="width: 100%; height: 350px;"
    ></map>
    <div class="boxWrap">
      <div class="row">
        <p class="top">
          我的位置 <span class="l">(不在</span><span class="c">考勤范围</span><span class="l">内)</span>
        </p>
        <p class="bottoms">
          <span :style="{'background':colorCode}">外勤</span> {{adress}}
        </p>
      </div>
      <div class="center">
        <div class="lBox">
          <p>备注</p>
          <input type="text" v-model="Description" placeholder="选填">
        </div>
        <div class="rBox">
          <p @click="getChooseImage">
            <i class="iconfont icon-tupian" v-if="imgUrl==''"></i>
            <img :src="imgUrl" alt="" v-if="imgUrl!=''">
          </p>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="box">
        <van-button type="primary" :color="colorCode" block @click="getExternalClockIn">{{time}} {{submitName}}</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { timestr } from '@/utils/timer';
export default {
  name: "mapCom",
  props: ["longitude", "latitude","adress","clockInStatus","WorkShiftId","sessionkey"],
  data() {
    return {
      longitude: "",
      latitude: "",
      adress:"",
      imgUrl:"",
      Description:"",
      clockInStatus:"",
      submitName:"",
      colorCode:"",
      markers: [
        {
          id: 0,
          latitude: 23.099994,
          longitude: 113.32452,
          width: 50,
          height: 50
        }
      ],
      polyline: [
        {
          points: [
            {
              longitude: 113.3245211,
              latitude: 23.10229
            },
            {
              longitude: 113.32452,
              latitude: 23.21229
            }
          ],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
        }
      ],
      controls: [
        {
          id: 1,
          position: {
            left: 0,
            top: 300 - 50,
            width: 50,
            height: 50
          },
          clickable: true
        }
      ],
      timer:null,
      time:""
    };
  },
  watch: {
    adress:{
      deep: true,
      handler: function(newVal, oldVal) {
        this.$nextTick(() => {
          this.adress = newVal;
        });
      }
    },
    clockInStatus:{
      deep: true,
      handler: function(newVal, oldVal) {
        this.$nextTick(() => {
          this.clockInStatus = newVal;
        });
      }
    },
    longitude: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.$nextTick(() => {
          this.longitude = newVal;
        });
      }
    },
    latitude: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.$nextTick(() => {
          this.latitude = newVal;
          // this.parentMessage = newVal
          //在下面进行一些赋值操作等
          // this.data = newVal.artificialCostList ? newVal.artificialCostList : ''
        });
      }
    },
    WorkShiftId:{
      deep: true,
      handler: function(newVal, oldVal) {
        console.log(newVal,'1213231');
        this.$nextTick(() => {
          this.WorkShiftId = newVal;
        });
      }
    },
    sessionkey:{
      deep: true,
      handler: function(newVal, oldVal) {
        this.$nextTick(() => {
          this.sessionkey = newVal;
        });
      }
    }
  },
  mounted(){
    let that = this;
    that.timer = setInterval(function() {
      console.log(timestr(),'------');
      timestr();
      that.time = timestr();
      console.log(that.time,'timestr');
    }, 1000);
  },
  onLoad() {
    // status 0:上班打卡1:下班打卡2:迟到打卡3:早退打卡4:外勤上班打卡5:外勤下班打卡6:迟到外勤打卡7:早退外勤打卡
    console.log(this.clockInStatus,'onload');

    if(this.clockInStatus==6){
      this.submitName = '迟到外勤打卡';
      this.colorCode = '#ff9237';
    }else if(this.clockInStatus==4){
      this.submitName = '外勤打卡';
      this.colorCode = '#65bfb4';
    }if(this.clockInStatus==5) {
      this.submitName = '外勤打卡';
      this.colorCode = '#65bfb4';
    }else if(this.clockInStatus==7){
      this.submitName = '早退外勤打卡';
      this.colorCode = '#65bfb4';
    }
  },
  methods: {
    regionchange(e) {
      console.log(e.type);
    },
    markertap(e) {
      console.log(e.detail.markerId);
    },
    controltap(e) {
      console.log(e.detail.controlId);
    },
    getExternalClockIn(){
      let data = {
        status:true,
        path:this.imgUrl,
        Description:this.Description
      }
      this.$emit('childFn',data);
      clearTimeout(this.timer);
    },
    getChooseImage(){
      let that = this;
      console.log(that.WorkShiftId,'AttendanceEmpId');
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          that.imgUrl = tempFilePaths[0];
          wx.uploadFile({
              url: "https://oawx.hnca.org.cn/rest?method="+'file.attachfiles.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.WorkShiftId+'&objTypeCode='+'30090',
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
  }
};
</script>
<style lang="scss" scopod>
@import '../../../static/css/icon.css';
page{
  // background: #fff;
}
  .wrap{
    .boxWrap{
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 24rpx 0;
      .row{
        padding: 10rpx 33rpx;
        .top{
          font-size: 31rpx;
          color: #333333;
          .l{
            font-size: 24rpx;
            color: #999999;
          }
          .c{
            font-size: 24rpx;
            color: #3399ff;
          }
        }
        .bottoms{
          font-size: 24rpx;
          color: #999999;
          margin-top: 20rpx;
          span{
            display: inline-block;
            color: #fff;
            width: 71rpx;
            height: 31rpx;
            line-height: 31rpx;
            text-align: center;
            border-radius: 16rpx;
            // background: #65bfb4;
          }
        }
      }
      .center{
        padding: 20rpx 33rpx;
        border-top: 2rpx solid #e4e4e4;
        border-bottom: 2rpx solid #e4e4e4;
        display: flex;
        align-items: center;
        .lBox{
          flex: 1;
          p{
            font-size: 24rpx;
            color: #333333;
          }
        }
        .rBox{
          p{
            width:105rpx;
            height:105rpx;
            background: #fff;
            border: 7rpx solid #e4e4e4;
            display: flex;
            justify-content: center;
            align-items: center;
            i{
              font-size: 60rpx;
              color: #999999;
            }
            img{
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .footer{
      width: 100%;
      position: fixed;
      bottom: 0;
      .box{
        padding: 28rpx 33rpx;
      }
    }
  }
</style>