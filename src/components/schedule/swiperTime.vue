<template>
  <div>
    <swiper
      :current="number"
      @change="changeSwiper"
      slidesPerView="2"
      @transition="getTransition"
      indicator-color="red"
      indicator-active-color="yellow"
      :autoplay="false"
      class="swiper"
    >
      <block>
        <swiper-item class="item" v-for="(item,i) in currentList" :key="i">
          <div class="swiper-wrapper">
            <ul class="swiper-slide">
              <li v-for="(k,j) in item" @click="setCurrent(i,j,k.sendDate)" :key="j">
                <p class="day">{{k.week}}</p>
                <span class="jin" v-if="k.now">今</span>
                <!-- <i class="iconfont icon-jin" v-if="k.now"></i> -->
                <span class="select" v-else :class="{'active':currentIndex==j}">{{k.showDate}}</span>
              </li>
            </ul>
          </div>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>
<script>
export default {
  name:"SwiperCalendar",
  data() {
    return {
      currentList: [],
      currentFirstDate: null,
      currentIndex: new Date().getDay(),
      cateLeft: 0,
      nowDate: this.setNowDate(new Date()),
      sign: null,
      number: 1,
      actNum: 0
    };
  },
  onLoad() {
    this.now();
  },
  methods: {
    changeSwiper(e) {
      console.log(e);
      let current = e.mp.detail.current;
      if (current == this.currentList.length - 1) {
        let next = this.setDate(this.addDate(this.currentFirstDate, 7));
        this.currentList.push(next);
        // this.currentIndex = 6;
        this.nowDate = this.currentList[current][this.currentIndex].sendDate;
        // console.log(this.nowDate, "nowDate");
      }else 
      if (current == 0) {
        this.actNum++;
        this.number = current;
        let pre = this.setDate(this.addDate(this.sign, -7));
        this.currentList.unshift(pre);
        this.number = 1;
        // this.currentIndex = 0;
        this.nowDate = this.currentList[this.number][this.currentIndex].sendDate;
        // console.log(this.nowDate, "nowDate");
      }else {
          this.nowDate=this.currentList[current][this.currentIndex].sendDate;
      }
      console.log(this.nowDate, "nowDate-----");
      this.$emit('change',{
          nowDate:this.nowDate,
          current:current
      })
    },
    getTransition(e) {
      // console.log(e);
    },
    formatDate(nowDate) {
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let date = nowDate.getDate();
      let week = ["日", "一", "二", "三", "四", "五", "六"][nowDate.getDay()];
      return {
        week,
        showDate: date,
        listDate: `${month}月${date}日 ${week}`,
        sendDate: `${year}-${month}-${date}`,
        now: nowDate.toLocaleDateString() === new Date().toLocaleDateString()
      };
    },
    now() {
      let now = this.setDate(new Date());
      let pre = this.setDate(this.addDate(this.currentFirstDate, -7));
      let next = this.setDate(this.addDate(this.currentFirstDate, 14));
      this.currentList = [pre, now, next];
    },
    addDate(date, n) {
      date.setDate(date.getDate() + n);
      return date;
    },
    setDate(date) {
      console.log("setdate");
      let week = date.getDay();
      date = this.addDate(date, week * -1);

      this.currentFirstDate = new Date(date);
      if (!this.sign) {
        this.sign = this.addDate(new Date(date), -7);
      }
      let list = [];
      for (let i = 0; i < 7; i++) {
        list.push(
          this.formatDate(
            i === 0 ? this.addDate(date, 0) : this.addDate(date, 1)
          )
        );
      }
      //console.log(list,'list');
      return list;
    },
    setNowDate(nowDate) {
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let date = nowDate.getDate();
      return `${year}-${month}-${date}`;
    },
    currentClassStatus(i, j) {
      console.log(i === 1 && j === this.currentIndex, "boolear");
      return i === 1 && j === this.currentIndex;
    },
    setCurrent(i,j, sendDate) {
      console.log(j, sendDate);
      this.currentIndex = j;
      this.nowDate = sendDate;
      this.$emit('change',{
          nowDate:this.nowDate,
          current:i
      })
    },
    getNow() {
      this.now();
      this.nowDate = this.setNowDate(new Date());
      this.currentIndex = new Date().getDay();
    },
    getReturn(){
        this.number = ''
        this.number = this.actNum+1;
        this.currentIndex = new Date().getDay();
    }
  }
};
</script>
<style lang="scss">
.swiper {
  height: 140rpx;
  .item{
    height: 140rpx!important;
    .swiper-wrapper {
        width: 100%;
        height: 100%;
        .swiper-slide {
            padding: 10px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            background: #fff;
            li {
                color: #fff;
                font-size: 11px;
                text-align: center;
                width: 25px;
                // p {
                // font-size: 9px;
                // opacity: 0.7;
                // }
                .day{
                    font-size: 26rpx;
                    color: #7b8187;
                }
                .jin {
                    display: inline-block;
                    font-size: 10px;
                    width: 25px;
                    height: 25px;
                    line-height: 25px;
                    text-align: center;
                    background: #3399ff;
                    color: #fff!important;
                    border-radius: 50%;
                }
                span {
                    margin-top: 5px;
                    display: inline-block;
                    color: #333333;
                    font-size: 30rpx;
                    height: 25px;
                }
                .select{
                    margin-top: 8px;
                }
                .select.active {
                    width: 25px;
                    height: 25px;
                    line-height: 25px;
                    text-align: center;
                    background: #3399ff;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 30rpx;
                }

                i {
                font-size: 20px;
                display: inline-block;
                margin-top: 2px;
                }
            }
        }
    }
  }
}
</style>