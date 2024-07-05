<template>
    <div class="wrap">
        <div class="nav">
            <span>
                首页
            </span>
            <span>
                <i-icon type="enter" size="18" i-class="icon" color="#999999" />
            </span>
            <span>
                绍兴第二医院
            </span>
        </div>
        <div class="rowWrap" @click="getAddDepartment">
            <p class="imgs">
                <img src="https://oawx.hnca.org.cn/img/wechat/05.7.Add.png" alt="">
            </p>
            <p class="text">
                新建部门 
            </p>
        </div>
        <div class="center">
            <div class="row" v-for="(item,index) in list" :key="index">
                <p>{{item.name}}</p>
                <p><i-icon type="collection" />下级</p>
            </div>
        </div>
        <van-popup
            :show="show"
            position="center"
            custom-style="width:80%;height: 20%;border-radius:10rpx;"
            @close="onClose"
        >
            <div class="popup">
                <h3>请输入部门名称</h3>
                <van-field
                    :value="value"
                    label="部门名称:"
                    placeholder="部门名称"
                    :border="false"
                    bind:change="onChange"
                />
                <div class="btn">
                    <p>
                        <span @click="getCancel">取消</span>
                        <span @click="getSubmit">确定</span>
                    </p>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list:[
                {
                    name:"院办"
                },
                {
                    name:"门诊"
                },
                {
                    name:"临床科室"
                },
                {
                    name:"财务"
                },
                {
                    name:"监察室"
                },
                {
                    name:"质控办"
                },
                {
                    name:"医务"
                }
            ],
            show:false,
            value:""
        }
    },
    methods:{
        getAddDepartment(){
            this.show = true;
        },
        getCancel(){
            this.show = false;
        },
        getSubmit(){
            this.show = false;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .nav{
            background: #fff;
            padding: 30rpx;
            font-size: 24rpx;
            span:nth-child(1){
                color: #3399ff;
            }
            span:nth-child(2){
                .icon{
                    margin-top: -5px;
                }
            }
            span:nth-child(3){
                color: #999999;
            }
        }
        .rowWrap{
            padding: 20rpx 30rpx;
            margin: 30rpx 0;
            display: flex;
            background: #fff;
            .imgs{
                width: 80rpx;
                height: 80rpx;
                justify-content: center;
                align-items: center;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .text{
                margin-left: 10px;
                line-height: 80rpx;
                font-size: 28rpx;
                color: #333333;
            }
        }
        .center{
            background: #fff;
            padding: 0 30rpx;
            .row{
                padding: 35rpx 0;
                display: flex;
                justify-content: space-between;
                border-bottom: 1rpx solid #eaebeb;
                p{
                    font-size: 28rpx;
                    color: #666666;
                }
                p:nth-child(2){
                    border-left: 1rpx solid #eaebeb;
                    color: #3399ff;
                    padding: 0 20rpx;
                }
            }
            .row:last-child{
                border: none;
            }
        }
        .popup{
            width: 100%;
            overflow: hidden;
            h3{
                padding: 30rpx 30rpx 0 30rpx;
                font-size: 12px;
                color: #999999;
            }
            .btn{
                p{
                    font-size: 12px;
                    color: #3399ff;
                    text-align: right;
                    padding-right: 30rpx;
                    span:nth-child(1){
                        margin-right: 20rpx;
                    }
                }
            }
        }
    }
</style>