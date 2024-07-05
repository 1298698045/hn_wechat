<template>
    <div class="wrapper">
        <div class="panel">
            <div class="row_inp">
                <van-field
                    label-class="filed_label"
                    label="名称"
                    :value="shift.name"
                    placeholder="请输入班次名称"
                    :border="false"
                    @change="(e)=>{changeInput(e,'name')}"
                    input-align="right"
                />
            </div>
            <picker @change="(e)=>{changePicker(e,'shiftMethodCodeIdx')}" :value="shiftMethodCodeIdx" range-key="label" :range="params.ShiftMethodCode.values">  
                <div class="row">
                    <p class="l_text">
                        排班方式
                    </p>
                    <p class="r_text"> 
                        {{params.ShiftMethodCode.values[shiftMethodCodeIdx].label}}
                        <i-icon type="enter" size="18" />
                    </p>
                </div>
            </picker>
            <picker @change="(e)=>{changePicker(e,'shiftTypeCodeIdx')}" :value="shiftTypeCodeIdx" range-key="label" :range="params.ShiftTypeCode.values">  
                <div class="row">
                    <p class="l_text">
                        班次类型
                    </p>
                    <p class="r_text">
                        {{params.ShiftTypeCode.values[shiftTypeCodeIdx].label}}
                        <i-icon type="enter" size="18" />
                    </p>
                </div>
            </picker>
            <picker @change="(e)=>{changePicker(e,'statusCodeIdx')}" :value="statusCodeIdx" range-key="label" :range="params.StatusCode.values">  
                <div class="row">
                    <p class="l_text">
                        状态
                    </p>
                    <p class="r_text">
                        {{params.StatusCode.values[statusCodeIdx].label}}
                        <i-icon type="enter" size="18" />
                    </p>
                </div>
            </picker>
            <picker @change="(e)=>{changePicker(e,'leaveTypeIdx')}" :value="leaveTypeIdx" range-key="label" :range="params.LeaveType.values">  
                <div class="row">
                    <p class="l_text">
                        关联请假类型
                    </p>
                    <p class="r_text">
                        {{params.LeaveType.values[leaveTypeIdx].label}}
                        <i-icon type="enter" size="18" />
                    </p>
                </div>
            </picker>
            <picker @change="(e)=>{changePicker(e,'nightTypeCodeIdx')}" :value="nightTypeCodeIdx" range-key="label" :range="params.NightTypeCode.values">  
                <div class="row">
                    <p class="l_text">
                        夜班类型
                    </p>
                    <p class="r_text">
                        {{params.NightTypeCode.values[nightTypeCodeIdx].label}}
                        <i-icon type="enter" size="18" />
                    </p>
                </div>
            </picker>
            <picker @change="(e)=>{changePicker(e,'categoryCodeIdx')}" :value="categoryCodeIdx" range-key="label" :range="params.CategoryCode.values">  
                <div class="row">
                    <p class="l_text">
                        分类
                    </p>
                    <p class="r_text">
                        {{params.CategoryCode.values[categoryCodeIdx].label}}
                        <i-icon type="enter" size="18" />
                    </p>
                </div>
            </picker>
            <div class="row_inp">
                <van-field
                    label-class="filed_label"
                    label="缩写或符号"
                    :value="shift.symbol"
                    placeholder="请输入缩写或符号"
                    :border="false"
                    @change="(e)=>{changeInput(e,'symbol')}"
                    input-align="right"
                />
            </div>
            <div class="row_inp">
                <van-field
                    label-class="filed_label"
                    label="补贴金额"
                    :value="shift.amount"
                    placeholder="请输入补贴金额"
                    :border="false"
                    @change="(e)=>{changeInput(e,'amount')}"
                    input-align="right"
                />
            </div>
            <div class="timeSlot">
                <div class="timeBlock">
                    <!-- <div class="box">
                        <div class="left">
                            
                        </div>
                        <div class="right"></div>
                    </div> -->
                    <div class="timeWrap">
                        <picker
                            class="picker"
                            mode="multiSelector"
                            :value="multiIndex"
                            @change="bindMultiPickerChange"
                            :disabled="checked"
                            :range="newMultiArray"
                            >
                            <input
                                type="text"
                                v-if="month == ''"
                                placeholder="开始时间"
                                disabled
                                placeholder-class="placeholder"
                            />
                            <div class="box">
                                <p>
                                {{ month }}{{ day }} <span v-if="!checked">{{ startDay }}</span>
                                </p>
                                <p>{{ !checked ? hours : startDay }}</p>
                            </div>
                        </picker>
                        <div class="imgBox">
                        <img src="https://oawx.hnca.org.cn/img/wechat/2845.png" alt="" />
                        </div>
                        <picker
                            class="picker"
                            mode="multiSelector"
                            :value="endmultiIndex"
                            @change="endbindMultiPickerChange"
                            :disabled="checked"
                            :range="newMultiArray"
                            >
                            <input
                                type="text"
                                v-if="endMonth == ''"
                                placeholder="结束时间"
                                disabled
                                placeholder-class="placeholder"
                            />
                            <div class="box rBox">
                                <p>
                                {{ endMonth }}{{ endDay }}
                                <span v-if="!checked">{{ endWeek }}</span>
                                </p>
                                <p>{{ !checked ? endHours : endWeek }}</p>
                            </div>
                        </picker>
                    </div>
                    <div class="timeWrap" v-if="isTimeTwo">
                        <picker
                            class="picker"
                            mode="multiSelector"
                            :value="multiIndexTwo"
                            @change="bindMultiPickerChangeTwo"
                            :disabled="checkedTwo"
                            :range="newMultiArray"
                            >
                            <input
                                type="text"
                                v-if="monthTwo == ''"
                                placeholder="开始时间"
                                disabled
                                placeholder-class="placeholder"
                            />
                            <div class="box">
                                <p>
                                {{ monthTwo }}{{ dayTwo }} <span v-if="!checked">{{ startDayTwo }}</span>
                                </p>
                                <p>{{ !checkedTwo ? hoursTwo : startDayTwo }}</p>
                            </div>
                        </picker>
                        <div class="imgBox">
                        <img src="https://oawx.hnca.org.cn/img/wechat/2845.png" alt="" />
                        </div>
                        <picker
                            class="picker"
                            mode="multiSelector"
                            :value="endmultiIndexTwo"
                            @change="endbindMultiPickerChangeTwo"
                            :disabled="checkedTwo"
                            :range="newMultiArray"
                            >
                            <input
                                type="text"
                                v-if="endMonthTwo == ''"
                                placeholder="结束时间"
                                disabled
                                placeholder-class="placeholder"
                            />
                            <div class="box rBox">
                                <p>
                                {{ endMonthTwo }}{{ endDayTwo }}
                                <span v-if="!checkedTwo">{{ endWeekTwo }}</span>
                                </p>
                                <p>{{ !checkedTwo ? endHoursTwo : endWeekTwo }}</p>
                            </div>
                        </picker>
                    </div>
                    <p class="add_time" @click="addTimeSlot">{{!isTimeTwo?'+添加时间段':'删除时间段'}}</p>
                </div>
                <van-cell-group>
                    <van-field
                        label-class="filed_label"
                        label="时长(可修改)"
                        :value="(hourTotal||'')+'小时'"
                        placeholder="请输入班次名称"
                        :border="false"
                        @change="changeShiftName"
                        input-align="right"
                    />
                </van-cell-group>
                <!-- <div class="timeLength">
                    <p class="l_text">
                        时长(可修改)
                    </p>
                    <p class="r_text">
                       {{hourTotal || ''}} 小时
                    </p>
                </div> -->
            </div>
        </div>
        <div class="desc">
            在排班-排班管理-排班设置-工时单位中可切换工时单位
        </div>
        <div class="panel">
            <div class="row">
                <p class="l_text">
                    系数
                </p>
                <p class="r_text">
                    1
                </p>
            </div>
        </div>
        <div class="panel">
            <div class="row">
                <p class="l_text">
                    管床
                </p>
                <p class="r_text">
                    <van-switch :checked="checked" size="20px" @change="changeSwitch" />
                </p>
            </div>
        </div>
        <div class="desc">
            管床开启后，可在排班时对改班次设置管床信息
        </div>
        <div class="desc">
            类型为“休息”的班次将不会收到上班提醒
        </div>
        <div class="panel">
            <div class="row">
                <p class="l_text">
                    启用
                </p>
                <p class="r_text">
                    <van-switch :checked="checked" size="20px" @change="changeSwitch" />
                </p>
            </div>
        </div>
        <div class="footer">
            <div class="row">
                <p class="label" :class="{'active':isModelmes}" @click="handleSave">保存</p>
                <p class="btn" :class="{'active':isModelmes}">保存并继续添加</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            shift: {
                name:''
            },
            checked: false,
            typeList:[
                {
                    id:1,
                    label:'正常上班'
                },
                {
                    id:2,
                    label: '休息'
                }
            ],
            typeIdx:0,
            multiIndex: [0, 0, 0, 0, 0],
            endmultiIndex: [0, 0, 0, 0, 0],
            month: "",
            day: "",
            hours: "",
            endMonth: "",
            endDay: "",
            endHours: "",
            startTime: "2020-06-03 04:00",
            endTime: "2020-06-03 05:00",
            isTimeTwo: false,
            multiIndexTwo: [0, 0, 0, 0, 0],
            endmultiIndexTwo: [0, 0, 0, 0, 0],
            monthTwo: "",
            dayTwo: "",
            hoursTwo: "",
            endMonthTwo: "",
            endDayTwo: "",
            endHoursTwo: "",
            startTimeTwo: "",
            endTimeTwo: "",
            time: '',
            timeTwo: '',
            endTime: '',
            endTimeTwo: '',
            params:{
                // 排班方式
                ShiftMethodCode:{
                    values: [
                        {attributes: null, label: "固定班制", validFor: null, value: "1"},
                        {attributes: null, label: "排班制", validFor: null, value: "2"},
                        {attributes: null, label: "自由班", validFor: null, value: "3"}
                    ]
                },
                // 班次类型
                ShiftTypeCode: {
                    index: '',
                    values: [
                        {attributes: null, label: "白天班", validFor: null, value: "1"},
                        {attributes: null, label: "晚上班", validFor: null, value: "2"},
                        {attributes: null, label: "24小时全天班", validFor: null, value: "3"},
                        {attributes: null, label: "法定节假日", validFor: null, value: "4"},
                        {attributes: null, label: "休息", validFor: null, value: "0"},
                        {attributes: null, label: "请假", validFor: null, value: "30022"}
                    ]
                },
                // 状态
                StatusCode:{
                    index: '',
                    values: [
                        {attributes: null, label: "未启用", validFor: null, value: "0"},
                        {attributes: null, label: "已启用", validFor: null, value: "1"}
                    ]
                },
                // 关联请假类型
                LeaveType: {
                    index: '',
                    values: [
                        {attributes: null, label: "无", validFor: null, value: "0"},
                        {attributes: null, label: "事假", validFor: null, value: "1"},
                        {attributes: null, label: "病假", validFor: null, value: "2"},
                        {attributes: null, label: "产假", validFor: null, value: "3"},
                        {attributes: null, label: "婚假", validFor: null, value: "4"},
                        {attributes: null, label: "探亲假", validFor: null, value: "5"},
                        {attributes: null, label: "公休", validFor: null, value: "6"},
                        {attributes: null, label: "公伤假", validFor: null, value: "7"},
                        {attributes: null, label: "丧假", validFor: null, value: "8"},
                        {attributes: null, label: "公休日加班", validFor: null, value: "10"},
                        {attributes: null, label: "节假日加班", validFor: null, value: "11"},
                        {attributes: null, label: "平时加班", validFor: null, value: "12"},
                        {attributes: null, label: "规培", validFor: null, value: "14"},
                        {attributes: null, label: "进修", validFor: null, value: "15"},
                        {attributes: null, label: "其它", validFor: null, value: "16"},
                        {attributes: null, label: "补休", validFor: null, value: "17"},
                        {attributes: null, label: "计生假", validFor: null, value: "18"},
                        {attributes: null, label: "哺乳假", validFor: null, value: "19"},
                        {attributes: null, label: "夜班天数", validFor: null, value: "22"},
                        {attributes: null, label: "本地外出", validFor: null, value: "27"},
                        {attributes: null, label: "外地出差", validFor: null, value: "28"},
                        {attributes: null, label: "旷工", validFor: null, value: "25"},
                        {attributes: null, label: "上研", validFor: null, value: "31"},
                        {attributes: null, label: "放射假", validFor: null, value: "32"},
                        {attributes: null, label: "下乡", validFor: null, value: "39"},
                        {attributes: null, label: "学习", validFor: null, value: "47"}
                    ]
                },
                // 夜班类型
                NightTypeCode:{
                    index: '',
                    values:[
                        {attributes: null, label: "小夜班", validFor: null, value: "1"},
                        {attributes: null, label: "大夜班", validFor: null, value: "2"},
                        {attributes: null, label: "通宵", validFor: null, value: "3"}
                    ]
                },
                //  分类
                CategoryCode:{
                    index: '',
                    values: [
                        {attributes: null, label: "中班", validFor: null, value: "0"},
                        {attributes: null, label: "行政职能", validFor: null, value: "1"},
                        {attributes: null, label: "门诊医生", validFor: null, value: "2"},
                        {attributes: null, label: "住院医生", validFor: null, value: "3"},
                        {attributes: null, label: "护理", validFor: null, value: "4"},
                        {attributes: null, label: "其他", validFor: null, value: "5"}
                    ]
                }
            },
            shiftMethodCodeIdx: 0,
            shiftTypeCodeIdx: 0,
            statusCodeIdx: 0,
            leaveTypeIdx: 0,
            nightTypeCodeIdx: 0,
            categoryCodeIdx: 0
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        newMultiArray: () => {
            let array = [];
            const date = new Date();
            const years = [];
            const months = [];
            const days = [];
            const hours = [];
            const minutes = [];
            var d = new Date();
            var y = d.getFullYear();
            for (let i = y; i <= date.getFullYear() + 10; i++) {
                years.push("" + i + "年");
            }
            array.push(years);
            for (let i = 1; i <= 12; i++) {
                if (i < 10) {
                i = "0" + i;
                }
                months.push("" + i + "月");
            }
            array.push(months);
            for (let i = 1; i <= 31; i++) {
                if (i < 10) {
                i = "0" + i;
                }
                days.push("" + i + "日");
            }
            array.push(days);
            for (let i = 0; i < 24; i++) {
                if (i < 10) {
                i = "0" + i;
                }
                hours.push("" + i + "时");
            }
            array.push(hours);
            for (let i = 0; i < 60; i++) {
                if (i < 10) {
                i = "0" + i;
                }
                minutes.push("" + i + "分");
            }
            array.push(minutes);
            return array;
        },
        hourTotal(){
            let total = 0;
            let oneTotal = 0;
            let towTotal = 0;
            if(this.time!=''&&this.endTime!=''){
                oneTotal = this.getCalculationHour(this.time, this.endTime)
                total = oneTotal
            }
            if(this.isTimeTwo){
                if(this.time!=''&&this.endTime!=''&&this.timeTwo!=''&&this.endTime!=''){
                    oneTotal = this.getCalculationHour(this.time, this.endTime)
                    towTotal = this.getCalculationHour(this.timeTwo, this.endTimeTwo)
                    console.log(oneTotal, towTotal)
                    total = oneTotal + towTotal
                }
            }
            // if(this.timeTwo!=''&&this.timeTwo!=''){
            //     towTotal = this.getCalculationHour(this.timeTwo, this.timeTwo)
            //     total = towTotal
            // }
            
            console.log(total,'total')
            return total
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey')
        }
    },
    onLoad(){
        for(var key in this.params){
            // console.log(key,'key')
            // console.log('values:', this.params[key])
            this.$set(this.params[key],'index',0)
        }
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method: this.$api.scheduling.pickerList,
                    Sessionkey: this.sessionkey,
                    objectTypeCode: 30040
                }
            }).then(res=>{
                console.log(res,'res')
            })
        },
        changePicker(e,field){
            let index = e.mp.detail.value;
            this[field] = index;
        },
        // 两个时间相差的小时
        getCalculationHour(s1, s2) {
            var reDate = /\d{4}-\d{1,2}-\d{1,2} /;
            s1 = new Date((reDate.test(s1) ? s1 : '2017-1-1 ' + s1).replace(/-/g, '/'));
            s2 = new Date((reDate.test(s2) ? s2 : '2017-1-1 ' + s2).replace(/-/g, '/'));
            var ms = s2.getTime() - s1.getTime();
            if (ms < 0) return 0;
            return Math.floor(ms / 1000 / 60 / 60);
        },
        // 添加时间段
        addTimeSlot(){
            this.isTimeTwo = !this.isTimeTwo;
        },
        changeInput(e,name){
            this.shift[name] = e.mp.detail;
        },
        changeSwitch(e){
            this.checked = e.mp.detail
        },
        changeType(e){
            this.typeIdx = e.mp.detail.value;
        },
         bindMultiPickerChange(e) {
            this.multiIndex = e.target.value;
            console.log("当前选择的时间", this.multiIndex);
            const index = this.multiIndex;
            const year = this.newMultiArray[0][index[0]];
            const month = this.newMultiArray[1][index[1]];
            const day = this.newMultiArray[2][index[2]];
            const hour = this.newMultiArray[3][index[3]];
            const minute = this.newMultiArray[4][index[4]];
            this.time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.month = month;
            this.day = day;
            this.hours = this.RemoveChinese(hour) + ":" + this.RemoveChinese(minute);
            this.time = this.RemoveChinese(this.time);
            this.startTime = this.RemoveChinese(this.time);
            this.copyStartTime =
                year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.copyStartTime = this.RemoveChinese(this.copyStartTime);
            let startTime = year + "-" + month + "-" + day;
            startTime = this.RemoveChinese(startTime);
            this.startDay = this.getWeekDay(startTime);
        },
        bindMultiPickerChangeTwo(e) {
            this.multiIndexTwo = e.target.value;
            console.log("当前选择的时间", this.multiIndexTwo);
            const index = this.multiIndexTwo;
            const year = this.newMultiArray[0][index[0]];
            const month = this.newMultiArray[1][index[1]];
            const day = this.newMultiArray[2][index[2]];
            const hour = this.newMultiArray[3][index[3]];
            const minute = this.newMultiArray[4][index[4]];
            this.timeTwo = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.monthTwo = month;
            this.dayTwo = day;
            this.hoursTwo = this.RemoveChinese(hour) + ":" + this.RemoveChinese(minute);
            this.timeTwo = this.RemoveChinese(this.timeTwo);
            this.startTimeTwo = this.RemoveChinese(this.timeTwo);
            let startTime = year + "-" + month + "-" + day;
            startTime = this.RemoveChinese(startTime);
            this.startDayTwo = this.getWeekDay(startTime);
        },
        // 默认日期
        getCurrent(startTime, endTime) {
            console.log(startTime, endTime, "========");
            let date = new Date(startTime.replace(/-/g, "/"));
            this.month = date.getMonth() + 1 + "月";
            this.day = date.getDate() + "日";
            this.hours = `${date.getHours()}:${
                date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
            }`;
            this.startDay = this.getWeekDay(startTime.replace(/-/g, "/"));
            let endDate = new Date(endTime.replace(/-/g, "/"));
            this.endMonth = endDate.getMonth() + 1 + "月";
            this.endDay = endDate.getDate() + "日";
            this.endHours = `${endDate.getHours()}:${
                endDate.getMinutes() < 10
                ? "0" + endDate.getMinutes()
                : endDate.getMinutes()
            }`;
            this.endWeek = this.getWeekDay(endTime.replace(/-/g, "/"));
        },
        RemoveChinese(strValue) {
            if (strValue != null && strValue != "") {
                var reg = /[\u4e00-\u9fa5]/g;
                return strValue.replace(reg, "");
            } else return "";
        },
        getWeekDay(date) {
            var dt = new Date(date).getDay();
            //     var dt = new Date(date.split("-")[0], date.split("-")[1]-1,date = date.split("-")[2]);
            var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            return weekDay[dt];
        },
        endbindMultiPickerChange(e) {
            this.endmultiIndex = e.target.value;
            const index = this.endmultiIndex;
            const year = this.newMultiArray[0][index[0]];
            const month = this.newMultiArray[1][index[1]];
            const day = this.newMultiArray[2][index[2]];
            const hour = this.newMultiArray[3][index[3]];
            const minute = this.newMultiArray[4][index[4]];
            let oldTime = this.RemoveChinese(year + "-" + month + "-" + day + " " + hour + ":" + minute);
            let startStamp = new Date(this.startTime.replace(/-/g,'/')).getTime(); // 开始时间戳
            let endStamp = new Date(oldTime.replace(/-/g,'/')).getTime(); // 结束时间戳
            if(endStamp<startStamp){
                wx.showToast({
                title:'请选择大于开始时间',
                icon:'none',
                duration:2000
                })
                return false;
            }
            this.endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.endMonth = month;
            this.endDay = day;
            this.endHours =
                this.RemoveChinese(hour) + ":" + this.RemoveChinese(minute);
            this.endTime = this.RemoveChinese(this.endTime);
            this.copyEndTime =
                year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.copyEndTime = this.RemoveChinese(this.copyEndTime);
            let endTime = year + "-" + month + "-" + day;
            endTime = this.RemoveChinese(endTime);
            this.endWeek = this.getWeekDay(endTime);
            console.log(this.endTime,this.time);
        },
        endbindMultiPickerChangeTwo(e) {
            this.endmultiIndexTwo = e.target.value;
            const index = this.endmultiIndexTwo;
            const year = this.newMultiArray[0][index[0]];
            const month = this.newMultiArray[1][index[1]];
            const day = this.newMultiArray[2][index[2]];
            const hour = this.newMultiArray[3][index[3]];
            const minute = this.newMultiArray[4][index[4]];
            let oldTime = this.RemoveChinese(year + "-" + month + "-" + day + " " + hour + ":" + minute);
            let startStamp = new Date(this.startTimeTwo.replace(/-/g,'/')).getTime(); // 开始时间戳
            let endStamp = new Date(oldTime.replace(/-/g,'/')).getTime(); // 结束时间戳
            if(endStamp<startStamp){
                wx.showToast({
                    title:'请选择大于开始时间',
                    icon:'none',
                    duration:2000
                })
                return false;
            }
            this.endTimeTwo = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.endMonthTwo = month;
            this.endDayTwo = day;
            this.endHoursTwo =
                this.RemoveChinese(hour) + ":" + this.RemoveChinese(minute);
            this.endTimeTwo = this.RemoveChinese(this.endTimeTwo);
            let endTimeTwo = year + "-" + month + "-" + day;
            endTimeTwo = this.RemoveChinese(endTimeTwo);
            this.endWeekTwo = this.getWeekDay(endTimeTwo);
            console.log(this.endTimeTwo,this.timeTwo);
        },
        // 保存
        handleSave(){
            const obj = {
                params: {
                    recordRep:{
                        objTypeCode: 30040,
                        fields:{
                            Name: this.shift.name,
                            Symbol: this.shift.symbol,
                            Amount: this.shift.amount,
                            ShiftMethodCode: this.params.ShiftMethodCode.values[this.shiftMethodCodeIdx].value,
                            ShiftTypeCode: this.params.ShiftTypeCode.values[this.shiftTypeCodeIdx].value,
                            StatusCode: this.params.StatusCode.values[this.statusCodeIdx].value,
                            LeaveType: this.params.LeaveType.values[this.leaveTypeIdx].value,
                            NightTypeCode: this.params.NightTypeCode.values[this.nightTypeCodeIdx].value,
                            CategoryCode: this.params.CategoryCode.values[this.categoryCodeIdx].value
                        },
                        id: ""
                    }
                }
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.scheduling.add_shift,
                    message: JSON.stringify(obj)
                }
            }).then(res=>{
                console.log(res,'res')
            })
        }
    }
}
</script>
<style lang="scss">
    .wrapper{
        .panel{
            background: #fff;
            margin-top: 20rpx;
            .row_inp{
                border-bottom: 1rpx solid #e2e3e5;
            }
            .row{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--cell-vertical-padding,10px) var(--cell-horizontal-padding,16px);
                font-size: 26rpx;
                color: #333;
                border-bottom: 1rpx solid #e2e3e5;
                .r_text{
                    display: flex;
                    align-items: center;
                }
            }
            .filed_label{
                font-weight: bold !important;
            }
            .timeSlot{
                border-top: 1rpx solid #e2e3e5;
                .timeBlock{
                    .timeWrap {
                        display: flex;
                        padding: 10rpx 33rpx;
                        background: #fff;
                        // justify-content: space-around;
                        input {
                            text-align: center;
                            margin-top: 20rpx;
                        }
                        .picker {
                            width: 45%;
                            .placeholder{
                                font-size: 26rpx;
                            }
                        }
                        .box {
                            font-size: 30rpx;
                            color: #333333;
                            // width: 45%;
                            // height: 92rpx;
                            text-align: left;
                            p:nth-child(2) {
                            margin-top: 10rpx;
                            }
                        }
                        .rBox {
                            margin-left: 20rpx;
                        }
                        .imgBox {
                            width: 14rpx;
                            height: 92rpx;
                            img {
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                            }
                        }
                    }
                }
                .add_time{
                    padding: 20rpx 32rpx;
                    box-sizing: border-box;
                    font-size: 26rpx;
                    color: #3399ff;
                }
                .timeLength{
                    display: flex;
                    padding: var(--cell-vertical-padding,10px) var(--cell-horizontal-padding,16px);
                    justify-content: space-between;
                    font-size: 26rpx;
                    color: #333;
                    font-weight: bold;
                    border-top: 1rpx solid #e2e3e5;
                }
            }
        }
        .desc{
            padding: 10rpx 32rpx;
            box-sizing: border-box;
            color: #999999;
            font-size: 24rpx;
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .row{
                display: flex;
                border-top: 1rpx solid #e2e3e5;
                .label{
                    font-size: 24rpx;
                    flex: 1;
                    padding: 30rpx 0 30rpx 20rpx;
                    text-align: center;
                    color: #3399ff;
                }
                .label.active{
                    padding-bottom: 40rpx;
                }
                .btn{
                    flex: 1;
                    padding: 30rpx 0;
                    background: #3399ff;
                    color: #fff;
                    font-size: 26rpx;
                    text-align: center;
                }
                .btn.active{
                    padding-bottom: 100rpx;
                }
            }
        }
    }
</style>