<template>
  <div class="wrap">
    <div class="rows" @click="getOpenModal">
      <div class="label">选择节点</div>
      <div class="icon">
        <span class="people">{{text}}</span>
        <van-icon name="add-o" color="#3399ff" size="20" />
      </div>
    </div>
    <div class="center">
      <div class="content" v-if="listData!=''&&!signShow">
        <van-checkbox-group :value="result" @change="onChange">
          <van-checkbox custom-class="checkbox" :name="item.UserId" v-for="(item,index) in listData" :key="index">{{item.UserIdName}}</van-checkbox>
          <!-- <van-checkbox custom-class="checkbox" name="b">复选框 b</van-checkbox>
          <van-checkbox custom-class="checkbox" name="c">复选框 c</van-checkbox> -->
        </van-checkbox-group>
      </div>
      <div class="btn" v-if="!signShow" @click="getAddPeople"><van-icon name="add-o" color="#3399ff" size="20" />添加办理人</div>
      <div class="textarea">
          <p>留言</p>
          <textarea v-model="description" name="" placeholder="请输入内容" id="" cols="30" rows="10"></textarea>
      </div>
    </div>
    <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
        <div class="btn">
            <van-button type="info" block @click="sign!=''?getToSetp():getComfire()">提交</van-button>
        </div>
    </div>
    <van-popup
      :show="show"
      position="center"
      custom-style="width:80%;height: auto;"
      @close="onClose"
      @cancel="onClose"
    >
    <div class="popupWrap">
      <Three ref="child" :list="list" :processId="processId" :processInstanceId="processInstanceId" :sessionkey="sessionkey" @detail="handleDetail"></Three>
      <div class="boxBtn">
        <p class="cancel" @click="onClose">取消</p>
        <p class="determine" @click="getSubmit">确定</p>
      </div>
    </div>
    </van-popup>
  </div>
</template>
<script>
import Three from '@/components/Three';
import { mapState } from 'vuex';
export default {
  components:{
    Three
  },
  data(){
    return {
      list:[
        {
          name:"组织架构"
        },
        {
          name:"技术部门"
        },
        {
          name:"技术部门"
        },
        {
          name:"技术部门"
        },
        {
          name:"技术部门"
        },
      ],
      processId:"",
      processInstanceId:"",
      show:false,
      text:'',
      result:[],
      listData:[],
      RuleLogId:"",
      sign:"",
      signShow:false
    }
  },
  computed:{
    sessionkey(){
      return wx.getStorageSync('sessionkey');
    },
    isModelmes(){
      return wx.getStorageSync('isModelmes');
    },
    ...mapState({
        selectListName:state=>{
            console.log(state.mailList.selectListName);
            return state.mailList.selectListName;
        }
    }),
  },
  onLoad(options){
    Object.assign(this.$data,this.$options.data());
    this.processId = options.processId;
    this.processInstanceId = options.processInstanceId;
    this.ToActivityId = options.ToActivityId;
    this.RuleLogId = options.RuleLogId;
    this.sign = options.sign; // 退回到指定节点判断
    if(options.sign){
      this.signShow = true;
      wx.setNavigationBarTitle({
        title: '退回到指定节点'
      })
    }else {
      this.signShow = false;
      wx.setNavigationBarTitle({
        title: '跳转'
      })
    }
    this.getQuery();
  },
  onShow(){
    console.log(this.selectListName,'selectListName')
    for(let i=0;i<this.selectListName.length;i++){
      let item = this.selectListName[i];
      this.listData.push({
        UserId:item.id,
        UserIdName:item.FullName
      })
      this.result.push(item.id)
    }
  },
  methods:{
    onChange(e){
      this.result = e.mp.detail;
    },
    getOpenModal(){
      this.show = true;
    },
    onClose(){
      this.text = '';
      this.$refs.child.num = -1;
      this.show = false;
    },
    handleDetail(item){
      this.text = item.text;
    },
    getAddPeople(){
      const url = '/pages/publics/mailList/main';
      wx.navigateTo({url:url});
    },
    getSubmit(){
      this.$httpWX.get({
          url:this.$api.message.queryList,
          data:{
              method:'process.step.participator.getlist',
              SessionKey:this.sessionkey,
              processId:this.processId,
              stepId:this.$refs.child.stepId,
              processInstanceId:this.processInstanceId
          }
      }).then(res=>{
        this.listData = res.Participantors;
        this.show = false;
      })
    },
    getQuery(){
      this.$httpWX.get({
          url:this.$api.message.queryList,
          data:{
              method:this.$api.instance.steptree,
              SessionKey:this.sessionkey,
              processId:this.processId,
          }
      }).then(res=>{
          this.GetFirstRow(res);
      })
    },
    GetFirstRow(data) {
        var newdata = [];
        var rows = data;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].pid == "") {
                // var item = rows[i];
                this.FormartData(rows, rows[i].id,0);
                // if (item.children.length > 0) {
                //     item.state = "closed";
                // }
                // newdata.push(item);
            }
        }
        this.list = rows;
        console.log(rows,'rows')
        // return newdata;
    },
    FormartData(data, pid,num) {
        num++;
        // var childrenitem = [];
        for (var j = 0; j < data.length; j++) {
            if (pid == data[j].pid) {
                // var item = data[j];
                // var item = JSON.parse(JSON.stringify(data[j]));
                this.FormartData(data, data[j].id,num);
                // if (item.children.length > 0) {
                //     item.state = "closed";
                // }
                data[j].num = num;
                // childrenitem.push(item);
            }
        }
        // return childrenitem;
    },
    getComfire(){
      let obj = {
        actions:[
          {
            params:{
              processId:this.processId,
              processInstanceId:this.processInstanceId,
              ruleLogId:this.RuleLogId,
              participators:this.result,
              description:this.description,
              fromActivityId:this.ToActivityId,
              toActivityId:this.$refs.child.stepId
            }
          }
        ]
      }
      console.log(obj,'obj');
      this.$httpWX.post({
          url:this.$api.message.queryList+'?method='+this.$api.instance.jump,
          data:{
              SessionKey:this.sessionkey,
              message:JSON.stringify(obj)
          }
      }).then(res=>{
          console.log(res);
          wx.navigateBack({
            delta:2
          })
      })
    },
    // 退回到指定节点
    getToSetp(){
      let obj = {
        actions:[
          {
            params:{
              processId:this.processId,
              processInstanceId:this.processInstanceId,
              ruleLogId:this.RuleLogId,
              description:this.description,
              fromActivityId:this.ToActivityId,
              toActivityId:this.$refs.child.stepId
            }
          }
        ]
      }
      console.log(obj,'obj');
      this.$httpWX.post({
          url:this.$api.message.queryList+'?method='+this.$api.approval.tostep,
          data:{
              SessionKey:this.sessionkey,
              message:JSON.stringify(obj)
          }
      }).then(res=>{
          console.log(res);
          wx.navigateBack({
            delta:2
          })
      })
    }
  }
}
</script>
<style lang="scss">
  .wrap{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .rows{
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 33rpx;
      color: #666666;
      background: #fff;
      margin-top: 15rpx;
      .icon{
        display: flex;
        align-items: center;
        .people {
          font-size: 31rpx;
          color: #333333;
          margin-right: 22rpx;
        }
        .round {
          width: 38rpx;
          height: 38rpx;
          line-height: 38rpx;
          text-align: center;
          border-radius: 50%;
          border: 2rpx solid #3399ff;
        }
      }
    }
    .boxWrap{
      background: #fff;
      padding:20rpx 32rpx;
      font-size: 28rpx;
      color: #666666;
      border-bottom: 1rpx solid #eaebeb;
      display: flex;
      flex-wrap: wrap;
    }
    .center{
      .content{
        background: #fff;
        padding: 20rpx 33rpx;
        .checkbox{
          padding: 20rpx 0 !important;
        }
      }
      margin-top: 16rpx;
      .node_wrap{
        background: #fff;
        p{
          font-size: 24rpx;
          padding: 40rpx 32rpx;
          border-bottom: 1rpx solid #e2e3e5;
        }
      }
      .mailList{
        background: #fff;
        margin-top: 16rpx;
        p{
          font-size: 24rpx;
          padding: 40rpx 32rpx;
          border-bottom: 1rpx solid #e2e3e5;
        }
      }
      .btn{
        text-align: center;
        padding: 20rpx 0;
        background: #fff;
        font-size: 28rpx;
        color: #3399ff;
        border-top: 1rpx solid #e2e3e5;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .textarea{
          padding: 20rpx;
          background: #fff;
          margin-top: 20rpx ;
          p{
              font-size: 28rpx;
              font-weight: bold;
          }
          textarea{
              height: 80px;
          }
      }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 20rpx;
        background: #fff;
        .btn{
            padding: 20rpx;
        }
    }
    .popupWrap{
      .boxBtn{
        display: flex;
        padding: 20rpx 0;
        border-top: 1rpx solid #e2e3e5;
        p{
          width: 50%;
          flex: 1;
          text-align: center;
        }
        .determine{
          color: #3399ff;
          border-left: 1rpx solid #e2e3e5;
        }
      }
    }
  }
</style>