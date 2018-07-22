$(function () {
    window.RectMark = function (workcanvas) {
        var drawcanvas = $('#draw-canvas');
        var drawcontext = drawcanvas[0].getContext('2d');
        var workcontext = workcanvas[0].getContext('2d');
        var drawing = false;
        var finish = false;
        var left, top, width, height;

        function initialize(){
            workcontext.lineWidth = 4;
        }
        initialize();

        this.click = function (e) {
            drawing = !drawing;
            if (drawing) {
                left = e.offsetX / drawcanvas.attr('scale');
                top = e.offsetY / drawcanvas.attr('scale');
            } else {
                workcontext.strokeRect(left, top, width, height);
                drawcanvas[0].width = drawcanvas[0].width;//清空画布
                finish = true;
            }
        };
        this.move = function (e) {
            if (drawing) {
                drawcanvas[0].width = drawcanvas[0].width;//清空画布
                width = e.offsetX / drawcanvas.attr('scale') - left;
                height = e.offsetY / drawcanvas.attr('scale') - top;
                drawcontext.lineWidth = 4;
                drawcontext.strokeRect(left, top, width, height);
            }
        };
        this.broke = function () {
            drawcanvas[0].width = drawcanvas[0].width;//清空画布
            workcanvas.remove();
        };
        this.isFinish = function () {
            return finish;
        }
        this.getMark = function () {
            return [{
                'top': top,
                'left': left,
                'width': width,
                'height': height,
            }];
        };
        this.draw = function (rectMarkObject) {
            left = rectMarkObject.left;
            top = rectMarkObject.top;
            width = rectMarkObject.width;
            height = rectMarkObject.height;
            workcontext.strokeRect(left, top, width, height);
            finish = true;
        }
        this.getMethodName = function(){
            return 'rectMark';
        }

        this.copy = function (workcanvas) {
            return new RectMark(workcanvas);
        }
    }
});