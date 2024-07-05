<template>
    <div class="wrap">
        <div class="content">
            <div class="row">
                <div class="lable">
                    标题
                </div>
                <div class="inp">
                    <input type="text" v-model="Name">
                </div>
            </div>
            <picker @change="bindPickerChange" :value="index" :range="level">
                <div class="row">
                    <div class="lable">
                        级别
                    </div>
                    <div class="inp">
                        <input type="text" v-model="level[index]" :disabled="true">
                    </div>
                    <div class="icon">
                        <i-icon type="enter" size="20" color="#999999" />
                    </div>
                </div>
            </picker>
            <div class="row">
                <div class="lable">
                    办理期限
                </div>
                <div class="inp">
                    <input type="number" v-model="Deadline">
                </div>
            </div>
            <div class="cont_wrap">
                <div class="row">
                    <div class="lable">
                        内容
                    </div>
                </div>
                <div class="cont">
                    <textarea v-model="Description" name="" id="" cols="30" rows="10" placeholder="请输入"></textarea>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="btn">
                <van-button type="primary" color="#3399ff" block @click="getNext">下一步</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            ProcessId:"",
            Name:"",
            level:[
                '普通','中等','紧急'
            ],
            Deadline:1,
            index:0,
            Description:"",
            BusinessUnitId:"",
            ProcessInstanceId:"",
            RuleLogId:""
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.Name = options.Name + '    ' + wx.getStorageSync('businessUnitName')+' '+wx.getStorageSync('fullName');
        this.departName = options.departName;
        this.BusinessUnitId = wx.getStorageSync('businessUnitId');
        this.ProcessId = options.ProcessId;
    },
    methods:{
        bindPickerChange(e){
            this.index = e.mp.detail.value;
        },
        getNext(){
            if(this.Name==''){
                wx.showToast({
                    title:'请输入标题',
                    icon:'success',
                    duration:2000
                })
                return false;
            }else {
                let dataParams = {
                    params:{
                        recordRep:{
                            fields:{
                                ProcessId:this.ProcessId,
                                Name:this.Name,
                                Deadline:this.Deadline,
                                BusinessUnitId:this.BusinessUnitId,
                                Priority:this.index,
                                Description:this.Description
                            }
                        }
                    }
                }
                this.$httpWX.post({
                    url:this.$api.message.queryList+'?method='+this.$api.approval.create,
                    method:this.$api.approval.create,
                    data:{
                        SessionKey:this.sessionkey,
                        message:JSON.stringify(dataParams)
                    }
                }).then(res=>{
                    if(res.actions[0].state=='SUCCESS'){
                        this.ProcessInstanceId = res.actions[0].returnValue.ProcessInstanceId;
                        this.RuleLogId = res.actions[0].returnValue.RuleLogId;
                        const url = '/pages/approval/add/main?name='+this.Name+'&ProcessId='+this.ProcessId+'&departName='+this.departName+'&departId='+this.BusinessUnitId+'&ProcessInstanceId='+this.ProcessInstanceId+'&RuleLogId='+this.RuleLogId;
                        wx.navigateTo({url:url});
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .content{
            .row{
                background: #fff;
                display: flex;
                align-items: center;
                margin-top: 24rpx;
                padding: 30rpx;
                .lable{
                    width: 20%;
                    font-size: 34rpx;
                    color: #333333;
                }
                .inp{
                    flex: 1;
                    input{
                        width: 100%;
                        text-align: right;
                    }
                }
            }
            .cont_wrap{
                background: #fff;
                margin-top: 24rpx;
                .row{
                    display: flex;
                    align-items: center;
                    padding: 30rpx;
                    .lable{
                        font-size: 34rpx;
                        color: #333333;
                    }
                }
                .cont{
                    width: 100%;
                    padding: 0 30rpx;
                    textarea{
                        width: 100%;
                        height: 160rpx;
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
            .btn{
                padding: 24rpx;
            }
        }
    }
</style>