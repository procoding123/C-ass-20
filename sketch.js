var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var score = 0;
gameState=1;


function preload(){

  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");

  cloudImage=loadImage("cloud.png");
  groundImage = loadImage("ground2.png");

  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");

  restartImage=loadImage("restart.png");

  gameOverImage=loadImage("gameOver.png");

  trexc=loadAnimation("trex_collided.png")

  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  checkpointsound = loadSound("checkpoint.mp3");
}

function setup() {

  createCanvas(windowWidth,windowHeight)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided",trexc);
  trex.debug=false;
  trex.setCollider("rectangle",0,0,40,trex.height);
  
  //create a ground sprite
  ground = createSprite(width/2,height-150,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(4+score/100);
  
  //creating invisible ground
  invisibleGround = createSprite(200,height-140,width,10);
  invisibleGround.visible = false;

  rand=Math.round(random(1,100));
  
  console.log(rand);

  obstaclesGroup = new Group()
  cloudsGroup = new Group()

  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.8;

  restart = createSprite(width/2,height/2+80);
  restart.addImage(restartImage);
  restart.scale=0.5;
 
}

function draw() {
  //set background color
  background("black");


  fill("yellow");
  text("SCORE="+score,500,50);

  trex.collide(invisibleGround);

  console.log(frameRate());

  if(gameState===1){
    score=score+Math.round(frameRate()/60);
   
    if(touches.length>0||keyDown("space")&& trex.y >= 158) {
      trex.velocityY = -14;
      jumpsound.play();
      touches={}
    }

    if(score%100===0&&score>0){
      checkpointsound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    gameOver.visible=false;
    restart.visible=false;

    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState=2;
      diesound.play();
    // trex.velocityY=-14;
    }
  } 
  else if(gameState===2){
    ground.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    gameOver.visible=true;
    restart.visible=true;

    trex.changeAnimation("collided");
    trex.velocityY=0;

    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)||touches.length>0){
       reset();
    }

  }
  drawSprites();
}

function spawnClouds(){
  if(frameCount%120===0){
    cloud=createSprite(width,100,40,10);
    cloud.velocityX=-3;
    cloud.addImage(cloudImage);
    cloud.scale=0.6;
    cloud.y=random(100,250);
    cloud.depth=trex.depth;
    trex.depth+=1;
    cloud.lifetime=width/3;
    cloudsGroup.add(cloud);
    }
  }

function spawnObstacles(){
  if(frameCount%80===0){
    obstacle = createSprite(width,height-165,10,40);
    obstacle.velocityX=-(5+score/100);
    obstacle.lifetime=width/5;

    obstacle.scale=0.5;
    obstaclesGroup.add(obstacle);
    
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
      break
      case 2:obstacle.addImage(obstacle2);
      break
      case 3:obstacle.addImage(obstacle3);
      break
      case 4:obstacle.addImage(obstacle4);
      break
      case 5:obstacle.addImage(obstacle5);
      break
      case 6:obstacle.addImage(obstacle6);
      break
      default:break
    }
  }
}

function reset(){
  gameState=1
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  trex.changeAnimation("running")
  score=0
}