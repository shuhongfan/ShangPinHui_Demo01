<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
<!--            分类的面包屑-->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i @click="removeCategoryName">×</i></li>
<!--            关键字的面包屑-->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyword">×</i></li>
<!--            品牌的面包屑-->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(":")[1] }}<i @click="removeTradeMark">×</i></li>
<!--            平台的售卖属性的面包屑-->
            <li class="with-x" v-if="searchParams.props" v-for="(p,index) in searchParams.props">{{ p.split(':')[1] }}<i @click="removeProps(index)">×</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>
        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li @click="changeOrder(1)" :class="{active:isOne}">
                  <a href="#">
                    综合
                    <span class="iconfont" :class="isUp ? 'icon-sort-down' : 'icon-sort-up'"></span>
                  </a>
                </li>
                <li  @click="changeOrder(2)" :class="{active:isTwo}">
                  <a  href="#">
                    价格
                    <span class="iconfont" :class="isUp ? 'icon-sort-down' : 'icon-sort-up'"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good,index) in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`"><img v-lazy="good.defaultImg" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i> {{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">
                       {{good.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
<!--          分页器-->
          <Pagination
              @getPageNo="getPageNo"
              :pageNo="searchParams.pageNo"
              :pageSize="searchParams.pageSize"
              :total="total"
              :continues="5" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchSelector from './SearchSelector/SearchSelector'
  import {mapGetters, mapState} from "vuex";
  export default {
    name: 'Search',
    components: {
      SearchSelector
    },
    beforeMount() {
      Object.assign(this.searchParams,this.$route.query,this.$route.params)
    },
    mounted() {
      this.getData()
    },
    computed:{
      ...mapGetters(['goodsList']),
      ...mapState({
        total:state=>state.search.searchList.total
      }),
      isOne(){
        return this.searchParams.order.indexOf('1')!=-1
      },
      isTwo(){
        return this.searchParams.order.indexOf('2')!=-1
      },
      isUp(){
        return this.searchParams.order.indexOf('asc')==-1
      }
    },
    data(){
      return {
        searchParams: {
          "category3Id": "",
          "categoryName": "",
          "keyword": "",
          "order": "1:desc",
          "pageNo": 1,
          "pageSize": 10,
          "props": [],
          "trademark": ""
        }

      }
    },
    methods: {
      // 向服务器发送请求获取search模块数据（根据参数不同返回不同数据进行展示）
      getData(){
        this.$store.dispatch("getSearchList",this.searchParams)
      },
      removeCategoryName(){ // 删除分类的关键字
        this.searchParams.categoryName = undefined
        this.searchParams.category1Id = undefined
        this.searchParams.category2Id = undefined
        this.searchParams.category3Id = undefined
        this.getData()
        if (this.$route.params){
          this.$router.push({name:"search",params:this.$route.params})
        }
      },
      removeKeyword(){ // 删除关键字
        // 给服务器带的参数searchParams的keyword置空
        this.searchParams.keyword = undefined
        // 再次发起请求
        this.getData()
        // 通知兄弟组件Header清楚关键字
        this.$bus.$emit("clear")
        // 进行路由的跳转
        if (this.$route.query){
          this.$router.push({name:'search',query:this.$route.query})
        }
      },
      removeTradeMark(){
        this.searchParams.trademark = undefined
        this.getData()
      },
      // 自定义事件的回调
      trademarkInfo(trademark){
        // console.log(trademark)
        this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
        this.getData()
      },
      // 平台售卖属性
      attrInfo(attr,attrvalue){
        let props = `${attr.attrId}:${attrvalue}:${attr.attrName}`
        console.log(props)
        if (this.searchParams.props.indexOf(props)==-1){
          this.searchParams.props.push(props)
        }
        this.getData()
      },
      removeProps(index){
        this.searchParams.props.splice(index,1)
        this.getData()
      },
      changeOrder(flag){
        // flag用户每一次点击li标签的时候，用于区分综合1还是价格2
        let originOrder = this.searchParams.order
        let originFlag = this.searchParams.order.split(":")[0]
        let originSort = this.searchParams.order.split(":")[1]
        let newOrder = ''
        console.log(originFlag,flag)
        if (originFlag==flag){
          // 点击的是同一个按钮
          newOrder = `${originFlag}:${originSort=='desc'?'asc':'desc'}`
        } else {
          // 点击不是同一个按钮，默认降序
          newOrder = `${flag}:desc`
        }
        this.searchParams.order=  newOrder
        this.getData()
      },
      // 自定义事件的回调函数----获取当前第几页
      getPageNo(pageNo){
        console.log(pageNo)
        this.searchParams.pageNo=pageNo

        this.getData()
      }
    },
    watch: {
      // 数据监听： 监听组件实例身上的属性的属性值变化
      // 监听路由的信息是否发生变化，如果发生变化，再次发起请求
      $route(newValue, oldValue){
        // 再次发起请求之前整理带给服务器参数
        Object.assign(this.searchParams,this.$route.query,this.$route.params)
        // console.log(this.searchParams)
        this.getData()

        // 每一次请求完毕，应该把相应的1 2 3级分类的id值为空
        this.searchParams.category1Id=undefined
        this.searchParams.category2Id=undefined
        this.searchParams.category3Id=undefined
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                }

                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: -5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
        }


      }
    }
  }
</style>
