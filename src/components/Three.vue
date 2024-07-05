<template>
    <div class="wrap">
        <div class="box_wrap">
            <div class="list-item" v-for="(item, index) in list" :key="index">
                <div class="item-name">
                    <span v-for="(v,idx) in item.num" :key="idx">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span @click="getDetail(item,index)" class="text" :class="{'active':num==index}">{{item.text}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "Three",
  props: {
    list: Array,
    processId:String,
    processInstanceId:String,
    sessionkey:String
  },
  data(){
      return {
          num:-1,
          stepId:""
      }
  },
  methods:{
    getDetail(item,index){
        this.num = index;
        this.stepId = item.id;
        this.$emit('detail',item);
    },
  }
};
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .box_wrap{
            width: 100%;
            height: 100px;
            overflow-y:scroll;
            overflow-x:scroll;
            margin: 20rpx;
            .list-item{
                background: #fff;
                .text.active{
                    color: #3399ff;
                }
            }
        }
    }
</style>