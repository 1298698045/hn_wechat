<template>
  <div class="todoList">
    <i-tabs :current="current" @change="handleChangeTab">
        <i-tab key="tab1" title="待办"></i-tab>
        <i-tab key="tab2" title="已完成"></i-tab>
        <i-tab key="tab3" title="我创建的"></i-tab>
    </i-tabs>    
    <div class="todolist_bd">
      <div class="box" v-for="(item,index) in listData" :key="index" @click="handleRoute(item)">
        <div class="left" @click.stop>
          <img :src="imgUrl+item.IssueType.iconUrl" alt="">
          <!-- <van-checkbox v-model="item.checked" shape="square" @change="(e)=>{changeCheckbox(e,item)}">
          </van-checkbox> -->
        </div>
        <div class="right">
          <p class="name">
            <span class="title">
              {{item.Subject.textValue}}
            </span>
            <span class="status" :class="statusStyle[item.StateCode.statusCategoryId-1]">
              {{item.StateCode.name}}
            </span>
          </p>
          <div class="desc">
            <p class="time" :class="{'active':currentTimer>item.timer && item.endTime}">
              <i class="iconfont icon-jiezhi"></i>
              <!-- {{item.startTime || ''}}
              <span v-if="item.startTime && item.endTime">~</span> -->
              {{item.endTime || '暂无截止时间'}}
            </p>
            <p class="level" v-if="item.PriorityCode && item.PriorityCode.name">
              {{item.PriorityCode.name}}
              <img :src="imgUrl+item.PriorityCode.iconUrl" alt="">
            </p>
          </div>
          <p class="project_name">
            <i class="iconfont icon-fenzu"></i>
            项目：{{item.RegardingObjectId.lookupValue.displayName || ''}}
          </p>
          <div class="project_name createBy">
            <i class="iconfont icon-canyuren"></i>
            报告人：
            <span>{{item.CreatedBy.userValue.displayName || ''}}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="clues-add-button"
      @click="handleAddTask"
      :class="{ active: isModelmes }"
    >
      <i class="iconfont icon-icon-add-3-copy"></i>
    </div>
  </div>
</template>
<script>
var moment = require('moment');
export default {
  name: "todoList",
  props: ['isModelmes'],
  data() {
    return {
      listData: [],
      pageNumber: 1,
      pageSize: 10,
      isPage: false,
      current: 'tab1',
      tag: 'neq',
      statusStyle: [
        'status1style',
        'status2style',
        'status3style',
        'status4style',
        'status5style',
        'status6style'
      ]
    };
  },
  computed:{
    sessionkey(){
      return wx.getStorageSync('sessionkey');
    },
    userId(){
      return wx.getStorageSync('userId');
    },
    year(){
      return new Date().getFullYear();
    },
    imgUrl(){
      return "https://oawx.hnca.org.cn/static/img";
    },
    currentTimer(){
      return new Date().getTime();
    }
  },
  onLoad(){
    console.log(this.currentTimer,'currentTimer')
    this.getQuery();
  },
  onShow(){
    
  },
  methods:{
    getTimer(str){
      return new Date(str.replace(/-/g,'/')).getTime();
    },
    handleChangeTab(e){
      this.current = e.mp.detail.key;
      if(this.current=='tab1'){
        this.tag = 'neq';
        this.getQuery();
      }else if(this.current == 'tab2'){
        this.tag = 'eq';
        this.getQuery()
      }else if(this.current == 'tab3'){
        this.tag = '';
        this.getQuery()
      }
    },
      getQuery(){
        var filterQuery = 'OwningUser\teq-userid'
        if(this.current == 'tab3'){
          filterQuery = 'CreatedBy\teq-userid'
        }
        filterQuery+='\n';
        if(this.tag=='eq'){
          filterQuery += 'StatusCategoryId\teq\t3'
        }else if(this.tag == 'neq'){
          filterQuery+='StatusCategoryId\tneq\t3'
        }
        let data = '\r\n--XXX';
        data += '\r\nContent-Disposition: form-data; name="filterQuery"'+
                '\r\n'+
                '\r\n'+filterQuery+
                '\r\n--XXX' 
        data+=
					'\r\nContent-Disposition: form-data; name="method"'+
					'\r\n'+
					'\r\n'+this.$api.task.list+
					'\r\n--XXX';
        data+=
					'\r\nContent-Disposition: form-data; name="SessionKey"'+
					'\r\n'+
					'\r\n'+this.sessionkey+
					'\r\n--XXX';
        data+=
					'\r\nContent-Disposition: form-data; name="pageSize"'+
					'\r\n'+
					'\r\n'+this.pageSize+
					'\r\n--XXX';
        data+=
					'\r\nContent-Disposition: form-data; name="pageNumber"'+
					'\r\n'+
					'\r\n'+this.pageNumber+
					'\r\n--XXX';
        data+=
					'\r\nContent-Disposition: form-data; name="objectTypeCode"'+
					'\r\n'+
					'\r\n'+4200+
					'\r\n--XXX';
				data += '--';
        this.$httpWX.post({
          url: this.$api.message.queryList,
          header: {
            'content-type': 'multipart/form-data; boundary=XXX'
          },
          data: data,
        }).then(res=>{
          let total = res.data.totalCount;
          if(this.pageNumber*this.pageSize < total){
            this.isPage = true;
          }else {
            this.isPage = false;
          }
          let result = [];
          if(this.pageNumber === 1){
            result = res.data.issues.nodes;
          }else {
            result = this.listData.concat(res.data.issues.nodes);
          }
          this.listData = result;
          this.listData.forEach(item=>{
            this.$set(item,'checked',false)
            // if(item.ScheduledStart.dateTime){
            //   let startYear = moment(item.ScheduledStart.dateTime).format('YYYY');
            //   var startTime = moment(item.ScheduledStart.dateTime).format('YYYY-MM-DD');
            //   if(startYear == this.year){
            //     console.log('item.ScheduledStart.dateTime',item.ScheduledStart.dateTime)
            //     startTime = moment(item.ScheduledStart.dateTime).format('MM-DD');
            //   }
            //   this.$set(item,'startTime',startTime);
            // }
            if(item.ScheduledEnd.dateTime){
              let endYear = moment(item.ScheduledEnd.dateTime).format('YYYY');
              var endTime = moment(item.ScheduledEnd.dateTime).format('YYYYMMDD');
              if(endYear == this.year){
                endTime = moment(item.ScheduledEnd.dateTime).format('MM-DD');
                this.$set(item,'endTime',endTime);
              }
              this.$set(item,'timer',this.getTimer(item.ScheduledEnd.dateTime))
            }
          })
        })
      },
      changeCheckbox(e,item){
        console.log(e,item);
        var checkbox = e.mp.detail;
        item.checked = checkbox;
      },
      handleAddTask(){
          wx.navigateTo({
            url: '/pages/task/create_task/main'
          })
      },
      handleRoute(item){
        wx.navigateTo({
          url: '/pages/task/detail_task/main?id='+item.id + '&projectId='+item.RegardingObjectId.lookupValue.value
        })
      }
  },
  // 下拉刷新
  onPullDownRefresh() {
      // this.current_scroll = '推荐';
      this.pageNumber = 1;
      this.getQuery();
      wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
      if(this.isPage){
          this.pageNumber++;
          this.getQuery();
      }
  }
};
</script>
<style lang="scss">
    @font-face {
        font-family: "iconfont";
        src: url(data:font/truetype;charset=utf-8;base64,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)
            format("truetype");
        font-weight: normal;
        font-style: normal;
    }

    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .icon-icon-add-3-copy:before {
        content: "\e691";
    }
    .clues-add-button.active{
        bottom: 100px;
    }
    .clues-add-button {
        position: fixed;
        right: 20px;
        // bottom: 80px;
        bottom: 40px;
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
    .todoList{
      .todolist_bd{
        padding: 0 20rpx;
        .box{
          background: #fff;
          border-radius: 15rpx;
          padding: 20rpx;
          box-sizing: border-box;
          margin-top: 20rpx;
          display: flex;
          .left{
            width: 50rpx;
            height: 50rpx;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .right{
            padding-left: 20rpx;
            flex: 1;
            .name{
              font-size: 32rpx;
              color: #333;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              .title{
                width: 80%;
              }
              .status{
                color: #333;
                font-weight: initial;
                font-size: 28rpx;
                width: 100rpx;
                text-align: center;
                height: 50rpx;
                line-height: 50rpx;
                border-radius: 5rpx;
              }
            }
            .desc{
              padding: 15rpx 0;
              display: flex;
              justify-content: space-between;
              font-size: 24rpx;
              color: #666666;
              .time{
                display: flex;
                align-items: center;
                i{
                  padding-right: 15rpx;
                }
              }
              .time.active{
                color: red;
              }
              .level{
                margin-left: 15rpx;
                img{
                  width: 30rpx;
                  height: 30rpx;
                  object-fit: cover;
                  margin-left: 10rpx;
                  vertical-align: middle;
                }
              }
            }
            .project_name{
              font-size: 24rpx;
              color: #666666;
              display: flex;
              align-items: center;
              i{
                padding-right: 15rpx;
              }
            }
            .project_name.createBy{
              padding-top: 15rpx;
            }
          }
        }
      }
    }
</style>