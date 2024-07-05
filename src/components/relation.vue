<template>
    <div class="wrap">
        <div class="header" v-if="!editShow&&draft=='true'">
            <p @click="getAdd">添加</p>
            <p @click="getEdit">编辑</p>
        </div>
        <div class="containers" @click.stop>
            <van-checkbox-group :value="result" @change="changeGroup">
                <div class="centers" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                    <div class="rowWrap">
                        <div class="checkWrap" v-if="editShow">
                            <van-checkbox custom-class="check" :name="item.ValueId"></van-checkbox>
                        </div>
                        <!-- <div v-if="!editShow"></div> -->
                        <div>
                            <p class="radio">{{item.StartByName}}</p>
                        </div>
                        <div class="cont">
                            <p>{{item.StartByName}}提交的流程申请表</p>
                            <!-- <p>
                                <span>标题：{{item.Name}}</span>
                            </p>
                            <p>
                                <span>级别：</span>{{item.priority==0?'普通':item.priority==1?'紧急':'非常紧急'}}
                            </p> -->
                            <div class="level">
                                <p>
                                    <i class="iconfont icon-jinji2 icon" :class="item.priority==0?'icon':item.priority==1?'zhongji':'jinji'"></i>
                                </p>
                                <p class="name">{{item.Name}}</p>
                            </div>
                            <p>{{item.CreatedOn}} · 来自{{item.StartByName}} {{item.BusinessUnitIdName}}</p>
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="bottomWrap" :class="{'active':isModelmes}" v-if="editShow">
            <div>
                <p @click="cancalEdit">取消</p>
                <p @click="getAllelection">全选</p>
                <p :class="{'active':result!=''}" @click="getDelete">删除</p>
            </div>
        </div>
        <!-- <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="row">
                <div class="col">
                    <p>
                        <i-icon type="undo" size="20" color="#646464" />
                    </p>
                    <p>返回</p>
                </div>
                <div class="col">
                    <p>
                        <i-icon type="undo" size="20" color="#646464" />
                    </p>
                    <p>撤回</p>
                </div>
                <div class="col">
                    <p>
                        <i-icon type="undo" size="20" color="#646464" />
                    </p>
                    <p>催办</p>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import Bus from '../utils/bus';
import {mapMutations} from 'vuex';
export default {
    name:"relation",
    props:['instanceId','draft'],
    data(){
        return {
            result:[],
            editShow:false,
            sessionkey:"",
            list:[]
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        // this.getQuery();
    },
    mounted(){
        this.monitoring(); // 注册监听事件
        this.getQuery();
    },
    onShow(){
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"wfinstance.related.getlist",
                    SessionKey:this.sessionkey,
                    processInstanceId:this.instanceId
                }
            }).then(res=>{
                console.log(res,'关联');
                this.list = res.rows;
            })
        },
        monitoring(){
            this.$on('childMethod', (res) => {
                console.log('方法1:触发监听事件监听成功')
                console.log(res)
            })
        },
        getAdd(){
            const url = '/pages/todoBusiness/selectRelation/main';
            wx.navigateTo({url:url});
        },
        changeGroup(e){
            console.log(e);
            this.result = e.mp.detail;
        },
        getEdit(){
            this.editShow = true;
        },
        // 取消
        cancalEdit(){
            this.editShow = false;
            this.result = [];
        },
        getAllelection(){
            this.list.forEach(item=>{
                this.result.push(item.ValueId);
            })
        },
        getDelete(){
            this.result.forEach(item=>{
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"flow.instancerelated.delete",
                        SessionKey:this.sessionkey,
                        id:item
                    }
                }).then(res=>{
                    this.getQuery();
                })
            })
        },
        ...mapMutations([
            'updateInstanceId'
        ]),
        getDetail(item){
            this.updateInstanceId(item.ProcessInstanceId);
            const url = '/pages/todoBusiness/detail/main?RuleLogId='+item.ValueId+'&processInstanceId='+item.ProcessInstanceId+'&name='+item.Name+'&processId='+item.ProcessId+'&createdByName='+item.StartByName;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style scoped lang="scss">
    @import '../../static/css/public.scss';
    .header{
        width: 100%;
        background: #fff;
        padding: 30rpx 0;
        display: flex;
        border-bottom: 1rpx solid #f6f6f6;
        p{
            flex: 1;
            text-align: center;
            color: #3399ff;
            font-size: 28rpx;
        }
        p:nth-child(1){
            border-right: 1rpx solid #f6f6f6;
        }
    }
    .containers{
        padding-bottom: 60px;
        /deep/ .centers {
            border-bottom: 1rpx solid #f6f6f6;
            background: #fff;
            .rowWrap{
                display: flex;
                padding: 20rpx;
                div{
                    .radio{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 12px;
                    }
                }
                .checkWrap{
                    width: 30px;
                    .check{
                        margin-top: 10rpx;
                    }
                }
                .cont{
                    flex: 1;
                    margin-left: 10px;
                    p:nth-child(1){
                        font-size: 28rpx;
                        color: #333;
                    }
                    p:nth-child(2),p:nth-child(3){
                        font-size: 12px;
                    }
                    p:nth-child(4){
                        font-size: 12px;
                        color: #999999;
                        margin-top: 20px;
                    }
                    .level{
                        display: flex;
                        align-items: center;
                        margin: 15rpx 0;
                        font-size: 28rpx;
                        color: #333333;
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
                }
            }
        }
    }
    .bottomWrap.active{
        bottom: 164rpx !important;
    }
    .bottomWrap{
        width: 100%;
        position: fixed;
        bottom: 120rpx!important;
        background: #fff;
        border-bottom: 1rpx solid #e3e3e5;
        div{
            display: flex;
            padding: 20rpx 0;
            p{
                flex: 1;
                text-align: center;
                font-size: 28rpx;
                color: #3399ff;
            }
            p:nth-child(3){
                color: #ff6666;
                opacity: .5;
            }
            p:nth-child(3).active{
                color: #ff6666;
                opacity: 1;
            }
        }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 0;
        border-top: 1rpx solid #e6e6e6;
        .row{
            display: flex;
            font-size: 12px;
            color: #666666;
            padding: 10rpx 0;
            .col{
                flex: 1;
                p{
                    text-align: center;
                }
            }
        }
    }
</style>