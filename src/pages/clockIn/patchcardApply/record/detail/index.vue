<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <div class="l">
                    <p>崔曼</p>
                </div>
                <div class="r">
                    <p>崔曼</p>
                    <p>等待我审批</p>
                </div>
            </div>
            <div class="rowWrap">
                <div class="l">
                    <p>缺卡原因</p>
                </div>
                <div class="r">
                    <p>2019-05-13,星期一,默认班次,上班时间9:00 补卡时间9:00</p>
                    <!-- <p></p> -->
                </div>
                <div class="icon">
                    <i-icon type="enter" color="#cccccc" />
                </div>
            </div>
            <div class="rowBottom">
                <p>
                    审批编号
                    <span>201905221110000438410</span>
                </p>
                <p>
                    所在部门
                    <span>信息中心</span>
                </p>
                <p>
                    缺卡原因
                    <span>临时出差</span>
                </p>

            </div>
        </div>
        <div class="record">
            <p>历史补卡记录</p>
            <p><i-icon type="enter" color="#cccccc" /></p>
        </div>
        <div class="center">
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="pactive"></p>
               </div>
               <div class="center">
                   <p>崔曼  发起申请</p>
               </div>
               <div class="time">
                   <p>05:22 11:10</p>
               </div>
           </div>
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="pactive"></p>
               </div>
               <div class="center">
                   <p>崔曼  <span>审批中</span></p>
               </div>
               <div class="time">
                   <p> 已等待7分钟</p>
               </div>
           </div>
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="admin">主管理员</p>
               </div>
               <div class="center">
                   <p>崔曼  <span>审批中</span></p>
               </div>
               <div class="time">
                   <p> 已等待7分钟</p>
               </div>
           </div>
        </div>
        <div class="footer">
            <div class="boxWrap">
                <div class="lbox">
                    <div class="box">
                        <p class="icon">
                            <i-icon type="undo" />
                        </p>
                        <p>催办</p>
                    </div>
                    <div class="box" @click="getRevoke">
                        <p class="icon">
                            <i-icon type="undo" />
                        </p>
                        <p>撤销</p>
                    </div>
                    <div class="box" @click="getMove">
                        <p class="icon">
                            <i-icon type="undo" />
                        </p>
                        <p>更多</p>
                    </div>
                </div>
                <div class="rbox">
                    <p>
                        <span>拒绝</span>
                        <span>同意</span>
                    </p>
                </div>
            </div>
        </div>
        <van-action-sheet
            :round="false"
            cancel-text="取消"
            :show="isShow"
            :actions="actions"
            @cancel="getCancel"
            @close="onClose"
            @select="onSelect"
        />

    </div>
</template>
<script>
export default {
    data(){
        return {
            isShow:false,
            actions: [
                {
                    name: '评论'
                },
                {
                    name: '转交'
                }
            ]
        }
    },
    onLoad(){
        wx.setNavigationBarTitle({
            title: '张丽萍提交的补卡申请'
        })
    },
    methods:{
        getRevoke(){
            wx.showModal({
                title: '提示',
                content: '你确定要撤销申请吗？',
                success (res) {
                    if (res.confirm) {
                    console.log('用户点击确定')
                    } else if (res.cancel) {
                    console.log('用户点击取消')
                    }
                }
            })
        },
        getMove(){
            this.isShow = true;
        },
        getCancel(){
            this.isShow = false;
        },
        onClose(){
            this.isShow = false;
        },
        onSelect(e){
            let name = e.mp.detail.name;
            if(name=='评论'){
                const url = '/pages/clockIn/patchcardApply/record/detail/comment/main';
                wx.navigateTo({url:url});
            }
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../../../static/css/public.scss';
    .wrap{
        .header{
            padding: 0 33rpx;
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #eceeed;
                .l{
                    p{
                        width: 72rpx;
                        height: 72rpx;
                        line-height: 72rpx;
                        border-radius: 50%;
                        text-align: center;
                        background: #3399ff;
                        font-size: 22rpx;
                        color: #fff;
                    }
                }
                .r{
                    margin-left: 20rpx;
                    p:nth-child(1){
                        color: #333333;
                        font-size: 33rpx;
                    }
                    p:nth-child(2){
                        font-size: 26rpx;
                        color: #d49746;
                    }
                }
            }
            .rowWrap{
                display: flex;
                // align-items: center;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #eceeed;
                .l{
                    font-size: 29rpx;
                    color: #999999
                }
                .r{
                    flex: 1;
                    margin-left: 20rpx;
                    font-size: 29rpx;
                    color: #333333;
                }
            }
            .rowBottom{
                padding: 20rpx 0;
                p{
                    font-size: 29rpx;
                    color: #999999;
                    span{
                        color: #333333;
                        margin-left: 20rpx;
                    }
                }
                p:nth-child(2){
                    padding: 10rpx 0;
                }            
            }
        }
        .record{
            padding: 20rpx 33rpx;
            background: #fff;
            font-size: 29rpx;
            color: #666666;
            display: flex;
            justify-content: space-between;
            margin: 35rpx 0;
        }
        .center{
            padding: 20rpx 33rpx;
            background: #fff;
            .steps:last-child .step .pactive{
                width: 0;
                height: 0;
                border: none;
            }
            .steps{
                display: flex;
                .step{
                    p:nth-child(1){
                        width: 60rpx;
                        height: 60rpx;
                        line-height: 60rpx;
                        font-size: 10px;
                    }
                    .pactive{
                        width: 10px;
                        height: 50rpx;
                        border-right:1px dashed #cccccc ;
                        margin-left: 8rpx;
                    }
                    .admin{
                        background: #e4f5ff;
                        padding: 5rpx;
                        color: #3399ff;
                        font-size: 8px;
                    }
                }
                .center{
                    flex: 1;
                    font-size: 12px;
                    line-height: 60rpx;
                    color: #666666;
                    margin-left: 10px;
                    p{
                        span{
                            color: #d49746;
                        }
                    }
                }
                .time{
                    font-size: 12px;
                    line-height: 60rpx;
                    color: #666666;
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
                align-items: center;
                .lbox{
                    width: 50%;
                    display: flex;
                    justify-content: space-around;
                    border-right: 1rpx solid #eceeed;
                    padding: 20rpx 0;
                    .box{
                        font-size: 21rpx;
                        color: #666666;
                    }
                }
                .rbox{
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    p{
                        span{
                            display: inline-block;
                            width: 169rpx;
                            height: 60rpx;
                            line-height: 60rpx;
                            background: #3399ff;
                            color: #fff;
                            font-size: 32rpx;
                            text-align: center;
                        }
                        span:nth-child(1){
                            background: #fff;
                            border-top-left-radius: 7rpx;
                            border-bottom-left-radius: 7rpx;
                            border:7rpx solid #bebfc3;
                            box-shadow: border-box;
                            color: #3399ff;
                            border-right: 0;
                        }
                        span:nth-child(2){
                            border-top-right-radius: 7rpx;
                            border-bottom-right-radius: 7rpx;
                            border: 7rpx solid #3399ff;
                        }
                    }
                }
            }
        }
    }
</style>