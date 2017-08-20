/**
 * Created by Administrator on 2017/6/30.
 */
var can;
var ctx;
var girlPic=new Image();
var starPic=new Image();

var num=100;   //星星总数
var stars=[];

var lasttime;    //上一侦刷新的时间
var deltime;     //当前侦与上一侦刷新的时间间隔
var switchy=false;
var  life=1;

function init() {
    can=document.getElementById("canvace");
    ctx=can.getContext("2d");
    
    w=can.clientWidth;
    h=can.clientHeight;

    document.addEventListener("mousemove",mousemove,false);

    girlPic.src="src/girl.jpg";
    starPic.src="src/star.png";
    //实例化星星
    for(var i=0;i<num;i++){
        var obj=new starObj;
        stars.push(obj);
        stars[i].init();     //计算x,y坐标点
    }

    lasttime=Date.now();   //Date.now() 方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。
    gameloop();
}
document.body.onload=init;

//刷新canvas画布
function gameloop() {
    var now=Date.now();
    deltime=now-lasttime;
    lasttime=now;
    //console.log(deltime);

    window.requestAnimFrame(gameloop);   //setTimeout,setInterval,     requestAnimFrame绘制的过程中有一个平滑的过渡，这个方法的性能比setTimeout和setInterval要高   requestAnimFrame时间间隔不等
    drawBackground();
    drawGirl();
    drawStar();
    aliveUpdate()
}

function drawBackground() {
    ctx.fillStyle="#393550";
    ctx.fillRect(0,0,w,h);
}

function drawGirl() {
    //drawImage(img,x,y,width,height)
    ctx.drawImage(girlPic,100,150,600,300);
}

function mousemove(e) {
    if (e.offsetX || e.layerX) {
        var px = e.offsetX == undefined ? e.layerX : e.offsetX;
        var py = e.offsetY == undefined ? e.layerY : e.offsetY;
        //out switchy=false;in switchy=true;
        if(((px>100&px<700)&((py>150&py<450)))){
            switchy=true;
        }else {
            switchy=false;
        }
        console.log(switchy)
    }
}
/** 星星 **/
var starObj = function () {
    this.x;
    this.y;
    this.picNo;
    this.timer;

    this.xSpd;
    this.ySpd;
};
starObj.prototype.init = function () {
    this.x = Math.random() * 600+100;
    this.y = Math.random() * 300+150;
    this.picNo=Math.floor(Math.random()*7);
    this.timer=0;

    this.xSpd=Math.random()*3-1.5;
    this.ySpd=Math.random()*3-1.5;
};
starObj.prototype.updata=function () {
    this.x+=this.xSpd*deltime*0.004;
    this.y+=this.ySpd*deltime*0.004;
    if(!((this.x>100&this.x<700-7)&((this.y>150&this.y<450-7)))){
        this.init();
        return
    }

    this.timer+=deltime;
    if(this.timer>50){
        this.picNo+=1;
        this.picNo%=7;
        this.timer=0;
    }
};
starObj.prototype.draw = function () {
    //save()
    //globalAlpha全局透明度
    //restore()
    ctx.save();
    ctx.globalAlpha=life;

    //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(starPic,this.picNo*7,0,7,7, this.x, this.y,7,7);
    ctx.restore()
};
function drawStar() {
    for (var i = 0; i < num; i++) {
        stars[i].updata();
        stars[i].draw();
    }
}
function aliveUpdate() {
    if(switchy){
        //hide stars
        life-=0.03*deltime*0.05;
        if(life<0){
            life=0
        }
    }else {
        //show stars
        life+=0.03*deltime*0.05;
        if(life>1){
            life=1
        }
    }
}