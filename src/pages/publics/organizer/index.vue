<template>
    <div class="wrap">
        <div class="search">
            <van-search :value="keyValue" placeholder="请输入搜索关键词" @change="changeSearch" />
        </div>
        <div class="header">
            <div class="row">
                <div class="lBox">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/AO1-1.png" alt="">
                    </p>
                </div>
                <div class="rBox">
                    <p class="sign">常用联系人</p>
                </div>
            </div>
            <div class="mailList">
                <div class="contRow" :class="{'active':num==index}" v-for="(item,index) in list" :key="index" @click="getSelect(item,index)">
                    <div class="l">
                        <p>
                            {{item.name}}
                        </p>
                    </div>
                    <div class="r">
                        <p>{{item.FullName}}</p>
                        <p>{{item.DeptName}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
    data(){
        return {
            list:[],
            keyValue:"",
            sessionkey:"",
            num:-1,
            sign:""
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.sign = options.sign; // 0 组织人 1 会议纪要指派人
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.queryList();
    },
    methods:{
        ...mapMutations([
            'handleOrganizer',
            'handleDesignee'
        ]),
        changeSearch(e){
            this.keyValue = e.mp.detail;
            if(this.keyValue!=''){
                this.getQuery();
            }else {
                this.queryList();
            }

        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.user.search",
                    SessionKey:this.sessionkey,
                    search:this.keyValue
                }
            }).then(res=>{
                console.log(res);
                if(this.keyValue!=''){
                    this.list = res.listData;
                    this.list.forEach(item=>{
                        this.$set(item,'checked',false);
                        const name = item.FullName.substr(1);
                        this.$set(item,'name',name);
                    })
                }
            })
        },
         // 常用联系人
        queryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.getlatestlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.data;
                this.list.forEach(item=>{
                    this.$set(item,'checked',false);
                    const name = item.FullName.substr(1);
                    this.$set(item,'name',name);
                })
            })
        },
        getSelect(item,index){
            this.num = index;
            if(this.sign==0){
                let organizer = {
                    FullName:item.FullName,
                    DeptName:item.DeptName,
                    id:item.ValueId
                }
                console.log(organizer);
                this.handleOrganizer(organizer);
            }else {
                let designee = {
                    FullName:item.FullName,
                    DeptName:item.DeptName,
                    id:item.ValueId
                }
                this.handleDesignee(designee);
            }
            wx.navigateBack({
                delta:1
            })
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
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                        .imgs{
                            width: 20rpx;
                            height: 20rpx;
                        }
                    }
                }
                .rBox{
                    flex: 1;
                    margin-left: 25rpx;
                    font-size: 35rpx;
                    color: #333333;
                    .sign{
                        font-weight: bold;
                    }
                }
            }
            .mailList{
                padding: 0 32rpx;
                .contRow.active{
                    opacity: .5;
                }
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