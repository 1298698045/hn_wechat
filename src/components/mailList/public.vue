<template>
  <div class="wrap">
    <div class="footer"  v-if="!isShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
      <div class="boxWrap">
        <p class="l" @click="getDetail">
          已选择:{{cc=='cc'?selectListNameCC.length:selectListName.length}}人
          <i-icon type="unfold" />
        </p>
        <p class="r" @click="getSubmit">确定</p>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState,mapGetters} from 'vuex';
export default {
    name:"Public",
    props:['total','sign','cc','admin','foldersId','RightCode','meetingId'],
    computed:{
      ...mapState({
        selectId:state=>{
          return state.mailList.selectId
        },
        selectListNameCC:state=>{
          return state.mailList.selectListNameCC
        },
        selectListName:state=>{
          return state.mailList.selectListName;
        }
      }),
      ...mapGetters([
        'doneTodos',
        'filterList'
      ]),
      isModelmes(){
          return wx.getStorageSync('isModelmes');
      },
    },
  data() {
    return {
      sessionkey:""
    };
  },
  onLoad(){
    this.sessionkey = wx.getStorageSync('sessionkey');
  },
  methods:{
    getDetail(){
      this.$parent.maxShow = true;
    },
    getSubmit(){
      console.log(this.sign,'123123');
      // admin 0: 共享文件添加权限 1: 日程详情添加参与人
      if(this.admin=="0"){
        this.$httpWX.get({
          url:this.$api.message.queryList,
          data:{
            method:this.$api.usb.fileAdmin,
            SessionKey:this.sessionkey,
            Id:this.foldersId,
            RightCode:this.RightCode,
            ObjectTypeCode:8,
            ObjectId:this.selectListName.map(item=>item.id).join(',')
          }
        }).then(res=>{
          console.log(res);
        })
      }else if(this.admin==1){
        this.$httpWX.get({
          url:this.$api.message.queryList,
          data:{
            method:this.$api.meeting.addPeople,
            SessionKey:this.sessionkey,
            invitee:this.selectListName.map(item=>item.id).join(','),
            meetingId:this.meetingId
          }
        }).then(res=>{
          console.log(res);
        })
      }
      if(this.sign=='release'||this.sign=='writeMail'||this.sign=='delta'){
        wx.navigateBack({
          delta: 2
        })
      }else {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
};
</script>
<style lang="scss">
.footer {
  width: 100%;
  position: fixed;
  bottom: 20rpx;
  background: #fff;
  z-index: 999;
  .boxWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 33rpx;
    .l {
      font-size: 29rpx;
      color: #3399ff;
    }
    .r {
      width: 207rpx;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 7rpx;
      font-size: 26rpx;
      color: #fff;
      background: #3399ff;
      text-align: center;
    }
  }
}
</style>