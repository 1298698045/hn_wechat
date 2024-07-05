<template>
    <div class="wrap">
        <div class="position" v-if="info.stateCode!=0">
            <img v-if="info.stateCode==1" src="https://oawx.hnca.org.cn/img/wechat/04.9.1.2.Adopt.png" alt="">
            <img v-if="info.stateCode==2" src="https://oawx.hnca.org.cn/img/wechat/04.9.1.2.Refuse.png" alt="">
        </div>
        <div class="header">
            <div class="lBox">
                <p>{{info.owningUserName}}</p>
            </div>
            <div class="rBox">
                <p>{{info.owningUserName}}</p>
                <p class="dai" v-if="info.stateCode==0">等待{{info.owningUserName}}审批</p>
                <p class="agree" v-if="info.stateCode==1">审批通过</p>
                <p class="refuse" v-if="info.stateCode==2">审批被拒绝</p>
            </div>
        </div>
        <div class="content">
            <div class="row">
                <p class="label">
                    所在部门
                </p>
                <p class="cont">
                    {{''}}
                </p>
            </div>
            <div class="row">
                <p class="label">
                    会议标题
                </p>
                <p class="cont">
                    {{info.subject}}
                </p>
            </div>
            <div class="row">
                <p class="label">
                    会议室
                </p>
                <p class="cont">
                   {{info.resourceIdName}}
                </p>
            </div>
            <div class="row">
                <p class="label">
                    开始时间
                </p>
                <p class="cont">
                    {{info.scheduledStart}}
                </p>
            </div>
            <div class="row">
                <p class="label">
                    结束时间
                </p>
                <p class="cont">
                    {{info.scheduledEnd}}
                </p>
            </div>
            <div class="row">
                <p class="label">
                    预约人
                </p>
                <p class="cont">
                    {{info.owningUserName}}
                </p>
            </div>
            <div class="row">
                <p class="label">
                    参会人数
                </p>
                <p class="cont">
                    {{info.peopleQty || ''}}
                </p>
            </div>
        </div>
        <div class="center">
           <div class="steps">
               <div class="step">
                   <p class="radius">{{info.owningUserName}}</p>
                   <p class="pactive"></p>
               </div>
               <div class="middle">
                   <p>{{info.owningUserName}}  发起申请</p>
               </div>
               <div class="time">
                   <p>{{info.createdOn}}</p>
               </div>
           </div>
           <div class="steps" v-for="(item,index) in info.approvers" :key="index">
               <div class="step">
                   <p class="radius">{{item.approverName}}</p>
                   <!-- <p class="pactive"></p> -->
                   <p class="tag">
                       主管理员
                   </p>
               </div>
               <div class="middle">
                   <p>{{item.approverName}}  <span :style="info.stateCode==1?'color:#39c1b3;':info.stateCode==2?'color:#ff6666;':''">{{info.stateCode==0?'审批中':info.stateCode==1?'审批通过':info.stateCode==2?'审批拒绝':''}}</span></p>
               </div>
               <div class="time">
                   <p>{{item.approverOn}}</p>
               </div>
           </div>
        </div>
        <!-- <div class="footer">
            <div class="boxWrap">
                <div class="box">
                    <p>
                        <i-icon type="refresh" color="#666666" size="20" />
                    </p>
                    <p class="name">返回</p>
                </div>
                <div class="box">
                    <p><i-icon type="brush_fill" color="#666666" size="20" /></p>
                    <p class="name">修改</p>
                </div>
                <div class="box">
                    <p><i-icon type="trash" color="#666666" size="20" /></p>
                    <p class="name">删除</p>
                </div>
            </div>
        </div> -->
        <div class="adminFooter" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="boxWrap">
                <div class="lBox">
                    <!-- <div class="box">
                        <p>
                            <i class="iconfont icon-bianji2"></i>
                            <i-icon type="refresh" color="#666666" size="20" />
                        </p>
                        <p class="name">返回</p>
                    </div> -->
                <div class="box" @click="getEdit">
                    <p>
                        <i class="iconfont icon-bianji2"></i>
                        <!-- <i-icon type="brush_fill" color="#666666" size="20" /> -->
                    </p>
                    <p class="name">修改</p>
                </div>
                <!-- <div class="box">
                    <p>
                        <i class="iconfont icon-pinglun"></i>
                    </p>
                    <p class="name">评论</p>
                </div> -->
                <div class="box" @click="getDelete">
                    <p>
                        <i class="iconfont icon-shanchu"></i>
                        <!-- <i-icon type="trash" color="#666666" size="20" /> -->
                    </p>
                    <p class="name">删除</p>
                </div>
                </div>
                <div class="rBox">
                    <p>
                        <span class="refuse" @click="getRefuse(2)">拒绝</span><span class="agree" @click="getAgree(1)">同意</span>
                    </p>
                </div>
            </div>
        </div>
        <van-popup
            :show="showModal"
            position="center"
            custom-style="width:80%;height: auto;border-radius:7rpx;"
            @close="onClose"
        >
            <div class="showModal">
                <div class="cont">
                    <p class="cancel">原因：</p>
                    <input type="text" v-model="Description" placeholder="请输入原因">
                </div>
                <div class="btn">
                    <p class="no" @click="getNo">暂不</p>
                    <p @click="getSubmit">确定</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data(){
        return {
            id:"",
            info:{},
            showModal:false,
            Description:"",
            status:"",
            sessionkey:""
        }
    },
    onShow(){
        this.getQuery();
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.id;
        this.getQuery().then(()=>{
            wx.setNavigationBarTitle({
                title: `${this.info.owningUserName}提交的会议室审批`
            })
        });
    },
    methods:{
       async getQuery(){
           let response = await this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.get",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:"20035",
                    Id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data;
                response = res;
                return response;
            })
        },
        getRefuse(i){
            this.status = i;
            this.showModal = true;
        },
        getAgree(i){
            this.status = i;
            this.getSubmit();
            // this.showModal = true;
        },
        onClose(){
            this.showModal = false;
        },
        getNo(){
            this.showModal = false;
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meetingroom.reservation.approve",
                    SessionKey:this.sessionkey,
                    Id:this.id,
                    status:this.status,
                    Description:this.Description
                }
            }).then(res=>{
                console.log(res);
                this.showModal = false;
                this.getQuery();
            })
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"resource.roomorder.delete",
                    SessionKey:this.sessionkey,
                    Id:this.id
                }
            }).then(res=>{
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000
                })
            })
        },
        getEdit(){
            const url = '/pages/conferenceRoom/appointment/main?id='+this.info.id;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/conference.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .position{
            width: 260rpx;
            height: 260rpx;
            position: absolute;
            top: 0;
            right: 33rpx;
            img{
                width: 100%;
                height: 100%;
                vertical-align: middle;
            }
        }
        .header{
            width: 100%;
            padding: 20rpx 33rpx;
            display: flex;
            background: #fff;
            border-bottom: 2rpx solid #eceeed;
            .lBox{
                p{
                    width: 72rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    text-align: center;
                    border-radius: 50%;
                    background: #3399ff;
                    color: #fff;
                    font-size: 22rpx;
                }
            }
            .rBox{
                margin-left: 20rpx;
                p:nth-child(1){
                    font-size: 33rpx;
                    color: #333333;
                }
                .dai{
                    font-size: 26rpx;
                    color: #d49746;
                }
                .agree{
                    font-size: 26rpx;
                    color: #999999;
                }
                .refuse{
                    font-size: 26rpx;
                    color: #999999;
                }
            }
        }
        .content{
            background: #fff;
            .row{
                display: flex;
                padding: 10rpx 33rpx;
                .label{
                    width: 133rpx;
                    font-size: 29rpx;
                    color: #999999;
                }
                .cont{
                    margin-left: 20rpx;
                    font-size: 29rpx;
                    color: #333333;
                }
            }
        }
        .center{
            margin-top: 35rpx;
            background: #fff;
            padding: 33rpx;
            .steps{
                display: flex;
                .step{
                    width: 100rpx;
                    .radius{
                        width: 62rpx;
                        height: 62rpx;
                        line-height: 62rpx;
                        font-size: 21rpx;
                        text-align: center;
                        color: #fff;
                        border-radius: 50%;
                        background: #3399ff;
                    }
                    .pactive{
                        width: 10px;
                        height: 50rpx;
                        border-right:1px dashed #cccccc ;
                        margin-left: 8rpx;
                    }
                    .tag{
                        width: 83rpx;
                        height: 33rpx;
                        line-height: 33rpx;
                        text-align: center;
                        font-size: 18rpx;
                        color: #3399ff;
                        background: #e4f5ff;
                        margin-left: -10rpx;
                    }
                }
                .middle{
                    flex: 1;
                    margin-left: 20rpx;
                    font-size: 28rpx;
                    color: #666666;
                    margin-top: 10rpx;
                    p{
                        span{
                            color: #d49746;
                        }
                    }
                }
                .time{
                    font-size: 24rpx;
                    color: #999999;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxWrap{
                display: flex;
                padding: 10rpx 0;
                .box{
                    flex: 1;
                    text-align: center;
                    .name{
                        font-size: 21rpx;
                        color: #666666;
                    }
                }
            }
        }
        .adminFooter{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxWrap{
                display: flex;
                padding: 10rpx 0;
                .lBox{
                    width: 50%;
                    display: flex;
                    align-items: center;
                    .box{
                        flex: 1;
                        text-align: center;
                        i{
                            color: #666666;
                        }
                        .name{
                            font-size: 21rpx;
                            color: #666666;
                        }
                    }
                }
                .rBox{
                    p{
                        span{
                            display: inline-block;
                            width: 160rpx;
                            height: 75rpx;
                            line-height: 75rpx;
                            text-align: center;
                            background: #3399ff;
                            color: #fff;
                            font-size: 32rpx;
                        }
                        .refuse{
                            border:7rpx solid #bebfc3;
                            border-right: none;
                            border-top-left-radius: 7rpx;
                            border-bottom-left-radius: 7rpx;
                            background: #fff;
                            color: #3399ff;
                        }
                        .agree{
                            border: 7rpx solid #3399ff;
                            border-left: none;
                            border-top-right-radius: 7rpx;
                            border-bottom-right-radius: 7rpx;
                        }
                    }
                }
            }
        }
        .showModal{
                .cont{
                    padding: 33rpx;
                    .cancel{
                        font-size: 23rpx;
                        color: #999999;
                    }
                    .text{
                        font-size: 33rpx;
                        color: #333333;
                    }
                    .cen{
                        padding: 10rpx 0;
                    }
                }
                .btn{
                    display: flex;
                    border-top: 2rpx solid #eaeeed;
                    p{
                        flex: 1;
                        height: 108rpx;
                        line-height: 108rpx;
                        text-align: center;
                        font-size: 31rpx;
                        color: #3399ff;
                    }
                    .no{
                        border-right: 1rpx solid #eaeeed;
                    }
                }
            }
    }
</style>