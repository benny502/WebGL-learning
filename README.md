#2016-07-12 纠正一个概念

刚刚理解了世界坐标系与本地坐标系的互相转换

本地坐标系——>世界坐标系——>视图坐标系——>裁剪坐标

任何一个物体要投影到屏幕上都要经过以上的坐标系变换

在本地坐标系中，所有物体的的原点都位于（0，0），与世界坐标系的原点重合。要将物体放入世界坐标系，需要经过一系列的平移translate，旋转rotate，缩放scale `mformMatrix * position`

通过设定视点，将物体由世界坐标系向视图坐标系转换。`vformMatrix * mformMatrix * position`

最后通过设定正射投影，或者透视投影将物体由视图坐标系向裁剪坐标系转换  `pformMatrix * vformMatrix * mformMatrix * position`

最后得出的公式正好与我们转换的过程相反

由以上过程可以看出来，世界坐标系应该是个静止不动的坐标系，所有的变化都通过物体转换，视点变化来达成。所以view中也不应该存在rotation，translation等方法。但我还是保留了这几个方法。特别在此注明


# Webgl-learning
学习WebGL

对WebGL API基于自身理解进行了封装，使用了requirejs

##目前阶段：
* 实现了场景，基本的gameobject
* 视点变换，正射与透视投影变换
* 物体由本地坐标系向世界坐标系，视图坐标系，裁剪坐标系转换
* 深度测试
* 实现了矩形对象


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


