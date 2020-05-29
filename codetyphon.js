function random(begin,end){
  return Math.floor(Math.random()*(end-begin))+begin;
}

let Res = {
  count:0,
  loaded_img:0,
  imgs:[],
  waitloading:0,
  show_loading(){
    tt.showLoading({
    title: "请求中，请稍后...",
  });
  },
  add_img(name,src){
    let _self=this;
    this.count+=1;
    this.imgs[name]=tt.createImage();
    this.imgs[name].src=src;
    this.imgs[name].onload=function(){
      _self.loaded_img+=1;//这里不能是this，否则数值不对。
      console.log(name,'加载完毕')
      tt.hideLoading({});
    }
    if(this.waitloading==0){
      this.waitloading = setInterval(function(){
        if(_self.loaded_img==_self.count){
          //资源加载完毕
          console.log("所有图片皆加载完毕");
          //清除轮循检测资源是否完毕的定时器
          clearInterval(_self.waitloading);
          Game.start();
          Game.main();
        }
      },1000);
    }
  }
}

class Sprite{
  constructor(name,img,x,y,w,h){
    this.name=name;
    this.img=img;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.collide_functions={};
    this.turn_on_collide=false;
  }
  randomX(){
    this.x=random(0,Width);
  }
  randomY(){
    this.y=random(0,Height);
  }
  onCollide(name,fn){
    this.turn_on_collide=true;
    this.collide_functions[name]=fn;
  }
  collide(){
    Render.sprites.map(sprite=>{
      if (sprite!=this){
        if(this.collide_functions[sprite.name]!=undefined){
          let me_center_x=this.x+this.w/2;
          let me_center_y=this.y+this.h/2;
          let it_center_x=sprite.x+sprite.w/2;
          let it_center_y=sprite.y+sprite.h/2;
          let x_sub = Math.abs(me_center_x-it_center_x);
          let y_sub = Math.abs(me_center_y-it_center_y);
          if(x_sub<this.w/2 && y_sub<this.h/2){
            console.log('name:',sprite.name);
            this.collide_functions[sprite.name](sprite);
          }
        }
      }
    });
  }
  run(){
  }
}

let Render={
  canvas:tt.createCanvas(),
  context:null,
  sprites:[],
  init(){
    this.context=this.canvas.getContext('2d');
  },
  clear(){
    this.context.clearRect(0,0,Width,Height);  
  },
  text(text,x,y,color){
    this.context.fillStyle=color;
    this.context.font="40px Georgia";
    this.context.fillText(text,x,y);
    this.context.fillStyle="#000"
  },
  renderBg(){
    let systemInfo = tt.getSystemInfoSync();
    this.context.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
  },
  background(color){
    this.context.fillStyle = color;
  },
  add(sprite){
    this.sprites.push(sprite);
  },
  renderSprites(){
    this.sprites.map((sprite,index,sprites)=>{
      if(sprite.die==true){
        sprites.splice(index,1);
      }else{
        sprite.run();
        if(sprite.turn_on_collide==true){
          sprite.collide();
        }
        this.context.drawImage(sprite.img,sprite.x,sprite.y,sprite.w,sprite.h);
      }
    });
  }
}



let Game={
  status:"ready",
  setup(){},
  looping(){},
  start(){
    Render.sprites=[];
    this.setup();
    this.status="looping";
  },
  over(){
    let _self=this;
    this.status="over";
    tt.showModal({
      title: "game over",
      content: "再玩一次",
      success(res) {
        if (res.confirm) {
          console.log("re_start")
          _self.start();
        } else if (res.cancel) {
          tt.exitMiniProgram()
        } else {
          // what happend?
        }
      },
      fail(res) {
        console.log(`showModal调用失败`);
      }
    });
  },
  pause(){
    this.status="pause";
  },
  
  main(fn){
    let _self=this;
    function update(){
      if(_self.status=="looping"){
        Render.clear();
        Render.renderBg();
        Render.renderSprites();
        _self.looping();
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
