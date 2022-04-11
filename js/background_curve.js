function draw_random_slash(context, cursorx, cursory, size) {
    var rand = Math.floor(Math.random() * 2);
    var rx = Math.floor(Math.random() * size) * Math.floor(Math.random() * -1);
    var ry = Math.floor(Math.random() * size) * Math.floor(Math.random() * -1);
    if (rand === 0) {
        context.beginPath();
        context.moveTo(0 + cursorx,0 + cursory);
        context.quadraticCurveTo(size + cursorx + rx, cursory + ry, size + cursorx,size + cursory);
        context.stroke();
    } else {
        context.beginPath();
        context.moveTo(size + cursorx,0 + cursory);
        context.quadraticCurveTo(size + cursorx + rx, size + cursory+ ry, cursorx,size + cursory);
        context.stroke();
    }
}

window.onload = function () {
    var canvas = document.getElementById('main');
    var context = canvas.getContext('2d');
    var width = 1000;
    var cursorx = 0;
    var cursory = 0;
    var step = 40;
    var iter = Math.floor(width / step);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, width);
    context.strokeStyle = 'white';

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
