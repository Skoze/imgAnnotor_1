$(function () {
    var canvasArea = $('#canvas-area');
    var submitbtn = $('#submit');
    var input = $('#input');
    var getbtn = $('#getm');
    var currentMarks;


    function getNewPicture(imgid) {
        loadimg(imgid);

        function loadimg(imgid) {
            $.ajax({
                type: 'GET',
                url: "/URL/findURL/" + imgid,
                success: function (data) {
                    canvasArea.append('<img src="" id="image">');
                    var img = $('#image');
                    img.addClass('draggable resizable');
                    img.attr('src', data.imgURL).on('load', function () {
                        loadMarks(imgid);
                    })
                },
                contentType: 'application/json',
                dataType: 'json'
            });
        }
        function loadMarks(imgid) {
            $.ajax({
                type: 'GET',
                url: "/mark/findMark/" + imgid,
                success: function (data) {
                    currentMarks = new Marks(data);
                    submitbtn.on('click', submitBtnEvent);
                },
                contentType: 'application/json',
                dataType: 'json'
            });
        }
    };



    function submitMark() {
        $.ajax({
            type: 'POST',
            url: "/mark/setMark",
            data: JSON.stringify(currentMarks.getMarks()),
            success: function (data) {
                currentMarks = null;
                alert('提交成功');
                getbtn.on('click', getBtnEvent);
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    }

    function initialize() {
        // var img_url = {
        //     'imgid': 'a',
        //     'imgURL': 'img/altair.jpg'
        // }
        // var ma = {
        //     'imgid': 'a',
        //     'marks': {
        //         'markMethods': ['rectMark','polyMark'],
        //         'rectMark': [
        //
        //         ],
        //         'polyMark': [
        //
        //         ]
        //     }
        // }
        // $.ajax({
        //     type: 'POST',
        //     url: "/URL/setURL",
        //     data: JSON.stringify(img_url),
        //     success: function () {
        //         $.ajax({
        //             type: 'POST',
        //             url: "/mark/setMark",
        //             data: JSON.stringify(ma),
        //             contentType: 'application/json',
        //             dataType: 'json'
        //         });
        //     },
        //     contentType: 'application/json',
        //     dataType: 'json'
        // });
        getbtn.on('click', getBtnEvent);
    }

    var getBtnEvent = function () {
        var imgid = input.val();
        getbtn.unbind();
        getNewPicture(imgid);
    }
    var submitBtnEvent = function () {
        if (confirm('确认提交？')) {
            currentMarks.end();
            submitbtn.unbind();
            submitMark();
        }
    }

    initialize();
});