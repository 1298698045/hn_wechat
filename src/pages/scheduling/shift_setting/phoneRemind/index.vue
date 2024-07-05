<template>
    <div class="wrapper">
        <div class="center">
            <div class="panel">
                <div class="row">
                    <p class="l_text">
                        排班电话提醒
                    </p>
                    <p class="r_text">
                        <van-switch :checked="checked" size="20px" @change="changeSwitch" />
                    </p>
                </div>
                <div class="row" @click="handlerRemind">
                    <p class="l_text">
                        提醒时间
                    </p>
                    <p class="r_text">
                        {{timeVal}}
                        <i-icon type="enter" size="18" />
                    </p>
                </div>
            </div>
            <van-popup :show="isPicker" custom-class="popup" position="bottom" @close="onClose">
                <div class="head">
                    <p class="cancel" @click="onClose">取消</p>
                    <p class="confirm" @click="handlerConfirm">确定</p>
                </div>
                <picker-view indicator-class="pickview" style="width: 100%; height: 300px;" :value="value" @change="bindChange">
                    <picker-view-column>
                        <div class="view" v-for="(item,index) in labels" :key="index">{{item.name}}</div>
                    </picker-view-column>
                    <picker-view-column>
                        <div class="view" v-for="(item,index) in times" :key="index">{{item}}</div>
                    </picker-view-column>
                </picker-view>
            </van-popup>
        </div>
        <div class="saveBtn">
            <van-button type="primary" round block color="#3399ff">保存</van-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            typeList:[
                {
                    id:1,
                    label:'正常上班'
                },
                {
                    id:2,
                    label: '休息'
                }
            ],
            typeIdx:0,
            value: '',
            labels:[
                {
                    name:'下周期开始前1日'
                },
                {
                    name:'下周期开始前2日'
                },
                {
                    name:'下周期开始前3日'
                },
            ],
            times:['16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
            isPicker: false,
            label:"",
            time:"",
            timeVal:"",
            checked: false
        }
    },
    methods: {
        changeSwitch(e){
            this.checked = e.mp.detail;
        },
        handlerRemind(){
            this.isPicker = true;
        },
        bindChange(e){
            let val = e.mp.detail.value;
            this.label = this.labels[val[0]].name;
            this.time = this.times[val[1]];
            console.log(this.label, this.time)
        },
        onClose(){
            this.label = '';
            this.time = '';
            this.isPicker = false;
        },
        handlerConfirm(){
            if(this.label){
                this.timeVal = `${this.label}-${this.time}`;
                this.isPicker = false;
            }
        }
    },
}
</script>
<style lang="scss">
    .wrapper{
        .panel{
            background: #fff;
            margin-top: 20rpx;
            .row{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--cell-vertical-padding,10px) var(--cell-horizontal-padding,16px);
                font-size: 26rpx;
                color: #333;
                .r_text{
                    display: flex;
                    align-items: center;
                }
            }
        }
        .popup{
            .head{
                display: flex;
                align-items: center;
                justify-content: space-between;
                line-height: 80rpx;
                padding: 0 30rpx;
                box-sizing: border-box;
                font-size: 28rpx;
                .cancel{
                    color: #999;
                }
                .confirm{
                    color: #3399ff;
                }
            }
        }
        .pickview {
            // line-height: 80rpx;
            // height: 80rpx;
        }
        .view{
            line-height: 80rpx;
            height: 80rpx;
            text-align: center;
            font-size: 26rpx;
            color: #333;
        }
        .saveBtn{
            margin: 100rpx 30rpx;
        }
    }
</style>