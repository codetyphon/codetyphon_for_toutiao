# codetyphon

一个今日头条小程序的canvas游戏引擎。

因为今日头条小程序的小游戏，只能用JavaScript写，因此神马pixi、phaser之类的框架都不能用了，当然可以移植但需要一些开发量。所以干脆，我就自己写了一个。可以加载图片资源，设置精灵，设置游戏状态及碰撞检测等。

## 示例代码

```
import {Res,Sprite,Render,Game,Width,Height} from './codetyphon.js';

//添加图片资源
Res.add_img('player','./images/player.png');
Res.add_img('flyobj','./images/flyobj.png');
//设置图片加载完毕后的函数
Res.setup(function(){

  let x = Width/2-25;
  let y = Height-50;
  
  //玩家精灵
  let player = new Sprite(Res.imgs['player'],x,y,50,65);//x,y,width,height
  
  //敌机精灵
  let obj = new Sprite(Res.imgs['flyobj'],x,0,50,50);

  //游戏循环
  Game.main(function(){
    player.y-=2;
    obj.y+=2;
    //碰撞检测
    player.collide(obj,function(){
      Game.over();
    });
    Render.background('#000000');
    Render.show(player);
    Render.show(obj);
  });
  
  //启动游戏
  Game.start();
  
});
```

## 效果

![](demo.gif)

