<template>
    <div class="wrap">
        <van-search :value="value" placeholder="搜索" />
        <div class="nav">
            <p>
                通讯录
                <span>
                    <i-icon type="enter" size="20" color="#cccccc" />
                </span>
            </p>
            <p>
                选择群组
                <span>
                    <i-icon type="enter" size="20" color="#cccccc" />
                </span>
            </p>
            <p>
                所有好友
                <span>
                    <i-icon type="enter" size="20" color="#cccccc" />
                </span>
            </p>
        </div>
        <h3>常用联系人</h3>
        <div class="center">
            <van-checkbox-group :value="result" @change="changeCheckbox">
                <div class="content" v-for="(item,index) in list" :key="index">
                    <div class="lBox">
                        <p>
                            <van-checkbox custom-class="check" :name="item.UserId"></van-checkbox>                        
                        </p>
                    </div>
                    <div class="rBox">
                        <div>
                            <p class="radius">{{item.name}}</p>
                        </div>
                        <div>
                            <p>{{item.FullName}}</p>
                            <p>信息中心</p>
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="footer">
            <div class="row">
                <p class="text">已选择</p>
                <p class="btn" :class="{'active':result!=''}" @click="submit">确定({{contSize}}/{{total}})</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed:{
         contSize(){
            return this.result.length;
        }
    },
    data(){
        return {
            result:[],
            total:5,
            list:[],
            fileName:"",
            method:"",
            fileId:""
        }
    },
    onLoad(options){
        console.log(options);
        this.fileId = options.id;
        this.fileName = options.file;
        this.method = options.method;
        this.queryList();
    },
    methods:{
        // 常用联系人
        queryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.latest.getlist",
                    SessionKey:"5af66c21-6974-4251-bb0c-b3f4f7e0f416"
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
         changeCheckbox(e){
            console.log(e);
            this.result = e.mp.detail;
            this.objectId = this.result.join(',');
            console.log(this.objectId);
        },
        submit(){
            if(this.result!=''){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.method,
                        SessionKey:"5af66c21-6974-4251-bb0c-b3f4f7e0f416",
                        FileId:this.fileId,
                        ObjectTypeCode:"8",
                        ObjectId:this.objectId
                    }
                }).then(res=>{
                    console.log(res);
                })
            }else {
                return ;
            }
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .nav{
            width: 100%;
            background: #fff;
            p{
                padding: 30rpx ;
                border-bottom: 1rpx solid #f6f6f6;
                overflow: hidden;
                span{
                    float: right;
                }
            }
            p:last-child{
                border:none;
            }
        }
        h3{
            background: #f4f4f4;
            color: #999999;
            padding: 20rpx 30rpx;
            font-size: 12px;
        }
        .center{
            width: 100%;
            background: #fff;
            padding-bottom: 80px;
            .content:last-child .rBox{
                border:none;
            }
            .content{
                display: flex;
                padding: 20rpx ;
                .lBox{
                    width: 10%;
                    .check{
                        margin-top: 10px;
                    }
                }
                .rBox{
                    flex: 1;
                    width: 100%;
                    display: flex;
                    padding-bottom: 10px;
                    border-bottom: 1rpx solid #f6f6f6;
                    div:nth-child(2){
                        flex: 1;
                        margin-left: 10px;
                        p:nth-child(1){
                            font-size: 30rpx;
                            font-weight: 500;
                        }
                        p:nth-child(2){
                            font-size: 26rpx;
                            color: #999999;
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
            border-top: 1rpx solid #eaeaea;
            .row{
                padding:20rpx 30rpx;
                display: flex;
                justify-content:space-between;
                .text{
                    font-size: 28rpx;
                    color: #333;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .btn{
                    font-size: 28rpx;
                    color: #fff;
                    padding: 20rpx;
                    background: #3399ff;
                    opacity: .5;
                    border-radius: 5rpx;
                }
                .btn.active{
                    opacity: 1;
                }
            }
        }
    }
</style>