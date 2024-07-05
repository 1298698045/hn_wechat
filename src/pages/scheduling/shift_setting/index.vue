<template>
    <div class="wrapper">
        <div class="panel">
            <van-cell title="排班模式" is-link :value="pattern.name" @click="handlePattern">
                <van-icon slot="right-icon" name="arrow" class="custom-icon" />
            </van-cell>
        </div>
        <div class="panel">
            <van-cell title="工时单位" is-link :value="manhourunit">
                <van-icon slot="right-icon" name="arrow" class="custom-icon" />
            </van-cell>
            <van-cell title="存欠设置" is-link>
                <van-icon slot="right-icon" name="arrow" class="custom-icon" />
            </van-cell>
        </div>
        <div class="panel" @click="handlerVacation">
            <van-cell title="假期类型" is-link :value="vacationType.name">
                <van-icon slot="right-icon" name="arrow" class="custom-icon" />
            </van-cell>
            <!-- <van-cell title="管床设置" is-link value="内容">
                <van-icon slot="right-icon" name="arrow" class="custom-icon" />
            </van-cell> -->
        </div>
        <div class="panel">
            <van-cell title="班次组合" is-link>
                <van-icon slot="right-icon" name="arrow" class="custom-icon" />
            </van-cell>
        </div>
        <div class="panel" @click="handlerRemind">
            <van-cell title="排班电话提醒" is-link :value="remind?'已开启':'未开启'">
                <van-icon slot="right-icon" name="arrow" class="custom-icon" />
            </van-cell>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            pattern:{
                id:1,
                name: '周排班'
            },
            manhourunit: '',
            vacationType: {
                id:1,
                name: ''
            },
            remind: true
        }
    },
    methods:{
        handlePattern(){
            wx.navigateTo({
                url: '/pages/scheduling/shift_setting/pattern/main'
            })
        },
        handlerVacation(){
            wx.navigateTo({
                url: '/pages/scheduling/shift_setting/vacationType/main'
            })
        },
        handlerRemind(){
            wx.navigateTo({
                url: '/pages/scheduling/shift_setting/phoneRemind/main'
            })
        }
    }
}
</script>
<style lang="scss">
    .wrapper{
        .panel{
            margin-top: 20rpx;
        }
    }
</style>