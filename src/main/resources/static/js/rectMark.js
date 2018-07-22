$(function () {
    window.RectMark = function (workcanvas) {
        var drawcanvas = $('#draw-canvas');
        var drawcontext = drawcanvas[0].getContext('2d');
        var workcontext = workcanvas[0].getContext('2d');
        var drawing = false;
        var finish = false;
        var left, top, width, height;

        function initialize() {
            workcontext.lineWidth = 4;
            drawcontext.lineWidth = 4;
        }
        initialize();

        this.click = function (e) {
            drawing = !drawing;
            if (drawing) {
                left = e.offsetX / scale;
                top = e.offsetY / scale;
            } else {
                drawcanvas[0].width = drawcanvas[0].width;//清空画布
                draw();
                finish = true;
            }
        };
        this.move = function (e) {
            if (drawing) {
                drawcanvas[0].width = drawcanvas[0].width;//清空画布
                width = e.offsetX / scale - left;
                height = e.offsetY / scale - top;
                drawcontext.strokeRect(left, top, width, height);
            }
        };
        this.dblclick = function () {

        }
        this.getInfo = function () {
            return {
                top: top,
                left: left,
                width: width,
                height: height,
            };
        };
        this.set = function (rectMark) {
            left = rectMark.left;
            top = rectMark.top;
            width = rectMark.width;
            height = rectMark.height;
            draw();
            finish = true;
        }

        function draw() {
            workcontext.strokeRect(left, top, width, height);
        }

        this.getMethodName = function () {
            return 'rectMark';
        }

        this.isFinish = function () {
            return finish;
        }

        this.onSelect = function () {
            if (!drawing) {
                workcontext.fillStyle = 'rgba(255, 255, 255, 0.3)'
                workcontext.fillRect(left, top, width, height);
            }
        }
        this.deselect = function () {
            if (!drawing) {
                workcanvas[0].width = workcanvas[0].width;//清空画布
                draw();
            }
        }
        this.delete = function () {
            drawcanvas[0].width = drawcanvas[0].width;//清空画布
        }
    }
});