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
            <!-- <div class="searchWrap" v-if="isBlock">
                <div class="navs">
                    <p>
                        <van-search background="#f4f4f4" :value="searchValue" placeholder="请输入搜索关键词" />
                    </p>
                    <p @click="getCancelBlock">取消</p>
                </div>
                <div class="history">
                    <div class="text">
                        <p>搜索历史</p>
                        <p><i-icon type="close" size="20" color="#999999" /></p>
                    </div>
                    <div class="rowWrap">
                        <p>崔曼</p>
                        <p>补卡申请</p>
                    </div>
                </div>
                <div class="activeCenter">
                    <div class="box">
                        <van-divider contentPosition="center">在这里可以搜索到</van-divider>
                        <div class="iconWrap">
                            <div class="icon">
                                <p>
                                    <img src="https://oawx.hnca.org.cn/img/wechat/Scan.png" alt="">
                                </p>
                                <p>审批标题</p>
                            </div>
                            <div class="icon">
                                <p>
                                    <img src="https://oawx.hnca.org.cn/img/wechat/Scan.png" alt="">
                                </p>
                                <p>审批状态</p>
                            </div>
                            <div class="icon">
                                <p>
                                    <img src="https://oawx.hnca.org.cn/img/wechat/Scan.png" alt="">
                                </p>
                                <p>审批时间</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- <div class="screenWrap" v-if="screenShow">
                <div class="navs">
                    <p>
                        <van-search background="#f4f4f4" :value="searchValue" placeholder="请输入搜索关键词" />
                    </p>
                    <p @click="getCancelScreen">取消</p>
                </div>
                <div class="contWrap">
                    <van-collapse :value="activeNames" @change="changeCollapse">
                        <van-collapse-item name="1">
                            <view slot="title" class="title">院办</view>
                            <div class="rowBox">
                                <p :class="{'active':num==index}" v-for="(item,index) in optionList" :key="index" @click="getOptions(item,index)">{{item.name}}</p>
                            </div>
                        </van-collapse-item>
                        <van-collapse-item name="2">
                            <view slot="title" class="title">审计处</view>
                        </van-collapse-item>
                    </van-collapse>
                </div>
                <div class="time">
                    <picker mode="date" :value="startTime" @change="changeStartTime">
                        <van-field
                            input-class="inp"
                            :value="startTime"
                            :readonly="true"
                            clearable
                            label="开始时间"
                            icon="arrow"
                            placeholder="请选择"
                        />
                    </picker>    
                    <picker mode="date" :value="startTime" @change="changeEndTime">
                        <van-field
                            input-class="inp"
                            :value="endTime"
                            :readonly="true"
                            clearable
                            label="结束时间"
                            icon="arrow"
                            placeholder="请选择"
                        />
                    </picker>  
                </div>
                <div class="bottom">
                    <van-button type="primary" color="#3399ff" block>确定</van-button>
                </div>
            </div> -->
            <NavShow v-if="isBlock" ref="childs" @childFn="getChildFn" :childShow="childShow" />
            <div class="content" v-if="!isBlock||isBlock&&childShow==0">
                <div class="row" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                    <div class="lBox">
                        <p>{{item.createdByName}}</p>
                    </div>
                    <div class="rBox">
                        <div class="title">
                            <p>{{item.createdByName}}提交的{{item.processIdName}}</p>
                            <!-- 更多操作隐藏 -->
                            <!-- <p class="time" @click.stop="getMore(item)">
                                <i-icon type="more" size="20" color="#999999" />
                            </p> -->
                        </div>
                        <div class="level">
                            <p>
                                <i class="iconfont icon-jinji2 icon" :class="item.priority==0?'icon':item.priority==1?'zhongji':'jinji'"></i>
                            </p>
                            <p class="name">{{item.name}}</p>
                        </div>
                        <!-- <p class="text">标题：<span>{{item.name}}</span></p>
                        <p class="text">级别: <span>{{item.priority==0?'普通':item.priority==1?'中级':'高级'}}</span> </p>   -->
                        <!-- <div class="box">
                            <p class="time">
                                {{item.createdOn}} · 来自{{item.createdByName}} {{item.businessUnitIdName}}
                            </p>
                            <p v-if="item.StateCode" class="status" :class="item.StateCode==0?'blue':item.StateCode==3?'success':item.StateCode==5?'error':''">{{item.StateCode==0?'草稿':item.StateCode==1?'审批中':item.StateCode==3?'已完成':'已拒绝'}}</p>
                        </div> -->
                        <div class="statusBottom">
                            <p class="time">{{item.createdOn}} · 来自{{item.createdByName}} {{item.businessUnitIdName}}</p>
                            <div class="right">
                                <div class="tag" :class="item.className">
                                    {{item.stateCode==1?'审批中':item.stateCode==3?'已通过':item.stateCode==5?'已拒绝':item.stateCode==4?'已撤销':item.stateCode==0?'草稿':item.stateCode==2?'挂起':''}}
                                </div>
                                <div class="icon" v-if="item.stateCode==1" @click.stop="getNewUrging(item)">
                                    <img :src="imgUrl+'urging.png'" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <van-action-sheet
            :show=" show "
            :round="false"
            cancel-text="取消"
            :actions="actions"
            @close="onClose"
            @cancel="onClose"
            @select="onSelect"
        >
            <div class="sheetWrap">
                <p class="title">
                    更多操作
                </p>
                <p class="row" @click="getWithdraw">撤回</p>
                <p class="row" @click="getCirculation">传阅</p>
                <p class="row" @click="getUrging">催办</p>
            </div>
        </van-action-sheet>
        <van-popup
            :show="urgingShow"
            position="center"
            custom-style="width:80%;height: auto;border-radius:10rpx;"
            overlay-style="background: #333;opacity: .5;"
            @close="onCloseRefuse">
            <div class="popup">
                <h3>催办</h3>
                <div class="text">
                    <textarea class="textarea" v-model="content" placeholder="请输入留言" name="" id="" cols="30" rows="10"></textarea>
                </div>
                <div class="rowCheck">
                    <div class="notice">通知方式：</div>
                    <van-checkbox-group :value="resultTag" @change="changeTag">
                        <div class="checkboxGroup">
                            <van-checkbox :name="item" v-for="(item,index) in tagList" :key="index" custom-class="check" label-class="labels"  shape="square">
                                {{item}}
                            </van-checkbox>
                        </div>
                    </van-checkbox-group>
                </div>
                <div class="btn">
                    <p class="cancel" @click="onClosePupupShow">取消</p>
                    <p @click="getSubmit">确定</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import NavShow from '@/components/approval/navShow';
export default {
    components:{
        NavShow
    },
    data(){
        return {
            isBlock:false,
            screenShow:false,
            activeNames: ['1'],
            optionList:[
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                },
                {
                    id:1,
                    name:"01 请示报告"
                }
                
            ],
            show:false,
            num:"",
            list:[],
            sessionkey:"",
            id:"",
            urgingShow:false,
            content:"",
            timeSort:['时间排序','优先级排序'],
            timeSortIdx:0,
            childShow:"",
            isBook:false,
            tagList:['短信','应用内'],
            resultTag:[]
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    computed:{
        sort(){
            let sort = this.timeSortIdx==0?'CreatedOn':'Priority';
            return sort;
        },
        imgUrl(){
            return this.$api.photo.url
        },
        notifySms(){
           let isBol = this.resultTag.indexOf('短信')!==-1?true:false;
           return isBol;
        },
        notifyMessager(){
            let isBol = this.resultTag.indexOf('应用内')!==-1?true:false;
            return isBol;
        }
    },
    methods:{
        getChildFn(isBook){
            this.isBook = isBook;
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:'flow.mytasks.getlist',
                    SessionKey:this.sessionkey,
                    sort:this.sort,
                    search:this.isBook?this.$refs.childs.searchValue:'',
                    processId:this.isBook?this.$refs.childs.processId:'',
                    // stateCode:this.isBook?this.$refs.childs.statusNum:'',
                    stateCode:this.isBook?this.$refs.childs.stateCode:'',
                    deptIds:this.isBook?this.$refs.childs.deptIds.join(','):'',
                    createdByIds:this.isBook?(this.$refs.childs.designee.hasOwnProperty('id')?this.$refs.childs.designee.id:''):""
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.list.forEach(item=>{
                    let className = item.stateCode==1?'approvalIng':item.stateCode==3?'tag':item.stateCode==5?'error':item.stateCode==4?'revoke'
                    :item.stateCode==0?'draft':item.stateCode==2?'挂起':'';
                    this.$set(item,'className',className);
                })
            })
        },
        bindPickerChange(e){
            this.timeSortIdx = e.mp.detail.value;
            this.getQuery();
        },
        ...mapMutations([
            'updateInstanceId'
        ]),
        getDetail(item){
            let draft = false;
            if(item.stateCode==0){
                draft = true;
            }
            this.updateInstanceId(item.instanceId);
            const url = '/pages/todoBusiness/detail/main?id='+item.id+'&name='+item.name+'&processInstanceId='+item.processInstanceId+'&processId='+item.processId+'&RuleLogId='+item.id
            +'&toActivityId='+item.toActivityId+'&fromActivityId='+item.fromActivityId+'&current=tab1'+'&stateCode='+item.stateCode+'&instanceId='+item.instanceId+'&createdByName='+item.createdByName+'&processIdName='+item.processIdName+'&draft='+false;
            // const url = '/pages/todoBusiness/detail/main?processInstanceId='+item.processInstanceId+'&processId='+item.processId+'&draft='+draft;
            wx.navigateTo({
                url:url
            })
        },
        getSearch(){
            this.childShow = 0;
            this.isBlock = true;
        },
        getCancelBlock(){
            this.isBlock = false;
        },
        // 筛选
        getScreen(){
            this.childShow = 1;
            this.isBlock = true;
            // this.screenShow = true;
        },
        getCancelScreen(){
            this.screenShow = false;
        },
        changeCollapse(e){
            this.activeNames = e.mp.detail;
        },
        getOptions(item,index){
            this.num = index;
        },
        getMore(item){
            this.id = item.processInstanceId;
            this.show = true;
        },
        onClose(){
            this.show = false;
        },
        // 撤回
        getWithdraw(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:'flow.instance.cancelsubmit',
                    SessionKey:this.sessionkey,
                    processInstanceId:this.id
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getUrging(){
            this.show = false;
            this.urgingShow = true;
        },
        onClosePupupShow(){
            this.urgingShow = false;
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:'flow.instance.pushmessage',
                    SessionKey:this.sessionkey,
                    processInstanceId:this.id,
                    Message:this.content,
                    notifySms:this.notifySms,
                    notifyMessager:this.notifyMessager
                }
            }).then(res=>{
                console.log(res);
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:"success",
                    duration:2000,
                    success:res=>{
                        that.content = '';
                        that.urgingShow = false;
                    }
                })
            })
        },
        // 催办
        getNewUrging(item){
            this.id = item.processInstanceId;
            this.urgingShow = true;
        },
        changeTag(e){
            this.resultTag = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/schedule.css';
    .wrap{
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .header{
            width: 100%;
            background: #fff;
            border-bottom: 2rpx solid #e2e2e2;

            .nav{
                width: 100%;
                display: flex;
                background: #ffffff;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx;
                .lBox{
                    font-size: 26rpx;
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
            background: #fff;
            overflow-y: scroll;
            .searchWrap{
                .navs{
                    width: 100%;
                    display: flex;
                    background: #f4f4f4;
                    border-bottom: 1rpx solid #e2e4e3;
                    p:nth-child(1){
                        width: 80%;
                    }
                    p:nth-child(2){
                        width: 20%;
                        text-align: center;
                        font-size: 28rpx;
                        color: #3399ff;
                        text-align: center;
                        margin-top: 30rpx;
                    }
                }
                .history{
                    width: 100%;
                    background: #f4f4f4;
                    padding: 30rpx 0;
                    .text{
                        padding: 0 30rpx;
                        display: flex;
                        justify-content: space-between;
                        font-size: 28rpx;
                        color: #999999;
                    }
                    .rowWrap{
                        display: flex;
                        flex-wrap: wrap;
                        padding:0 30rpx;
                        p{
                            background: #fff;
                            border-radius: 20px;
                            padding: 20rpx;
                            font-size: 26rpx;
                            align-items: center;
                            margin-right: 10px;
                            margin-top: 10px;
                        }
                    }
                }
                .activeCenter{
                    background: #fff;
                    border-top: 1rpx solid #e2e4e3;
                    .box{
                        padding: 50px;
                    }
                    .iconWrap{
                        display: flex;
                        .icon{
                            flex: 1;
                            p:nth-child(1){
                                width: 50rpx;
                                height: 50rpx;
                                margin:0 auto;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    vertical-align:middle;
                                }
                            }
                            p{
                                font-size: 12px;
                                color:#505050;
                                text-align: center;
                            }
                        }
                    }
                }
            }
            .screenWrap{
                .navs{
                    width: 100%;
                    display: flex;
                    background: #f4f4f4;
                    border-bottom: 1rpx solid #e2e4e3;
                    p:nth-child(1){
                        width: 80%;
                    }
                    p:nth-child(2){
                        width: 20%;
                        text-align: center;
                        font-size: 28rpx;
                        color: #3399ff;
                        text-align: center;
                        margin-top: 30rpx;
                    }
            }
                .contWrap{
                    background: #fff;
                    .title{
                        font-size: 28rpx;
                        font-weight: bold;
                    }
                    .rowBox{
                        display: flex;
                        flex-flow: wrap;
                        justify-content: space-between;
                        padding:10rpx 20rpx;
                        p{
                            width: 45%;
                            height: 30px;
                            line-height: 30px;
                            font-size: 14px;
                            background: #f4f4f4;
                            color: #666666;
                            border-radius: 10rpx;
                            padding-left: 10rpx;
                            margin: 10rpx 0;
                        }
                        p.active{
                            background: #dbf5ec;
                            color: #39c1b3;
                        }
                    }
                }
                .time{
                    margin: 30rpx 0;
                    .inp{
                        text-align: right;
                    }
                }
                .bottom{
                    width: 100%;
                    position: fixed;
                    bottom: 0;
                }
            }
            .content{
                .row{
                    display: flex;
                    padding: 35rpx 24rpx;
                    border-bottom: 2rpx solid #e2e3e5;
                    .lBox{
                        width: 68rpx;
                        height: 68rpx;
                        line-height: 68rpx;
                        text-align: center;
                        background: #3399ff;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 26rpx;
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 25rpx;
                        .title{
                            display: flex;
                            justify-content: space-between;
                            padding-bottom: 20rpx;
                            p{
                                font-size: 34rpx;
                                color: #333333;
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
                        .statusBottom{
                            display: flex;
                            justify-content: space-between;
                            margin-top: 20rpx;
                            .time{
                                color: #999999;
                                font-size: 12px;
                            }
                            .right{
                                display: flex;
                                align-items: center;
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
                                .icon{
                                    width: 27rpx;
                                    height: 27rpx;
                                    margin-left: 20rpx;
                                    img{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                        }
                        .text{
                            font-size: 26rpx;
                            color: #999999;
                            span{
                                color: #333333;
                            }
                        }
                        // .box{
                        //     display: flex;
                        //     justify-content: space-between;
                        //     margin-top: 30rpx;
                        //     .time{
                        //         font-size: 22rpx;
                        //         color: #999999;
                        //     }    
                        //     .status{
                        //         font-size: 22rpx;
                        //         color: #dea75c;

                        //     }
                        //     .status.blue{
                        //         color: #3399ff;
                        //     }
                        //     .status.success{
                        //         color: #39c1b3;
                        //     }
                        //     .status.error{
                        //         color: #ff6666;
                        //     }
                        // }
                    }
                }
            }
        }
        .sheetWrap{
            width: 100%;
            .title{
                text-align: center;
                font-size: 22rpx;
                color: #999999;
                padding: 13rpx 0;
            }
            .row{
                text-align: center;
                padding: 26rpx 0;
                font-size: 33rpx;
                color: #3399ff;
                border-top: 1rpx solid #eceeed
            }
        }
        .popup{
            h3{
                font-size: 30rpx;
                color: #333333;
                // border-bottom: 2rpx solid #3399ff;
                text-align: center;
                padding: 20rpx 0;
            }
            .text{
                .textarea{
                    // background: #e4e4e4;
                    background: #fff;
                    height: 80px;
                    padding: 10px;
                    border-radius: 10rpx;
                    width: 85%;
                    height: 221rpx;
                    margin: 20px auto;
                    border: 1rpx solid #a6a6a6;
                }
            }
            .rowCheck{
                display: flex;
                align-items: center;
                padding: 0 30rpx 30rpx 30rpx;
                .notice{
                    color: #999999;
                    font-size: 25rpx;
                }
                .checkboxGroup{
                    display: flex;
                    .check{
                        margin-right: 20rpx;
                        font-size: 28rpx;
                    }
                }
            }
            .btn{
                display: flex;
                border-top: 1rpx solid #eaeeed;
                p{
                    flex: 1;
                    text-align: center;
                    color: #3399ff;
                    font-size: 28rpx;
                    height: 104rpx;
                    line-height: 104rpx;
                    box-shadow: border-box;
                }
                .cancel{
                    border-right: 1rpx solid #eaeeed;
                }
            }
        }
    }
</style>