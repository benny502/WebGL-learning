# Webgl-learning
学习WebGL

对WebGL API基于自身理解进行了封装，使用了requirejs

##目前阶段：
* 实现了场景，基本的gameobject
* 视点变换，正射与投影变换
* 世界变换（平移，旋转，缩放）物体变换
* 深度测试


##demo：
可参考lib/webgl.js文件

    require(['jquery','webgl.view3d','webgl.gameobject3d'],function($,view,gameobject){ 
      var canvas = $('canvas')[0];
  
      var view = new view(canvas);  //创建场景,传入canvas对象
      view.clearColor(0,0,0,1); //设置背景颜色
      view.setPerspective(30, canvas.width/canvas.height, 0.1, 100);   //投影映射 
      view.setLookAt(0,0,-5,
                  0,0,100,
                  0,1,0);   //设置视点位置
      var triangle1 = new gameobject([      0.0,  0.5,   0.0,   // gameobject(vertext,color);
                              -0.5, -0.5,   0.0,
                               0.5, -0.5,   0.0,
                               ],
                               [
                          0.5,  0.5,  0, 1.0,
                          0.5,  0.5,  0, 1.0,
                          0.5,  0.5,  0, 1.0,
                          ]);
  
      var triangle2 = new gameobject(
                          [   
                               0.0,  1.0,  0.5,  
                              -0.5, -1.0,  0.5,
                               0.5, -1.0,  0.5
                               ],
                               [
                          1.0,  0.0,  0.0, 1.0,
                          1.0,  0.0,  0.0, 1.0,
                          1.0,  0.0,  0.0, 1.0,
                          ]
      );
  
       view.add(triangle1); //将gameobject加入场景中
       view.add(triangle2);
  
  
      var lastTime = Date.now(),angleStep = 20;
      function animate(){
  
          var now = Date.now();
          var timeLapse = now - lastTime;
          var angle = angleStep * timeLapse / 1000.0;
          angle %= 360;
          lastTime = now;
          view.rotation(angle,0,1,0); //场景变换
          triangle1.rotation(angle,1,0,0);  //物体变换
          view.run(); //开始绘制
          requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    });

##将要实现
* 光照
* 着色器切换
* 纹理与材质


