/*
Power By Gomosoft
Modificaciones para éste proyecto por Dannegm
*/
var log = console.log;
(function($){ 
	var boton, on = false, filtro = 0, user, call, access_token, user_id;
	this.ini =  function(vars){
		return chkLogin(fbIni());
	};
	this.isOn = function(){ 
		log('Comrpbamos si esta adentro');
		return on; 
	}; 
	this.obtAcToken = function(){ 
		return access_token; 
	}
	this.obtUserId = function(){ 
		return user_id; 
	}
	this.chkLogin =  function (resp) {
		if(filtro > 0) return;
		log('Comprobamos que este logueado');
		if (resp.authResponse) {
			log('Esta loguado, Obtenemos token e id');
			access_token = resp.authResponse.accessToken;
			user_id = resp.authResponse.userID;
			on = true;
			if(call) call;
		} else {
			log('No está logueado');
			on = false;
			log('Le damos poder al boton');
			boton.click(function() {
				log('Inciamos con facebook');
				FB.login(function(resp) {
					log('Comprobamos el logueo')
					if (resp.authResponse) {
						on = true; 
						log('Obtenemos token e id')
						access_token = resp.authResponse.accessToken;
						user_id = resp.authResponse.userID;
						if(call) call;
					} else {
						log('Puto facebook e.e');
						return {cod:11, estado:"sin permisos"};
					}
				}, 'email,user_about_me,user_hometown,user_interests,user_location');
			}); 
		}
		filtro++;
	}; 
	this.fbInfo = function(callback){
		if(!on) return;
		FB.api('/me', callback);
	}; 
	this.fql = function(query,callback){
		FB.api({ 
			method: 'fql.query', 
			query: query 
		}, callback );
	};
	this.fbIni = function() {
		log('Configuramos facebook');
		FB.init({
			appId: '125054150878675', 
			status: true,
			cookie: true,
			xfbml: true,
			oauth: true
		});
		log('Revisamos si está loguado');
		FB.getLoginStatus( chkLogin ); 
		log('Esto no se para que es');
		FB.Event.subscribe( 'auth.statusChange', chkLogin );
		return this;
	};
	jQuery.fn.fb = function(callback){
		log('Agregamos funcion al boton');
		boton = $(this); 
		if(callback) {
			log('Seteamos callback');
			call = callback;
			log('Iniciamos fb');
			return fbIni();
		}
	};
})(jQuery);