let Res = {
  count:0,
  loaded_img:0,
  imgs:[],
  add_img(name,src){
    let _self=this;
    this.count+=1;
    this.imgs[name]=tt.createImage();
    this.imgs[name].src=src;
    this.imgs[name].onload=function(){
      _self.loaded_img+=1;//这里不能是this，否则数值不对。
      console.log(name,'加载完毕')
    }
  },
  setup(fn){
    let _self=this;
    let waitloading = setInterval(function(){
      if(_self.loaded_img==_self.count){
        //资源加载完毕
        console.log("所有图片皆加载完毕");
        //清除轮循检测资源是否完毕的定时器
        clearInterval(waitloading);
        fn();
      }
    },1000);
  }
}

class Sprite{
  constructor(img,x,y,w,h){
    this.img=img;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
  }
  collide(sprite,fn){
    let me_center_x=this.x+this.w/2;
    let me_center_y=this.y+this.h/2;
    let it_center_x=sprite.x+sprite.w/2;
    let it_center_y=sprite.y+sprite.h/2;
    let x_sub = Math.abs(me_center_x-it_center_x);
    let y_sub = Math.abs(me_center_y-it_center_y);
    if(x_sub<this.w/2 && y_sub<this.h/2){
      fn();
    }
  }
  show(){
    
  }
}

let Render={
  canvas:tt.createCanvas(),
  context:null,
  init(){
    this.context=this.canvas.getContext('2d');
  },
  background(color){
    this.context.fillStyle = color;
    let systemInfo = tt.getSystemInfoSync();
    this.context.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
  },
  show(sprite){
    this.context.drawImage(sprite.img,sprite.x,sprite.y,sprite.w,sprite.h);
  }
}

let Game={
  status:"ready",
  start(){
    this.status="looping";
  },
  over(){
    this.status="over";
  },
  main(fn){
    let _self=this;
    function update(){
      if(_self.status=="looping"){
        fn();
      }
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
}

Render.init();
let systemInfo = tt.getSystemInfoSync();
let Width = systemInfo.windowWidth;
let Height = systemInfo.windowHeight;
export {Res,Sprite,Render,Game,Width,Height};
