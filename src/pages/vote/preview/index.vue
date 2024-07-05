<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <p class="Avatar">
                    {{voteInfo.CreatedByName}}
                </p>
                <div class="rBox">
                    <p class="name">
                        {{voteInfo.CreatedByName}}
                    </p>
                    <p class="info">
                        信息中心
                    </p>
                </div>
            </div>
            <h3>{{voteInfo.content}}</h3>
            <div class="text_row">
                <p>
                    <i class="iconfont icon-shijian-copy"></i>
                    <span>
                        {{voteInfo.closeTime}} 截止
                    </span>
                </p>
                <p>
                    <i class="iconfont icon-canyuren"></i>
                    <span>
                        0人参与
                    </span>
                </p>
            </div>
            <div class="title">
                {{voteInfo.PollType==0?'选项（单选）':'选项（多选）'}}
            </div>
            <div class="radio_wrap" v-if="voteInfo.PollType==0">
                <van-radio-group v-model="radio" @change="changeRadio">
                    <van-radio custom-class="radio" name="1" v-for="(item,index) in voteInfo.options" :key="index">{{index+1}}.  {{item.option}}</van-radio>
                </van-radio-group>
            </div>
            <div class="checkbox_wrap"  v-if="voteInfo.PollType==1">
                <van-checkbox-group :value="result" @change="onChange">
                    <van-checkbox shape="square" custom-class="check" :value="item.checked" :name="item.id" v-for="(item,index) in voteInfo.options" :key="index">
                        <div class="row">
                            <div>
                                {{index+1}}.
                            </div>
                            <div class="radius"></div>
                            <div>
                                <p class="name">{{item.option}}</p>
                                <p class="deparment">{{item.Description}}</p>
                            </div>
                        </div>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <p class="pre" @click="getReturnEdit">
                    返回编辑
                </p>
                <p class="create" @click="getSubmit">
                    创建投票
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    data(){
        return {
            list:[
                {
                    id:1,
                    name:'朱炜1',
                    checked:false
                },
                {
                    id:2,
                    name:'朱炜2',
                    checked:false
                },
                {
                    id:3,
                    name:'朱炜3',
                    checked:false
                }
            ],
            result:[]
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        ...mapState({
            voteInfo:state=>{
                return state.publics.voteInfo;
            }
        }),
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    methods:{
        getReturnEdit(){
            wx.navigateBack({
                delta: 1
            })
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.create,
                    SessionKey:this.sessionkey,
                    id:this.voteInfo.id,
                    poll:{
                        PollType:this.voteInfo.PollType,
                        title:this.voteInfo.content,
                        closeTime:this.voteInfo.closeTime,
                        isPublic:this.voteInfo.isPublic,
                        TotalPeoples:this.voteInfo.TotalPeoples,
                        CreatedByName:this.voteInfo.CreatedByName,
                        StatusCode:this.voteInfo.StatusCode,
                        options:this.voteInfo.options
                    },
                    peoples:this.voteInfo.peoples
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta: 2
                })
            })
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/vote.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .header{
            padding: 26rpx 33rpx;
            .row{
                display: flex;
                align-items: center;
                .Avatar{
                    width: 75rpx;
                    height: 75rpx;
                    line-height: 75rpx;
                    text-align: center;
                    border-radius: 50%;
                    background: #3399ff;
                    font-size: 21rpx;
                    color: #fff;
                }
                .rBox{
                    flex: 1;
                    margin-left: 24rpx;
                    .name{
                        font-size: 28rpx;
                        color: #333333;
                    }
                    .info{
                        font-size: 22rpx;
                        color: #999999;
                    }
                }
            }
            h3{
                font-size: 33rpx;
                color: #333333;
                font-weight: bold;
                padding: 28rpx 0;
            }
            .text_row{
                font-size: 24rpx;
                color: #999999;
                display: flex;
                justify-content: space-between;
                p{
                    display: flex;
                    align-items: center;
                    i{
                        color: #a4a4a4;
                    }
                    span{
                        margin-left: 10rpx;
                    }
                }
            }
            .title{
                font-size: 28rpx;
                color: #666666;
                padding: 15rpx 0;
            }
            .radio_wrap{
                .radio{
                    background: #fff;
                    margin: 17rpx 0;
                    padding: 35rpx 20rpx;
                    border-radius: 9rpx;
                    font-size: 33rpx;
                    color: #333333;
                }
            }
            .checkbox_wrap{
                .check{
                    background: #fff;
                    margin: 17rpx 0;
                    border-radius: 9rpx;
                    display: flex;
                    align-items: center;
                    padding: 26rpx 20rpx;
                    .row{
                        display: flex;
                        align-items: center;
                        .radius{
                            width: 104rpx;
                            height: 104rpx;
                            border: 1rpx solid #ebedec;
                            margin: 0 21rpx;
                        }
                        div:nth-child(3){
                            .name{
                                font-size: 31rpx;
                                color: #333333;
                            }
                            .deparment{
                                font-size: 28rpx;
                                color: #999999;
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
            z-index: 999;
            .box{
                display: flex;
                justify-content: space-around;
                padding: 25rpx 0;
                p{
                    width: 331rpx;
                    height: 85rpx;
                    line-height: 85rpx;
                    text-align: center;
                    font-size: 34rpx;
                    border-radius: 5rpx;
                }
                .pre{
                    background: #f8f8f8;
                    color: #333333;
                }
                .create{
                    background: #3399ff;
                    color: #ffffff;
                }
            }
        }
    }
</style>