// config;
let moveLeft = 37;
let moveUp = 38;
let moveDown = 40;
let moveRight = 39;
let foodNum = 50;
let food1_color;
let food2_color;
let food3_color;
let food1_score = 5;
let food2_score = 15;
let food3_score = 25;
let food1_amount = Math.floor(foodNum * 0.6);
let food2_amount = Math.floor(foodNum * 0.3);
let food3_amount = Math.floor(foodNum * 0.1);
let foodCollected = 0;
let colors = ["red", "green", "blue", "purple", "pink", "black"];
let backgroundMusic;
let livesLeft = 5;
let gameTime = 60;
let monsterNum = 1;
let audio = new Audio('backgroundsound.mp3');
audio.loop = true;
let greenPacmanAudio = new Audio('./greenPacmanSound.wav');
let killSound = new Audio('./killSound.wav');
let gameOverSound = new Audio('./gameOverSound.wav');
let winnerSound = new Audio('./winner.wav');

let soundMuted = false;
let playerName = "nan";
let movingDirection = "right";
let monsters;
let bonusObj;
var context;
var shape = new Object();
var board;
var score;
var pac_color = "yellow";
let eyeColor = "black";
var start_time;
var time_elapsed;
let updatePacmanPositioInterval;
let updateMonstersPositionInterval;
let updateBonusPositionInterval;
var users = {
	"k": ["k", "admin", "admin@admin.com", "01/01/2000"]
};
let currentPage = "welcomePage";

function changePage(newPage) {
	if (newPage == "gamePage") {
		document.getElementById("header").style.display = 'none';
		document.getElementById("footerID").style.display = 'none';
	}
	else {
		document.getElementById("header").style.display = 'flex';
		document.getElementById("footerID").style.display = 'block';
	}

	muteSound();
	$(`#${currentPage}`).hide();
	document.getElementById(newPage).hidden = false;
	// document.getElementById(newPage).style.display = "flex";
	$(`#${newPage}`).show();
	currentPage = newPage;
}

$(document).ready(function () {
	//update setting fields
	document.getElementById("upKeyP").innerText = moveUp;
	document.getElementById("rightKeyP").innerText = moveRight;
	document.getElementById("downKeyP").innerText = moveDown;
	document.getElementById("leftKeyP").innerText = moveLeft;
	document.getElementById("foodNumInput").value = foodNum;
	$("#foodNum").text(foodNum);
	// document.getElementById("food_type_1_color").value = food1_color;
	// document.getElementById("food_type_2_color").value = food2_color;
	// document.getElementById("food_type_3_color").value = food3_color;
	document.getElementById("gameTime").value = gameTime;
	document.getElementById("monsterNum").value = monsterNum;
	//*****************************************************/
});

$(function () {
	$("#soundBtn").click(function (e) {
		if (!soundMuted) {
			muteSound();
		}
		else {
			playSound();
		}
	});
});

function playSound() {
	soundMuted = false;
	document.getElementById("soundBtnP").innerHTML = "MUTE";
	audio.play();
}
function muteSound() {
	audio.pause();
	document.getElementById("soundBtnP").innerHTML = "PLAY SOUND";
	soundMuted = true;
}


function Start() {
	playSound();
	//load monsters
	monsters = [{ img: new Image(), x: 0, y: 0, superMonster: false },
	{ img: new Image(), x: 600, y: 0, superMonster: true },
	{ img: new Image(), x: 0, y: 600, superMonster: true },
	{ img: new Image(), x: 600, y: 600, superMonster: false }];
	monsters[0].img.src = './monster1.png';
	monsters[1].img.src = './monster2.png';
	monsters[2].img.src = './monster2.png';
	monsters[3].img.src = './monster1.png';
	// load bonus object
	bonusObj = { img: new Image(), x: 300, y: 300, cought: false };
	bonusObj.img.src = './50pts.png';
	//****************** */
	movingDirection = "right";
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	foodCollected = 0;
	livesLeft = 5;
	$("#livesLeft").text(livesLeft);
	pac_color = "yellow";
	start_time = new Date();
	while (food1_amount + food2_amount + food3_amount < foodNum) {
		food1_amount++;
	}
	for (var i = 0; i < 11; i++) {
		board[i] = new Array();
		//put obstacles
		for (var j = 0; j < 11; j++) {
			if (
				(i == 0 && j == 1) || (i == 0 && j == 2) || (i == 0 && j == 4) ||
				(i == 1 && j == 4) || (i == 1 && j == 6) || (i == 1 && j == 7) || (i == 1 && j == 8) ||
				(i == 2 && j == 0) || (i == 2 && j == 2) || (i == 2 && j == 4) || (i == 2 && j == 6) || (i == 2 && j == 10) ||
				(i == 3 && j == 6) ||
				(i == 4 && j == 0) || (i == 4 && j == 2) || (i == 4 && j == 3) || (i == 4 && j == 8) || (i == 4 && j == 9) ||
				(i == 6 && j == 5) || (i == 6 && j == 6) ||
				(i == 7 && j == 1) || (i == 7 && j == 2) || (i == 7 && j == 5) || (i == 7 && j == 8) ||
				(i == 8 && j == 1) || (i == 8 && j == 7) || (i == 8 && j == 8) ||
				(i == 9 && j == 3) || (i == 9 && j == 4) || (i == 9 && j == 9)
			) {
				board[i][j] = 4;
			}
			else {
				//pick random type:
				board[i][j] = 1;
			}
		}
	}
	randomizePacmanLocation();
	//clear the num of food we need:
	let foodNeedToDeleteNum = 90 - foodNum;
	while (foodNeedToDeleteNum > 0) {
		var i = Math.floor(Math.random() * 10 + 1);
		var j = Math.floor(Math.random() * 10 + 1);
		while (board[i][j] != 1) {
			i = Math.floor(Math.random() * 10 + 1);
			j = Math.floor(Math.random() * 10 + 1);
		}
		board[i][j] = 0;
		foodNeedToDeleteNum--;
	}
	changeFoodColor();


	keysDown = {};
	addEventListener(
		"keydown",
		function (e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function (e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	updatePacmanPositioInterval = setInterval(UpdatePacmanPosition, 100);
	updateMonstersPositionInterval = setInterval(UpdateMonstersPosition, 500);
	updateBonusPositionInterval = setInterval(updateBonusPosition, 500);

	loadSettingDisplayData(); //for displaying the settings when game page is on
}

function changeFoodColor() {
	let foodtypes = ["11", "22", "33"];
	let randomType;

	for (let i = 0; i < 11; i++) {
		for (let j = 0; j < 11; j++) {
			if (board[i][j] == 1) {
				randomType = foodtypes[Math.floor(Math.random() * foodtypes.length)];//pick random element from array
				switch (randomType) {
					case "11":
						board[i][j] = randomType;
						food1_amount--;
						if (food1_amount == 0) {//delete the type from the array
							let index = foodtypes.indexOf(randomType);
							foodtypes.splice(index, 1);
						} break;
					case "22":
						board[i][j] = randomType;
						food2_amount--;
						if (food2_amount == 0) {//delete the type from the array
							let index = foodtypes.indexOf(randomType);
							foodtypes.splice(index, 1);
						} break;
					case "33":
						board[i][j] = randomType;
						food3_amount--;
						if (food3_amount == 0) {//delete the type from the array
							let index = foodtypes.indexOf(randomType);
							foodtypes.splice(index, 1);
						} break;
				}
			}
		}
	}
}

function loadSettingDisplayData() {
	$("#ballNumSettingDisplay").text("Balls Number: " + foodNum);
	document.getElementById("inputColor1").value = food1_color;
	document.getElementById("inputColor2").value = food2_color;
	document.getElementById("inputColor3").value = food3_color;
	$("#gameTimeSettingDisplay").text("Game Time: " + gameTime);
	$("#monsterNumSettingDisplay").text("Monster Number: " + monsterNum);
	$("#playerName").text("Player Name: " + playerName);

	// Movement keys:
	let upChar, downChar, leftChar, rightChar

	if (document.getElementById("upKeyP").innerText == '38') {
		upChar = "Up Arrow"
	}
	else {
		upChar = String.fromCharCode(document.getElementById("upKeyP").innerText)
	}

	if (document.getElementById("downKeyP").innerText == '40') {
		downChar = "Down Arrow"
	}
	else {
		downChar = String.fromCharCode(document.getElementById("downKeyP").innerText)
	}

	if (document.getElementById("leftKeyP").innerText == '37') {
		leftChar = "Left Arrow"
	}
	else {
		leftChar = String.fromCharCode(document.getElementById("leftKeyP").innerText)
	}

	if (document.getElementById("rightKeyP").innerText == '39') {
		rightChar = "Right Arrow"
	}
	else {
		rightChar = String.fromCharCode(document.getElementById("rightKeyP").innerText)
	}



	// downChar = String.fromCharCode(document.getElementById("downKeyP").innerText)
	// leftChar = String.fromCharCode(document.getElementById("leftKeyP").innerText)
	// rightChar = String.fromCharCode(document.getElementById("rightKeyP").innerText)



	$("#settingArrowUp").text(upChar);
	$("#settingArrowDown").text(downChar);
	$("#settingArrowLeft").text(leftChar);
	$("#settingArrowRight").text(rightChar);



}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 10 + 1);
	var j = Math.floor(Math.random() * 10 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 10 + 1);
		j = Math.floor(Math.random() * 10 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[moveUp]) {
		return 1;
	}
	if (keysDown[moveDown]) {
		return 2;
	}
	if (keysDown[moveLeft]) {
		return 3;
	}
	if (keysDown[moveRight]) {
		return 4;
	}
}
function DrawMonsters() {
	for (let i = 0; i < monsterNum; i++) {
		context.drawImage(monsters[i].img, monsters[i].x, monsters[i].y, 60, 60);
	}
}
function DrawBonus() {
	if (!bonusObj.cought) {
		context.drawImage(bonusObj.img, bonusObj.x, bonusObj.y, 60, 60);
	}
}
function Draw() {
	canvas.width = canvas.width; //clean board

	$("#lblScore").text("Score: " + score);
	$("#lblTime").text("Time Elapsed: " + time_elapsed);
	$("#livesLeft").text("Lives Left: " + livesLeft);
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			//pacman 
			if (board[i][j] == 2 && movingDirection == "up") {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.65 * Math.PI, 1.65 * Math.PI, true); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.arc(center.x, center.y, 30, 0.35 * Math.PI, 1.35 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x - 17, center.y - 10, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = eyeColor; //color
				context.fill();
			}
			else if (board[i][j] == 2 && movingDirection == "right") {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = eyeColor; //color
				context.fill();
			}
			else if (board[i][j] == 2 && movingDirection == "down") {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.35 * Math.PI, 1.45 * Math.PI, true); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.arc(center.x, center.y, 30, 0.65 * Math.PI, 1.65 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x - 17, center.y + 10, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = eyeColor; //color
				context.fill();

			}
			else if (board[i][j] == 2 && movingDirection == "left") {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.85 * Math.PI, 1.85 * Math.PI, true); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.15 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x - 12, center.y - 17, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = eyeColor; //color
				context.fill();


				//food:
			} else if (board[i][j] == 11) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = food1_color; //color
				context.fill();
			} else if (board[i][j] == 22) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = food2_color; //color
				context.fill();
			} else if (board[i][j] == 33) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = food3_color; //color
				context.fill();
			}
			//wall:
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			DrawMonsters();
			DrawBonus();

		}
	}
}

function UpdatePacmanPosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {//up
			shape.j--;
			movingDirection = "up";
		}
	}
	else if (x == 2) {
		if (shape.j < 10 && board[shape.i][shape.j + 1] != 4) {//down
			shape.j++;
			movingDirection = "down";
		}
	}
	else if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {//left
			shape.i--;
			movingDirection = "left";
		}
	}
	else if (x == 4) {
		if (shape.i < 10 && board[shape.i + 1][shape.j] != 4) {//right
			shape.i++;
			movingDirection = "right";
		}
	}

	if (board[shape.i][shape.j] == 11) {//food eaten
		if (pac_color == "green") {
			score = score + 10;//double score
		}
		else {
			score = score + 5;
		}
		foodCollected++;
	}
	if (board[shape.i][shape.j] == 22) {//food eaten
		if (pac_color == "green") {
			score = score + 30;//double score
		}
		else {
			score = score + 15;
		}
		foodCollected++;
	}
	if (board[shape.i][shape.j] == 33) {//food eaten
		if (pac_color == "green") {
			score = score + 50;//double score
		}
		else {
			score = score + 25;
		}
		foodCollected++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 300 && time_elapsed <= 10 && livesLeft > 3) {
		pac_color = "green";
		if (!soundMuted) {
			greenPacmanAudio.play();

		}
	}

	if (collisionCheck()) {
		if (livesLeft <= 0) {
			//game over
			if (!soundMuted) {
				gameOverSound.play();

			}
			showGameMessage("LOSER", "No More Lives Left \nYou Can Try Again If You Think You Can Do It");
			// alert("LOSER");
			window.clearInterval(updateBonusPositionInterval);
			window.clearInterval(updateMonstersPositionInterval);
			window.clearInterval(updatePacmanPositioInterval);
			// changePage("welcomePage");
		}
		else {
			// if (!soundMuted) {
			// 	killSound.play();

			// }
			// window.alert("Monster caught you!");
			// Start();
			window.clearInterval(updateMonstersPositionInterval);
			resetMonstersPosition();
			//clear dead pacman:
			board[shape.i][shape.j] = 0;
			context.clearRect(shape.i, shape.j, 60, 60);
			randomizePacmanLocation();
		}
	}
	else if (foodCollected == foodNum) {
		if (!soundMuted) {
			winnerSound.play();
		}
		window.clearInterval(updatePacmanPositioInterval);
		window.clearInterval(updateMonstersPositionInterval);
		window.clearInterval(updateBonusPositionInterval);

		showGameMessage("WINNER!!!", "Good Job! You Ate All The Food");

		// alert("Winner!!!");
		// changePage("welcomePage");
	}
	else if (time_elapsed >= gameTime) {
		window.clearInterval(updatePacmanPositioInterval);
		window.clearInterval(updateMonstersPositionInterval);
		window.clearInterval(updateBonusPositionInterval);
		if (score < 100) {
			let message = "You are better than " + score + " points!";
			showGameMessage("LOSER", message);
		}
		else {
			showGameMessage("WINNER!!!", "Well Done! You Got More Then 100 Points")
			// alert("Winner!!!");
		}
		// changePage("welcomePage");
	}
	else if (collisionWithBonusCheck()) {
		window.clearInterval(updateBonusPositionInterval);
	}
	else {
		Draw();
	}
}
function randomizePacmanLocation() {
	//pacman placing randomly:
	var i1 = Math.floor(Math.random() * 10 + 1);
	var i2 = Math.floor(Math.random() * 10 + 1);
	while (board[i1][i2] == 4 || board[i1][i2] == 11 || board[i1][i2] == 22 || board[i1][i2] == 33) {
		i1 = Math.floor(Math.random() * 10 + 1);
		i2 = Math.floor(Math.random() * 10 + 1);
	}
	shape.i = i1;
	shape.j = i2;
	board[i1][i2] = 2;
}
function resetMonstersPosition() {
	updateMonstersPositionInterval = setInterval(UpdateMonstersPosition, 500);
	monsters[0].x = 0;
	monsters[0].y = 0;
	monsters[1].x = 600;
	monsters[1].y = 0;
	monsters[2].x = 0;
	monsters[2].y = 600;
	monsters[3].x = 600;
	monsters[3].y = 600;
}
function updateBonusPosition() {
	let moves = ["up", "down", "left", "right"];
	let move = moves[Math.floor(Math.random() * moves.length)];//pick random element from array
	switch (move) {
		case "up":
			if (bonusObj.y / 60 - 1 >= 0 && board[bonusObj.x / 60][bonusObj.y / 60 - 1] != 4) {
				//up is not a wall -> update Y location of bonusObj
				bonusObj.y = bonusObj.y - 60;//60px
			}
			break;
		case "right":
			if (bonusObj.x / 60 + 1 <= 10 && board[bonusObj.x / 60 + 1][bonusObj.y / 60] != 4) {
				//right is not a wall -> update x location of monster
				bonusObj.x = bonusObj.x + 60;//60px
			}
			break;
		case "down":
			if (bonusObj.y / 60 + 1 <= 10 && board[bonusObj.x / 60][bonusObj.y / 60 + 1] != 4) {
				//down is not a wall -> update Y location of monster
				bonusObj.y = bonusObj.y + 60;//60px
			}
			break;
		case "left":
			if (bonusObj.x / 60 - 1 >= 0 && board[bonusObj.x / 60 - 1][bonusObj.y / 60] != 4) {
				//left is not a wall -> update x location of monster
				bonusObj.x = bonusObj.x - 60;//60px
			}
			break;
	}
}
function UpdateMonstersPosition() {
	for (let i = 0; i < monsterNum; i++) {
		const monster = monsters[i];
		let shapeX_pxl = shape.i * 60; // x position in pixels
		let shapeY_pxl = shape.j * 60; // y in pixels
		if (Math.abs(shapeX_pxl - monster.x) < 119 || Math.abs(shapeY_pxl - monster.y) < 119) { // x axis or y axis in distance less than 2 cubics
			//monster is close -> chase pacman
			if (shapeX_pxl > monster.x && board[monster.x / 60 + 1][monster.y / 60] != 4) {
				//right is not a wall -> update X location of monster
				monsters[i].x = monster.x + 60;//60px
			}
			else if (shapeY_pxl > monster.y && board[monster.x / 60][monster.y / 60 + 1] != 4) {
				//down is not a wall -> update Y location of monster
				monsters[i].y = monster.y + 60;//60px
			}
			else if (shapeX_pxl < monster.x && board[monster.x / 60 - 1][monster.y / 60] != 4) {
				//left is not a wall -> update X location of monster
				monsters[i].x = monster.x - 60;//60px
			}
			else if (shapeY_pxl < monster.y && board[monster.x / 60][monster.y / 60 - 1] != 4) {
				//up is not a wall -> update Y location of monster
				monsters[i].y = monster.y - 60;//60px
			}
		}
		else { //distance is far from pacman
			// so do random move
			let moves = ["up", "down", "left", "right"];
			let move = moves[Math.floor(Math.random() * moves.length)];//pick random element from array
			switch (move) {
				case "up":
					if (monster.y / 60 - 1 >= 0 && board[monster.x / 60][monster.y / 60 - 1] != 4) {
						//up is not a wall -> update Y location of monster
						monsters[i].y = monster.y - 60;//60px
					}
					break;
				case "right":
					if (monster.x / 60 + 1 <= 10 && board[monster.x / 60 + 1][monster.y / 60] != 4) {
						//right is not a wall -> update x location of monster
						monsters[i].x = monster.x + 60;//60px
					}
					break;
				case "down":
					if (monster.y / 60 + 1 <= 10 && board[monster.x / 60][monster.y / 60 + 1] != 4) {
						//down is not a wall -> update Y location of monster
						monsters[i].y = monster.y + 60;//60px
					}
					break;
				case "left":
					if (monster.x / 60 - 1 >= 0 && board[monster.x / 60 - 1][monster.y / 60] != 4) {
						//left is not a wall -> update x location of monster
						monsters[i].x = monster.x - 60;//60px
					}
					break;
			}
		}
	}
	DrawMonsters();
}
function collisionWithBonusCheck() {
	let shapeX_pxl = shape.i * 60;
	let shapeY_pxl = shape.j * 60;
	if (bonusObj.x == shapeX_pxl && bonusObj.y == shapeY_pxl && bonusObj.cought == false) {
		score = score + 50;
		bonusObj.cought = true;
		return true;
	}
	return false;
}
function collisionCheck() {
	for (let i = 0; i < monsterNum; i++) {
		const monster = monsters[i];
		let shapeX_pxl = shape.i * 60;
		let shapeY_pxl = shape.j * 60;
		if (monster.x == shapeX_pxl && monster.y == shapeY_pxl) {
			if (!soundMuted) {
				killSound.play();
			}
			keysDown = {}; //prevent sticky key after been caught
			pac_color = "yellow"; //return pacman to regular color
			if (monster.superMonster) {
				score = score - 20;
				if (score <= 0) {
					score = 0;
				}
				livesLeft = livesLeft - 2;
				if (livesLeft <= 0) {
					livesLeft = 0;
				}
			}
			else {
				score = score - 10;
				if (score <= 0) {
					score = 0;
				}
				livesLeft = livesLeft - 1;
			}
			$("#livesLeft").text("Lives Left: " + livesLeft);
			return true;
		}
	}
	return false;
}
$(function () {
	$("#newGameBtn").click(function (e) {
		window.clearInterval(updateBonusPositionInterval);
		window.clearInterval(updateMonstersPositionInterval);
		window.clearInterval(updatePacmanPositioInterval);
		changePage("settingsPage");
	});
});


// ********************* REGISTER   *********************//

// Date picker  //
$(function () {
	$("#datepicker").datepicker();
});

$(function () {
	$("#register").click(function (e) {
		changePage("registerPage");
	});
});

$(function () {
	$("#registerBtn2").click(function (e) {
		changePage("registerPage");
	});
});


$(function () {
	$("#registerForm").submit(function (e) {
		e.preventDefault();
		let valid;
		let username = document.getElementById("username").value;
		let password = document.getElementById("password").value;
		let fullname = document.getElementById("fullname").value;
		let email = document.getElementById("email").value;
		let birthday = document.getElementById("datepicker").value;
		// Verification
		valid = registerFieldValidation(username, password, fullname);
		if (valid) {
			users[username] = [password, fullname, email, birthday];
			document.getElementById("registerForm").reset();
			// Change scene
			changePage("welcomePage");
			e.preventDefault();
		}
	});
});



function registerFieldValidation(username, password, fullname) {
	const nameRegex = new RegExp('^[A-Za-z ]+$');
	let valid = true;

	// Username check 

	if (users[username] != null) {
		document.getElementById("username").style.borderColor = "red";
		$("#username_error").text("Username already exist.");
		valid = false;
	}
	else {
		document.getElementById("username").style.borderColor = "";
		$("#username_error").text("");
	}

	// Password check

	if (password.length < 6) {
		document.getElementById("password").style.borderColor = "red";
		$("#password_error").text("Password must be at least 6 digits long.");
		valid = false;
	}
	else if (!hasNumber(password) || !hasLetter(password)) {
		document.getElementById("password").style.borderColor = "red";
		$("#password_error").text("Password must contain at least 1 digit and 1 letter.");
		valid = false;
	}
	else {
		document.getElementById("password").style.borderColor = "";
		$("#password_error").text("");
	}

	// Full name check

	if (!nameRegex.test(fullname)) {
		document.getElementById("fullname").style.borderColor = "red";
		$("#fullname_error").text("Full name should contain only letters.");
		valid = false;
	}

	else {
		document.getElementById("fullname").style.borderColor = "";
		$("#fullname_error").text("");
	}

	return valid
}


function hasNumber(password) {
	return /\d/.test(password);
}
function hasLetter(password) {
	let letterRegex = RegExp('\w*[a-zA-Z]\w*');
	return letterRegex.test(password);

}
// ********************* Register Ends   *********************//


// *********************  LOGIN  ******************//
$(function () {
	$("#login").click(function (e) {
		changePage("loginPage");
	});
});

$(function () { //for login btn at rgister page
	$("#loginBtn2").click(function (e) {
		changePage("loginPage");
	});
});

$(function () {
	$("#loginForm").submit(function (e) {
		let valid;
		let password;
		let typedUsername = document.getElementById("usernameLogin").value;
		let typedPassword = document.getElementById("passwordLogin").value;
		if (users[typedUsername] != null) {
			password = users[typedUsername][0];
			if (typedPassword === password) {
				// Valid login
				alert("logged in successfully \nWelcome " + users[typedUsername][1]);
				playerName = users[typedUsername][1];
				$("#playerName").text(typedUsername);
				changePage('settingsPage');
				document.getElementById("usernameLogin").value = "";
				document.getElementById("passwordLogin").value = "";
			}
			else {
				$("#login_error").text("Username or Password incorrect");
			}
		}
		else {
			$("#login_error").text("Username or Password incorrect");
		}
		e.preventDefault();

	});
});


// ********************  LOGIN END ******************//




// ***************  About ******************//

function closeModal(modal) {
	// document.getElementById("about").hidden = false;
	modal.style.display = "block";
}

$(function () {//modal
	// Get the modal
	var modal = document.getElementById("aboutModal");
	// Get the button that opens the modal
	var btn = document.getElementById("aboutBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	// When the user clicks the button, open the modal 
	btn.onclick = function () {
		modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

	// When the user clicks esc, close it
	window.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			modal.style.display = 'none';
		}
	})
});

// Help function to close modal when clicking on the footer area
function closeModalFooterClick() {
	let modal = document.getElementById("aboutModal");
	if (modal.style.display != 'none') {
		modal.style.display = 'none';
	}
}
// ***************  About END ******************//


// ************   SETINGS *********************************:
$(function () {
	$("#settings").click(function (e) {
		e.preventDefault();
		if (playerName != "nan") {
			changePage("settingsPage");
		}
		else {
			alert("Sorry You Must Log In First!");
		}
	})
});


function updateFoodNum() {
	foodNum = document.getElementById("foodNumInput").value;
	$("#foodNum").text(foodNum);
}


$(function () {
	$("#randomizeSettingsBtn").click(function (e) {
		randomizeSettings();
		e.preventDefault();

	})
});

function randomizeSettings() {


	//move keys:
	document.getElementById("moveUpKey").value = "38";
	document.getElementById("moveRightKey").value = "39";
	document.getElementById("moveDownKey").value = "40";
	document.getElementById("moveLeftKey").value = "37";
	moveLeft = 37;
	moveUp = 38;
	moveDown = 40;
	moveRight = 39;
	document.getElementById("upKeyP").innerText = moveUp;
	document.getElementById("rightKeyP").innerText = moveRight;
	document.getElementById("downKeyP").innerText = moveDown;
	document.getElementById("leftKeyP").innerText = moveLeft;
	//food number:
	const randomFoodNum = Math.floor(Math.random() * 41) + 50;
	document.getElementById("foodNumInput").value = randomFoodNum;
	$("#foodNum").text(randomFoodNum);
	//color pick:

	var randomColor1 = Math.floor(Math.random() * 16777215).toString(16);
	var randomColor2 = Math.floor(Math.random() * 16777215).toString(16);
	var randomColor3 = Math.floor(Math.random() * 16777215).toString(16);

	while (randomColor1 == randomColor2 || randomColor1 == randomColor3 || randomColor2 == randomColor3) {
		randomColor1 = Math.floor(Math.random() * 16777215).toString(16);
		randomColor2 = Math.floor(Math.random() * 16777215).toString(16);
		randomColor3 = Math.floor(Math.random() * 16777215).toString(16);
	}

	food1_color = "#" + randomColor1;
	food2_color = "#" + randomColor2;
	food3_color = "#" + randomColor3;

	document.getElementById("food_type_1_color").value = "#" + randomColor1;
	document.getElementById("food_type_2_color").value = "#" + randomColor2;
	document.getElementById("food_type_3_color").value = "#" + randomColor3;

	//game time :
	document.getElementById("gameTime").value = Math.floor(Math.random() * 500) + 60;
	//monsters:
	monsterNum = Math.floor(Math.random() * 4) + 1;
	document.getElementById("monsterNum").textContent = monsterNum;
}


$(function () {
	$("#gameTime").change(function (e) {
		e.preventDefault();
		const time = document.getElementById("gameTime").value;
		if (time < 60) {
			$("#gameTime_error").text("Time should be longer than 60 seconds");
			document.getElementById("gameTime").value = "";
		}
		else {
			$("#gameTime_error").text("");

		}
	})
});


$(function () {
	$("#settingsForm").submit(function (e) {
		// no validation needed because fields checked onChange and all fields required
		moveUp = document.getElementById("upKeyP").innerText;
		moveRight = document.getElementById("rightKeyP").innerText;
		moveDown = document.getElementById("downKeyP").innerText;
		moveLeft = document.getElementById("leftKeyP").innerText;
		foodNum = document.getElementById("foodNumInput").value;
		food1_color = document.getElementById("food_type_1_color").value;
		food2_color = document.getElementById("food_type_2_color").value;
		food3_color = document.getElementById("food_type_3_color").value;
		gameTime = document.getElementById("gameTime").value;
		monsterNum = document.getElementById("monsterNum").innerHTML;
		// e.preventDefault();

		let validColors = checkColors(food1_color, food2_color, food3_color);
		let validArrows = checkArrows(moveUp, moveDown, moveLeft, moveRight);
		if (validColors && validArrows) {
			changePage("gamePage");
			Start();
		}
		e.preventDefault();

	});
});

function checkColors(color1, color2, color3) {
	if (color1 != color2 && color1 != color3 && color2 != color3) {
		return true;
	}
	else {
		$("#colorBalls_error").text("Please make sure 3 balls are in different colors");
		return false;
	}
}

function checkArrows(arrow1, arrow2, arrow3, arrow4) {
	if (arrow1 != arrow2 && arrow1 != arrow3 && arrow1 != arrow4 && arrow2 != arrow3 && arrow2 != arrow4 && arrow3 != arrow4) {
		return true;
	}
	else {

		$("#arrow_error").text("Please make sure all movment keys are different");
		return false;
	}
}


// ********************* SETINGS END ************************************


// ********************* GAME STARTS ************************************


function showGameMessage(mainMessage, subMessage) {

	audio.pause();
	audio.currentTime = 0;
	document.getElementById("mainMessage").innerHTML = mainMessage;
	document.getElementById("subMessage").innerHTML = subMessage;

	document.getElementById("messageBox").style.display = 'flex';
	$("#canvas").hide();

}

$(function () {
	$("#playAgain").click(function (e) {

		e.preventDefault();
		$("#canvas").show();
		document.getElementById("messageBox").style.display = 'none';
		changePage("settingsPage");
	})
});

$(function () {
	$("#quit").click(function (e) {
		e.preventDefault();
		playerName = "nan";
		changePage("welcomePage");
		$("#canvas").show();
		document.getElementById("messageBox").style.display = 'none';
	})
});








// function closeModal(modal) {
// 	// document.getElementById("about").hidden = false;
// 	modal.style.display = "block";
// }


// Help function to close modal when clicking on the footer area
// function closeModalFooterClick() {
// 	let modal = document.getElementById("aboutModal");
// 	if (modal.style.display != 'none') {
// 		modal.style.display = 'none';
// 	}
// }





// ********************* SETINGS END ************************************







// pattern - please dont fill or delete
// $(function () { 
// 	$("#testtest").change(function (e) {
// 		e.preventDefault();

// 	})
// });



$(function () {
	$("#fastGame").click(function (e) {
		changePage("gamePage");
		Start();
	});
});



// Movement keys update


$(function () {
	$("#moveUpKey").click(function (e) {

		e.preventDefault();
		document.addEventListener('keydown', function changeKey(e) {
			keyUpdateListener(e, "moveUpKey");
			document.removeEventListener('keydown', changeKey);
			$("#upKeyP").text(e.keyCode);
		});
		document.getElementById("moveUpKey").blur();
	})


});


$(function () {
	$("#moveLeftKey").click(function (e) {
		e.preventDefault();
		document.addEventListener('keydown', function changeKey(e) {
			keyUpdateListener(e, "moveLeftKey");
			document.removeEventListener('keydown', changeKey);
			$("#leftKeyP").text(e.keyCode);
		});
		document.getElementById("moveLeftKey").blur();
	})
});


$(function () {
	$("#moveDownKey").click(function (e) {

		e.preventDefault();
		document.addEventListener('keydown', function changeKey(e) {
			keyUpdateListener(e, "moveDownKey");
			document.removeEventListener('keydown', changeKey);
			$("#downKeyP").text(e.keyCode);
		});
		document.getElementById("moveDownKey").blur();
	})


});

$(function () {
	$("#moveRightKey").click(function (e) {

		e.preventDefault();
		document.addEventListener('keydown', function changeKey(e) {
			keyUpdateListener(e, "moveRightKey");
			document.removeEventListener('keydown', changeKey);
			$("#rightKeyP").text(e.keyCode);
		});
		document.getElementById("moveRightKey").blur();
	})


});


let keyUpdateListener = function (event, id) {
	test(event.keyCode, id);
};

function test(code, id) {
	switch (id) {
		case "moveUpKey":
			moveUp = code;
			break;
		case "moveLeftKey":
			moveLeft = code;
			break;
		case "buttonD":
			moveDownKey = code;
			break;
		case "moveRightKey":
			moveRight = code;
			break;
	}
}



$(function () {
	$("#lessMonsterB").click(function (e) {
		e.preventDefault();
		if (monsterNum > 1)
			monsterNum--;
		document.getElementById("monsterNum").textContent = monsterNum;
	})
});

$(function () {
	$("#moreMonsterB").click(function (e) {
		e.preventDefault();
		if (monsterNum < 4)
			monsterNum++;
		document.getElementById("monsterNum").textContent = monsterNum;
	})
});


