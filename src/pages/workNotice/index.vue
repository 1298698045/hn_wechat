<template>
    <div class="wrap">
        <div class="center" v-for="(item,index) in list" :key="index">
            <div class="time">
                {{item.date}}
            </div>
            <div class="content" v-for="(v,i) in item.list" :key="i">
                <div class="head">
                    <img src="" alt="">
                </div>
                <div class="rBox">
                    <p class="title">{{v.Subject}}</p>
                    <div class="cont_box">
                        <p class="name">{{v.Subject}}</p>
                        <p class="text">{{v.MsgContent}}</p>
                        <p class="approval">手术医师手术权限申请审批</p>
                        <p class="info spacing">催办人：{{v.FromUserIdName}}</p>
                        <p class="info">部门：信息中心</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list:[],
            pageSize:50,
            pageNumber:1
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
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.notice.query,
                    SessionKey:this.sessionkey,
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber
                }
            }).then(res=>{
                console.log(res);
                let list = res.listData;
                let temp = [];
                list.forEach(item=>{
                    let date = item.CreatedOn.substr(0,10);
                    temp.push({
                        date:date,
                        list:[]
                    })
                })
                
                console.log(this.unique(temp));
                let array = this.unique(temp);
                for(let i=0;i<array.length;i++){
                    for(let j=0; j<list.length;j++){
                        let date = list[j].CreatedOn.substr(0,10);
                        if(array[i].date==date){
                            array[i].list.push(list[j])
                        }
                    }
                }
                this.list = array;
                console.log(array,'array')
            })
        },
        unique(arr) { // 根据唯一标识orderId来对数组进行过滤
　　　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
　　　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
　　　　　　return arr.filter((arr) => !res.has(arr.date) && res.set(arr.date, 1)) 
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            padding: 35rpx 17rpx;
            .time{
                width: 219rpx;
                text-align: center;
                font-size: 24rpx;
                color: #ffffff;
                background: #cecece;
                padding: 10rpx 0;
                border-radius: 5rpx;
                margin: 0 auto;
            }
            .content{
                display: flex;
                margin-top: 20rpx;
                .head{
                    width: 83rpx;
                    height: 83rpx;
                    border-radius: 50%;
                    background: #3399ff;
                }
                .rBox{
                    flex: 1;
                    margin-left: 22rpx;
                    .title{
                        font-size: 25rpx;
                        color: #505050;
                        padding: 10rpx 0;
                    }
                    .cont_box{
                        width: 551rpx;
                        padding: 28rpx;
                        background: #fff;
                        border-radius: 5rpx;
                        .name{
                            font-size: 32rpx;
                            color: #3399ff;
                        }
                        .text{
                            font-size: 28rpx;
                            color: #333333;
                            font-weight: bold;
                            padding: 10rpx 0;
                        }
                        .approval{
                            font-size: 33rpx;
                            color: #333333;
                        }
                        .info{
                            font-size: 28rpx;
                            color: #999999;
                        }
                        .info.spacing{
                            padding: 10rpx 0;
                        }
                    }
                }
            }
        }
    }
</style>