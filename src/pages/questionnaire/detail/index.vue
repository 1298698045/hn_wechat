<template>
    <div class="wrap">
        <HeadRow :info="info" />
        <div class="center">
            <div class="block" :id="'d'+(index+1)" v-for="(item,index) in list" :key="index">
                <div class="title">{{index+1}}. {{item.Name}}
                    <span v-if="item.not" :animation="animationData">
                        这道题未回答
                    </span>
                </div>
                <div class="content" v-if="item.QuestionType==1">
                    <van-radio-group :value="item.value" @change="(e)=>{onChangeRadio(e,item)}">
                        <van-radio v-for="(v,i) in item.Options" :key="i" :name="v.AnswerOptionNumber" custom-class="radio">{{i+1}}.{{v.Name}}</van-radio>
                    </van-radio-group>
                </div>
                <div class="content" v-else-if="item.QuestionType==2" >
                    <van-checkbox-group :value="item.value" @change="(e)=>{handleCheck(e,item)}">
                        <van-checkbox v-for="(v,i) in item.Options" :key="i" shape="square" :name="v.AnswerOptionNumber" custom-class="checkbox" >{{i+1}}.{{v.Name}}</van-checkbox>
                    </van-checkbox-group>
                </div>
                <div class="content" v-else-if="item.QuestionType==5">
                    <input class="inp" @input="(e)=>{handleInput(e,item)}" v-model="item.value" type="text" :placeholder="''">
                </div>
                <div class="content" v-else-if="item.QuestionType==52">
                    <textarea class="textarea"  @input="(e)=>{handleTextarea(e,item)}" v-model="item.value" name="" id="" cols="30" rows="10"></textarea>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box_wrap">
                <div class="box" :class="{'active':disabled}" @click="getSubmit(1)">
                    <p>保存</p>
                </div>
                <div class="box" :class="{'active':disabled}" @click="getSubmit(2)">
                    <p>提交</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import HeadRow from '@/components/questionnaire/HeadRow';
import {message} from '@/utils/message';
export default {
    components:{
        HeadRow
    },
    data(){
        return {
            radio:'',
            result:[],
            id:"",
            info:{},
            list:[],
            detail:{},
            animationData: {},
            animation: ""
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        disabled(){
            let bol = false;
            this.list.forEach(item=>{
                if(item.value!=''){
                    bol = true;
                    return;
                    // break;
                }
            })
            return bol;
        }
    },
    onLoad(options){
        console.log(options,'---')
        this.id = options.id;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.survey.getSurvey,
                    SessionKey:this.sessionkey,
                    Id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.info = JSON.stringify(res.Survey);
                this.detail = res.Survey;
                this.list = res.Survey.Questions;
                this.list.forEach(item=>{
                    this.$set(item,'not',false)
                    item.Options.forEach(v=>{
                        this.$set(v,'checked',false)
                    })
                    if(item.QuestionType==1){
                        this.$set(item,'value','')
                    }else if(item.QuestionType==2){
                        this.$set(item,'value',[])
                    }else {
                        this.$set(item,'value','');
                    }
                })
            })
        },
        onChangeRadio(e,item){
            console.log(e);
            // item.value = e.mp.detail;
            let value = e.mp.detail;
            // let str = value.split('_')[1];
            let index = item.Options.findIndex(one=>one.AnswerOptionNumber==value);
            item.Options[index].checked = !item.Options[index].checked;
            if(item.Options[index].checked){
                item.not = false;
                item.value = e.mp.detail;
                item.Options.forEach((v,i)=>{
                    this.$set(v,'checked',false);
                    if(i==index){
                        item.Options[index].checked = true;
                    }
                })
            }else {
                item.value = '';
            }
        },
        handleCheck(e,item){
            console.log(e);
            item.value = e.mp.detail;
            if(item.value.length>0){
                item.not = false;
            }
        },
        handleInput(e, item){
            item.value = e.mp.detail.value;
            if(item.value!=''){
                item.not =  false;
            }
        },
        handleTextarea(e, item){
            item.value = e.mp.detail.value;
            if(item.value!=''){
                item.not =  false;
            }
        },
        getSubmit(statusCode){
            try{
                this.list.forEach(item=>{
                    console.log(item)
                    if(item.value==''){
                        this.animationData = {};
                        item.not = true;
                        wx.createSelectorQuery().select('#d'+item.SortNumber).boundingClientRect(function (rect) {
                            console.log(rect,'======')
                            // 使页面滚动到底部
                            wx.pageScrollTo({
                                scrollTop: rect.top - 20
                            })
                        }).exec();
                        var animation = wx.createAnimation({
                            duration: 400,
                            timingFunction: 'linear',
                        })
                        this.animation = animation
                        animation.translate(10).step();
                        this.animationData = animation.export()

                        setTimeout(function() {
                            animation.translate(0).step();
                            this.animationData = animation.export()
                        }.bind(this), 500)
                        
                        // wx.showToast({
                        //     title:`请填写${item.Name}`,
                        //     icon:"none",
                        //     duration:2000
                        // })
                        throw '';
                    }
                })
                let obj = {};
                let params = {};
                // params.statusCode = this.detail.StatusCode;
                params.statusCode = statusCode;
                params.surveyId = this.detail.SurveyId;
                let temp = [];
                this.list.forEach(item=>{
                    var arr = [];
                    if(item.QuestionType==1){
                        item.arr = arr.push(item.value);
                        temp.push({
                            surveyQuestionId:item.SurveyQuestionId,
                            questionNumber:item.QuestionNumber,
                            answerOptionNumber:arr,
                        })
                    }else if(item.QuestionType==2){
                        temp.push({
                            surveyQuestionId:item.SurveyQuestionId,
                            questionNumber:item.QuestionNumber,
                            answerOptionNumber:item.value,
                        })
                    }else{
                        temp.push({
                            surveyQuestionId:item.SurveyQuestionId,
                            questionNumber:item.QuestionNumber,
                            responseText:item.value
                        })
                    }
                })
                params.response = temp;
                obj.params = params;
                console.log(obj,'obj');
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.survey.submit,
                        SessionKey:this.sessionkey,
                        message:JSON.stringify(obj)
                    }
                }).then(res=>{
                    if(res.status===1){
                        message.toast({
                            title:"提交成功！",
                            delta:1
                        })
                    }
                })
            }catch(e){
                console.log(e);
            }
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
        .center{
            padding: 35rpx;
            .block:first-child{
                margin: 0;
            }
            .block{
                margin-top: 34rpx;
                .title{
                    color: #333333;
                    font-size: 33rpx;
                    font-weight: bold;
                    padding-bottom: 19rpx;
                    span{
                        font-size: 20rpx;
                        color: #fff;
                        display: inline-block;
                        padding: 5rpx 10rpx;
                        border-radius: 5rpx;
                        margin-left: 10rpx;
                        background: red;
                    }
                }
                .content{
                    background: #fff;
                    border-radius: 12rpx;
                    .radio{
                        padding: 20rpx 37rpx;
                        border-bottom: 1rpx solid #e2e3e5;
                        font-size: 32rpx;
                        color: #666666;
                    }
                    .checkbox{
                        padding: 20rpx 37rpx !important;
                        border-bottom: 1rpx solid #e2e3e5;
                        font-size: 32rpx;
                        color: #666666;
                    }
                    .inp{
                        width: 100%;
                        height: 100rpx;
                        padding: 0 27rpx;
                    }
                    .textarea{
                        width: 100%;
                        height: 191rpx;
                        padding: 10rpx 27rpx;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box_wrap{
                display: flex;
                .box{
                    flex: 1;
                    padding: 24rpx 25rpx;
                    opacity: .4;
                    p{
                        text-align: center;
                        line-height: 88rpx;
                        font-size: 34rpx;
                        color: #fff;
                        background: #3399ff;
                        border-radius: 7rpx;
                    }
                }
                .box.active{
                    opacity: 1;
                }
            }
        }
    }
</style>