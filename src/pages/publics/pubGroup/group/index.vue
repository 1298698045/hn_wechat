<template>
    <div class="wrap">
        <div class="header">
            <van-search :value="value" placeholder="搜索" />
            <div class="box">
                <van-checkbox :value="check" @change="changeAll">
                        <p :style="{'width':width+'px'}">全选</p>
                </van-checkbox>
            </div>
        </div>
        <div class="center">
            <van-checkbox-group :value="result" @change="changeGroup">
                <van-checkbox custom-class="checkbox" :vlaue="item.checked" :name="item.groupId" v-for="(item,index) in list" :key="index">
                    <div class="contRow" :style="{'width':width+'px'}">
                        <div class="l">
                            <p>
                                {{item.name}}
                            </p>
                        </div>
                        <div class="r">
                            <p>{{item.name}}</p>
                            <p>{{item.Quantity}}人</p>
                        </div>
                    </div>
                </van-checkbox>
            </van-checkbox-group>
        </div>
        <GroupTotal  @childFn="getSubmit" />
    </div>
</template>
<script>
import GroupTotal from '@/components/mailList/groupTotal';
import {mapState,mapMutations} from 'vuex';
export default {
    components:{
        GroupTotal
    },
    data(){
        return {
            width:"",
            check:false,
            sessionkey:"",
            result:[],
            list:[],
            selectData:[]
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        this.width = wx.getSystemInfoSync().windowWidth-60;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    computed:{
        ...mapState({
            
        })
    },
    methods:{
        ...mapMutations([
            'getGroupList',
            'getGroupLength'
        ]),
        getSubmit(){
           this.selectData = this.selectData.map(item=>({
                id:'R:'+item.id,
                name:item.name
            }))
            this.getGroupList(this.selectData);
            wx.navigateBack({
                delta: 2
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.groups.search",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.forEach(item=>{
                    this.$set(item,'checked',false);
                })
            })
        },
        changeAll(e){
            console.log(e);
            this.check = e.mp.detail;
            if(this.check){
                let temp = [];
                this.list.forEach(item=>{
                    this.$set(item,'checked',true);
                    temp.push({
                        id:item.groupId,
                        name:item.name
                    });
                })
                this.selectData = temp;
                this.result = temp.map(item=>{
                    return item.id;
                });
            }else {
                this.list.forEach(item=>{
                    this.$set(item,'checked',false);
                })
                this.result = [];
                this.selectData = [];
            }
            this.getGroupLength(this.selectData.length);
            // this.getGroupList(this.selectData);
            console.log(this.result,this.selectData,'1231231');
        },
        changeGroup(e){
            this.result = e.mp.detail;
            let selectData = [];
            for(var i=0; i<this.list.length;i++){
                this.list[i].checked = false;
                for(var j=0; j<this.result.length; j++){
                    if(this.list[i].groupId==this.result[j]){
                        this.list[i].checked = true;
                        selectData.push({
                            id:this.list[i].groupId,
                            name:this.list[i].name
                        })
                        break;
                    }
                }
            }
            this.selectData = selectData;
            // this.getGroupList(selectData);
            this.getGroupLength(this.selectData.length);
            console.log(selectData);
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
            .box{
                padding: 16rpx 33rpx;
                font-size: 35rpx;
                color: #333333;
            }
        }
        .center{
            background: #fff;
            margin-top: 16rpx;
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