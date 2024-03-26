//variables for board/background in short hehe
let board;
let boardwidth=360;
let boardheight=640;
let context;


//variables for bird
let birdwidth=34;
let birdheight=24;
let birdx=boardwidth/8;
let birdy=boardheight/2;
let birdimg;
//thus create a js obj for bird itself which will have all these parameters/kind of array chill
let bird={
    x:birdx,
    y:birdy,
    width:birdwidth,
    height:birdheight,
}


//variables for pipes
let pipearray=[];//as many pipes would be used throughout
let pipewidth=64;
let pipeheight=512;
let pipex=boardwidth;
let pipey=0;

let toppipeimg;
let bottompipeimg;


//physics
let velocityx=-2//pipes moving to left
//upward_y velo->in -ve(to jump)
//downward_y velo->in +ve(to dodge)
let velocityy=0;//bird jump speed
let gravity=0.4;

let gameover=false;
let score=0;



//when window will load we'll call a function
window.onload=function(){
    //get the element on board by id=board which is canvas in our html file
    //draw board
    board=document.getElementById("board");
    board.width=boardwidth;//extract em all
    board.height=boardheight;
    context=board.getContext("2d");//used for drawing on board
    //draw flappy bird
    // context.fillStyle="green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);//extract em all

    //load image 
    //for bird
    birdimg=new Image();
    birdimg.src="./flappybird.png";
    birdimg.onload=function(){
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
    }
    //for pipe
    toppipeimg=new Image();
    toppipeimg.src="./toppipe.png";
    bottompipeimg=new Image();
    bottompipeimg.src="./bottompipe.png";
    requestAnimationFrame(update);//func call
    setInterval(placepipes,1500)//1500ms=1.5sec/func call
    // setInterval(placepipes,2000)//2000ms=2sec/func call
    document.addEventListener("keydown",movebird)
}



//all the functions 

//for each frame/game end
function update(){
    if(gameover){
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height);
    //again redraw the bird in everyframe
    velocityy+=gravity;
    // bird.y+=velocityy;
    bird.y=Math.max(bird.y+velocityy,0);//to apply gravity on current bird.y and make sure not to exceed canvas
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>board.height){
        gameover=true;
    }

    //pipes
    for(let i=0;i<pipearray.length;i++){
        let pipe=pipearray[i];
        pipe.x+=velocityx;//shifting x pixel towards left by 2 (as -2)
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5;
            pipe.passed=true;
        }

        if(detectcollision(bird,pipe)){
            gameover=true;
        }
    }

    //clear pipes to save memory
    while(pipearray.length>0 && pipearray[0].x<-pipewidth){
        pipearray.shift();//removes first element from the array
    }

    //score
    context.fillStyle="black";
    context.font="45px sans-serif"
    context.fillText(score,5,45);//score,xpos,ypos


    //text to show when gameover
    if(gameover){
        // context.fillText("GAMEOVER NIGGA COPEHARD",5,90);//nuuhh not responsive lul
        context.fillText("GAMEOVER",5,90);
    }
}

// (0,0) origin is at top right of the canvas hehe
function placepipes(){
    if(gameover){return;}

    /*
        to adjust the y coordinate such that bottom pipe can fit
        Math.random->(0-1) did tki thode upr thode neeche pipe arrange ho jye hehe    
        if 0->128(pipeheight/4) worst case
        if 1->128(pipeheight/4)-256(pipeheight/2)=-3/4of pipeheight best case
    */
    let randompipey=pipey-pipeheight/4-Math.random()*(pipeheight/2);
    let openingspace=boardheight/4;
    let toppipe={
        img:toppipeimg,
        x:pipex,
        // y:pipey,
        y:randompipey,
        width:pipewidth,
        height:pipeheight,
        passed:false,//do flappybird passed this pipe or nah
    }
    //after every 1500 ms we'll call:
    pipearray.push(toppipe);

    let bottompipe={
        img:bottompipeimg,
        x:pipex,
        y:randompipey+pipeheight+openingspace,
        width:pipewidth,
        height:pipeheight,
        passed:false,
    }
    //after every 1500 ms we'll call:
    pipearray.push(bottompipe);
}

function movebird(e){
    if(e.code=="Space" || e.code=="ArrowUp"){
        //make the bird jump
        velocityy=-6;

        //to reset the game not working 
        if(gameover){
            //reset everything
            bird.y=birdy;
            pipearray=[];
            score=0;
            gameover=false;
        }
    }
}

function detectcollision(a,b){return a.x<b.x+b.width && a.x+a.width>b.x && a.y<b.y+b.height && a.y+a.height>b.y;}