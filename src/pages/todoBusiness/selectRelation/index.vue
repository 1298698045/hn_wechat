<template>
    <div class="wrap">
        <div class="nav">
            <van-search :value="keyValue" placeholder="搜索" />
            <i-tabs :current="current" @change="handleChange">
                <i-tab key="tab1" title="我已处理的"></i-tab>
                <i-tab key="tab2" title="我发起的"></i-tab>
            </i-tabs>
        </div>
        <!-- <div class="container">
            <van-checkbox-group :value="result" @change="onChange">
                <van-checkbox name="a">复选框 a</van-checkbox>
                <van-checkbox name="b">复选框 b</van-checkbox>
                <van-checkbox name="c">复选框 c</van-checkbox>
            </van-checkbox-group>
        </div> -->
        <div class="container">
            <van-checkbox-group :value="result" @change="changeCheckbox">
                <div class="center" v-for="(item,index) in list" :key="index">
                    <div class="rowWrap">
                        <div>
                            <van-checkbox custom-class="check" :name="current=='tab1'?item.id:item.instanceId"></van-checkbox>
                        </div>
                        <div>
                            <p class="radio">{{item.createdByName}}</p>
                        </div>
                        <div>
                            <p>标题：{{item.createdByName}}提交的流程申请表</p>
                            <p>
                                <span>{{item.name}}</span>
                            </p>
                            <p>
                                <span>级别：</span>{{item.priority==0?'普通':item.priority==1?'紧急':'非常紧急'}}
                            </p>
                            <p>{{item.createdOn}} · {{item.createdByName}}  {{item.businessUnitIdName}}</p>
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="footer">
            <div class="row">
                <p class="text">已选择：{{contSize}}</p>
                <p class="btn" :class="{'active':result!=''}" @click="getSubmit">确定({{contSize}}/{{total}})</p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
    data(){
        return {
            keyValue:"",
            current:"tab1",
            result:[],
            total:5,
            num:"",
            sessionkey:"",
            list:[]
        }
    },
    computed:{
        contSize(){
            return this.result.length;
        },
        ...mapState({
            instanceId:state=>{
                return state.user.instanceId
            }
        })
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
                    method:"flow.finishedtasks.getlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.total = this.list.length;
            })
        },
        getMyLaunch(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.myinstance.getlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.total = this.list.length;
            })
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.getQuery();
            }else {
                this.getMyLaunch();
            }
        },
        changeCheckbox(e){
            console.log(e);
            this.result = e.mp.detail;
        },
        getSubmit(){
            if(this.result!=''){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"flow.instancerelated.add",
                        SessionKey:this.sessionkey,
                        relateInstanceId:this.result.join(','),
                        instanceId:this.instanceId
                    }
                }).then(res=>{
                    console.log(res);
                    wx.navigateBack({
                        delta: 1
                    })
                })
            }
        }
    }
}
</script>
<style lang="scss">
    .container{
        padding-bottom: 100px;
        .center{
            margin-top: 10px;
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
                div:nth-child(1){
                    width: 30px;
                    .check{
                        margin-top: 10px;
                    }
                }
                div:nth-child(3){
                    flex: 1;
                    margin-left: 10px;
                    p:nth-child(1){
                        font-size: 28rpx;
                        color: #333;
                        font-weight: 500;
                        padding-bottom: 10px;
                    }
                    p:nth-child(2),p:nth-child(3){
                        font-size: 12px;
                    }
                    p:nth-child(4){
                        font-size: 12px;
                        color: #999999;
                        margin-top: 20px;
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
        border-top: 1rpx solid #eaeaea;
        .row{
            padding: 30rpx;
            display: flex;
            justify-content:space-between;
            .text{
                font-size: 28rpx;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .btn{
                font-size: 28rpx;
                color: #fff;
                padding: 20rpx;
                background: #3399ff;
                opacity: .5;
                border-radius: 5rpx;
            }
            .btn.active{
                opacity: 1;
            }
        }
    }
</style>