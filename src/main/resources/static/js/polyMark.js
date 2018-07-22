$(function () {
    window.PolyMark = function (workcanvas) {
        var drawcanvas = $('#draw-canvas');
        var drawcontext = drawcanvas[0].getContext('2d');
        var workcontext = workcanvas[0].getContext('2d');;
        var drawing = false;
        var finish = false;
        var x, y;

        function initialize() {
            workcontext.lineWidth = 4;
            drawcontext.lineWidth = 4;
            x = [];
            y = [];
        }
        initialize();

        this.click = function (e) {
            var tempX = e.offsetX / scale;
            var tempY = e.offsetY / scale;
            if (drawing = false) {
                workcontext.moveTo(tempX, tempY);
            } else {
                workcontext.lineTo(tempX, tempY);
                workcontext.stroke();
            }
            x.push(tempX);
            y.push(tempY);
            drawing = true;
        };
        this.dblclick = function () {
            drawing = false;
            drawcanvas[0].width = drawcanvas[0].width;//清空画布
            draw();
            finish = true;
        }
        this.move = function (e) {
            if (drawing) {
                drawcanvas[0].width = drawcanvas[0].width;//清空画布
                drawcontext.moveTo(x[x.length - 1], y[y.length - 1]);
                drawcontext.lineTo(e.offsetX / scale, e.offsetY / scale);
                drawcontext.stroke();
            }
        };
        this.getInfo = function () {
            return {
                x: x,
                y: y,
            };
        };
        this.set = function (polyMark) {
            x = polyMark.x;
            y = polyMark.y;
            draw();
            finish = true;
        }

        function draw() {
            workcontext.moveTo(x[0], y[0]);
            for (index in x) {
                workcontext.lineTo(x[index], y[index]);
            }
            workcontext.closePath();
            workcontext.stroke();
        }

        this.getMethodName = function () {
            return 'polyMark';
        }

        this.isFinish = function () {
            return finish;
        }

        this.onSelect = function () {
            if (!drawing) {
                workcontext.fillStyle = 'rgba(255, 255, 255, 0.3)'
                workcontext.fill();
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