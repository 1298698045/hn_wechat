<template>
    <div class="wrap">
        <div class="header">
            <div class="nav" v-if="!isBlock">
                <div class="lBox">
                    <picker @change="bindPickerChange" :value="timeSortIdx" :range="timeSort">
                        <p>{{timeSort[timeSortIdx]}}<i-icon type="enter" color="#999999" /></p>
                    </picker>
                </div>
                <div class="rBox">
                    <p @click="getSearch">
                        <i class="iconfont icon-sousuo-copy"></i>
                    </p>
                    <p @click="getScreen">
                        <i class="iconfont icon-xuankeshaixuantubiaoimg-copy"></i>
                    </p>
                </div>
            </div>
        </div>
        <div class="center" :class="{'martop':childShow=='0'}">
            <NavShow v-if="isBlock" ref="childs" @childFn="getChildFn" :childShow="childShow" />
            <div class="radio" v-if="!isShow&&!isBlock">
                <div class="row">
                    <p>
                        <van-checkbox :value="checked" @change="changeRadio">仅查看未读传阅({{totalNum}})</van-checkbox>
                    </p>
                    <p @click="getAllSign">全部标为已读</p>
                    <!-- <p @click="getBatch">批量操作</p> -->
                </div>
            </div>
            <div class="content" v-if="!isShow&&!isBlock||!isShow&&isBlock&&childShow==0">
                <van-checkbox-group :value=" result " @change="onChange">
                    <div class="row" v-for="(item,index) in list" :key="index">
                        <van-checkbox v-if="isShow" custom-class="checkbox" :name="item.instanceId">
                        </van-checkbox>
                        <div class="dian" v-if="item.isRead==0">
                            <span></span>
                        </div>
                        <div class="lBox">
                            <p>{{item.createdByName}}</p>
                        </div>
                        <div class="rBox"  @click.stop="getDetail(item)">
                            <div class="title">
                                <p>{{item.createdByName}}提交的{{item.processIdName}}</p>
                                <!-- <p class="time">05.22</p> -->
                            </div>
                            <div class="level">
                                <p>
                                    <i class="iconfont icon-jinji2 icon" :class="item.priority==0?'icon':item.priority==1?'zhongji':'jinji'"></i>
                                </p>
                                <p class="name">{{item.name}}</p>
                            </div>
                            <!-- <p class="text">标题：{{item.name}}</p>
                            <p class="text">级别：{{item.priority==0?'普通':item.priority==1?'紧急':'非常紧急'}}</p> -->
                            <div class="status">
                                <p>{{item.createdOn}} · 来自{{item.createdByName}} {{item.businessUnitIdName}}</p>
                                <div class="tag" :class="item.className">
                                    {{item.stateCode==1?'审批中':item.stateCode==3?'已通过':item.stateCode==5?'已拒绝':item.stateCode==4?'已撤销':item.stateCode==0?'草稿':item.stateCode==2?'挂起':''}}
                                </div>
                            </div>
                        </div>
                    </div>
                </van-checkbox-group>
            </div>
        </div>
        <!-- <div class="footer" v-if="isShow">
            <div class="boxWrap">
                <p @click="getCancel">
                    取消
                </p>
                <p @click="getAllSelect" v-if="result==''">
                    全选
                </p>
                <p v-if="result!=''" @click="getCancelAll">
                    取消全选
                </p>
                <p @click="getAllSign">
                    标为已读
                </p>
                <p @click="getAllDel">
                    删除
                </p>
            </div>
        </div> -->
    </div>
</template>
<script>
import NavShow from '@/components/approval/navShow';
import {mapMutations} from 'vuex';
export default {
    components:{
        NavShow
    },
    data(){
        return {
            isBlock:false,
            checked:false,
            result:[],
            isShow:false,
            childShow:'',
            sessionkey:"",
            list:[],
            timeSort:['时间排序','优先级排序'],
            timeSortIdx:0,
            isBook:"",
            readState:-1,
            totalNum:""
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    computed:{
        // ValueIds(){
        //     let temp = [];
        //     this.result.forEach(item=>{
        //         temp.push(item);
        //     })
        //     return temp.join(',');
        // },
        ValueIds(){
            let temp = [];
            this.list.forEach(item=>{
                if(item.isRead==0){
                    temp.push(item.instanceId);
                }
            })
            return temp.join(',');
        },
        sort(){
            let sort = this.timeSortIdx==0?'CreatedOn':'Priority';
            return sort;
        }
    },
    methods:{
        bindPickerChange(e){
            this.timeSortIdx = e.mp.detail.value;
            this.getQuery();
        },
        getChildFn(isBook){
            this.isBook = isBook;
            this.getQuery();
        },
        getQuery(){
            console.log(this.isBook?this.$refs.childs.statusCode:'','-----');
            // return;
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.readtasks.getlist",
                    SessionKey:this.sessionkey,
                    readState:this.readState,
                    sort:this.sort,
                    search:this.isBook?this.$refs.childs.searchValue:'',
                    processId:this.isBook?this.$refs.childs.processId:'',
                    // stateCode:this.isBook?this.$refs.childs.statusNum:'',
                    stateCode:this.isBook?this.$refs.childs.statusCode:'',
                    deptIds:this.isBook?this.$refs.childs.deptIds.join(','):'',
                    createdByIds:this.isBook?(this.$refs.childs.designee.hasOwnProperty('id')?this.$refs.childs.designee.id:''):""
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                let total = 0;
                this.list.forEach(item=>{
                    let className = item.stateCode==1?'approvalIng':item.stateCode==3?'tag':item.stateCode==5?'error':item.stateCode==4?'revoke'
                    :item.stateCode==0?'draft':item.stateCode==2?'挂起':'';
                    this.$set(item,'className',className);
                    if(item.isRead==0){
                        total ++;
                    }
                    this.totalNum = total;
                })
            })
        },
        ...mapMutations([
            'updateInstanceId'
        ]),
        getDetail(item){
            this.updateInstanceId(item.instanceId);
            const url = '/pages/todoBusiness/detail/main?processInstanceId='+item.processInstanceId+'&processId'+item.processId+'&sign='+'off';
            wx.navigateTo({
                url:url
            })
        },
         changeRadio(e){
            this.checked = e.mp.detail;
            if(this.checked){
                this.readState = 0;
            }else {
                this.readState = 1;
            }
            this.getQuery();
        },
        onChange(e){
            this.result = e.mp.detail;
        },
        getBatch(){
            // this.isShow = !this.isShow;
        },
        getCancel(){
            this.result = [];
            this.isShow = false;
        },
        getAllSelect(){
            this.list.forEach(item=>{
                this.result.push(item.instanceId)
            })
        },
        getCancelAll(){
            this.result = [];
        },
        getSearch(){
            this.childShow = 0;
            this.isBlock = true;
        },
        getScreen(){
            this.childShow = 1;
            this.isBlock = true;
        },
        getAllSign(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"wfinstance.notify.batch.read",
                    SessionKey:this.sessionkey,
                    ValueIds:this.ValueIds
                }
            }).then(res=>{
                wx.showToast({
                    title:res.msg,
                    icon:"success",
                    duration:2000
                })
                this.getQuery();
                // this.result = [];
                // this.isShow = false;
            })
        },
        getAllDel(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"wfinstance.notify.batch.delete",
                    SessionKey:this.sessionkey,
                    ValueIds:this.ValueIds
                }
            }).then(res=>{
                console.log(res);
                this.result = [];
                this.isShow = false;
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/schedule.css';
    .wrap{
        // width: 100%;
        // height: 100vh;
        // display: flex;
        // flex-direction: column;
        // overflow: hidden;
        .header{
            width: 100%;
            background: #fff;
            .nav{
                width: 100%;
                display: flex;
                background: #ffffff;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx;
                .lBox{
                    font-size: 23rpx;
                    color: #999999;
                }
                .rBox{
                    display: flex;
                    p{
                        flex:1;
                        text-align: center;
                        color: #333333;
                        font-size: 28rpx;
                    }
                    p:nth-child(1){
                        margin-right: 60rpx;
                    }
                }
            }
        }
        .martop{
            margin-top: 50px;
        }
        .center{
            flex: 1;
            width: 100%;
            .radio{
                padding: 33rpx;
                .row{
                    display: flex;
                    justify-content: space-between;
                    p:nth-child(1){
                        color: #999999;
                        font-size: 12px;
                    }
                    p:nth-child(2){
                        width: 200rpx;
                        height: 44rpx;
                        line-height: 44rpx;
                        text-align: center;
                        color: #3399ff;
                        font-size: 27rpx;
                        border-radius: 23rpx;
                        border: 1rpx solid #3399ff;
                    }
                }
            }
            .content{
                .row{
                    display: flex;
                    padding: 35rpx 24rpx;
                    border-bottom: 2rpx solid #e2e3e5;
                    background: #fff;
                    .checkbox{
                        margin: 10rpx 20rpx 0 0 !important;
                    }
                    .dian{
                        height: 68rpx;
                        display: flex;
                        align-items: center;
                        margin-right: 10rpx;
                        span{
                            display: inline-block;
                            width: 10rpx;
                            height: 10rpx;
                            background: #ff6666;
                            border-radius: 50%;
                        }
                    }
                    .lBox{
                        width: 68rpx;
                        height: 68rpx;
                        line-height: 68rpx;
                        text-align: center;
                        background: #3399ff;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 23rpx;
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 25rpx;
                        .title{
                            display: flex;
                            justify-content: space-between;
                            padding-bottom: 20rpx;
                            p{
                                font-size: 36rpx;
                                color: #333333;
                                font-weight: bold;
                            }
                            .time{
                                font-size: 22rpx;
                                color: #bbbbbb;
                            }
                        }
                        .level{
                            display: flex;
                            align-items: center;
                            .icon{
                                color: #74b48c;
                            }
                            .icon.jinji{
                                color: #ec746c;
                            }
                            .icon.zhongji{
                                color: #e49c5c;
                            }
                            .name{
                                font-size: 28rpx;
                                color: #333333;
                                margin-left: 20rpx;
                            }
                        }
                        .text{
                            font-size: 26rpx;
                            color: #999999;
                        }
                        .status{
                            display: flex;
                            justify-content: space-between;
                            margin-top: 30rpx;
                            p:nth-child(1){
                                font-size: 22rpx;
                                color: #999999;
                            }
                            .tag{
                                width: 80rpx;
                                height: 32rpx;
                                line-height: 32rpx;
                                text-align: center;
                                font-size: 20rpx;
                                background: #e6f6f0;
                                color: #57b987;
                                border-radius: 7rpx;
                            }
                            .tag.draft{
                                background: #e6f0f6;
                                color: #3399ff;
                            }
                            .tag.error{
                                background: #faebe9;
                                color: #ff6666;
                            }
                            .tag.revoke{
                                background: #ebecf2;
                                color: #5b6991;
                            }
                            .tag.approvalIng{
                                background: #fcf2e9;
                                color: #f09951;
                            }

                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .boxWrap{
                display: flex;
                p{
                    flex: 1;
                    text-align: center;
                    font-size: 29rpx;
                    color: #3399ff;
                }
            }
        }
    }
</style>