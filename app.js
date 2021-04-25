// config;
let moveLeft = 37;
let moveUp = 38;
let moveDown = 40;
let moveRight = 39;
let foodNum = 50;
let food1_color = "red";
let food2_color = "green";
let food3_color = "blue";
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
let soundMuted = false;
let playerName;
let movingDirection = "right";
let monsters;
let bonusObj;
var context;
var shape = new Object();
var board;
var score;
var pac_color;
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
	muteSound();
	$(`#${currentPage}`).hide();
	$(`#${newPage}`).show();
	currentPage = newPage;
}

$(document).ready(function () {
	//update setting fields
	document.getElementById("moveUpKey").value = moveUp;
	document.getElementById("moveRightKey").value = moveRight;
	document.getElementById("moveDownKey").value = moveDown;
	document.getElementById("moveLeftKey").value = moveLeft;
	document.getElementById("foodNumInput").value = foodNum;
	$("#foodNum").text(foodNum);
	document.getElementById("food_type_1_color").value = food1_color;
	document.getElementById("food_type_2_color").value = food2_color;
	document.getElementById("food_type_3_color").value = food3_color;
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
	document.getElementById("soundBtn").innerHTML = "MUTE";
	audio.play();
}
function muteSound() {
	audio.pause();
	document.getElementById("soundBtn").innerHTML = "PLAY SOUND";
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
	updateMonstersPositionInterval = setInterval(UpdateMonstersPosition, 700);
	updateBonusPositionInterval = setInterval(updateBonusPosition, 300);

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
	$("#ballNumSettingDisplay").text("Balls Number:" + foodNum);
	$("#food1ColorSettingDisplay").text(food1_color + " Ball Score: " + food1_score);
	$("#food2ColorSettingDisplay").text(food2_color + " Ball Score: " + food2_score);
	$("#food3ColorSettingDisplay").text(food3_color + " Ball Score: " + food3_score);
	$("#gameTimeSettingDisplay").text("Game Time: " + gameTime);
	$("#monsterNumSettingDisplay").text("Monster Number: " + monsterNum);
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
	$("#lblScore").text(score);
	$("#lblTime").text(time_elapsed);
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
	$("#livesLeft").text(livesLeft);
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {//up
			shape.j--;
			movingDirection = "up";
		}
	}
	if (x == 2) {
		if (shape.j < 10 && board[shape.i][shape.j + 1] != 4) {//down
			shape.j++;
			movingDirection = "down";
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {//left
			shape.i--;
			movingDirection = "left";
		}
	}
	if (x == 4) {
		if (shape.i < 10 && board[shape.i + 1][shape.j] != 4) {//right
			shape.i++;
			movingDirection = "right";
		}
	}
	if (board[shape.i][shape.j] == 11) {//food eaten
		score = score + 5;
		foodCollected++;
	}
	if (board[shape.i][shape.j] == 22) {//food eaten
		score = score + 15;
		foodCollected++;
	}
	if (board[shape.i][shape.j] == 33) {//food eaten
		score = score + 25;
		foodCollected++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 100 && time_elapsed <= 10 && livesLeft == 5) {
		pac_color = "green";
	}
	if (foodCollected == foodNum) {
		window.clearInterval(updatePacmanPositioInterval);
		window.clearInterval(updateMonstersPositionInterval);
		window.clearInterval(updateBonusPositionInterval);
		alert("Winner!!!");
		changePage("welcomePage");
	}
	else if (time_elapsed >= gameTime) {
		window.clearInterval(updatePacmanPositioInterval);
		window.clearInterval(updateMonstersPositionInterval);
		window.clearInterval(updateBonusPositionInterval);
		if (score < 100) {
			window.alert("You are better than " + score + " points!");
		}
		else {
			alert("Winner!!!");
		}
		changePage("welcomePage");
	}
	else if (collisionCheck()) {
		if (livesLeft <= 0) {
			//game over
			alert("LOSER");
			window.clearInterval(updateBonusPositionInterval);
			window.clearInterval(updateMonstersPositionInterval);
			window.clearInterval(updatePacmanPositioInterval);
			changePage("welcomePage");
		}
		else {
			window.alert("Monster caught you!");
			// Start();
			resetMonstersPosition();
			//clear dead pacman:
			board[shape.i][shape.j] = 0;
			context.clearRect(shape.i, shape.j, 60, 60);
			randomizePacmanLocation();
		}
	} else if (collisionWithBonusCheck()) {
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
			pac_color = "yellow"; //return pacman to regular color
			if (monster.superMonster) {
				score = score - 20;
				if (score <= 0) {
					score = 0;
				}
				livesLeft = livesLeft - 2;
			}
			else {
				score = score - 10;
				if (score <= 0) {
					score = 0;
				}
				livesLeft = livesLeft - 1;
			}
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
	$("#registerForm").submit(function (e) {
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
		$("#username_error").text("Username already exist.")
		valid = false;
	}
	else {
		document.getElementById("username").style.borderColor = "";
		$("#username_error").text("")
	}

	// Password check

	if (password.length < 6) {
		document.getElementById("password").style.borderColor = "red";
		$("#password_error").text("Password must be at least 6 digits long.")
		valid = false;
	}
	else if (!hasNumber(password) || !hasLetter(password)) {
		document.getElementById("password").style.borderColor = "red";
		$("#password_error").text("Password must contain at least 1 digit and 1 letter.")
		valid = false;
	}
	else {
		document.getElementById("password").style.borderColor = "";
		$("#password_error").text("")
	}

	// Full name check

	if (!nameRegex.test(fullname)) {
		// alert(nameRegex.test(fullname))
		document.getElementById("fullname").style.borderColor = "red";
		$("#fullname_error").text("Full name should contain only letters.")
		valid = false;
	}

	else {
		document.getElementById("fullname").style.borderColor = "";
		$("#fullname_error").text("")
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
				alert("logged in successfully");
				$("#playerName").text(typedUsername);
				changePage('settingsPage');
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
// ***************  About END ******************//


// ************   SETINGS *********************************:
$(function () {
	$("#settings").click(function (e) {
		e.preventDefault();
		changePage("settingsPage");

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
	//food number:
	const randomFoodNum = Math.floor(Math.random() * 41) + 50;
	document.getElementById("foodNumInput").value = randomFoodNum;
	$("#foodNum").text(randomFoodNum);
	//color pick:
	let possibleColors = JSON.parse(JSON.stringify(colors));//deep copy of colors array
	let randomColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];//pick random element from array
	let index = possibleColors.indexOf(randomColor);// find the index of the color
	possibleColors.splice(index, 1);//delete the color from the array
	document.getElementById("food_type_1_color").value = randomColor;
	randomColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];
	index = possibleColors.indexOf(randomColor);
	possibleColors.splice(index, 1);
	document.getElementById("food_type_2_color").value = randomColor;
	randomColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];
	index = possibleColors.indexOf(randomColor);
	possibleColors.splice(index, 1);
	document.getElementById("food_type_3_color").value = randomColor;
	//game time :
	document.getElementById("gameTime").value = Math.floor(Math.random() * 500) + 60;
	//monsters:
	document.getElementById("monsterNum").value = Math.floor(Math.random() * 4) + 1;




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
	$("#monsterNum").change(function (e) {
		e.preventDefault();
		const monsterNum = document.getElementById("monsterNum").value;
		if (!(monsterNum >= 1 && monsterNum <= 4)) {
			$("#monsterNum_error").text("Monster number should be between 1 to 4");
			document.getElementById("monsterNum").value = "";
		}
		else {
			$("#monsterNum_error").text("");

		}
	})
});

$(function () {
	$("#settingsForm").submit(function (e) {
		// no validation needed because fields checked onChange and all fields required
		moveUp = document.getElementById("moveUpKey").value;
		moveRight = document.getElementById("moveRightKey").value;
		moveDown = document.getElementById("moveDownKey").value;
		moveLeft = document.getElementById("moveLeftKey").value;
		foodNum = document.getElementById("foodNumInput").value;
		food1_color = document.getElementById("food_type_1_color").value;
		food2_color = document.getElementById("food_type_2_color").value;
		food3_color = document.getElementById("food_type_3_color").value;
		gameTime = document.getElementById("gameTime").value;
		monsterNum = document.getElementById("monsterNum").value;
		e.preventDefault();
		changePage("gamePage");
		Start();

	});
});
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
