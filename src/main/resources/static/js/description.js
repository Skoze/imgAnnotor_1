$(function () {
    window.Description = function (descRow) {
        var descTime;
        var descContent;
        var edit = false;

        function initialize() {
            descRow.append('<span></span><span></span>');
            descTime = descRow.children(':first-child');
            descContent = descRow.children(':last-child');
            descTime.addClass('mark-desc-time');
            descContent.addClass('mark-desc-content');
            descTime.html(getTime());
            descContent.html(' ');
        }

        initialize();

        descContent.on('click', function () {
            if (!edit) {
                editContent();
            }
        })

        function editContent() {
            edit = true;
            var oldVal = descContent.html();
            descContent.html('<div></div>');
            var inputArea = descContent.children('div');
            inputArea.attr('contenteditable', true);
            inputArea.html(oldVal);
            inputArea.focus();
            inputArea.on('blur', function () {
                setNewVal();
            })
            inputArea.on('keydown', function (e) {
                if (e.which == 13) {
                    setNewVal();
                }
            })
            function setNewVal() {
                var newVal = inputArea.html();
                if (newVal != oldVal) {
                    descTime.html(getTime());
                }
                descContent.html(newVal);
                edit = false;
            }
            this.broke = function () {
                if (edit) {
                    setNewVal();
                }
            }
        }

        function getTime() {
            var date = new Date();
            return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() +
                ' ' + (date.getHours() < 10 ? ' ' : '') + date.getHours() +
                ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        }

        this.set = function (description) {
            descTime.html(description.time);
            descContent.html(description.content);
        }

        this.getDesc = function () {
            return {
                time: descTime.html(),
                content: descContent.html(),
            };
        }
        this.onSelect = function () {
            descRow.addClass('selected');
        }
        this.deselect = function(){
            descRow.removeClass('selected');
        }
        this.delete = function(){

        }
    }
})