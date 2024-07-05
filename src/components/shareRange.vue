<template>
    <div class="pop_wrap">
        <div class="box">
            <van-radio-group :value="value" @change="changeRadio">
                <van-radio name="0" custom-class="radio">
                    <div class="row" :style="{'width':width+'px'}">
                        <p class="name">公开</p>
                        <p class="desc">所有人可见</p>
                    </div>
                </van-radio>
                <van-radio name="1" custom-class="radio">
                    <div class="row" :style="{'width':width+'px'}">
                        <p class="name">私密</p>
                        <p class="desc">仅自己可见</p>
                    </div>
                </van-radio>
                <van-radio name="3" custom-class="radio">
                    <div class="content" :style="{'width':width+'px'}">
                        <div class="row">
                            <p class="name">部分可见</p>
                            <p class="desc">指定的小组可见</p>
                        </div>
                        <div class="icon">
                            <i-icon type="unfold" />
                        </div>
                    </div>
                </van-radio>
            </van-radio-group>
        </div>
        <div class="box_child" v-if="value==3">
             <van-radio-group :value="groupId" @change="changeGroup">
                <van-radio :name="item.groupId" custom-class="radio" v-for="(item,index) in groupList" :key="index">
                    <div class="row" :style="{'width':width+'px'}">
                        <p class="name">{{item.name}}</p>
                    </div>
                </van-radio>
            </van-radio-group>
        </div>
        <div class="add_box" v-if="value==3" @click="getAddGroup">
            <div class="icon">
                <i class="iconfont icon-tianjia"></i>
            </div>
            <p class="name">创建小组</p>
        </div>
    </div>
</template>
<script>
export default {
    name:"shareRange",
    data(){
        return {
            value:'0',
            width:"",
            groupId:"",
            groupList:[]
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onShow(){
        if(this.value==3){
            this.queryGroup();
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
    },
    methods:{
        changeRadio(e){
            this.value = e.mp.detail;
            if(this.value!=3){
                this.$emit('changeValue',{
                    show:false,
                    value:this.value
                })
            }else {
                this.queryGroup();
            }
        },
        changeGroup(e){
            this.groupId = e.mp.detail;
            this.$emit('changeValue',{
                show:false,
                value:3,
                groupid:this.groupId
            })
        },
        queryGroup(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:'sys.groups.search',
                    SessionKey:this.sessionkey,
                    scope:'public'
                }
            }).then(res=>{
                this.groupList = res.listData;
            })
        },
        // 创建小组
        getAddGroup(){
            const url = '/pages/publics/createGroup/main';
            wx.navigateTo({url:url});
        }
    },
    onLoad(){
        this.width = wx.getSystemInfoSync().windowWidth-50;
    }
}
</script>
<style lang="scss">
@import '../../static/css/journal.css';
    .pop_wrap{
        background: #f4f4f4!important;
        .box{
            margin-top: 33rpx;
            .radio{
                display: flex;
                padding: 40rpx 33rpx;
                background: #fff;
                border-bottom: 1rpx solid #e2e4e3;
                .row{
                    .name{
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .desc{
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
                .content{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 20rpx;
                }
            }
        }
        .box_child{
            margin-top: 33rpx;
            padding-left: 100rpx;
            background: #fff;
            .radio{
                display: flex;
                padding: 40rpx 33rpx;
                background: #fff;
                border-bottom: 1rpx solid #e2e4e3;
                .row{
                    .name{
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .desc{
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
                .content{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 20rpx;
                }
            }
        }
        .add_box{
            display: flex;
            align-items: center;
            margin-top: 33rpx;
            padding-left: 100rpx;
            background: #fff;
            .icon{
                margin-right: 20rpx;
                i{
                    font-size: 18px;
                    color: #3399ff;
                }
            }
            p{
                padding: 34rpx 0;
            }
            .name{
                font-size: 32rpx;
                color: #666666;
            }
        }
    }
</style>