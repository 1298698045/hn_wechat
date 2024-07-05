<template>
  <div class="wrap">
    <div class="navTabs">
      <van-tabs :active="current" color="#3399ff" @change="onChange">
        <van-tab title="发起提交"></van-tab>
        <van-tab title="查看数据"></van-tab>
      </van-tabs>
    </div>
    <div class="container" v-if="current==0">
      <div class="content">
        <div class="row">
          <p class="label">
            申请人
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              :disabled="true"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入申请人姓名'"
              v-model="userName"
            />
          </p>
        </div>
        <div class="row">
          <p class="label">
            所在部门
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              :disabled="true"
              v-model="DepName"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入申请部门'"
            />
          </p>
        </div>
        <picker @change="pickerLeave" :value="postIdx" range-key="label" :range="postList">
          <div class="row">
            <p class="label">
              岗位类别
              <span>*</span>
            </p>
            <p class="name">
              <span
                :class="postList[postIdx]?'active':''"
              >{{postList[postIdx]?postList[postIdx].label:'请选择'}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <picker mode="date" :value="GCRQ" @change="bindDateChange">
          <div class="row">
            <p class="label">
              公出日期
              <span>*</span>
            </p>
            <p class="name">
              <input
                type="text"
                :disabled="true"
                placeholder-style="text-align:right;color: #ababab;"
                selection-end="-1"
                placeholder="请选择公出日期"
                v-model="GCRQ"
              />
            </p>
          </div>
        </picker>

        <picker mode="date" :value="StartTime" @change="pickerStartTime">
          <div class="row">
            <p class="label">
              开始时间
              <span>*</span>
            </p>
            <p class="name">
              <input
                type="text"
                :disabled="true"
                placeholder-style="text-align:right;color: #ababab;"
                selection-end="-1"
                placeholder="请选择开始时间"
                v-model="StartTime"
              />
            </p>
          </div>
        </picker>
        <picker mode="date" :value="EndTime" @change="pickerEndTime">
          <div class="row">
            <p class="label">
              结束时间
              <span>*</span>
            </p>
            <p class="name">
              <input
                type="text"
                :disabled="true"
                placeholder-style="text-align:right;color: #ababab;"
                selection-end="-1"
                placeholder="请选择结束时间"
                v-model="EndTime"
              />
            </p>
          </div>
        </picker>
        <div class="row">
          <p class="label">
            公出时长
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              placeholder="请输入天数"
              v-model="LeaveDuration"
            />
          </p>
        </div>
      </div>
      <div class="leaveComment">
        <p>
          原因
          <span>*</span>
        </p>
        <div class="box">
          <textarea v-model="DD" name id cols="30" rows="10" placeholder="请输入原因"></textarea>
        </div>
      </div>
      <div class="leaveComment">
        <p>
          备注
        </p>
        <div class="box">
          <textarea v-model="BEZ" name id cols="30" rows="10" placeholder="请输入备注"></textarea>
        </div>
      </div>
      <div class="imgContent" v-if="false">
        <div class="head" @click="handleSelPhoto">
          <p>图片</p>
          <p>
            <i class="iconfont icon-tupian"></i>
          </p>
        </div>
        <div class="cont" v-if="imgList!=''">
          <p class="imgWrap" v-for="(item,index) in imgList" :key="index">
            <img :src="item" alt />
            <span class="close" @click="getCloseImg(index)">
              <i-icon type="close" color="#fff" size="12" />
            </span>
          </p>
        </div>
      </div>
      <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
          <div class="btn">
              <van-button type="info" block @click="getSubmit">提交</van-button>
          </div>
      </div>
      <ProcessModal ref="refProcess" :processId="ProcessId" :processIdName="processIdName"
     :RuleLogId="RuleLogId" :ProcessInstanceId="ProcessInstanceId" :describe="BEZ" />
    </div>
    <div class="dataWrap" v-if="current==1">
      <ShowData :objectType="30036" ref="child" />
    </div>
  </div>
</template>
<script>
import { getTotal } from '@/utils/iDays';
import ProcessModal from '@/components/approval/processModal';
import ShowData from '@/components/showData';
export default {
  components:{
    ProcessModal,
    ShowData
  },
  data() {
    return {
      multiIndex: [0, 0, 0, 0, 0],
      endMultiIndex: [0, 0, 0, 0, 0],
      StartTime: "",
      EndTime: "",
      imgList: [],
      address:"",
      current:0,
      postList:[],
      postIdx:'',
      ProcessId:"0b896e8f-6a53-4743-98a2-0fca2f56202b",
      Postcategory:"", // 岗位类别
      GCRQ:"",
      LeaveDuration:"",
      DD:"",
      BEZ:"",
      ProcessInstanceId:"",
      RuleLogId:"",
      processIdName:""
    };
  },
  computed: {
    userName(){
      return wx.getStorageSync('fullName');
    },
    DepName(){
      return wx.getStorageSync('businessUnitName');
    },
    sessionkey(){
      return wx.getStorageSync('sessionkey');
    },
    isModelmes(){
      return wx.getStorageSync('isModelmes');
    },
    time(){
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth()+1;
      let day = date.getDate();
      let h = date.getHours();
      let min = date.getMinutes();
      let s = date.getSeconds();
      return `${y}-${m}-${day} ${h}:${min}:${s}`;
    },
    UserId(){
      return wx.getStorageSync('userId');
    },
    DeptId(){
      return wx.getStorageSync('businessUnitId');
    }
  },
  onLoad(){
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let day = date.getDate();
    this.GCRQ = `${y}-${m}-${day}`;  
    this.queryType();
  },
  methods: {
    queryType(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          SessionKey:this.sessionkey,
          method:this.$api.public.leaveQuery,
          objectTypeCode:30036,
          name:"Postcategory"
        }
      }).then(res=>{
        this.postList = res;
      })
    },
    // 创建实例
    async getCreateExample(){
      let dataParams = {
          params:{
              recordRep:{
                  fields:{
                      ProcessId:this.ProcessId,
                      Name:'公出审批单'+wx.getStorageSync('businessUnitName') + ' ' + wx.getStorageSync('fullName'),
                      Deadline:1,
                      Priority:0
                  }
              }
          }
      }
      const ret = await this.$httpWX.post({
          url:this.$api.message.queryList+'?method='+this.$api.approval.create,
          method:this.$api.approval.create,
          data:{
              SessionKey:this.sessionkey,
              message:JSON.stringify(dataParams)
          }
      }).then(res=>{
          if(res.actions[0].state=='SUCCESS'){
              this.ProcessInstanceId = res.actions[0].returnValue.ProcessInstanceId;
              this.RuleLogId = res.actions[0].returnValue.RuleLogId;
              this.processIdName = res.actions[0].returnValue.Name;
          }
      })
      return ret;
    },
    getSubmit(){
      if(this.Postcategory==''){
          wx.showToast({
            title:"请选择岗位类别",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.GCRQ==''){
          wx.showToast({
            title:"请选择公出日期",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.StartTime==''){
          wx.showToast({
            title:"请选择开始时间",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.EndTime==''){
          wx.showToast({
            title:"请选择结束时间",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.LeaveDuration==''){
          wx.showToast({
            title:"请输入公出时长",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.DD==''){
          wx.showToast({
            title:"请输入原因",
            icon:"none",
            duration:2000
          })
          return false;
        }else {
          this.getCreateExample().then(res=>{
            let obj = {
                actions:[
                  {
                    params:{
                      processId:this.ProcessId,
                      ruleLogId:this.RuleLogId,
                      parentRecord:{
                        id:this.ProcessInstanceId,
                        objTypeCode:30036,
                        fields:{
                          ApplyUserId:{
                            Id:this.UserId
                          },
                          DeptId:{
                            Id:this.DeptId
                          },
                          Postcategory:this.Postcategory,
                          GCRQ:this.GCRQ,
                          StartTime:this.StartTime,
                          EndTime:this.EndTime,
                          LeaveDuration:this.LeaveDuration,
                          DD:this.DD,
                          BEZ:this.BEZ
                        }
                      }
                    }
                  }
                ]
              }
              this.$httpWX.post({
                  url:this.$api.message.queryList+'?method='+this.$api.approval.saverecord,
                  data:{
                      SessionKey:this.sessionkey,
                      message:JSON.stringify(obj)
                  }
              }).then(res=>{
                this.$refs.refProcess.agreeShow = true;
                this.$refs.refProcess.getStepQuery();
              })
          })
        }
    },
    onChange(e){
      this.current = e.mp.detail.index;
    },
    pickerLeave(e) {
      this.postIdx = e.mp.detail.value;
      this.Postcategory = this.postList[this.postIdx].value;
    },
    bindDateChange(e){
      console.log(e);
      this.GCRQ = e.mp.detail.value;
    },
    pickerStartTime(e) {
      this.StartTime = e.mp.detail.value;
    },
    pickerEndTime(e) {
      this.EndTime = e.mp.detail.value;
    },
    // 正则去除汉字
    RemoveChinese(strValue) {
      if (strValue != null && strValue != "") {
        var reg = /[\u4e00-\u9fa5]/g;
        return strValue.replace(reg, "");
      } else return "";
    },
    // 打开本地图库
    handleSelPhoto() {
      var that = this;
      wx.chooseImage({
        count: 9,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          console.log(res);
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          tempFilePaths.forEach(item => {
            this.imgList.push(item);
          });
          let url = `${that.$api.upload.url}?method=${that.$api.approval.upload}&SessionKey=${that.sessionkey}&pid=${that.ProcessInstanceId}&objTypeCode=${'30036'}`
          wx.uploadFile({
              url: url,
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                  'user': 'test'
              },
              success (res){
                  console.log(res);
                  const data = res.data
                  //do something
              }
          })
        }
      });
    },
    getCloseImg(index){
      this.imgList.splice(index,1);
    },
    getChooseLocation(){
      let that = this;
      wx.chooseLocation({
          success:res=>{
            console.log(res);
            that.address = res.address;
          },fail(error){

          }
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    if(this.current==1){
      this.$refs.child.pageNumber = 1;
      this.$refs.child.getQuery();
    }
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.current==1){
      if(this.$refs.child.isPage){
        this.$refs.child.pageNumber++;
        this.$refs.child.getQuery();
      }
    }
  }
};
</script>
<style lang="scss" scopod>
@import '../../../../static/css/icon.css';
.wrap {
  padding-bottom: 100px;
  .rowWrap {
    display: flex;
    justify-content: space-between;
    padding: 34rpx 33rpx;
    background: #fff;
    margin-top: 35rpx;
    .label {
      color: #666666;
      font-size: 32rpx;
      span {
        color: #ff6666;
      }
    }
    .name {
      span {
        font-size: 31rpx;
        color: #ababab;
      }
      span.active {
        color: #333333;
      }
    }
  }
  h3 {
    padding: 31rpx 33rpx;
    color: #3399ff;
    font-size: 26rpx;
  }
  .content {
    background: #fff;
    .row {
      display: flex;
      justify-content: space-between;
      padding: 34rpx 33rpx;
      background: #fff;
      border-bottom: 1rpx solid #e2e3e5;
      .label {
        color: #666666;
        font-size: 32rpx;
        span {
          color: #ff6666;
        }
      }
      .name {
        display: flex;
        align-items: center;
        span {
          font-size: 31rpx;
          color: #ababab;
        }
        span.active {
          color: #333333;
        }
        input {
          font-size: 31rpx;
          text-align: right;
          margin-right: 20rpx;
        }
      }
    }
    .rowBottom {
      padding: 20rpx 33rpx;
      // border-top: 2rpx solid #eaebeb;
      p {
        font-size: 26rpx;
        color: #ababab;
        span {
          color: #3399ff;
          margin-left: 10rpx;
        }
      }
    }
  }
  .leaveComment {
    padding: 34rpx 33rpx;
    background: #fff;
    margin: 35rpx 0;
    p {
      font-size: 32rpx;
      color: #666666;
      span {
        color: #ff6666;
      }
    }
    .box {
      textarea {
        height: 100rpx;
        font-size: 31rpx;
        color: #333333;
      }
    }
  }
  .imgContent {
    background: #fff;
    margin-bottom: 20rpx;
    .head {
      font-size: 28rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 33rpx;
      color: #666666;
      .iconfont {
        color: #3399ff;
      }
    }
    .cont {
      padding: 20rpx;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      // flex-direction: row;
      .imgWrap {
        width: 100rpx;
        height: 100rpx;
        position: relative;
        margin-right: 20rpx;
        margin-top: 10rpx;
        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          border-radius: 7rpx;
        }
        // .close{
        //     position: absolute;
        //     top: -10rpx;
        //     right: -10rpx;
        // }
        .close {
          display: inline-block;
          width: 33rpx;
          height: 33rpx;
          line-height: 33rpx;
          text-align: center;
          background: #9c9c9c;
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          border-radius: 50%;
          opacity: 0.8;
        }
      }
    }
  }
  .footer{
        width: 100%;
        position: fixed;
        bottom: 20rpx;
        background: #fff;
        z-index: 9999;
        .btn{
            padding: 20rpx;
        }
    }
}
</style>