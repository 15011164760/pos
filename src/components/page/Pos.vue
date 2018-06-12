<template>
  <el-row>
    <el-col :span=7>
      <el-tabs>
        <el-tab-pane label="点餐">
              <el-table :data="tableData" border  style="width: 100%" >
            <el-table-column prop="goodsName" label="商品"  ></el-table-column>
            <el-table-column prop="count" label="量" width="50"></el-table-column>
            <el-table-column prop="price" label="金额" width="70"></el-table-column>
            <el-table-column  label="操作" width="150" fixed="right">
              <template scope="scope">
                <el-button type="text" size="small" @click="delDataList(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="addDataList(scope.row)">增加</el-button>
                <el-button type="text" size="small" @click="reduceDataList(scope.row)">减少</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="totalbtn">
            <el-col :span="12"><div class="grid-content bg-purple">合计数量：{{totalCount}}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">合计价格：{{totalMoney}}</div></el-col>
          </el-row>
          <div style="margin:20px">
            <el-button type="warning"  class="leftbtn">挂单</el-button>
            <el-button type="danger"  @click="delAllGoods">删除</el-button>
            <el-button type="success" @click="checkout" >结账</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="挂单">
          挂单
        </el-tab-pane>
        <el-tab-pane label="外卖">
          外卖
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span=17
      <div class="often-goods">
        <div class="title">常用商品</div>
        <div class="often-goods-list">
          <ul>
            <li v-for="item in oftenGoods" @click="addDataList(item)">
              <span>{{item.goodsName}}</span>
              <span class="o-price">￥{{item.price}}元</span>
            </li>
          </ul>
        </div>
      </div>
<!--商品展示-->
    <div class="goods-type">

      <el-tabs>
        <el-tab-pane label="汉堡">
          <ul class='cookList'>
            <li v-for="tygood in type0Goods">
              <span class="foodImg"><img :src="tygood.goodsImg" width="100%"></span>
              <span class="foodName">{{tygood.goodsName}}</span>
              <span class="foodPrice">￥{{tygood.price}}元</span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="小食">
          <ul class='cookList'>
            <li v-for="tygood in type1Goods">
              <span class="foodImg"><img :src="tygood.goodsImg" width="100%"></span>
              <span class="foodName">{{tygood.goodsName}}</span>
              <span class="foodPrice">￥{{tygood.price}}元</span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="饮料">
          <ul class='cookList'>
            <li v-for="tygood in type2Goods">
              <span class="foodImg"><img :src="tygood.goodsImg" width="100%"></span>
              <span class="foodName">{{tygood.goodsName}}</span>
              <span class="foodPrice">￥{{tygood.price}}元</span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="套餐">
          <ul class='cookList'>
            <li v-for="tygood in type3Goods">
              <span class="foodImg"><img :src="tygood.goodsImg" width="100%"></span>
              <span class="foodName">{{tygood.goodsName}}</span>
              <span class="foodPrice">￥{{tygood.price}}元</span>
            </li>
          </ul>
        </el-tab-pane>

      </el-tabs>
    </div>
    </el-col>
  </el-row>

</template>
<script>
  import  axios from 'axios'
  export default {
    name: 'Pos',
    data () {
      return {
       totalCount:0,//汇总数量清零
       totalMoney:0,//汇总价钱
      isHave:false,
        tableData: [],
        oftenGoods:[
         ],
        type0Goods:[
        ],
        type1Goods:[
        ],
        type2Goods:[
        ],
        type3Goods:[
        ],
      }
    },
    created(){
      axios.get('http://jspang.com/DemoApi/oftenGoods.php').
      then(response=>{
        this.oftenGoods=response.data;
      }).catch(error=>{
         console.log(error);
         alert('网络错误不能访问');
      })
      axios.get('http://jspang.com/DemoApi/typeGoods.php').
      then(response=>{
//        console.log(JSON.stringify(response.data));
        this.type0Goods=response.data[0];
        this.type1Goods=response.data[1];
        this.type2Goods=response.data[2];
        this.type3Goods=response.data[3];
      }).catch(error=>{
         console.log(error);
         alert('网络错误不能访问');
      })
    },
    methods:{
      addDataList(goods){
        this.totalCount=0;//汇总数量清零
        this.totalMoney=0;//汇总数量清零
        let isHave=false;
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].goodsId==goods.goodsId){
              isHave=true;//存在
          }
        }
        if(isHave){
          //存在就进行数量添加
          let arr = this.tableData.filter(o =>o.goodsId==goods.goodsId);
//          console.log(arr);
          arr[0].count++;
        }else{
          //不存在就推入数组
          let newGoods={goodsId:goods.goodsId,goodsName:goods.goodsName,price:goods.price,count:1};
          this.tableData.push(newGoods);
        }
        //进行数量和价格的汇总计算
        this.getAllMoney();
      },
      reduceDataList(goods){
        //存在就进行数量添加
        let arr = this.tableData.filter(o =>o.goodsId==goods.goodsId);
        if(arr[0].count>1){
          arr[0].count--;
          //进行数量和价格的汇总计算
          this.getAllMoney();
        }
      },
      delDataList(goods){
        console.log(goods);
        this.tableData=this.tableData.filter(o => o.goodsId !=goods.goodsId);
        this.getAllMoney();
      },
      getAllMoney(){
        this.totalCount=0;
        this.totalMoney=0;
        if(this.tableData){
          //进行数量和价格的汇总计算
          this.tableData.forEach((element) => {
            this.totalCount+=element.count;
            this.totalMoney=this.totalMoney+(element.price*element.count);
          });
        }
      },
      delAllGoods(){
        this.tableData=[];
        this.totalMoney=0;
        this.totalCount=0;
      },
      //结账
      checkout(){
        if(this.totalCount!=0){
          this.tableData=[];
          this.totalMoney=0;
          this.totalCount=0;
          this.$message({
            type:'success',
            message:'结账成功，感谢你又为店里出了一份力!'
          })
        }else{
          this.$message.error('不能空结。老板了解你急切的心情');
        }
      }
    }
  }
</script>
<style scoped>
  .title{
    height: 20px;
    border-bottom:1px solid #D3DCE6;
    background-color: #F9FAFC;
    padding:10px;
  }
  .el-tabs__content{
    width:20%;
  }
  .often-goods-list ul li{
    list-style: none;
    float:left;
    border:1px solid #E5E9F2;
    padding:10px;
    margin:5px;
    background-color:#fff;
  }
  .o-price{
    color:#58B7FF;
  }
  .goods-type {
    clear: both;
  }

  .cookList li{
    list-style: none;
    width:23%;
    border:1px solid #E5E9F2;
    height: auot;
    overflow: hidden;
    background-color:#fff;
    padding: 2px;
    float:left;
    margin: 2px;

  }
  .cookList li span{

    display: block;
    float:left;
  }
  .foodImg{
    width: 40%;
  }
  .foodName{
    font-size: 18px;
    padding-left: 10px;
    color:brown;

  }
  .foodPrice{
    font-size: 16px;
    padding-left: 10px;
    padding-top:10px;
  }
  .totalbtn{
   color:#409EFF;
    margin:10px;
    font-size:14px;
    /*border:1px solid #ccc;*/
  }
</style>
