<template>
    <div class="wrap">
        <div class="row">
            <van-cell-group>
                <van-field
                    label="小组名称"
                    :required="true"
                    :value="name"
                    placeholder="请输入名称"
                    :border="false"
                    input-align="right"
                    @change="onChange"
                />
            </van-cell-group>
        </div>
        <h3>
            小组成员
        </h3>
        <div class="add" @click="getAddPeople">
            <div class="icon">
                <i class="iconfont icon-tianjia"></i>
            </div>
            <p class="name">
                添加成员
            </p>
        </div>
        <div class="peopleWrap">
            <div class="rowBox" v-for="(item,index) in selectListName" :key="index">
                <div class="icon_del" @click="handleDel(item,index)">
                    <i class="iconfont icon-shanchu"></i>
                </div>
                <div class="avator">
                    {{item.name}}
                </div>
                <div class="info">
                    <p class="name">{{item.FullName}}</p>
                    <p class="depart">{{item.DeptName}}</p>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box_wrap">
                <div class="btn cancel" @click="getCancel">取消</div>
                <div class="btn" :class="{'active':name!=''}" @click="name!=''?addPeople():''">完成</div>
            </div>
        </div>
    </div>
</template>
<script>
import {message} from '@/utils/message';
import { mapState,mapMutations } from 'vuex';
import { splitName } from '@/utils/splitName';
export default {
    data(){
        return {
            name:""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        ...mapState({
            selectListName:state=>{
                return state.mailList.selectListName;
            }
        }),
        listName(){
            let temp = [];
            if(this.selectListName!=''){
                this.selectListName.forEach(item=>{
                    let name = splitName(item.FullName);
                    this.$set(item,'name',name);
                })
            }
            return temp;
        }
    },
    onUnload(){
        this.getClear([]);
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
    },
    methods:{
        ...mapMutations(['getSingleDelete','getClear']),
        onChange(e){
            this.name = e.mp.detail;
        },
        getAddPeople(){
            const url = '/pages/publics/mailList/main';
            wx.navigateTo({url:url});
        },
        handleDel(item,index){
            this.getSingleDelete(item.id);
        },
        getSubmit(){
            return new Promise((resolve,reject)=>{
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:'sys.group.create',
                        SessionKey:this.sessionkey,
                        name:this.name
                    }
                }).then(res=>{
                    this.id = res.data.id;
                    resolve(res);
                    // if(res.status===1){
                    //     message.toast({
                    //         title:res.msg,
                    //         delta:1
                    //     })
                    // }
                })
            })
        },
        async addPeople(){
            const w = await this.getSubmit();
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:'sys.group.adduser',
                    SessionKey:this.sessionkey,
                    groupId:this.id,
                    Userid:this.selectListName.map(item=>item.id).join(','),
                    action:"+"
                }
            }).then(res=>{
                if(res.status===1){
                    message.toast({
                        title:res.msg,
                        delta:1
                    })
                }
            })
        },
        getCancel(){
            wx.navigateBack({
                delta:1
            })
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/journal.css';
    .wrap{
        .row{
            margin-top: 35rpx;
        }
        h3{
            padding: 31rpx 33rpx;
            font-size: 26rpx;
            color: #999999;
        }
        .add{
            display: flex;
            align-items: center;
            padding: 30rpx 33rpx;
            background: #fff;
            .icon{
                i{
                    color: #3399ff;
                    font-size: 20px;
                }
            }
            .name{
                font-size: 33rpx;
                color: #3399ff;
                margin-left: 20rpx;
            }
        }
        .peopleWrap{
            margin-top: 35rpx;
            background: #fff;
            .rowBox{
                display: flex;
                align-items: center;
                padding: 25rpx 33rpx;
                border-bottom: 1rpx solid #e2e3e5;
                .icon_del{
                    i{
                        font-size: 20px;
                        color: #FF6666;
                    }
                }
                .avator{
                    width: 104rpx;
                    height: 104rpx;
                    line-height: 104rpx;
                    border-radius: 50%;
                    text-align: center;
                    background: #3399ff;
                    color: #fff;
                    margin-left: 33rpx;
                    font-size: 26rpx;
                }
                .info{
                    color: #333333;
                    font-size: 33rpx;
                    margin-left: 33rpx;
                }
                .depart{
                    color: #999999;
                    font-size: 28rpx;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 99;
            padding: 21rpx 33rpx;
            .box_wrap{
                display: flex;
                justify-content: space-between;
                padding: 24rpx 0;
                .btn{
                    width: 328rpx;
                    height: 83rpx;
                    line-height: 83rpx;
                    text-align: center;
                    font-size: 33rpx;
                    color: #fff;
                    background: rgba(51, 153, 255, .5);;
                    border-radius: 5rpx;
                    cursor: no-drop;
                }
                .btn.active{
                    background: rgba(51, 153, 255, 1);;
                }
                .cancel{
                    color: #333;
                    background: #f3f3f3;
                    border:1rpx solid #dadcdb;
                }
            }
        }
    }
</style>