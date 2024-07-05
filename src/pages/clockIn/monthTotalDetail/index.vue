<template>
    <div class="wrap">
        <h3>{{year}}.{{month}} {{name}} {{listTotal}}</h3>
        <div class="content">
            <div class="row" v-for="(item,index) in list" :key="index">
                <div class="left">
                    <p>{{item.newName}}</p>
                </div>
                <div class="right">
                    <div class="l">
                        <p class="name">{{item.Name}}</p>
                        <p class="department">{{item.DeptName}}</p>
                    </div>
                    <div class="r">
                        <p>
                            <span>{{item.RowNumber}}</span>
                            <i-icon type="enter" size="20" color="#999999" />
                        </p>
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
            name:"",
            sessionkey:"",
            scope:"",
            list:[],
            RuleCode:"",
            year:"",
            month:""
        }
    },
    computed:{
        date(){
            let nowDate = new Date();
            let y = nowDate.getFullYear();
            let m = nowDate.getMonth()+1;
            let d = nowDate.getDate();
            return `${y}-${this.getStr(m)}-${this.getStr(d)}`;
        },
        // year(){
        //     let nowDate = new Date();
        //     let y = nowDate.getFullYear();
        //     return y;
        // },
        // month(){
        //     let nowDate = new Date();
        //     let m = nowDate.getMonth()+1;
        //     return m;            
        // },
        listTotal(){
            return this.list.length;
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.name = options.name;
        this.RuleCode = options.RuleCode;
        this.year = options.year;
        this.month = options.month;
        wx.setNavigationBarTitle({
            title:String(this.name)
        })
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.clockIn.peoplesList,
                    SessionKey:this.sessionkey,
                    year:this.year,
                    month:this.month,
                    ruleCode:this.RuleCode
                }
            }).then(res=>{
                this.list = res.data;
                this.list.map(item=>{
                    if(item.Name.length>2){

                        const newName = item.Name.substr(1);
                        item.newName = newName;
                    }else {
                        item.newName = item.Name;
                    }
                    return item;
                })
                console.log(this.list);
            })
        },
        getStr(v){
            let str = '';
            if(v<10){
                str = '0'+v;
            }else {
                str = v;
            }
            return str;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        h3{
            font-size: 26rpx;
            color: #999999;
            padding: 37rpx 24rpx;
        }
        .content{
            background: #fff;
            .row:last-child .right{
                border: none;
            }
            .row{
                display: flex;
                align-items: center;
                padding: 0 33rpx;
                .left{
                    p{
                        width: 72rpx;
                        height: 72rpx;
                        border-radius: 50%;
                        background: #3399ff;
                        font-size: 21rpx;
                        color: #fff;
                        text-align: center;
                        line-height: 72rpx;
                    }
                }
                .right{
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #e2e3e5;
                    padding: 19rpx 0;
                    margin-left: 20rpx;
                    .l{
                        .name{
                            font-size: 29rpx;
                            color: #333333;
                        }
                        .department{
                            font-size: 22rpx;
                            color: #999999;
                        }
                    }
                    .r{
                        span{
                            margin-right: 20rpx;
                            font-size: 34rpx;
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
</style>