function CanvasDoodle(canvas, left, top) {
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.imgSrc = canvas.getAttribute("imgsrc");
  this.width = canvas.width;
  this.height = canvas.height;
  this.left = parseInt(canvas.style.left);
  this.top = parseInt(canvas.style.top);
  this.touchX = 0;
  this.touchY = 0;
  this.needDraw = false;
  this.init();
  this.temX = 0;
  this.temY = 0;
  this.targetX = 0;
  this.targetY = 0;
  this.isOk = false;
}

CanvasDoodle.prototype = {
  init: function() {
    var _self = this;
    var ratio = getPixelRatio(_self.ctx);
    var img = new Image();
    img.src = this.imgSrc;
    img.onload = function() {
       _self.ctx.drawImage(img,0,0,_self.width,_self.height);
        _self.ctx.globalCompositeOperation = 'destination-out';
        _self.ctx.lineCap="round";
        _self.ctx.lineJoin="round";
        _self.ctx.lineWidth=25*ratio;
    }

    this.canvas.addEventListener('touchstart', function(e) {
      e.preventDefault();
      _self.needDraw = true;
      var touch = e.touches[0];
      _self.ctx.beginPath();
      _self.ctx.moveTo((touch.pageX - left)*ratio, (touch.pageY - top)*ratio);
      _self.temX = touch.pageX - left;
      _self.temY = touch.pageY - top;
       console.log(touch.pageX);
        console.log((touch.pageX - left)*ratio);
    }, false);

    this.canvas.addEventListener('touchmove', function(e) {
      e.preventDefault();
      if (_self.needDraw) {
        var touch = e.touches[0];
        _self.ctx.lineTo((touch.pageX - left)*ratio, (touch.pageY - top)*ratio);
        _self.ctx.stroke();
        _self.targetX = touch.pageX - left;
        _self.targetY = touch.pageY - top;
      }
    }, false);

    this.canvas.addEventListener('touchend', function(e) {
      e.preventDefault();
      _self.needDraw = false;
    });
  }
};


var w = $(".canvas-box").width(),
    h = $(".canvas-box").height(),
    left = $(".canvas-box").offset().left,
    top = $(".canvas-box").offset().top,
    canvas = document.getElementById('CanvasDoodle'),
    ctx = canvas.getContext("2d");
    $(".act-canvas").attr("width", w*getPixelRatio(ctx)).attr("height", h*getPixelRatio(ctx));
    new CanvasDoodle(canvas, left, top);

function getPixelRatio(ctx){
      var devicePixelRatio = window.devicePixelRatio || 1;
      var backingStore = ctx.backingStorePixelRatio ||
         ctx.webkitBackingStorePixelRatio ||
         ctx.mozBackingStorePixelRatio ||
         ctx.msBackingStorePixelRatio ||
         ctx.oBackingStorePixelRatio ||
         ctx.backingStorePixelRatio || 1;
      return(devicePixelRatio / backingStore);
}