<template>
    <div class="wrap">
        <div class="header">
            <div class="row">
                <p class="Avatar">
                    {{detail.OwningUserName}}
                </p>
                <div class="rBox">
                    <p class="name">
                        {{detail.OwningUserName}}
                    </p>
                    <p class="info">
                        信息中心 {{detail.CreatedOn}}
                    </p>
                </div>
            </div>
            <h3>{{detail.Title}}</h3>
            <div class="text_row">
                <p>
                    <i class="iconfont icon-shijian-copy"></i>
                    <span>
                        {{detail.CloseTime}} 截止
                    </span>
                </p>
                <p @click="getInvitees">
                    <i class="iconfont icon-canyuren"></i>
                    {{detail.AllowVoteQty}}人参与
                </p>
            </div>
            <div class="title">
                {{detail.PollType==1?'选项（最多可选5项）':'选项（单选）'}}
            </div>
            <div class="radio_wrap" v-if="detail.PollType==0&&!detail.HasPolled">
                <van-radio-group v-model="radio" @change="changeRadio">
                    <van-radio custom-class="radio" v-for="(item,index) in detail.Options" :key="index" :name="item.PollOptionId">{{item.SortNumber}}.  {{item.Option}}</van-radio>
                </van-radio-group>
            </div>
            <div class="checkbox_wrap"  v-if="detail.PollType==1&&!detail.HasPolled">
                <van-checkbox-group :value="result" @change="onChange">
                    <van-checkbox shape="square" custom-class="check" v-for="(item,index) in detail.Options" :key="index" :value="item.checked" :name="item.PollOptionId">
                        <div class="row">
                            <div>
                                {{item.SortNumber}}.
                            </div>
                            <div class="radius"></div>
                            <div>
                                <p class="name">{{item.Option}}</p>
                                <p class="deparment">{{item.Description}}</p>
                            </div>
                        </div>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
            <div class="progress_wrap" v-if="detail.HasPolled">
                <div class="row" v-for="(item,index) in detail.Options" :key="index">
                    <div class="num">
                        {{item.SortNumber}}.
                    </div>
                    <div class="rBox">
                        <div class="descript" v-if="detail.PollType==0">{{item.Option}}</div>
                        <div class="descript" v-if="detail.PollType==1">
                            <p class="img">
                                <img :src="item.ImgUrl" alt="">
                            </p>
                            <div class="text_r">
                                <p>{{item.Option}}</p>
                                <p>{{item.Description}}</p>
                            </div>
                        </div>
                        <div class="r">
                            <p class="progress">
                                <span :style="{width:item.widthNum+'rpx',background:colorList[index]}"></span>
                            </p>
                            <p class="num" v-if="detail.IsPublic">
                                <span>
                                    {{item.PollQty}}票
                                </span>
                                <span>
                                    {{item.num}}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <i-icon type="enter" size="20" color="#666666" />
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <p class="create" @click="getSubmit" v-if="!detail.HasPolled">我要投票</p>
                <p class="default" v-else>你已投票</p>
            </div>
        </div>
    </div>
</template>
<script>
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
            result:[],
            PollId:"",
            sessionkey:"",
            detail:{},
            radio:"",
            colorList:[
                '#3399ff',
                'red',
                'yellow',
                '#FF6666'
            ]
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(options){
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.PollId = options.PollId;
        this.getDetail();
    },
    methods:{
        getDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.getpoll,
                    SessionKey:this.sessionkey,
                    id:this.PollId
                }
            }).then(res=>{
                console.log(res);
                this.detail = res.data;
                this.detail.Options.forEach(item=>{
                    this.$set(item,'checked',false);
                    let num = this.GetPercent(item.PollQty,item.Pct);
                    let widthNum = this.toPoint(num) * 333;
                    this.$set(item,'num',num);
                    this.$set(item,'widthNum',widthNum);
                })
            })
        },
        toPoint(percent){
            var str=percent.replace("%","");
            str= str/100;
            return str;
        },
        GetPercent(num, total) {
            /// <summary>
            /// 求百分比
            /// </summary>
            /// <param name="num">当前数</param>
            /// <param name="total">总数</param>
            num = parseFloat(num);
            total = parseFloat(total);
            if (isNaN(num) || isNaN(total)) {
                return "-";
            }
            return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
        },
        changeRadio(e){
            this.radio = e.mp.detail;
            this.detail.polloptionids = this.radio;
        },
        onChange(e){
            this.result = e.mp.detail;
            this.detail.polloptionids = this.result.join(',');
            for(var i=0;i<this.detail.Options.length;i++){
                this.detail.Options[i].checked = false;
                for(var j=0;j<this.result;j++){
                    if(this.detail.Options[i].PollOptionId===this.result[j]){
                        this.detail.Options[i].checked = true;
                        break;
                    }
                }
            }
        },
        getInvitees(){
            const url = '/pages/vote/joinDetail/main';
            wx.navigateTo({url:url})
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.response,
                    SessionKey:this.sessionkey,
                    pollid:this.detail.PollId,
                    polloptionids:this.detail.polloptionids
                }
            }).then(res=>{
                console.log(res);
                this.getDetail();
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
        padding-bottom: 100px;
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
            .progress_wrap{
                .row{
                    display: flex;
                    align-items: center;
                    background: #fff;
                    border-radius: 9rpx;
                    padding: 30rpx 20rpx;
                    margin-top: 17rpx;
                    .num{
                        font-size: 31rpx;
                        color: #333333;
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 24rpx;
                        .descript{
                            font-size: 31rpx;
                            color: #333333;
                            display: flex;
                            align-items: center;
                            .img{
                                width: 104rpx;
                                height: 104rpx;
                                border: 1rpx solid #ebedec;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    vertical-align: middle;
                                }
                            }
                            .text_r{
                                margin-left: 21rpx;
                                p:nth-child(1){
                                    font-size: 31rpx;
                                    color: #333333;
                                }
                                p:nth-child(2){
                                    color: #999999;
                                    font-size: 31rpx;
                                }
                            }
                        }
                        .r{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .progress{
                                width: 331rpx;
                                height: 21rpx;
                                background: #e5e5e5;
                                margin-top: 27rpx;
                                span{
                                    display: block;
                                    width: 30rpx;
                                    height: 100%;
                                    background: #ff6666;
                                }
                            }
                            .num{
                                height: 21rpx;
                                font-size: 25rpx;
                                color: #999999;
                                span:nth-child(1){
                                    margin-right: 28rpx;
                                }
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
                padding: 25rpx 24rpx;
                p{
                    width: 100%;
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
                .default{
                    background: #f8f8f8;
                    color: #cccccc;
                }
            }
        }
    }
</style>