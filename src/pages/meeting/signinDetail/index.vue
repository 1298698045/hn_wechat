<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="未签到"></i-tab>
            <i-tab key="tab2" title="已签到"></i-tab>
        </i-tabs>
        <div class="center">
            <div class="row" v-if="current=='tab1'" v-for="(item,index) in list" :key="index">
                <div class="lBox">
                    <p>{{item.name}}</p>
                </div>
                <div class="rBox">
                    <p>
                        {{item.owningUserName}}
                        <span>{{item.owningBusinessUnitName}}</span>
                    </p>
                    <p class="btn" v-if="isEdit=='true'" @click="getAlreadySign(item)">
                        标为已签
                    </p>
                </div>
            </div>
            <div class="rowWrap" v-if="current=='tab2'"  v-for="(item,index) in list" :key="index">
                <div class="lBox">
                    <p>{{item.owningUserName}}</p>
                </div>
                <div class="cBox">
                    <p class="name">
                        {{item.owningUserName}}
                        <span>{{item.owningBusinessUnitName}}</span>
                    </p>
                    <p class="time">{{item.modifiedOn}}</p>
                </div>
                <div class="rBox" @click="getMove(item)" v-if="isEdit=='true'">
                    <i-icon type="more" size="20" color="#3399ff" />
                </div>
            </div>
        </div>
        <!-- <div class="footer">
            <div class="box">
                <p>展示签到二维码</p>
                <p>导出Excel</p>
            </div>
        </div> -->
        <van-action-sheet
            :round="false"
            :show="show"
            cancel-text="取消"
            @close="onClose"
            @cancel="onClose"
            @select="onSelect"
        >
            <div class="sheetWrap">
                <h3>
                    请选择
                </h3>
                <div class="row" @click="getNoSign">
                    将{{name}}标记为未签到
                </div>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import { splitName } from '@/utils/splitName';
export default {
    data(){
        return {
            current:'tab1',
            show:false,
            actions:[
                {
                    name: '将碧池标记为未签到'
                }
            ],
            id:"",
            sessionkey:"",
            status:5,
            list:[],
            name:"",
            isEdit:false,
            userId:""
        }
    },
    onLoad(options){
        this.isEdit = options.isEdit;
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.id = options.id;
        this.getQuery();
        
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.meeting.peoples,
                    SessionKey:this.sessionkey,
                    status:this.status,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                this.list.map(item=>{
                    item.name = splitName(item.owningUserName);
                    return item;
                })
            })
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.status = 5;
            }else {
                this.status = 3;
            }
            this.getQuery();
        },
        getMove(item){
            this.name = item.owningUserName;
            this.userId = item.owningUser;
            this.show = true;
        },
        onClose(){
            this.show = false;
        },
        // 标为签到
        getAlreadySign(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.meeting.tagSign,
                    SessionKey:this.sessionkey,
                    id:this.id,
                    checkIn:true,
                    userId:item.owningUser
                }
            }).then(res=>{
                console.log(res);
                this.getQuery();
            })
        },
        // 标记为未签到
        getNoSign(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.meeting.tagSign,
                    SessionKey:this.sessionkey,
                    id:this.id,
                    checkIn:false,
                    userId:this.userId
                    
                }
            }).then(res=>{
                console.log(res);
                this.show = false;
                this.getQuery();
            })
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
            background: #fff;
            .row{
                display: flex;
                padding: 0 33rpx;
                align-items: center;
                .lBox{
                    padding: 16rpx 0;
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 30rpx;
                    }
                }
                .rBox{
                    padding: 16rpx 0;
                    flex: 1;
                    margin-left: 20rpx;
                    width: 100%;
                    border-bottom: 2rpx soid #e2e3e5;
                    display: flex;
                    justify-content: space-between;
                    p{
                        font-size: 35rpx;
                        color: #333333;
                        span{
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                    .btn{
                        width: 144rpx;
                        height: 56rpx;
                        line-height: 56rpx;
                        text-align: center;
                        font-size: 28rpx;
                        color: #3399ff;
                        border: 2rpx solid #3399ff;
                        border-radius: 7rpx;
                    }
                }
            }
            .rowWrap{
                display: flex;
                padding: 0 33rpx;
                align-items: center;
                .lBox{
                    padding: 16rpx 0;
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 30rpx;
                    }
                }
                .cBox{
                    flex: 1;
                    margin-left: 20rpx;
                    .name{
                        font-size: 35rpx;
                        color: #333333;
                        span{
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                    .time{
                        font-size: 24rpx;
                        color: #666666;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            .box{
                display: flex;
                p{
                    width: 50%;
                    text-align: center;
                    padding: 41rpx 0;
                    font-size: 34rpx;
                    color: #3399ff;
                }
            }
        }
        .sheetWrap{
            text-align: center;
            h3{
                font-size: 28rpx;
                color: #999999;
                padding: 20rpx 0;
            }
            .row{
                border-top: 2rpx solid #e2e3e5;
                border-bottom: 2rpx solid #e2e3e5;
                font-size: 34rpx;
                color: #000000;
                padding: 30rpx 0;
            }
        }
    }
</style>