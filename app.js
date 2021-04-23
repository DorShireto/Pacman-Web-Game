var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var users = {
	"k": ["k", "admin", "admin@admin.com", "01/01/2000"]
};
let currentPage = "welcomePage";

function changePage(newPage) {
	$(`#${currentPage}`).hide()
	$(`#${newPage}`).show()
	currentPage = newPage;
}



$(document).ready(function () {
	context = canvas.getContext("2d");
	// Start();
});

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
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
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
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
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

// Register Starts  //

// Date picker  //
$(function () {
	$("#datepicker").datepicker();
});


function register() {
	let valid;
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let fullname = document.getElementById("fullname").value;
	let email = document.getElementById("email").value;
	let birthday = document.getElementById("datepicker").value;
	// Verification
	valid = fieldValidation(username, password, fullname)
	if (valid) {
		users[username] = [password, fullname, email, birthday];
		// Change scene
		changePage("welcomePage");
	}
}



function fieldValidation(username, password, fullname) {
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
// Register Ends  //


// Login Starts  //

function login() {
	let valid;
	let password;
	let typedUsername = document.getElementById("usernameLogin").value;
	let typedPassword = document.getElementById("passwordLogin").value;
	alert("Password recived:" + typedPassword)


	if (users[typedUsername] != null) {
		alert(users[typedUsername][0]);
		password = users[typedUsername][0];
		if (typedPassword === password) {
			// Valid login
			changePage('gamePage');
			// Start();
			return;
		}
	}
	$("#login_error").text("Username or Password incorrect");
}

// Login Ends  //



// About //
$(function () {
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
			modal.style.display = 'none'
		}
	})
});