<template>
    <div class="wrap">
        <div class="boxWrap">
            <p class="icon">
                <i-icon type="activity" color="#3c3c3c" size="20" />
            </p>
            <p class="cont">
                <textarea v-model="title" name="" id="" cols="30" rows="10" placeholder="添加会议标题"></textarea>
            </p>
        </div>
        <div class="center">
            <div class="row">
                <p>
                    <i class="iconfont icon-shijian1"></i>
                    <!-- <i-icon type="clock_fill" color="#3c3c3c" size="20" /> -->
                </p>
                <p>会议时间</p>
                <p>{{date}}  {{ScheduledStart}}~{{ScheduledEnd}}</p>
            </div>
            <div class="row">
                <p>
                    <i class="iconfont icon-huiyishi"></i>
                    <!-- <i-icon type="clock_fill" color="#3c3c3c" size="20" /> -->
                    </p>
                <p>会议室</p>
                <p>{{ResourceName}}</p>
            </div>
            <div class="row">
                <p>
                    <i class="iconfont icon-zuzhiren"></i>
                    <!-- <i-icon type="clock_fill" color="#3c3c3c" size="20" /> -->
                </p>
                <div class="box">
                    <p class="radius">{{owningUserName}}</p>
                    <span class="name">{{owningUserName}}</span>
                    <span class="tag">预约人</span>
                </div>
                <p>
                    <i-icon type="enter" color="#666666" size="20" />
                </p>
            </div>
            <div class="row" v-if="isMeeting">
                <p>
                    <i class="iconfont icon-canyuren-copy"></i>
                    <!-- <i-icon type="addressbook" color="#3c3c3c" size="20" /> -->
                </p>
                <p>
                    <input type="text" v-model="peopleNumber" placeholder="请输入参会人数">
                </p>
                <p @click="getDelMeeting">
                    <i-icon type="close" color="#666666" size="20" />
                </p>
            </div>
            <div class="rowWrap" v-if="isEquipment">
                <div class="row">
                    <p>
                        <i class="iconfont icon-shebei1"></i>
                        <!-- <i-icon type="addressbook" color="#3c3c3c" size="20" /> -->
                    </p>
                    <p>
                        选择会议室设备
                    </p>
                    <p @click="getDelEquipment">
                        <i-icon type="close" color="#666666" size="20" />
                    </p>
                </div>
                <van-checkbox-group :value="result" @change="onChange">
                    <div class="checkWrap">
                        <van-checkbox :name="item" v-for="(item,index) in tagList" :key="index" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            {{item}}
                        </van-checkbox>
                        <!-- <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            投影
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            多媒体
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            视频同步
                        </van-checkbox> -->
                    </div>
                </van-checkbox-group>
            </div>
            <div class="row" v-if="isPhone">
                <p>
                    <i class="iconfont icon-dianhua"></i>
                    <!-- <i-icon type="addressbook" color="#3c3c3c" size="20" /> -->
                </p>
                <p>
                    <input type="text" v-model="phone" placeholder="输入联系电话">
                </p>
                <p @click="getDelPhone">
                    <i-icon type="close" color="#666666" size="20" />
                </p>
            </div>
            <div class="row" v-if="isRemarks">
                <p>
                    <i class="iconfont icon-beizhu"></i>
                    <!-- <i-icon type="addressbook" color="#3c3c3c" size="20" /> -->
                </p>
                <p>
                    <van-field
                        :value="description"
                        type="textarea"
                        placeholder="请输入描述"
                        autosize
                        :border="false"
                        @change="changeDescription"
                    />
                    <!-- 医院规章制度、审核流程 -->
                </p>
                <p @click="getDelDescription">
                    <i-icon type="close" color="#666666" size="20" />
                </p>
            </div>
            <div class="row" v-if="isNotice">
                <p>
                    <i class="iconfont  icon-shanguangdeng"></i>
                    <!-- <i-icon type="addressbook" color="#3c3c3c" size="20" /> -->
                </p>
                <p>
                    通知
                </p>
                <div class="btn">
                    <p>
                        <span class="l">应用内</span>
                        <span class="r">短信</span>
                        <i-icon type="close" color="#666666" size="20" @click="getDelNotice" />
                    </p>
                </div>
            </div>
            <div class="iconRow">
                <div class="box" v-if="!isMeeting" @click="getMeeting">
                    <p>
                        <i class="iconfont icon-canyuren-copy"></i>
                        <!-- <i-icon type="refresh" color="#666666" size="20" /> -->
                    </p>
                    <p class="name">参会人</p>
                </div>
                <div class="box" v-if="!isEquipment" @click="getEquipment">
                    <p>
                        <i class="iconfont icon-shebei1"></i>
                        <!-- <i-icon type="brush_fill" color="#666666" size="20" /> -->
                    </p>
                    <p class="name">设备</p>
                </div>
                <div class="box" v-if="!isPhone" @click="getPhone">
                    <p>
                        <i class="iconfont icon-dianhua"></i>
                        <!-- <i-icon type="trash" color="#666666" size="20" /> -->
                    </p>
                    <p class="name">电话</p>
                </div>
                <div class="box" v-if="!isRemarks" @click="getRemarks">
                    <p>
                        <i class="iconfont icon-beizhu"></i>
                        <!-- <i-icon type="brush_fill" color="#666666" size="20" /> -->
                    </p>
                    <p class="name">描述</p>
                </div>
                <div class="box" v-if="!isNotice" @click="getNotice">
                    <p>
                        <i class="iconfont  icon-shanguangdeng"></i>
                        <!-- <i-icon type="trash" color="#666666" size="20" /> -->
                    </p>
                    <p class="name">通知</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <!-- <van-button type="primary" color="#f3f3f3" :disabled="disabled" custom-class="btn black" block>取消</van-button> -->
                <van-button type="primary" @click="getSubmit" color="#3399ff" :disabled="disabled" custom-class="btn" block>完成</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            title:"",
            peopleNumber:"",
            phone:"",
            disabled:false,
            result:[],
            isMeeting:false,
            isEquipment:false,
            isPhone:false,
            isRemarks:false,
            isNotice:false,
            tagList:[
              '电脑','投影','多媒体','视频同步'
            ],
            id:"",
            ResourceId:"",
            date:"",
            ScheduledStart:"",
            ScheduledEnd:"",
            ResourceName:"",
            tag:"",
            description:"",
            info:{},
            owningUserName:"",
            sessionkey:""
        }
    },
    onLoad(options){
        Object.assign(this.$data, this.$options.data())
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        console.log(options);
        this.ResourceId = options.ResourceId;
        this.date = options.date;
        this.ScheduledStart = options.ScheduledStart;
        this.ScheduledEnd = options.ScheduledEnd;
        this.ResourceName = options.name;
        this.id = options.id;
        if(options.id){
            this.getQuery();
        }else {
            this.id = '';
            this.getQueryInfo();
        }
    },
    methods:{
        getQueryInfo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.userinfo.get",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.owningUserName = res.data[0].fullName;
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.get",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:20035,
                    Id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data;
                this.ResourceId = this.info.resourceId;
                this.title = this.info.subject;
                let date = new Date()
                let arr = this.info.scheduledStart.split(' ');
                console.log(arr);
                this.date = arr[0];
                this.ScheduledStart = arr[1];
                let end = this.info.scheduledEnd.split(' ');
                this.ScheduledEnd = end[1];
                this.ResourceName = this.info.resourceIdName;
                this.peopleNumber = this.info.peopleQty;
                this.description = this.info.description;
                this.owningUserName = this.info.owningUserName;
                this.result = this.info.attachs.split(',');
                this.tag = this.result.join(',');

            })
        },
        changeDescription(e){
            this.description = e.mp.detail;
        },
        onChange(e){
            this.result = e.mp.detail;
            this.tag = this.result.join(',');
            console.log(this.tag);
        },
        getMeeting(){
            this.isMeeting = true;
        },
        getEquipment(){
            this.isEquipment = true;
        },
        getPhone(){
            this.isPhone = true;
        },
        getRemarks(){
            this.isRemarks = true;
            // const url = '/pages/conferenceRoom/appointment/remarks/main';
            // wx.navigateTo({url:url});
        },
        getNotice(){
            this.isNotice = true;
        },
        getDelMeeting(){
            this.isMeeting = false;
        },
        getDelEquipment(){
            this.isEquipment = false;
        },
        getDelPhone(){
            this.isPhone = false;
        },
        getDelNotice(){
            this.isNotice = false;
        },
        getDelDescription(){
            this.isRemarks = false;
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"resource.room.order",
                    SessionKey:this.sessionkey,
                    ResourceId:this.ResourceId,
                    ScheduledStart:this.date+'  '+this.ScheduledStart,
                    ScheduledEnd:this.date+'  '+this.ScheduledEnd,
                    subject:this.title,
                    description:this.description,
                    TelPhone:this.phone,
                    PeopleQty:this.peopleNumber,
                    reminderTime:10,
                    attachs:this.tag,
                    PeopleQty:this.peopleNumber,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta: 1
                })
                // const url = '/pages/conferenceRoom/main';
                // wx.navigateTo({url:url});
            })
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/conference.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .boxWrap{
            display: flex;
            padding: 33rpx;
            background: #fff;
            margin-top: 35rpx;
            .icon{
                margin-top: -5rpx;
            }
            .cont{
                flex: 1;
                width: 100%;
                margin-left: 20rpx;
                textarea{
                    width: 100%;
                    height: 100rpx;
                }
            }
        }
        .center{
            padding-bottom: 80px;
            .row{
                display: flex;
                padding: 33rpx;
                background: #fff;
                margin-top: 35rpx;
                align-items: center;
                p:nth-child(2){
                    flex: 1;
                    margin-left: 20rpx;
                    font-size: 33rpx;
                    color: #333333;
                }
                p:nth-child(2){
                    font-size: 28rpx;
                    color: #333333;
                }
                .box{
                    flex: 1;
                    margin-left: 20rpx;
                    display: flex;
                    align-items: center;
                    .radius{
                        width: 49rpx;
                        height: 49rpx;
                        line-height: 49rpx;
                        text-align: center;
                        border-radius: 50%;
                        background: #3399ff;
                        color: #fff;
                        font-size: 17rpx;
                    }
                    .name{
                        font-size: 33rpx;
                        color: #333333;
                        margin: 0 10rpx;
                    }
                    .tag{
                        color: #3399ff;
                        font-size: 19rpx;
                        display: inline-block;
                        padding: 3 10rpx;
                        background: #e6f0fa;
                    }
                }
                .btn{
                    p{
                        span{
                            display: inline-block;
                            width: 124rpx;
                            height: 58rpx;
                            line-height: 58rpx;
                            text-align: center;
                            font-size: 28rpx;
                            color: #fff;
                            background: #3399ff;
                            border: 1rpx solid #3399ff;
                        }
                        .l{
                            border-top-left-radius: 5rpx;
                            border-bottom-left-radius: 5rpx;
                            border-right: none;
                        }
                        .r{
                            border-top-right-radius: 5rpx;
                            border-bottom-right-radius: 5rpx;
                            background: #fff;
                            color: #3399ff;
                            border-left: none;
                            margin-right: 20rpx;
                        }
                    }
                }
            }
            .rowWrap{
                background: #fff;
                .row{
                    padding: 33rpx;
                    display: flex;
                    margin-top: 35rpx;
                    align-items: center;
                    p:nth-child(2){
                        flex: 1;
                        margin-left: 20rpx;
                        font-size: 33rpx;
                        color: #333333;
                    }
                    p:nth-child(2){
                        font-size: 28rpx;
                        color: #333333;
                    }
                }
                .checkWrap{
                    display: flex;
                    padding: 0 33rpx 33rpx 33rpx;
                    .check{
                        margin-right: 20rpx;
                        font-size: 26rpx;
                    }
                    .label{
                        margin-left: 10rpx;
                    }
                }
            }
            .iconRow{
                display: flex;
                padding: 10rpx 20rpx;
                background: #fff;
                margin-top: 35rpx;
                align-items: center;
                .box{
                    width: 25%;
                    text-align: center;
                    .name{
                        font-size: 19rpx;
                        color: #666666;
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
                // display: flex;
                // justify-content: space-around;
                padding: 20rpx 33rpx;
                .btn{
                    // width: 328rpx;
                }
                .black{
                    color: #333333 !important;
                }
            }
        }
    }
</style>