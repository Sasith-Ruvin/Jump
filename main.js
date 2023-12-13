let board;
let boardwidth = 450;
let boardheight = 576;
let context;


let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardwidth/2 - doodlerWidth/2;
let doodlerY = boardheight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;



let velocityX =0;
let velocityY =0;
let initialVelocityY=-6;
let gravity = 0.2;


let platformArray = [];
let platformwidth = 60;
let platformheight = 20;
let platformImg;


let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}


let score = 0;
let maxScore = 0;

let gameOver = false;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");


    

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./peppa.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function(){
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./pngwing.com.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    velocityY = initialVelocityY;

    placePlatforms();

    requestAnimationFrame(update);
    document.addEventListener('keydown', moveDoodler);

}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return
    }
    context.clearRect(0, 0, board.width, board.height);
    doodler.x += velocityX;
    if(doodler.x > boardwidth){
        doodler.x = 0;
    }else if(doodler.x + doodler.width <0){
        doodler.x = boardwidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;

    if(doodler.y > board.height){
        gameOver = true;
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    for(let i = 0; i < platformArray.length; i++){
        let platform = platformArray[i];
        if(velocityY < 0 && doodler.y < boardheight*3/4){
            platform.y -= initialVelocityY;
        }
        if(detectCollision(doodler,platform) && velocityY >=0){
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img,platform.x,platform.y,platform.width,platform.height);
    }
    while(platformArray.length > 0 && platformArray[0].y >= boardheight){
        platformArray.shift();
        newPlatform();
    }
    updateScore();
    context.fillStyle = "white";
    context.font = '16px sans-serif';
    context.fillText(score, 0, 20);

    if(gameOver){
        context.fillText("Game Over! Fuhrer is Dissapointed. 'Space' Start Again ",boardwidth/12, boardheight*7/8);
    }


}

function moveDoodler(e){
    if(e.code == "ArrowRight" || e.code == "Key0"){
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }else if(e.code == "ArrowLeft" || e.code =="KeyA"){
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }else if(e.code == "Space" && gameOver){
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score=0;
        maxScore=0;
        gameOver=false;
        placePlatforms();
    }
}

function placePlatforms(){
    platformArray = [];

    let platform ={
        img : platformImg,
        x : boardwidth/2,
        y : boardheight -50,
        width : platformwidth,
        height : platformheight
    }
    platformArray.push(platform);

    for (let i=0; i <6; i++){
        let randomX = Math.floor(Math.random() * boardwidth*3/4);

        let platform ={
            img : platformImg,
            x : randomX,
            y : boardheight -75*i -150,
            width : platformwidth,
            height : platformheight
        }
        platformArray.push(platform);
    }
}

function newPlatform(){
    let randomX = Math.floor(Math.random() * boardwidth*3/4);

        let platform ={
            img : platformImg,
            x : randomX,
            y : -platformheight,
            width : platformwidth,
            height : platformheight
        }
        platformArray.push(platform);
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y +b.height &&
    a.y +a.height > b.y;
}

function updateScore(){
    let points = Math.floor(50*Math.random());
    if(velocityY < 0){
        maxScore += points;
        if(score < maxScore){
            score = maxScore;
        }
    }else if(velocityY >=0){
        maxScore -= points;
    }
}