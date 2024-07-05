<template>
  <div class="wrapper">
    <div class="header">
      <van-notice-bar
        :scrollable="false"
        text="删除人员后将会同步删除本周期的排班"
      />
    </div>
    <div class="center">
      <div class="checkbox_wrap">
        <van-checkbox-group :value="result" @change="onChange">
          <!-- <movable-area style="width: 100%; height: 500px">
            <movable-view
              class="movable-view"
              :damping="2000"
              :out-of-bounds="true"
              :class="{ active: activeIdx == index }"
              v-for="(item, index) in list"
              :y="item.y + 'px'"
              :key="index"
              direction="all"
              :animation="false"
              @htouchmove="
                (e) => {
                  dragChange(e, item);
                }
              "
              :data-index="index"
            > -->
              <van-cell-group>
                <van-cell
                    v-for="(item, index) in list"
                    :key="index"
                  :title="item.Name"
                  value-class="value-class"
                  :data-name="index"
                  clickable
                  @click.stop="toggle"
                >
                    <div class="row">
                        <div class="icons">
                            <span @click.stop="handleMove('up', item, index)">
                                上移
                            </span>
                            <span @click.stop="handleMove('down', item, index)">
                                下移
                            </span>
                        </div>
                        <van-checkbox
                            :class="'checkboxes-' + index"
                            :name="item.EmployeeId"
                        />
                    </div>
                </van-cell>
              </van-cell-group>
            <!-- </movable-view>
          </movable-area> -->
        </van-checkbox-group>
      </div>
    </div>
    <div class="footer">
      <div class="row">
        <p class="label" :class="{ active: isModelmes }">
          已选择<span>{{ result.length }}</span
          >人
        </p>
        <p class="btn sort_btn" :class="{ active: isModelmes }" @click="handleSubmitSort">排序</p>
        <p class="btn" :class="{ active: isModelmes }" @click="delEmployee">确定</p>
      </div>
    </div>
  </div>
</template>
<script>
import { message } from '@/utils/message';
export default {
  data() {
    return {
      sessionkey: wx.getStorageSync("sessionkey"),
      list: [
        {
          id: 1,
          name: "张三",
        },
        {
          id: 2,
          name: "李四",
        },
        {
          id: 3,
          name: "李四2",
        },
        {
          id: 4,
          name: "李四3",
        },
        {
          id: 5,
          name: "李四4",
        },
      ],
      result: [],
      activeIdx: -1,
      recordIdx: 0,
      startTime: "",
      endTime: "",
      unitId:""
    };
  },
  computed: {
    isModelmes() {
      return wx.getStorageSync("isModelmes");
    },
  },
  onLoad(options) {
    Object.assign(this.$data,this.$options.data());
    this.startTime = options.startTime;
    this.endTime = options.endTime;
    this.unitId = options.unitId;
    this.getQuery();
    this.list.forEach((item, index) => {
      const y = index * 44;
      this.$set(item, "y", y);
    });
  },
  methods: {
    getQuery() {
      this.$httpWX
        .get({
          url: this.$api.message.queryList,
          data: {
            SessionKey: this.sessionkey,
            method: this.$api.scheduling.departQuery,
            startDate: this.startTime,
            endDate: this.endTime,
            unitType: 10,
            viewMode: 2,
            calendar: 1,
            md0: 0,
            md1: 0,
          },
        })
        .then((res) => {
          this.list = res.listData;
          this.shiftList = result;
          this.departId = res.Units[0].businessUnitId;
          this.unitId = res.UnitId;
        });
    },
    onChange(e) {
      this.result = e.mp.detail;
      console.log(this.result,'onChange')
    },
    toggle(event) {
      console.log(event)
      const { name } = event.mp.currentTarget.dataset;
      const checkbox = this.$mp.page.selectComponent(`.checkboxes-${name}`);
      checkbox.toggle();
    },
    noop() {},
    handleClick(index) {
      this.recordIdx = index;
    },
    dragChange(e, item) {
      console.log(e);
      const { index } = e.mp.target.dataset;
      this.activeIdx = index;
      item.y = e.y;
      console.log("dragChange:", e);
      // if(index!=0){
      //     let prevY = this.list[index-1].y-22
      // }

      if (this.recordIdx < this.list.length - 1) {
        var nextY = this.list[this.recordIdx + 1].y - 10;
        var prevY = this.list[this.recordIdx - 1].y - 10;
        var next;
        var prev;
        if (e.y > nextY) {
          this.list[this.recordIdx + 1].y -= 44;
          next = true;
        }
        if (e.y < prevY) {
          prev = true;
          this.list[this.recordIdx - 1].y += 44;
        }
        if (next) {
          this.recordIdx++;
        }
        if (prev) {
          this.recordIdx--;
        }
      }

      // console.log('prevY:', prevY)
    },
    handleMouseUp(item, index) {
      console.log(item.y);
      setTimeout(() => {
        item.y = this.list[this.recordIdx].y + 44;
        console.log(item.y);
      }, 0);
    },
    handleVtouchMove(e) {
      // console.log(e)
      // const {index} = e.mp.target.dataset;
      // let y = e.clientY;
      // console.log('handleVtouchMove:', e, index,y)
      // this.$nextTick(()=>{
      //     this.list[index].y = y
      // })
      // console.log(this.list)
    },
    handleMove(direction,item,index){
        console.log(item,index)
        let arr = this.list;
        if(direction=='up'&&index!=0){
            console.log('上移动');
            arr.splice(index - 1, 1, ...arr.splice(index, 1, arr[index - 1]));
        }
        if(direction=='down'&&index<this.list.length-1){
            console.log('下移动')
            arr.splice(index, 1, ...arr.splice(index + 1, 1, arr[index]));
        }
        this.list = arr
    },
    // 排序提交
    handleSubmitSort(){
        let ids = this.list.map(item=>item.EmployeeId).join(',')
        this.$httpWX.get({
            url:this.$api.message.queryList,
            data:{
                method: this.$api.scheduling.sort,
                SessionKey: this.sessionkey,
                EmployeeIds: ids,
                objectTypeCode: 10,
                unitId:this.unitId
            }
        }).then(res=>{
            console.log(res)
            let that = this;
            message.toast({
                title:"排序成功",
                delta: 0,
                success(){
                  setTimeout(()=>{
                    that.getQuery();
                  },1000)
                }
            })
        })
    },
    // 删除人员
    delEmployee(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          method:this.$api.scheduling.del_employee,
          SessionKey:this.sessionkey,
          unitId:this.unitId,
          employeeIds: this.result.join(','),
          startDate: this.startTime,
          endDate: this.endTime
        }
      }).then(res=>{
        console.log(res);
      })
    }
  },
};
</script>
<style lang="scss">
page {
  background: #fff;
}
.wrapper {
  .center {
    position: relative;
    .value-class {
      flex: none !important;
    }
    .movable-view {
      width: 100%;
      height: 88rpx !important;
    }
    .movable-view.active {
      z-index: 9999 !important;
    }
    .row{
        display: flex;
        .icons{
            margin-right: 30rpx;
            color: #3399ff;
        }
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;
    z-index: 999;
    .row {
      display: flex;
      border-top: 1rpx solid #e2e3e5;
      .label {
        font-size: 24rpx;
        flex: 1;
        padding: 30rpx 0 30rpx 20rpx;
        span {
          color: #3399ff;
        }
      }
      .label.active {
        padding-bottom: 40rpx;
      }
      .btn {
        width: 150rpx;
        padding: 30rpx 0;
        background: #3399ff;
        color: #fff;
        font-size: 26rpx;
        text-align: center;
      }
      .btn.active {
        padding-bottom: 100rpx;
      }
      .sort_btn{
        border-right: 1rpx solid #fff;
        box-sizing: border-box                                                                 ;
      }
    }
  }
}
</style>