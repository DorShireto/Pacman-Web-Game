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
let colors = ["red", "green", "blue", "purple", "pink", "black"];

let livesLeft = 5;
let gameTime = 60;
let monsterNum = 4;
// let monsters = [new Object(), [new Image(), 600, 0], [new Image(), 0, 600], [new Image(), 600, 600]];
let monsters = [{ img: new Image(), x: 0, y: 0 },
{ img: new Image(), x: 600, y: 0 },
{ img: new Image(), x: 0, y: 600 },
{ img: new Image(), x: 600, y: 600 }];

//

var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
let interval1;
let interval2;
var users = {
	"k": ["k", "admin", "admin@admin.com", "01/01/2000"]
};
let currentPage = "welcomePage";

function changePage(newPage) {
	$(`#${currentPage}`).hide();
	$(`#${newPage}`).show();
	currentPage = newPage;
}

$(document).ready(function () {
	monsters[0].img.src = './monster1.png';
	monsters[1].img.src = './monster2.png';
	monsters[2].img.src = './monster2.png';
	monsters[3].img.src = './monster1.png';



});

function Start() {
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	start_time = new Date();
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
				board[i][j] = 1;
			}
		}
	}
	//pacman placing randomly:
	var i1 = Math.floor(Math.random() * 10 + 1);
	var i2 = Math.floor(Math.random() * 10 + 1);
	while (board[i1][i2] == 4) {
		i1 = Math.floor(Math.random() * 10 + 1);
		i2 = Math.floor(Math.random() * 10 + 1);
	}
	shape.i = i1;
	shape.j = i2;
	board[i1][i2] = 2;
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
	interval1 = setInterval(UpdatePacmanPosition, 100);
	interval2 = setInterval(UpdateMonstersPosition, 700);

	loadSettingDisplayData(); //for displaying the settings when game page is on
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
function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {//pacman 
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) { //food
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) { //wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			DrawMonsters();

		}
	}
}

function UpdatePacmanPosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 10 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 10 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == foodNum) {
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		window.alert("Game completed");
		changePage("welcomePage");
	}
	else if (time_elapsed >= gameTime) {
		window.clearInterval(interval1);
		window.clearInterval(interval2);

		window.alert("Game Over - Times Out");
		changePage("welcomePage");
	}
	else if (collisionCheck()) {
		window.clearInterval(interval2);
		window.clearInterval(interval1);
		livesLeft--;
		if (livesLeft == 0) {
			//game over
			window.alert("Game over - no more lives left");
			changePage("welcomePage");
		}
		else {
			window.alert("Monster caught you!");
			Start();

		}
	}
	else {
		Draw();
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
function collisionCheck() {
	for (let i = 0; i < monsterNum; i++) {
		const monster = monsters[i];
		let shapeX_pxl = shape.i * 60;
		let shapeY_pxl = shape.j * 60;
		if (monster.x == shapeX_pxl && monster.y == shapeY_pxl) {
			return true;
		}
	}
	return false;
}



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
				// e.preventDefault();
				changePage('gamePage');
				Start();
			}
			else {
				$("#login_error").text("Username or Password incorrect");
				// e.preventDefault();
			}
		}
		else {
			$("#login_error").text("Username or Password incorrect");
			// e.preventDefault();
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
	document.getElementById("moveUpKey").value = "upArrowKey";
	document.getElementById("moveRightKey").value = "rightArrowKey";
	document.getElementById("moveDownKey").value = "downArrowKey";
	document.getElementById("moveLeftKey").value = "leftArrowKey";
	//food number:
	const randomFoodNum = Math.floor(Math.random() * 41) + 50;
	document.getElementById("foodNumInput").value = randomFoodNum;
	$("#foodNum").text(randomFoodNum);
	//color pick:
	let possibleColors = JSON.parse(JSON.stringify(colors));//deep copy of colors array
	let randomColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];//pick random element from array
	let index = possibleColors.indexOf(randomColor);
	possibleColors.splice(index, 1);
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
		changePage("welcomePage");
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
