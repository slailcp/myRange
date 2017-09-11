function myRange() {
    this.zIndex = 1;
    this.blockHalfWidth = null;
    this.$lineOffsetLeft = null;
    this.rangeWidth = null;
    this.disX1 = 0;//滑竿相对父元素滑动的距离
    this.initX1 = 0;//初始距离-用来判断是否向左还是向右滑动
    this.endX1 = 0;//最终距离-用来判断是否向左还是向右滑动
    this.disX2 = null;//滑竿相对父元素滑动的距离
    this.initX2 = 0;//初始距离-用来判断是否向左还是向右滑动
    this.endX2 = 0;//最终距离-用来判断是否向左还是向右滑动
    this.min = null;
    this.max = null;
    this.texts = null;
    this.step = null;
    this.set = {
        number: 3000, //传入的基数
        values: [0, 3000], //点的位置
        step: 0,//每次滑动的步数
        slide: function (arg2) {
            console.log(arg2)
        }
    }
}
myRange.prototype.init = function (obj, opt) {
    var This = this;
    this.texts = [];
    $.extend(this.set, opt);

    this.setRangeHtml(obj);
    this.step = this.set.step;
    this.set.step = ((this.set.step / this.set.number) * this.rangeWidth);
    console.log(this.set.step)
    this.$block1.on('touchstart', function () { This.start(1, this); });
    this.$block2.on('touchstart', function () { This.start(2, this); });

    this.$block1.on('touchmove', function () { This.move(1); });
    this.$block2.on('touchmove', function () { This.move(2); });

    this.$block1.on('touchend', function () { This.end(1); });
    this.$block2.on('touchend', function () { This.end(2); })

    this.$rangeLine.on('mouseup', function (ev) {
        var clickX = ev.pageX - This.$lineOffsetLeft;
        console.log(clickX + ',,,' + This.disX1)
        /*  if(clickX==This.disX1||clickX==This.disX2){
            return;
          }*/
        if (clickX > 0 && This.rangeWidth > clickX) {
            This.click(clickX);
        }
    });
}

myRange.prototype.click = function (clickX) {
    var endClickX1 = clickX - (clickX % this.set.step);
    var endClickX2 = clickX + this.set.step - (clickX % this.set.step);
    if (this.disX1 > clickX) {//不超过第一个点的
        this.disX1 = endClickX1;
        this.setLineWinth(1);
    } else if (this.disX2 < clickX) {//超过第二个点的
        this.disX2 = endClickX2;
        this.setLineWinth(2);
    } else {//两个点的中间
        var bili = 0
        if (((this.disX2 - this.disX1) / 2 + this.disX1) >= clickX) {
            this.disX1 = endClickX2;
            this.setLineWinth(1);
            return;
        }
        if (clickX > ((this.disX2 - this.disX1) / 2 + this.disX1)) {
            this.disX2 = endClickX1;
            this.setLineWinth(2);
        }
    }

}

myRange.prototype.end = function (num) {
    if (num == 1) {
        if ((this.endX1 - this.initX1) > 0) {//右, 向上取整
            var v = (this.set.step - this.disX1 % this.set.step) + this.disX1;
            v <= this.rangeWidth ? this.disX1 = v : this.disX1 = this.rangeWidth;
            this.setLineWinth(1);
        } else {//左, 向下取整
            this.disX1 = (this.disX1 - this.disX1 % this.set.step);
            this.setLineWinth(1);
        }
    } else {
        if ((this.endX2 - this.initX2) > 0) {//右, 向上取整
            var v = (this.set.step - this.disX2 % this.set.step) + this.disX2;
            v <= this.rangeWidth ? this.disX2 = v : this.disX2 = this.rangeWidth;
            this.setLineWinth(2);
        } else {//左, 向下取整
            this.disX2 = this.disX2 - (this.disX2 % this.set.step);
            this.setLineWinth(2);
        }
    }
}

myRange.prototype.start = function (num, _this) {
    var ev = ev || event;
    if (num == 1) {
        this.initX1 = ev.targetTouches[0].pageX;
    } else {
        this.initX2 = ev.targetTouches[0].pageX;
    }
    this.zIndex++;
    $(_this).css('z-index', this.zIndex)
}

myRange.prototype.move = function (num) {
    var ev = ev || event;
    var moveX = ev.targetTouches[0].pageX;
    if (moveX >= this.min && moveX <= this.max) {
        if (num == 1) {
            this.endX1 = moveX;
            this.disX1 = (moveX - this.$lineOffsetLeft);
            this.setLineWinth(1, 'move')
        } else {
            this.endX2 = moveX;
            this.disX2 = (moveX - this.$lineOffsetLeft);
            this.setLineWinth(2, 'move')
        }
    }
}

myRange.prototype.setRangeHtml = function (obj) {

    this.$rangeLine = $('<div class = "range-line"></div>');
    this.$startNum = $('<div class = "range-num start-num">0</div>');
    this.$endNum = $('<div class = "range-num end-num">100</div>');
    this.$block1 = $('<span class = "rang-block block1"><i></i></span>');
    this.$line = $('<span class = "line"></span>');
    this.$block2 = $('<span class = "rang-block block2"><i></i></span>');

    if ($(obj).find('.range-line').length != 0) {
        $(obj).find('.range-line').remove();
    }
    this.$rangeLine.append(this.$startNum, this.$endNum, this.$block1, this.$line, this.$block2)
    $(obj).append($(this.$rangeLine));


    this.$lineOffsetLeft = $(obj).offset().left;
    console.log(this.$lineOffsetLeft)
    this.rangeWidth = $(obj).width();
    this.blockHalfWidth = this.$block1.width() / 2;
    var left1 = parseInt(this.set.values[0] / this.set.number * this.rangeWidth);
    var left2 = parseInt(this.set.values[1] / this.set.number * this.rangeWidth);

    this.min = this.$lineOffsetLeft;
    this.max = this.rangeWidth + this.$lineOffsetLeft;

    this.disX1 = left1;//滑竿相对父元素滑动的距离
    this.disX2 = left2;//滑竿相对父元素滑动的距离

    this.$block1.css('left', left1 - this.blockHalfWidth);
    this.$block2.css('left', left2 - this.blockHalfWidth);
    this.$line.css({ 'left': left1 + this.blockHalfWidth - this.blockHalfWidth, 'right': (this.rangeWidth - left2) });
    this.$startNum.html(this.set.values[0]);
    this.$endNum.html(this.set.values[1]);
}

myRange.prototype.setLineWinth = function (num, move) {
    if (num == 1) {
        this.$block1.css('left', this.disX1 - this.blockHalfWidth);
    } else {
        this.$block2.css('left', this.disX2 - this.blockHalfWidth);
    }
    if (this.disX1 > this.disX2) {
        this.$line.css('right', this.rangeWidth - this.disX1);
        this.$line.css('left', this.disX2);
    } else {
        this.$line.css('left', this.disX1);
        this.$line.css('right', this.rangeWidth - this.disX2);
    }
    var lineWidth = parseInt(this.$line.css('width'));
    var lineLeft = parseInt(this.$line.css('left'));

    console.log(this.disX1 / this.set.step)
    var start1=Math.floor(this.disX1 / this.set.step) * this.step;
    var end1=Math.floor((this.disX2 + 1) / this.set.step) * this.step;

    var start2=Math.round(this.disX1 / this.rangeWidth * this.set.number);
    var end2=Math.round(this.disX2 / this.rangeWidth * this.set.number);

    if(start1>end1){
      var temp=end1;
      end1=start1;
      start1=temp;
    }
    if(start2>end2){
      var temp=end2;
      end2=start2;
      start2=temp;
    }

    if (!move) {
        this.$startNum.html(start1);
        this.$endNum.html(end1);
    } else {
        this.$startNum.html(start2);
        this.$endNum.html(end2);
    }

    /*this.$startNum.html(parseInt(lineLeft/this.rangeWidth * this.set.number));
    this.$endNum.html(parseInt((lineWidth + lineLeft)/this.rangeWidth * this.set.number));*/
    if (this.set.slide) {
        this.texts[0] = this.$startNum.html();
        this.texts[1] = this.$endNum.html();
        this.set.slide(this.texts);
    }
}
