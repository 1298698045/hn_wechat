<template>
    <div class="wrap">
        <div class="header">
            <div class="nav">
                <p @click="getAdd">添加</p>
                <p @click="getAdmin" v-if="!show">管理</p>
                <!-- <p v-else-if="show" @click="getCancel">取消</p> -->
                <p v-if="show" @click="getAllSelect">全选</p>
            </div>
        </div>
        <div class="center">
            <van-checkbox-group :value="result" @change="onChange">
                <div class="row" v-for="(item,index) in list" :key="index">
                    <div class="check" v-if="show">
                        <van-checkbox :name="item.Id"></van-checkbox>
                    </div>
                    <div class="name">
                        <p class="radius">{{item.ObjectName}}</p>
                    </div>
                    <div class="cont">
                        <div>
                            <p>{{item.ObjectName}}</p>
                            <p>信息中心</p>
                        </div>
                        <div>
                            <p>创建者</p>
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="footer" v-if="show">
            <div class="box">
                <p>已选择:</p>
                <p class="btn" :class="{'active':result!=''}" @click="getDelete">删除({{count}}/{{total}})</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            result:[],
            show:false,
            total:3,
            id:"",
            RightCode:"",
            list:[],
            sessionkey:"",
            RightCode:""
        }
    },
    computed:{
        count(){
            return this.result.length;
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        let index = options.index;
        this.id = options.id;
        this.RightCode = options.RightCode;
        if(index=='0'){
            this.RightCode  = 32;
        }else if(index=='1'){
            this.RightCode = 4;
        }else if(index=='2'){
            this.RightCode = 2;
        }
        // this.queryList();
        this.getQuery();
    },
    onShow(){
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.access,
                    SessionKey:this.sessionkey,
                    id:this.id,
                    RightCode:this.RightCode
                }
            }).then(res=>{
                console.log(res);
                this.list = res.data;
                this.total = res.data.length;
            })
        },
        // 常用联系人
        queryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.addresslist,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                this.list = res;
                this.list.map(item=>{
                    const name = item.FullName.substr(1);
                    item.name = name;
                    return item;
                })
            })
        },
        onChange(e){
            this.result = e.mp.detail;
        },
        getAdd(){
            // this.$httpWX.get({
            //     url:this.$api.message.queryList,
            //     data:{
            //         method:"file.folderright.add",
            //         SessionKey:this.sessionkey,
            //         Id:this.id,
            //         RightCode:this.RightCode,
            //         ObjectTypeCode:0,
            //         ObjectId:this.result.join(',')
            //     }
            // }).then(res=>{
            //     console.log(res);
            // })
            const url = '/pages/publics/mailList/main?admin='+0+'&foldersId='+this.id+'&RightCode='+this.RightCode;
            wx.navigateTo({url:url});
        },
        getDelete(){
            if(this.result!=''){     
                // this.$httpWX.get({
                //     url:this.$api.message.queryList,
                //     data:{
                //         method:"file.folderright.add",
                //         SessionKey:this.sessionkey,
                //         Id:"",
                //         EntityId:this.id
                //     }
                // }).then(res=>{
                //     console.log(res);
                // })
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.usb.adminDel,
                        SessionKey:this.sessionkey,
                        ids:this.result.join(',')
                    }
                }).then(res=>{
                    console.log(res);
                    let that = this;
                    wx.showToast({
                        title:res.msg,
                        icon:'none',
                        duration:2000,
                        success:res=>{
                            wx.nextTick(()=>{
                                that.result = [];
                                that.show = false;
                                that.getQuery();
                            })
                        }
                    })
                })
            }else {
                return ;
            }
        },
        getAdmin(){
            this.show = true;
        },
        getCancel(){
            this.result = [];
            this.show = false;
        },
        getAllSelect(){
            let temp = [];
            this.list.forEach(item=>{
                temp.push(item.Id);
            })
            this.result = temp;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .header{
            .nav{
                background: #fff;
                display: flex;
                padding: 30rpx;
                justify-content: space-between;
                font-size: 28rpx;
                color: #3399ff;
            }
        }
        .center{
            margin-top: 20rpx;
            background: #fff;
            .row:last-child .cont{
                border: none;
            }
            .row{
                display: flex;
                align-items: center;
                padding:20rpx 30rpx;
                .check{
                    width: 30px;
                }
                .cont{
                    width: 100%;
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    padding-bottom:20rpx;
                    border-bottom: 1rpx solid #eceeed;
                    div:nth-child(1){
                        margin-left: 20rpx;
                        font-size: 28rpx;
                        p:nth-child(2){
                            color: #ababab;
                            font-size: 12px;
                        }
                    }
                    div:nth-child(2){
                        font-size: 28rpx;
                        color: #ababab;
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box{
                display: flex;
                padding: 20rpx 30rpx;
                justify-content: space-between;
                font-size: 28rpx;
                align-items: center;
                .btn{
                    padding: 20rpx;
                    background: #3399ff;
                    opacity: .5;
                    color: #fff;
                }
                .active{
                    opacity: 1;
                }
            }
        }
    }
</style>