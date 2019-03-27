var express = require('express');
const querystring = require('querystring'); 
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var pgp = require('pg-promise')();

const playerConfig = {
	host: 'localhost',
	port: 5432,
	database: 'player_db',
	user: 'postgres',
	password: '1234'
};

const gameConfig = {
	host: 'localhost',
	port: 5432,
	database: 'games_db',
	user: 'postgres',
	password: '1234'
};

var playerdb = pgp(playerConfig);
var gamedb = pgp(gameConfig);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
	var all_games = "select * from gamelist";
	var pop_games = "select * from gamelist order by (dislikes-likes);";
	gamedb.task('get-everything', task => {
		return task.batch([
			task.any(all_games),
			task.any(pop_games)
		]);
	})
	.then(info => {
		res.render('category', {
			my_title: "Home",
			all_game_data: info[0],
			pop_game_data: info[1].slice(0,3)
		})

	})
	.catch(error => {
		res.render('category', {
			my_title: "Home",
			all_game_data: '',
			pop_game_data: ''
		})
	});
});

app.get('/category', function(req, res) {
	var all_games = "select * from gamelist";
	var pop_games = "select * from gamelist order by (dislikes-likes);";
	gamedb.task('get-everything', task => {
		return task.batch([
			task.any(all_games),
			task.any(pop_games)
		]);
	})
	.then(info => {
		res.render('category', {
			my_title: "Home",
			all_game_data: info[0],
			pop_game_data: info[1].slice(0,3)
		})

	})
	.catch(error => {
		res.render('category', {
			my_title: "Home",
			all_game_data: '',
			pop_game_data: ''
		})
	});
});

app.get('/account', function(req, res) {
	res.render('account', {
		my_title: "Register Account",
		pw_match: true,
		valid_username: true,
		valid_email: true
	});
});

app.post('/account/reg_acct', function(req, res) {
	var pw = req.body.password;
	var cpw = req.body.repassword;
	var user_name = req.body.username;
	var first_name = req.body.firstname;
	var last_name = req.body.lastname;
	var email_addr = req.body.email;
	var check_username = "select COUNT(1) from player_info where username = '" + user_name + "'";
	var check_email = "select COUNT(1) from player_info where email = '" + email_addr + "'";
	var add_user = "INSERT INTO player_info(username, first_name, last_name, player_id, email, password, friends, games, high_scores) VALUES('" + 
			user_name + "','" + first_name + "','" + last_name + "',0,'" + email_addr + "','" + pw + "',ARRAY[]::integer[],ARRAY[0,0,0,0,0,0],ARRAY[0,0,0,0,0,0]);";

	playerdb.task('get-everything', task => {
		return task.batch([
			task.any(check_username),
			task.any(check_email)
		]);
	})
	.then(info => {
		if (pw != cpw || info[0][0].count == 1 || info[1][0].count == 1) {
			const query = querystring.stringify({
          		"pw_match": pw == cpw,
          		"valid_username": info[0][0].count == 0,
          		"valid_email": info[1][0].count == 0
      		});
      		res.redirect('/account?' + query);
			/*res.render('account', {
				my_title: "Register Account",
				pw_match: pw == cpw,
				valid_username: info[0][0].count == 0,
				valid_email: info[1][0].count == 0
			})*/
		}
		else {
			playerdb.any(add_user)
				.then(res.redirect('/category'))
				.catch(error => {
					res.render('account', {
						my_title: "Register Account",
						pw_match: true,
						valid_username: true,
						valid_email: true
					})
				})
		}
	})
	.catch(error => {
		res.render('account', {
			my_title: "Register Account",
			pw_match: true,
			valid_username: true,
			valid_email: true
		})
	});
});

app.listen(3000);