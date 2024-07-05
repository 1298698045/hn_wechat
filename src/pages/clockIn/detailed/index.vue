<template>
    <div class="wrap">
        <i-tabs :current="current" @change="changeTabs">
            <i-tab key="tab1" :title="'已打卡('+info.Check+')'"></i-tab>
            <i-tab key="tab2" :title="'应到但未打卡('+info.NotCheck+')'"></i-tab>
        </i-tabs>
            <scroll-view scroll-x="true" class="scroll">
                <div class="header">
                    <p :class="{active:num==index}" v-for="(item,index) in current=='tab1'?list:listT" :key="index" @click="getSwitch(item,index)">{{item.name}}({{item.total}})</p>
                </div>
            </scroll-view>
        <div class="center">
            <div class="content" v-for="(item,index) in listData" :key="index">
                <div class="imgs">
                    <p>{{item.copyName}}</p>
                </div>
                <div class="cont">
                    <div class="l">
                        <p>{{item.Name}}</p>
                        <p>{{item.DeptName}}</p>
                    </div>
                    <div class="r">
                        <p>{{statusName}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            current:"tab1",
            list:[
                {
                    name:"全部已打卡",
                    code:'Check'
                },
                {
                    name:"正常",
                    code:"Ok"
                },
                {
                    name:"迟到",
                    code:'Late'
                },
                {
                    name:"外勤",
                    code:'Out'
                },
                {
                    name:"早退",
                    code:"Leave"
                }
            ],
            statusName:"",
            listT:[
                {
                    name:"全部未打卡",
                    code:"Notcheck"
                },
                {
                    name:"矿工",
                    code:"Absent"
                },
                {
                    name:"缺卡",
                    code:"Lackcheck"
                },
            ],
            // list:['全部已打卡(10)','迟到(2)','外勤(6)','早退(1)','缺卡(2)'],
            // listT:['全部未打卡(13)','矿工(5)'],
            num:0,
            total:5,
            date:"",
            listData:[],
            scope:"Check",
            info:{},
            sessionkey:""
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.date = options.date;
        this.scope = options.scope;
        this.current = options.tab;
        if(this.current=='tab1'){
            this.num = this.list.findIndex(item=>item.code==options.scope);
        }else {
            this.num = this.listT.findIndex(item=>item.code==options.scope);
        }
        console.log(this.num,'----')
        this.getQuery();
        this.queryAll();
    },
    methods:{
        queryAll(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attendrpt.day.get",
                    SessionKey:this.sessionkey,
                    date:this.date
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data;
                this.$set(this.list[0],'total',res.data.Check);
                this.$set(this.list[1],'total',res.data.Ok);
                this.$set(this.list[2],'total',res.data.Late);
                this.$set(this.list[3],'total',res.data.Out);
                this.$set(this.list[4],'total',res.data.Leave);
                // this.$set(this.list[4],'total',res.data.Leave);
                this.$set(this.listT[0],'total',res.data.NotCheck);
                this.$set(this.listT[1],'total',res.data.Absent);
                this.$set(this.listT[2],'total',res.data.LackCheck);
                console.log(this.list,'123123');
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attenddetail.peoples.getlist",
                    SessionKey:this.sessionkey,
                    date:this.date,
                    scope:this.scope
                }
            }).then(res=>{
                console.log(res);
                this.listData = res.listData[0];
                this.listData.map(item=>{
                    const copyName = item.Name.length>2?item.Name.substr(1):item.Name;
                    item.copyName = copyName;
                    return item;
                })
            })
        },
        changeTabs(e){
            this.num = 0;
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.scope = 'Check';
                this.num = 0;
                this.getQuery();
            }else if(this.current=='tab2'){
                this.listData = [];
                this.scope = 'Notcheck';
                this.getQuery();
            }
        },
        getSwitch(item,index){
            this.num = index;
            this.statusName = item.name;
            this.scope = item.code;
            this.getQuery();
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .scroll{
            background: #fff;
            white-space: nowrap;
            .header{
                display: flex;
                padding: 10rpx 20rpx;
                p{
                    font-size: 24rpx;
                    color: #666666;
                    padding: 15rpx;
                    border-radius: 5rpx;
                    background: #f4f4f4;
                    margin: 10rpx;
                }
                p.active{
                    color: #3399ff;
                    background: #dae9fc;
                }
            }
        }
        .center{
            .content:last-child .cont{
                border: none;
            }
            .content{
                background: #fff;
                padding: 0 33rpx;
                display: flex;
                .imgs{
                    padding: 15rpx 0;
                    p{
                        width: 72rpx;
                        height: 72rpx;
                        line-height: 72rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 22rpx;
                    }
                }
                .cont{
                    padding: 15rpx 0;
                    margin-left: 20rpx;
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #eceeed;
                    .l{
                        p:nth-child(1){
                            font-size: 29rpx;
                            color: #333333;
                        }
                        p:nth-child(2){
                            font-size: 22rpx;
                            color: #999999;
                        }
                    }
                    .r{
                        font-size: 25rpx;
                        color: #999999;
                    }
                }
            }
        }
    }
</style>