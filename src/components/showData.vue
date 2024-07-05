<template>
    <div>
        <div class="search">
            <van-search :value="searchValue" placeholder="搜索标题、编号、正文内容"  @change="changeSearch" />
        </div>
        <div class="contentList">
            <div class="box_wrap" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                <div class="row">
                    <p class="title">{{item.Name}}</p>
                    <div class="time">{{item.CreatedOn||''}}</div>
                </div>
                <div class="tagFot">
                    <p class="tag">
                    <span>{{item.newName}}</span>
                    由{{item.CreatedByName}}提交
                    </p>
                    <p class="status">
                        {{item.StateCode==1?'审批中':item.StateCode==3?'已通过':item.StateCode==5?'已拒绝':item.StateCode==4?'已撤销':item.StateCode==0?'草稿':item.StateCode==2?'挂起':''}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"Showdata",
    props:['objectType'],
    data(){
        return {
            list:[],
            isPage:false,
            searchValue:"",
            pageNumber:1,
            pageSize:10
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onLoad(){
        this.getQuery();
    },
    methods:{
        getDetail(item){
            const url = '/pages/hr/detail/main?instanceId='+item.ProcessInstanceId;
            wx.navigateTo({url:url});
        },
        changeSearch(e){
            this.searchValue = e.mp.detail;
            this.getQuery();
        },
        // 查看数据
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"process.instanceowner.search",
                    SessionKey:this.sessionkey,
                    objectType: this.objectType,
                    search: this.searchValue,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                }
            }).then(res=>{
                let total = res.total;
                if(this.pageNumber*this.pageSize<=total){
                    this.isPage = true;
                }else {
                    this.isPage = false;
                }
                let temp = [];
                if(this.pageNumber==1){
                    temp = res.listData;
                }else {
                    temp = this.list.concat(res.listData);
                }
                this.list = temp;
                this.list.map(item=>{
                    if(item.CreatedByName.length>2){
                        item.newName = item.CreatedByName.substr(1);
                    }else {
                        item.newName = item.CreatedByName;
                    }
                    return item;
                })
                console.log(this.list,'list')
            })
        },
    }
}
</script>
<style lang="scss">
    .contentList{
      padding: 0 20rpx;
      .box_wrap{
        width: 100%;
        height: auto;
        background: #fff;
        box-shadow: 0 2rpx 6rpx 0 rgba(0,0,0,.06);
        margin-top: 20rpx;
        padding: 25rpx 20rpx;
        border-radius: 10rpx;
        .row{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15rpx;
          .title{

          }
          .time{
            font-size: 20rpx;
            color: #ababab;
          }
        }
        .desc{
          font-size: 24rpx;
          color: #ababab;
        }
        .tagFot{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15rpx;
          .tag{
            display: flex;
            align-items: center;
            span{
              display: inline-block;
              width: 40rpx;
              height: 40rpx;
              line-height: 40rpx;
              text-align: center;
              background: #3399ff;
              color: #fff;
              font-size: 14rpx;
              margin-right: 10rpx;
            }
          }
          .status{
            color: #3399ff;
          }
        }
      }
    }
</style>