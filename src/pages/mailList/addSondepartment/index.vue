<template>
    <div class="wrap">
        <div class="header">
            <van-cell-group>
                <van-field
                    input-class="inp"
                    :value="username"
                    required
                    clearable
                    label="部门名称"
                />
                <van-field
                    input-class="inp"
                    :value="deparment"
                    :readonly="true"
                    clearable
                    label="上级部门"
                    icon="arrow"
                    @click="getIcon"

                />
            </van-cell-group>
        </div>
        <div class="row">
            <p>创建部门群</p>
            <p>
                <van-switch :checked="checked" size="20px" @change="changeSwitch" />
            </p>
        </div>
        <h3>创建一个关联此部门的部门群，部门成员会被自动加入</h3>
        <div class="btn">
            <van-button type="primary" color="#3399ff" block>完成</van-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            username:"",
            deparment:"绍兴第二医院",
            checked:true
        }
    },
    methods:{
        getIcon(){
            const url = "/pages/mailList/selectSuperior/main";
            wx.navigateTo({url:url});
        },
        changeSwitch(e){
            this.checked = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .header{
            background: #ffffff;
            margin: 20rpx 0;
            .inp{
                text-align: right;
            }
        }
        .row{
            background: #fff;
            padding: 20rpx 30rpx;
            font-size: 28rpx;
            display: flex;
            justify-content: space-between;
        }
        h3{
            font-size: 12px;
            color: #999999;
            padding: 30rpx;
        }
        .btn{
            padding: 30rpx;
        }
    }
</style>