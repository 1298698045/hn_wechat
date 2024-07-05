var compare = function (obj1, obj2) {
  var val1 = obj1.y;
  var val2 = obj2.y;
  if (val1 < val2) {
      return -1;
  } else if (val1 >= val2) {
      return 1;
  } else {
      return 0;
  }            
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    branchid:'',
    appdocid:'',
    tabList:[
      {
        name:'十步杀一人'
      },
      {
        name:'千里不留行'
      },
      {
        name:'事了拂衣去'
      },
      {
        name:'深藏身与名'
      }
    ],
    //移动的是哪个元素块
    moveId:null,
    //最终停止的位置
    endX:0,
    endY:0
  },
  initMove(){
    let tabList = this.data.tabList;
    var tarr = []
    tabList.forEach(function(ele,index){
      let obj = ele
      obj.id = index
      obj.x = 30
      obj.y = 100*index +20
      tarr.push(obj)
    })
    console.log(tarr)
    this.setData({
      tabList:tarr
    })
  },
  moveEnd(e){
    console.log(e)
    var that = this;
    that.setData({
      ["tabList["+that.data.moveId+"].x"]:that.data.endX,
      ["tabList["+that.data.moveId+"].y"]:that.data.endY
    },()=>{
      let tabList = this.data.tabList;
      tabList = tabList.sort(compare);
      that.setData({
        tabList
      },()=>{
        setTimeout(function(){
          that.initMove();
        },500)
        
      })
    })
   
    
    //计算位置
  },
  moveStatus(e){
    // console.log(e)
    //移动的块ID
    var moveid = e.currentTarget.dataset.moveid;
    //最终坐标
    let x = e.detail.x 
    let y = e.detail.y 
    this.setData({
      moveId:moveid,
      endX:x,
      endY:y
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initMove();
  }
})