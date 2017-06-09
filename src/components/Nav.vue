<template>
  <nav>
    <div class="nav">
      <ul>
        <li v-for="(nav, index) in navs" v-bind:class="{ active: nav.isActive }" v-on:click="active(index,$event)">
          <a href="javascript:void(0)">
            <div class="n1"></div>
            <div class="n2">
              <span></span>
            </div>
            <div class="n3">
              <span>{{nav.name}}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>

    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p id="zp">zpppp</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p id="xw">zpppp</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p id="ms">zpppp</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p id="yl">zpppp</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
  </nav>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'nav',
    data () {
      return {
        navs : [
          {
            name : 'TOP',
            isActive : true,
            tab : 'top'
          },
          {
            name : '作品',
            isActive : false,
            tab : 'zp'
          },
          {
            name : '新闻',
            isActive : false,
            tab : 'xw'
          },
          {
            name : '美食',
            isActive : false,
            tab : 'ms'
          },
          {
            name : '音乐',
            isActive : false,
            tab : 'yl'
          }
        ]
      }
    },
    methods : {
      clearActive(){
        for(let i=0;i<this.navs.length;i++){
          this.navs[i].isActive = false
        }
      },
      active(index,event){
        this.clearActive();
        this.navs[index].isActive = true;
        let obj = this.navs[index].tab;
        let top = 0;
        if(obj != "top"){
          top = $(`#${obj}`).offset().top;
        }
        $('body,html').animate({ scrollTop: top }, 500);
      },
    },
    mounted() {
      let _this = this;
      let topValArr = [];
      for(let i = 1;i < this.navs.length; i++){
        let obj = this.navs[i].tab;
        let top = $(`#${obj}`).offset().top;
        topValArr.push(top);
      }
      $(document).scroll(function() {
        let docTop = $(this).scrollTop();
        _this.clearActive();
        if(docTop < topValArr[0] - 20){
          _this.navs[0].isActive = true;
        }else if(docTop > topValArr[topValArr.length-1] - 20){
          _this.navs[_this.navs.length-1].isActive = true;
        }else{
          for(let i = 0; i < topValArr.length - 1; i++){
            if(docTop > topValArr[i] - 20 && docTop < topValArr[i+1] - 20){
              _this.navs[i+1].isActive = true;
            }
          }
        }
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body {
    background: #f5f5f5;
  }
  .nav p{
    position: relative;
  }
  .nav {
    z-index: 998;
    position: fixed;
    top: 50%;
    margin-top: -91px;
    left: 50px;
  }

  .nav div {
    display: inline-block;
    vertical-align: middle;
  }

  .nav li {
    height: 36px;
    list-style: none;
  }

  .nav li a {
    display: block;
    text-decoration: none;
  }

  .nav .active .n1 {
    transform: translate(0, 0);
    background: #ff0078 !important
  }

  .nav .n1 {
    width: 10px;
    height: 3px;
    background: #fff;
    transform: translate(-8px, 0);
  }

  .nav .n2 {
    width: 40px;
    height: 1px;
    overflow: hidden;
  }

  .nav .active .n2 {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav .n2 span {
    display: block;
    width: 40px;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  .nav .n3 {
    overflow: hidden;
    height: 36px;
    width: 100px;
  }

  .nav .n3 span {
    display: inline-block;
    vertical-align: middle;
    font-size: 13px;
    font-weight: bold;
    color: #fff;
    font-family: '微软雅黑';
    letter-spacing: 1px;
    background: #000;
    padding: 9px 10px;
  }

  .n3 span {
    transform: translate(0, 0px);
  }

  .nav .n1, .nav .n2 span, .nav .n3 span {
    transition: all 0.2s;
    transform: translate(-102%, 0px);
  }
  .nav li a:hover .n3 span,.nav li a:hover .n2 span  {
    transition: all 0.4s cubic-bezier(0.68, 0, 0.265, 1);
    transform: translate(0, 0);
    transition-delay: 0.1s;
  }

  .nav .active .n2 span, .nav .active .n3 span {
    transform: translate(0, 0px);
  }
</style>
