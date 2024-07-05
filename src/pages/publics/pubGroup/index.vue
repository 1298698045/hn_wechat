<template>
    <div class="wrap">
        <div class="header">
            <van-search :value="value" placeholder="搜索" />
            <div class="row" @click="getSelDepartment">
                <div class="lBox">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/05.Organization.png" alt="">
                    </p>
                </div>
                <div class="rBox">
                    <p>选择部门</p>
                </div>
            </div>
            <div class="row" @click="getSelGroup">
                <div class="lBox">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/AO1-1.MyGroup.png" alt="">
                    </p>
                </div>
                <div class="rBox">
                    <p>选择群组</p>
                </div>
            </div>
        </div>
        <!-- <h3>
            最近联系
        </h3> -->
        <!-- <div class="center">
            <van-checkbox-group :value="result" @change="changeGroup">
                <van-checkbox custom-class="checkbox" :vlaue="item.checked" :name="item.ValueId" v-for="(item,index) in 5" :key="index">
                    <div class="contRow" :style="{'width':width+'px'}">
                        <div class="l">
                            <p>
                                {{'123'}}
                            </p>
                        </div>
                        <div class="r">
                            <p>{{'12432'}}</p>
                            <p>{{'12312'}}</p>
                        </div>
                    </div>
                </van-checkbox>
            </van-checkbox-group>
        </div> -->
        <GroupTodal />
    </div>
</template>
<script>
import GroupTodal from '@/components/mailList/groupTotal';
export default {
    components:{
        GroupTodal
    },
    data(){
        return {
            value:""
        }
    },
    methods:{
        getSelDepartment(){
            const url = '/pages/publics/pubGroup/department/main';
            wx.navigateTo({url:url});
        },
        getSelGroup(){
            const url = '/pages/publics/pubGroup/group/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .header{
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                padding: 16rpx 32rpx;
                .lBox{
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .rBox{
                    flex: 1;
                    margin-left: 25rpx;
                    font-size: 35rpx;
                    color: #333333;
                }
            }
        }
        h3{
            font-size: 25rpx;
            color: #999999;
            background: #f2f3f4;
            padding: 17rpx 33rpx;
        }
        .center{
            background: #fff;
            .checkbox{
                padding: 0 33rpx!important;
                display: flex;
                align-items: center;
                .contRow{
                    display: flex;
                    .l{
                        padding: 20rpx 0;
                        p{
                            width: 80rpx;
                            height: 80rpx;
                            line-height: 80rpx;
                            text-align: center;
                            border-radius: 50%;
                            background: #3399ff;
                            color: #fff;
                            font-size: 26rpx;
                        }
                    }
                    .r{
                        flex: 1;
                        width: 100%;
                        margin-left: 30rpx;
                        padding: 20rpx 0;
                        p:nth-child(1){
                            font-size: 35rpx;
                            color: #333333;
                        }
                        p:nth-child(2){
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
</style>