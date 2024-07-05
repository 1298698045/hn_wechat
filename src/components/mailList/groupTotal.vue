<template>
  <div class="wrap">
    <div class="footer">
      <div class="boxWrap">
        <p class="l" @click="getDetail">
          已选择:{{groupLength}}
          <i-icon type="unfold" />
        </p>
        <p class="r" @click="getSubmit">确定</p>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
    name:"GroupTotal",
    data(){
        return {

        }
    },
    computed:{
        ...mapState({
            groupLength:state=>{
                return state.mailList.groupLength;
            }
        })
    },
    methods:{
        getSubmit(){
            this.$emit('childFn');
        }
    }
}
</script>
<style lang="scss">
.footer {
  width: 100%;
  position: fixed;
  bottom: 20rpx;
  background: #fff;
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