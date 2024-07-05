<template>
    <div class="wrap">
        <div class="navHeader">
            <!-- <p>
                <span class="l" :class="{'active':isShow}" @click="getTab(0)">执行记录</span>
                <span class="r" :class="{'active':!isShow}"  @click="getTab(1)">流程图</span>
            </p> -->
        </div>
        <div class="content" v-for="(item,index) in list" :key="index">
            <div class="leftBox">
                <p class="ra">
                    <span></span>
                </p>
                <p class="line">
                    <span></span>
                </p>
            </div>
            <div class="rightBox">
                <div class="row">
                    <p class="h3_time">{{item.CreatedOn}}</p>
                    <p class="status">{{item.statusName}}</p>
                </div>
                <div class="boxWrap">
                    <p class="title">{{item.ToActivityName}}</p>
                    <p class="name">
                        <span class="label">提交人：</span>
                        <span class="val">{{item.CreatedByName || ''}}</span>
                    </p>
                    <p class="name top">
                        <span class="label">办理人：</span>
                        <span class="val">{{item.BusinessUnitIdName}}  {{item.CreatedByName}}</span>
                    </p>
                    <p class="name top">
                        <span class="label">处理方式：</span>
                        <span>{{item.SourceType}}</span>
                    </p>
                    <p class="name top">
                        <span class="label">耗时：</span>
                        <span class="val">{{item.TimeCost || ''}}</span>
                    </p>
                    <p class="name top">
                        <span class="label">办理时间：</span>
                        <span class="val">{{item.ModifiedOn || ''}}</span>
                    </p>
                    <p class="name top">
                        <!-- 处理意见 -->
                        <span class="label">留言：</span>
                        <span class="val">{{item.Description}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'process',
    props:['processInstanceId'],
    data(){
        return {
            sessionkey:"",
            list:[],
            isShow:true
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.process.rulelog.getlist",
                    SessionKey:this.sessionkey,
                    processInstanceId:this.processInstanceId
                }
            }).then(res=>{
                console.log(res);
                this.list = res.rows;
                this.list.map(item=>{
                    // const name = item.StateCode == 0 ?'草稿':item.StateCode == 1?'流转中':
                    // item.StateCode == 2 ? '挂起' :item.StateCode == '3'?'已完成':item.StateCode==4?'已终止'
                    // :item.StateCode == 5 ? '退回' :'';
                    const name = item.StateCode == 0 ? '未办理' : item.StateCode == 2 ? '已办理' : '';
                    item.statusName = name;
                    return item;
                })
            })
        },
        getTab(i){
            if(i==0){
                this.isShow = true;
            }else {
                this.isShow = false;
            }
        }
    }
}
</script>
<style lang="scss">
page{
    // background: #fff;
}
    .wrap{
        padding-bottom: 50rpx;
        .navHeader{
            display: flex;
            justify-content: center;
            margin: 31rpx 0;
            p{
                span{
                    display: inline-block;
                    width: 138rpx;
                    height: 58rpx;
                    line-height: 58rpx;
                    font-size: 28rpx;
                    text-align: center;
                }
                .l{
                    background: #fff;
                    color: #3399ff;
                    border-top-left-radius: 5rpx;
                    border-bottom-left-radius: 5rpx;
                    border: 1px solid #3399ff;
                    border-right: none;
                }
                .r{
                    background: #fff;
                    color: #3399ff;
                    border-top-right-radius: 5rpx;
                    border-bottom-right-radius: 5rpx;
                    border:1px solid #3399ff;
                    box-shadow: border-box;
                    border-left: none;
                }
                .l.active{
                    background: #3399ff;
                    color: #fff;
                }
                .r.active{
                    background: #3399ff;
                    color: #fff;
                }
            }
        }
        .content{
            display: flex;
            padding: 0 43rpx;
            margin-bottom: -10rpx;
            .leftBox{
                .ra{
                    width: 35rpx;
                    height: 35rpx;
                    border-radius: 50%;
                    border:1rpx solid #3399ff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span{
                        display: inline-block;
                        width: 16rpx;
                        height: 16rpx;
                        background: #3399ff;
                        border-radius: 50%;
                    }
                }
                .line{
                    text-align: center;
                    span{
                        display: inline-block;
                        width: 2rpx;
                        height: 550rpx;
                        background: #3399ff;
                    }
                }
            }
            .rightBox{
                flex: 1;
                margin-left: 43rpx;
                .row{
                    display: flex;
                    justify-content: space-between;
                    .h3_time{
                        font-size: 24rpx;
                        color: #999999;
                    }
                    .status{
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
                .boxWrap{
                    width: 100%;
                    // height: 201rpx;
                    background: #fff;
                    border-radius: 14rpx;
                    margin-top: 31rpx;
                    border: 1rpx solid #e2e4e3;
                    box-shadow: border-box;
                    .title{
                        background: #f2f2f2;
                        font-size: 24rpx;
                        color: #999999;
                        // height: 42rpx;
                        // line-height: 42rpx;
                        padding:14rpx 21rpx;
                    }
                    .name{
                        padding: 19rpx 21rpx;
                        color: #666666;
                        font-size: 28rpx;
                        .label{
                            display: inline-block;
                            width: 160rpx;
                        }
                        .val{
                            color: #333333;
                        }
                    }
                    .top{
                        border-top: 1rpx solid #e2e4e3;
                        box-shadow: border-box;
                    }
                }
            }
        }
    }
</style>