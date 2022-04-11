function draw_random_slash(context, cursorx, cursory, size) {
    var rand = Math.floor(Math.random() * 2);
    if (rand === 0) {
        context.beginPath();
        context.moveTo(0 + cursorx,0 + cursory);
        context.lineTo(size + cursorx,size + cursory);
        context.stroke();
    } else {
        context.beginPath();
        context.moveTo(size + cursorx,0 + cursory);
        context.lineTo(0 + cursorx,size + cursory);
        context.stroke();
    }
}

window.onload = function () {
    var canvas = document.getElementById('main');
    var context = canvas.getContext('2d');
    var width = 880;
    var cursorx = 0;
    var cursory = 0;
    var step = 10;
    var iter = Math.floor(width / step);

    for (j=0; j<iter; j=j+1) {
        for (i=0; i<iter; i=i+1) {
            draw_random_slash(context, cursorx, cursory, step);

            cursorx = cursorx + step;
        }
        cursorx = 0;
        cursory = cursory + step;
    }

    document.getElementById('body').style = "background-image:url(" + canvas.toDataURL("image/png") + ")";
}
