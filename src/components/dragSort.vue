<template>
  <view class="wrapper">
    <movable-area class="movable-area">
      <movable-view
        v-for="(item, index) in imgSrcs"
        :key="index"
        class="wrapper-image"
        :style="{'z-index': currentTouchIndex==index ? 99 : 0}"
        :x="reallyPositons[index].x + 'rpx'"
        :y="reallyPositons[index].y + 'rpx'"
        direction="all"
        :animation="animation"
        :out-of-bounds="false"
        @change="_onImgMove"
        @touchend="_onTouchEnd"
        :data-index="index"
      >
        <!-- <image
          class="image"
          mode="aspectFill"
          :src="item"
          @click="_previewImage"
          :data-index="index"
          :data-images="imgSrcs"
        /> -->
        <p class="tag">{{item.name}}</p>
        <!-- <div
          class="delete-icon"
          @click="_removeOnePicture"
          :data-index="index"
        ></div> -->
      </movable-view>
    </movable-area>
  </view>
</template>

<script>
const standardPositions = [
  //第一排
  {
    x: 0,
    y: 0
  },
  {
    x: 0 + 156 + 20,
    y: 0
  },
  {
    x: 0 + 156 + 20 + 156 + 20,
    y: 0
  },
  {
    x: 0 + 156 + 20 + 156 + 20 + 156 + 20,
    y: 0
  },
  //第二排
  {
    x: 0,
    y: 0 + 83 + 20
  },
  {
    x: 0 + 156 + 20,
    y: 0 + 83 + 20
  },
  {
    x: 0 + 156 + 20 + 156 + 20,
    y: 0 + 83 + 20
  },
  {
    x: 0 + 156 + 20 + 156 + 20 + 156 + 20,
    y: 0 + 83 + 20
  },
  //第三排
  {
    x: 0,
    y: 0 + 83 + 20 + 83 + 20
  },
  {
    x: 0 + 156 + 20,
    y: 0 + 83 + 20 + 83 + 20
  },
  {
    x: 0 + 156 + 20 + 156 + 20,
    y: 0 + 83 + 20 + 83 + 20
  },
  //防止添加按钮报错 ，虽然报错的时候添加按钮是隐藏的 但是还是先保留。
  {
    x: 0,
    y: 0
  },
  {
    x: 0,
    y: 0
  }
];
export default {
  props: {
    imgSrcs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      rpx: "",
      standardPositions,
      reallyPositons: standardPositions.slice(0, standardPositions.length),
      showAdd: true, // 是否显示添加图片
      currentTouchIndex: -1, //当前拖动的那个坐标
      animation: true //拖动排序时是否执行动画。现在在松手时不执行动画
    };
  },
  mounted() {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        console.log("获取系统信息 ", res);
        //获取rpx的比例
        var width = res.windowWidth;
        if (res.windowWidth > res.windowHeight) {
          width = res.windowHeight;
        }
        let rpx = width / 750;
        that.rpx = rpx;
      }
    });
  },
  methods: {
    /**
     * 预览图片
     * */
    _previewImage(event) {
      console.log("点击了一张图片", event);
      const index = event.currentTarget.dataset.index;
      const images = event.currentTarget.dataset.images;
      wx.previewImage({
        urls: images,
        current: images[index]
      });
    },
    /**
     * 点击增加图片按钮
     * */
    _onTappedAddPicture() {
      let that = this;
      let count = 9 - this.imgSrcs.length;
      wx.chooseImage({
        count: count,
        success: function(res) {
          let tempFilePaths = res.tempFilePaths.join(",");
          that._addPictures(tempFilePaths);
        }
      });
    },

    /**
     * 增加图片
     * */
    _addPictures(paths) {
      if (this.imgSrcs.length == 0) {
        let temps = paths.split(",");
        this.imgSrcs = temps;
      } else {
        let splits = paths.split(",");
        let imgSrcs = this.imgSrcs;
        let concats = imgSrcs.concat(splits);
        this.imgSrcs = concats;
      }
      this.showAdd = this.imgSrcs.length > 2 ? false : true
      this.$emit('change', this.imgSrcs)
    },

    /**
     * 删除一张图
     * */
    _removeOnePicture(e) {
      let index = e.target.dataset.index;
      this.imgSrcs.splice(index, 1);
      this.showAdd = false;
      if (this.imgSrcs.length < 9) {
        this.showAdd = true;
      }
      this.$emit('change', this.imgSrcs)
    },

    /**
     * 图片正在移动
     * 当图片被拖动的时候需要做的事情：
     * -- 将当前这张图片的zIndex调大，让他始终不会被其他图片挡住；
     * -- 获得当前拖动的图片的index
     * -- 根据当前的坐标计算他移动到哪了 目标的index
     * -- 如果移动到了别人的底盘，让别人给他让位置，并记录目标位置的index
     */
    _onImgMove(event) {
      if (event.mp.detail.source != "touch") {
        //非用户行为则不处理
        return;
      }

      let imgListLength = this.imgSrcs.length; //当前图片列表的长度
      let touchIndex = event.currentTarget.dataset.index; //跟随手指移动的那张图的index
      let detail = event.mp.detail; //手指在屏幕上的坐标信息
      this.isMoving = true; //将状态修改为正在拖动
      let targetIndex = this._calculateTargetIndex(detail); //当前被拖动到了哪儿
      console.log(
        "目标位置的index = ",
        touchIndex,
        ",targetIndex = ",
        targetIndex,
        ",length = ",
        imgListLength
      );
      //只需要修改我和目标位置之间的坐标（不包含我，包含目标），其他不要动
      if (targetIndex >= 0) {
        //至少有一个目的地
        if (
          (!this.currentTargetIndex && this.currentTargetIndex != 0) ||
          this.currentTargetIndex != targetIndex
        ) {
          //每次进入一个目标 只执行一次动画
          console.log(
            "开始计算，此时的目标位置 currentTargetIndex：",
            this.currentTargetIndex,
            ",targetIndex = ",
            targetIndex
          );

          this.currentTargetIndex = targetIndex;
          this.currentTouchIndex = touchIndex
          let data = {};
          //重新计算每一个图片应该在的位置
          for (let i = 0; i < imgListLength; i++) {
            //默认设置为标准位置
            let position = standardPositions[i];
            if (touchIndex > targetIndex) {
              //向前移动，不需要处理touchIndex之后的数据，不需要处理 targetIndex 之前的数据
              if (i <= touchIndex && i >= targetIndex) {
                //设置为标准位置往后移动一位
                position = standardPositions[i + 1];
              }
            } else {
              //向后移动，不需要处理touchIndex之前的数据，不需要处理 targetIndex 之后的数据
              if (i >= touchIndex && i <= targetIndex) {
                //设置为标准位置往前移动一位
                position = standardPositions[i - 1];
              }
            }
            //不修改当前拖动的这张图的位置，避免发生晃动
            if (i != touchIndex) {
              data[`reallyPositons[${i}]`] = position;
            }
          }
          //一顿计算之后 如果发现生成了新的data数据 那么就执行~
          if (data) {
            console.log(
              "执行动画，当前目标位置 currentTargetIndex= ",
              this.currentTargetIndex,
              ",targetIndex = ",
              targetIndex,
              " 计算完成的data = ",
              data
            );
            this.data = data
          }
        }
      }
    },

    /**
     * 手指从屏幕上离开了
     * */
    _onTouchEnd(event) {
      // console.log("手指从屏幕上离开了", event)
      if (this.isMoving) {
        this.animation = false
        this.isMoving = false;
        let index = event.currentTarget.dataset.index;
        console.log(
          "这是一次滑动结束的离开事件。 拖动目标 = ",
          index,
          "目的地 = ",
          this.currentTargetIndex
        );
        if (this.currentTargetIndex >= this.imgSrcs.length) {
          console.log(
            "目标位置 超出了图片数组的长度，将以图片数组长度为目标位置"
          );
          this.currentTargetIndex = this.imgSrcs.length - 1;
        }
        /**
         * 松手后真正修改图片的顺序。
         * 如果开启了动画 会出现奇怪的现象，暂时在松手的时候关闭动画。
         *
         * 此处待优化，如果移动距离超过两张图，会出现图片闪烁，虽然不影响功能，但是看起来很不友好。
         *
         */
        this.currentTouchIndex = -1
        this.reallyPositons = standardPositions.slice(0, standardPositions.length)
        this.imgSrcs = this._sortArr(this.imgSrcs, index, this.currentTargetIndex)
        this.animation = true
        this.$emit('change', this.imgSrcs)
      }
    },
    /**
     * 移动数组的一个条目到另一个位置
     * */
    _sortArr(arr, fromIndex, toIndex) {
      let imgSrcs = arr.slice(0, arr.length);
      let newArr = [];
      for (let i = 0; i < imgSrcs.length; i++) {
        if (i == toIndex) {
          //当前拖动的这条
          newArr.push(imgSrcs[fromIndex]);
        } else {
          newArr.push("");
        }
      }
      imgSrcs.splice(fromIndex, 1);
      for (let i = 0, j = 0; i < newArr.length, j < imgSrcs.length; i++, j++) {
        //新数组为空 则填入
        if (!newArr[i]) {
          newArr[i] = imgSrcs[j];
        } else {
          j--;
        }
      }
      return newArr;
    },

    /**
     * 根据坐标计算当前图片移动到了哪个索引应该存在的位置，返回索引值
     * */
    _calculateTargetIndex(detail) {
      /**
       * 80的目的是为了更接近用户手指按下的位置
       */
      let x = detail.x / this.rpx + 80;
      let y = detail.y / this.rpx + 80;
      let index = -1;
      if (y <= 200) {
        //第一行
        if (x <= 200) {
          //第1个
          index = 0;
        } else if (x >= 200 && x <= 410) {
          //第2个
          index = 1;
        } else if (x >= 410 && x <= 620) {
          //第3个
          index = 2;
        }
      } else if (y >= 200 && y <= 410) {
        //第二行
        if (x <= 200) {
          //第4个
          index = 3;
        } else if (x >= 200 && x <= 410) {
          //第5个
          index = 4;
        } else if (x >= 410 && x <= 620) {
          //第6个
          index = 5;
        }
      } else if (y >= 410 && y <= 620) {
        //第三行
        if (x <= 200) {
          //第7个
          index = 6;
        } else if (x >= 200 && x <= 410) {
          //第8个
          index = 7;
        } else if (x >= 410 && x <= 620) {
          //第9个
          index = 8;
        }
      }
      return index;
    }
  }
};
</script>

<style scoped>
.delete-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #f43530;
  right: 0;
  top: 0;
  border-radius: 20px;
  z-index: 5;
}
.delete-icon::before {
  content: "";
  width: 13px;
  height: 2px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
/* .wrapper {
  min-height: 190rpx;
  max-height: 100%;
  border-radius: 10rpx;
  padding: 0 30rpx 30rpx 30rpx;
  background: white;
} */

.placeholder {
  color: #999;
  letter-spacing: 0;
  line-height: 40rpx;
  font-size: 32rpx;
}

.textarea {
  /* background: red; */
  min-height: 150rpx;
  color: #444;
  font-size: 32rpx;
}

.textarea textarea {
  width: 100%;
  padding: 30rpx 0;
}

.movable-area {
  width: 100%;
  height:610rpx;
}
.margin-20rpx {
  margin-right: 20rpx;
}

.add {
  width: 190rpx;
  height: 190rpx;
  border: 2rpx solid #ccc;
  border-radius: 12rpx;
  /* position: relative; */
}

.line1 {
  position: absolute;
  width: 2px;
  height: 62rpx;
  background: #ccc;
  top: 68rpx;
  left: 50%;
}

.line2 {
  position: absolute;
  height: 2px;
  width: 63rpx;
  background: #ccc;
  top: 50%;
  left: 65rpx;
}

.wrapper-image {
  /* position: relative; */
  width: 156rpx;
  height: 83rpx;
}
.tag{
    width: 156rpx;
    height: 83rpx;
    text-align: center;
    line-height: 83rpx;
    font-size: 29rpx;
    color: #333333;
    background: red;
    border-radius: 7rpx;
}
.image {
  width: 190rpx;
  height: 190rpx;
  border: solid 1rpx black;
  border-radius: 12rpx;
}

.close-image {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10rpx 10rpx 20rpx 20rpx;
}

button {
  width: 670rpx;
  height: 100rpx;
  background: #336;
  border-radius: 12rpx;
  font-size: 32rpx;
  color: #fff;
  line-height: 100rpx;
}

button::after {
  border: 0;
}
</style>