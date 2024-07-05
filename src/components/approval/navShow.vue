<template>
  <div class="wraps">
    <div class="searchWrap" v-if="childShow==0">
      <div class="navs">
        <p>
          <van-search background="#f4f4f4" :value="searchValue" @change="changeSearch" placeholder="请输入搜索关键词" />
        </p>
        <p @click="getCancelBlock" v-if="searchValue==''">取消</p>
        <p @click="getSearch" v-else>搜索</p>
      </div>
      <!-- <div class="history">
        <div class="text">
          <p>搜索历史</p>
          <p>
            <i-icon type="close" size="20" color="#999999" />
          </p>
        </div>
        <div class="rowWrap">
          <p>崔曼</p>
          <p>补卡申请</p>
        </div>
      </div> -->
      <!-- <div class="activeCenter">
        <div class="box">
          <van-divider contentPosition="center">在这里可以搜索到</van-divider>
          <div class="iconWrap">
            <div class="icon">
              <p>
                <img src="https://oawx.hnca.org.cn/img/wechat/Scan.png" alt />
              </p>
              <p>审批标题</p>
            </div>
            <div class="icon">
              <p>
                <img src="https://oawx.hnca.org.cn/img/wechat/Scan.png" alt />
              </p>
              <p>审批状态</p>
            </div>
            <div class="icon">
              <p>
                <img src="https://oawx.hnca.org.cn/img/wechat/Scan.png" alt />
              </p>
              <p>审批时间</p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="screenWrap" v-if="childShow==1">
      <!-- <div class="navs">
        <p>
          <van-search background="#f4f4f4" :value="searchValue" placeholder="请输入搜索关键词" />
        </p>
        <p @click="getCancelScreen">取消</p>
      </div> -->
      <div class="contWrap">
        <div class="rowWrap" v-if="!isStatus">
          <div class="status">
            <span class="radius"></span>
            <span class="text">状态</span>
          </div>
          <div class="rowCont">
            <p class="tag" :class="{'active':statusIdx==index}" v-for="(item,index) in tagList" :key="index" @click="getChoiceStatus(index)">{{item}}</p>
          </div>
        </div>
        <div class="rowWrap">
          <div class="status">
            <span class="radius success"></span>
            <span class="text">类型</span>
          </div>
          <div class="collapse" v-for="(item,index) in optionList" :key="index">
            <div class="title" v-if="item.lengths>0" @click="item.lengths>4?getOpen(item,index):''">
              <p class="name">{{item.Name}}</p>
              <p class="text" v-if="item.lengths>4">{{item.isBook?'展开':'收起'}}</p>
            </div>
            <div class="contentWrap">
              <!-- <p class="item" :class="{'active':item.num==i}" v-for="(v,i) in item.isBook?item.array:item.Items" :key="i" @click="getOptions(item,index,v,i)">{{v.Name}}</p> -->
              <p class="item" :class="{'active':v.isBook}" v-for="(v,i) in item.isBook?item.array:item.Items" :key="i" @click="getOptions(item,index,v,i)">{{v.Name}}</p>
            </div>
          </div>  
        </div>

        
        <!-- <van-collapse :value="activeStatus" @change="changeCollapseStatus">
            <van-collapse-item :name="item.Id" v-for="(item,index) in statusList" :key="index">
                <view slot="title" class="title">{{item.Name}}</view>
                <div class="rowBox">
                    <p :class="{'active':statusNum==i}" v-for="(v,i) in item.Items" :key="i" @click="getOptionsStatus(v,i)">{{v.Name}}</p>
                </div>
            </van-collapse-item>
        </van-collapse>
        <van-collapse :value="activeNames" @change="changeCollapse">
          <van-collapse-item :name="item.Id" v-for="(item,index) in optionList" :key="index">
            <view slot="title" class="title">{{item.Name}}</view>
            <div class="rowBox">
              <p
                :class="{'active':processId==v.ProcessId}"
                v-for="(v,i) in item.Items"
                :key="i"
                @click="getOptions(item,index,v,i)"
              >{{v.Name}}</p>
            </div>
          </van-collapse-item>
          <van-collapse-item name="2">
            <view slot="title" class="title">审计处</view>
          </van-collapse-item>
        </van-collapse> -->
      </div>
      <div class="time">
          <van-field
              input-class="inp"
              :value="groupList"
              :readonly="true"
              clearable
              label="部门"
              icon="arrow"
              placeholder="请选择"
              @click="getDeparement"
          />
          <van-field
              input-class="inp"
              :value="designee.FullName"
              :readonly="true"
              clearable
              label="发起人"
              icon="arrow"
              placeholder="请选择"
              @click="getLanuchPeople"
          />
      </div>
      <div class="time">
        <picker mode="date" :value="startTime" @change="changeStartTime">
          <van-field
            input-class="inp"
            :value="startTime"
            :readonly="true"
            clearable
            label="开始时间"
            icon="arrow"
            placeholder="请选择"
          />
        </picker>
        <picker mode="date" :value="startTime" @change="changeEndTime">
          <van-field
            input-class="inp"
            :value="endTime"
            :readonly="true"
            clearable
            label="结束时间"
            icon="arrow"
            placeholder="请选择"
          />
        </picker>
      </div>
      <div class="bottom"  :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
        <van-button type="primary" color="#3399ff" block @click="getSubmit">确定</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
  name: "NavShow",
  props:['childShow','isStatus'],
  data() {
    return {
      num:"",
      searchValue:"",
      optionList:[
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                }
                
            ],
            activeNames: [],
            sessionkey:"",
            statusList:[
                {
                    Id:0,
                    Name:"状态",
                    Items:[
                        {
                            Id:0,
                            Name:"草稿"
                        },
                        {
                            Id:1,
                            Name:"流转中"
                        },
                        {
                            Id:2,
                            Name:"挂起"
                        },
                        {
                            Id:3,
                            Name:"已完成"
                        },
                        {
                            Id:4,
                            Name:"已终止"
                        },
                        {
                            Id:5,
                            Name:"退回"
                        },

                    ]
                }
            ],
            activeStatus:[],
            statusNum:-1,
            startTime:"",
            endTime:"",
            // processId:"",
            tagList:[
              '全部','审批通过','审批拒绝','审批中','已撤销','草稿'
            ],
            statusIdx:0,
            paramsData:[]
    };
  },
  onLoad(){
    this.sessionkey = wx.getStorageSync('sessionkey');
    this.getProcess();
  },
  computed:{
     ...mapState({
          designee:state=>{
              return state.mailList.designee;
          },
          groupList:state=>{
              return state.mailList.groupList.map(item=>{
                  return item.name;
              })
          },
          deptIds:state=>{
            return state.mailList.groupList.map(item=>{
                  return item.id;
              })
          }
      }),
      processId(){
        let temp = [];
        let str = '';
        this.paramsData.forEach(item=>{
          item.Items.forEach(v=>{
            temp.push(v)
          })
        })
        str = temp.join(',');
        return str;
      },
      statusCode(){
        let idx = '';
        idx = this.statusIdx==0?'-1':this.statusIdx==1?'3':this.statusIdx==2?'5':this.statusIdx==3?'1'
        :this.statusIdx==4?'4':'0';
        return idx;
      },
      isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
  },
  methods: {
    changeSearch(e){
      this.searchValue = e.mp.detail;
      this.$emit('childFn',true);
    },
    getSearch(){
      this.$emit('childFn',true);
    },
    getDeparement(){
        const url = '/pages/publics/pubGroup/main';
        wx.navigateTo({url:url});
    },
    getLanuchPeople(){
        const url = '/pages/publics/organizer/main';
        wx.navigateTo({url:url});
    },
    changeStartTime(e){
          this.startTime = e.mp.detail.value;
      },
      changeEndTime(e){
          this.endTime = e.mp.detail.value;
      },
      getChoiceStatus(index){
        this.statusIdx = index;
      },
      getOpen(item,index){
        console.log(item,index);
        item.isBook = !item.isBook;
      },
    // 筛选查询折叠面板列表
    getProcess(){
        this.$httpWX.get({
            url:this.$api.message.queryList,
            data:{
                method:"flow.process.all.list",
                SessionKey:this.sessionkey,
                search:''
            }
        }).then(res=>{
            console.log(res);
            this.optionList = res.data;
            this.optionList.forEach(item=>{
              this.$set(item,'isBook',true);
              this.$set(item,'num',0);
              // if(item.Items.lenght>4){
                if(item.Items.length>0){
                  // item.Items.unshift({
                  //   'Name':"全部"
                  // })
                // console.log(item.Items,'-----');
                }
                item.Items.forEach(v=>{
                  if(v.Name=='全部'){
                    this.$set(v,'isBook',true)
                  }else {
                    this.$set(v,'isBook',false)
                  }
                })
                const lengths = item.Items.length;
                this.$set(item,'lengths',lengths);
                item.array = item.Items.slice(0,4);
              // }else {
                // item.Items = item.Items;
              // }
            })
            console.log(this.optionList,'----')
            this.paramsData = this.optionList.map(item=>({
              Id:item.Id,
              Items:[]
            }));
        })
    },
    getOptions(item,index,v,i){
      console.log(v.ProcessId);
      item.num = i;
      v.isBook = !v.isBook;
      this.paramsData.forEach(one=>{
        if(one.Id==item.Id){
          const row = one.Items.find(row=>row==v.ProcessId);
          const idx = one.Items.findIndex(row=>row==v.ProcessId);
          console.log(row,'=====')
          if(row==undefined){
            one.Items.push(v.ProcessId);
          }else {
            one.Items.splice(idx,1);
          }
        }
      })
      console.log(this.paramsData);
      // console.log(JSON.stringify(this.paramsData),'paramsData')
      // console.log(v.idx,this.optionList,'-------');
      // this.processId = this.optionList[index].Items[i].ProcessId;

    },
    getCancelBlock() {
      this.$parent.childShow = '';
      this.$parent.isBlock = false;
    },
    changeCollapse(e){
      this.activeNames = e.mp.detail;
    },
    getCancelScreen(e){
      this.$parent.isBlock = false;
    },
    getSubmit(){
      this.$parent.isBlock = false;
      this.$emit('childFn',true);
    },
    changeCollapseStatus(e){
        this.activeStatus = e.mp.detail;
    },
    getOptionsStatus(item,index){
      this.statusNum = index;
    }

  }
};
</script>
<style lang="scss">
.wraps {
  .searchWrap {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99999;
    .navs {
      width: 100%;
      display: flex;
      background: #f4f4f4;
      border-bottom: 1rpx solid #e2e4e3;
      p:nth-child(1) {
        width: 80%;
      }
      p:nth-child(2) {
        width: 20%;
        text-align: center;
        font-size: 28rpx;
        color: #3399ff;
        text-align: center;
        margin-top: 30rpx;
      }
    }
    .history {
      width: 100%;
      background: #f4f4f4;
      padding: 30rpx 0;
      .text {
        padding: 0 30rpx;
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
        color: #999999;
      }
      .rowWrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 30rpx;
        p {
          background: #fff;
          border-radius: 20px;
          padding: 20rpx;
          font-size: 26rpx;
          align-items: center;
          margin-right: 10px;
          margin-top: 10px;
        }
      }
    }
    .activeCenter {
      background: #fff;
      border-top: 1rpx solid #e2e4e3;
      .box {
        padding: 50px;
      }
      .iconWrap {
        display: flex;
        .icon {
          flex: 1;
          p:nth-child(1) {
            width: 50rpx;
            height: 50rpx;
            margin: 0 auto;
            img {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
          p {
            font-size: 12px;
            color: #505050;
            text-align: center;
          }
        }
      }
    }
  }
  .screenWrap {
    // position: fixed;
    // height: 120vh;
    margin-bottom: 80px;
    margin-top: 85rpx;
    .navs {
      width: 100%;
      display: flex;
      background: #f4f4f4;
      border-bottom: 1rpx solid #e2e4e3;
      p:nth-child(1) {
        width: 80%;
      }
      p:nth-child(2) {
        width: 20%;
        text-align: center;
        font-size: 28rpx;
        color: #3399ff;
        text-align: center;
        margin-top: 30rpx;
      }
    }
    .contWrap {
      background: #fff;
      .rowWrap{
        padding: 0 34rpx;
          .status{
            padding: 20rpx 0;
            .radius{
              display: inline-block;
              width: 21rpx;
              height: 21rpx;
              background: #3399ff;
              border-radius: 50%;
            }
            .success{
              background: #39c1b3;
            }
            .text{
              color: #333333;
              font-size: 25rpx;
              margin-left: 10rpx;
            }
          }
          .rowCont{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .tag{
              width: 200rpx;
              height: 69rpx;
              line-height: 69rpx;
              text-align: center;
              // background: #dfeffe;
              background: #f4f4f4;
              font-size: 28rpx;
              color: #666666;
              border-radius: 7rpx;
              margin-bottom: 20rpx;
            }
            .active{
              background: #dfeffe;
              color: #3399ff;
            }
          }
          .collapse{
            .title{
              display: flex;
              justify-content: space-between;
              padding: 20rpx 0;
              .name{
                font-size: 33rpx;
                color: #333333;
                font-weight: bold;
              }
              .text{
                font-size: 26rpx;
                color: #999999;
              }
            }
            .contentWrap{
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              .item{
                width: 321rpx;
                height: 69rpx;
                line-height: 69rpx;
                border-radius: 7rpx;
                background: #f4f4f4;
                font-size: 28rpx;
                color: #333333;
                margin-bottom: 20rpx;
                padding-left: 20rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .item.active{
                background: #dbf5ec;
                color: #39c1b3;
              }
            }
          }
      }
      .title {
        font-size: 28rpx;
        font-weight: bold;
      }
      .rowBox {
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        padding: 10rpx 20rpx;
        p {
          width: 45%;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          background: #f4f4f4;
          color: #666666;
          border-radius: 10rpx;
          padding-left: 10rpx;
          margin: 10rpx 0;
        }
        p.active {
          background: #dbf5ec;
          color: #39c1b3;
        }
      }
    }
    .time {
      margin: 30rpx 0;
      .inp {
        text-align: right;
      }
    }
    .bottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      z-index: 999;
      background: #fff;
    }
  }
}
</style>