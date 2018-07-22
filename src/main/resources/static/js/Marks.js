$(function () {
    window.Marks = function (data) {
        var canvasArea = $('#canvas-area');
        var image = $('#image');
        var markCanvasWrap = $('#marks-canvas-wrap');
        var markMethodWrap = $('#marks-method-wrap');
        var markDescWrap = $('#mark-desc-wrap');
        var drawcanvas;
        var marks = data.marks;
        var markMethods = marks.markMethods;
        var marksArray = [];
        var currentMark = null;
        var currentMethodName = null;
        var originalWidth, originalHeight;
        var fitLeft, fitTop, fitScale;
        var isdrag = false;
        scale = 1.0;

        function initialize() {
            loadSize();
            loadDrawcanvas();
            loadMarks();
            setToFit();
            loadMarkMethodBtns();
            iniScroll();
            iniDrag();
        }

        initialize();

        function loadSize() {
            var fitWidth, fitHeight;
            originalWidth = image.width();
            originalHeight = image.height();
            var containerWidth = canvasArea[0].clientWidth;
            var containerHeight = canvasArea[0].clientHeight;
            if ((originalWidth * containerHeight) / (originalHeight * containerWidth) > 1) {
                fitHeight = originalHeight * containerWidth / originalWidth;
                fitWidth = containerWidth;
            } else {
                fitWidth = originalWidth * containerHeight / originalHeight;
                fitHeight = containerHeight;
            }
            fitScale = fitWidth / originalWidth;
            if (fitScale > 2) {
                fitWidth = originalWidth * 2;
                fitHeight = originalHeight * 2;
            }
            fitLeft = (containerWidth - fitWidth) / 2;
            fitTop = (containerHeight - fitHeight) / 2;
            fitScale = fitWidth / originalWidth;
        }

        function loadMarks() {
            for (methodName of markMethods) {
                for (markObject of marks[methodName]) {
                    createMark(methodName).set(markObject);
                }
            }
        }

        function createMarkCanvas() {
            markCanvasWrap.append('<canvas></canvas>');
            var workCanvas = markCanvasWrap.children(':last-child');
            workCanvas.addClass('draggable resizable');
            setPosition(workCanvas);
            return workCanvas;
        }
        function createDescriptionRow() {
            markDescWrap.append('<div></div>');
            descRow = markDescWrap.children(':last-child');
            descRow.addClass('mark-desc-row');
            return descRow;
        }


        function loadMarkMethodBtns() {
            for (methodName of markMethods) {
                createMarkMethodBtn(methodName);
            }
        }

        function createMarkMethodBtn(methodName) {
            markMethodWrap.append('<button id="' + methodName + '">' + methodName + '</button>');
            var btn = $('#' + methodName);
            btn.on('click', function () {
                console.log(methodName);
                if (currentMark) {
                    currentMark.broke();
                    currentMark.deselect();
                }
                currentMethodName = methodName;
            });
        }

        function loadDrawcanvas() {
            canvasArea.append('<canvas id="draw-canvas"></canvas>');
            drawcanvas = $('#draw-canvas');
            drawcanvas.addClass('draggable resizable');
            setPosition(drawcanvas);
            drawcanvas.on('click', function (e) {
                console.log(currentMethodName)
                console.log(currentMark);
                if (currentMethodName) {
                    if (!currentMark || currentMark.getMarkMethod().isFinish()) {
                        createMark(currentMethodName);
                    }
                    currentMark.getMarkMethod().click(e);
                }
            });
            drawcanvas.on('mousemove', function (e) {
                if (currentMark) {
                    currentMark.getMarkMethod().move(e);
                }
            });
            drawcanvas.on('dblclick', function(e){
                if (currentMark) {
                    currentMark.getMarkMethod().dblclick(e);
                }
            })
        }

        function createMark(methodName) {
            console.log('create');
            if (currentMark) {
                currentMark.deselect();
                currentMark.broke();
            }
            var markCanvas = createMarkCanvas();
            var markDescRow = createDescriptionRow();
            var newMark = new Mark(methodName, markCanvas, markDescRow);
            marksArray.push(newMark);
            currentMark = newMark;
            currentMark.onSelect();
            markDescRow.on('click', function () {
                if (currentMark&&currentMark != newMark) {
                    currentMark.deselect();
                    currentMark.broke();
                }else if(currentMark&&currentMark == newMark){
                    return;
                }
                currentMark = newMark;
                currentMark.onSelect();
            })
            return newMark;
        }

        function setPosition($ele) {
            $ele.each(function () {
                this.width = originalWidth;
                this.height = originalHeight;
                this.style.width = originalWidth * scale + 'px';
                this.style.height = originalHeight * scale + 'px';
                this.style.left = image[0].style.left;
                this.style.top = image[0].style.top;
            })
        }

        function setToFit() {
            scale = fitScale;
            resizeAll(scale);
            moveAll(fitLeft, fitTop);
        }

        function resizeAll(newScale) {
            scale = newScale;
            var $resizable = $('.resizable');
            $resizable.each(function () {
                this.style.width = originalWidth * scale + 'px';
                this.style.height = originalHeight * scale + 'px';
            })
        }

        function moveAll(left, top) {
            var $resizable = $('.resizable');
            $resizable.each(function () {
                this.style.left = left + 'px';
                this.style.top = top + 'px';
            })
        }

        function iniScroll() {
            drawcanvas.bind('mousewheel', function (e) {
                e.preventDefault();
                var down = e.originalEvent.wheelDelta < 0
                var delta = 0.1;
                if (down && scale * (1 - delta) < 0.5 * fitScale || !down && scale * (1 + delta) > 4) {
                    return;
                }
                if (!isdrag) {
                    var oldLeft = drawcanvas[0].offsetLeft;
                    var oldTop = drawcanvas[0].offsetTop;

                    var newLeft, newTop;

                    if (down) {
                        resizeAll(scale * (1 - delta));
                        newLeft = oldLeft + e.offsetX * delta;
                        newTop = oldTop + e.offsetY * delta;
                    } else {
                        resizeAll(scale * (1 + delta));
                        newLeft = oldLeft - e.offsetX * delta;
                        newTop = oldTop - e.offsetY * delta;
                    }

                    moveAll(newLeft, newTop);
                }
            })

        }

        function iniDrag() {
            var oldLeft, oldTop, x, y;

            drawcanvas.on('contextmenu', function () {
                return false;
            })

            drawcanvas.on('mousedown', function (e) {
                if (e.button == 1) {
                    oldLeft = drawcanvas[0].offsetLeft;
                    oldTop = drawcanvas[0].offsetTop;
                    x = e.clientX;
                    y = e.clientY;
                    isdrag = true;
                }
                e.preventDefault();
            })

            canvasArea.on('mousemove', function (e) {
                if (isdrag) {
                    moveAll(oldLeft + e.clientX - x, oldTop + e.clientY - y);
                }
            })

            drawcanvas.on('mouseup', function () {
                isdrag = false;
            })
            canvasArea.on('mouseleave', function () {
                isdrag = false;
            })
        }

        this.getMarks = function () {
            for (methodName of markMethods) {
                marks[methodName] = [];
            }
            for (mark of marksArray) {
                var methodName = mark.getMethodName();
                if (methodName) {
                    marks[methodName].push(mark.getMark());
                }
            }
            return data;
        }

        clearAll = function () {
            image.remove();
            $('canvas').remove();
            markMethodWrap.children().remove();
            markDescWrap.children().remove();
        }
        this.end = function () {
            if (currentMark) {
                currentMark.broke();
            }
            clearAll();
        }

        $('#delete').on('click', function () {
            if (currentMark) {
                currentMark.delete();
                currentMark = null;
            }
        })
    }
});