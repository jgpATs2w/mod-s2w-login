function S2W_Login (div_id){
	s2w.IDS = ["uname", "poema", "email"];
	s2w.DEFAULTS = ["Nombre", "", "tu@mundo.net"];
	s2w.PATTERNS = [/\W+/g, /.{8,}/g, /[^\w@\.]/g];//this pattern will produce an error in username, and is required in poema
	s2w.ERROR_MSGS = ["usuario no válido", "debe tener más de 5 caracteres", "eso no es un email válido"];
	
	document.getElementById('s2w_login').innerHTML = "<input id='uname' type='text' autofocus>"+
													"<label id='label_uname'>&nbsp;</label>"+
													"<input id='poema' type='password'>"+
													"<label id='label_poema'>&nbsp;</label>"+
													"<input id='email' type='email' style='display:none'>"+ 
													"<label id='label_email'>&nbsp;</label>"+
													"<input id='check_s2w_remember' type='checkbox'>Recuerdame"+
													"<button id='button_s2w_login'>Login</button>"+
													"<a id='a_s2w_login_new' href='#'>nuevo usuario</a>"+
													"<div id='div_s2w_login_status'>&nbps;</div>";
	
	if((u = localStorage.getItem('s2w_uname')) != null){
		input_uname = document.getElementById('uname');
		input_uname.value = u;
		input_uname.removeAttribute('autofocus');
		document.getElementById('poema').autofocus = "autofocus";
	}
	
		document.getElementById('poema').value = s2w.DEFAULTS[1];
		document.getElementById('email').value = s2w.DEFAULTS[2];
	
	for(i in s2w.IDS){
		input = document.getElementById(s2w.IDS[i]);
		input.setAttribute('data-index', i); //standard use from http://www.w3.org/html/wg/drafts/html/master/single-page.html#embedding-custom-non-visible-data-with-the-data-*-attributes
		input.onfocus = input_onfocus;
		input.onblur = input_onblur;
		input.onkeyup = input_onkeyup;
	}
	
	
	s2w.get = function(e, M){
		i = e.getAttribute('data-index');
		return M[i];
	}
	s2w.getValue = function(id){return document.getElementById(id).value; }
	
	this.submit = function(){ this.submitLogin();}
	
	this.submitLogin = function(){
		s2w.rpc.url = this.serverurl;
		s2w.rpc.onSuccess = function(result){
								if(result){
									if(result[0].count == 1){
										updateStatus('ok');
										localStorage.setItem('s2w_uname', s2w.getValue('uname'));
										location.href = s2w.login.redirect;
									}else
										updateStatus('usuario o password <br> erroneos')
								}else
									updateStatus(Response.error);
	
							}
		query = "SELECT count(uname) FROM main WHERE uname='"+s2w.getValue('uname')+"' AND "+
									"poema='"+s2w.getValue('poema')+"'";
							
		s2w.rpc.dbQuery(query);
	}
	this.submitRegister = function(){
		s2w.rpc.url = this.serverurl;
		s2w.rpc.onSuccess = function(Response){
								if(Response.result){
										updateStatus('ok');
										localStorage.setItem('s2w_uname', s2w.getValue('uname'));
										window.location.href = s2w.login.url;
								}else
									updateStatus(Response.error);
	
							}
		s2w.rpc.onError = function(){
			updateStatus('error, prueba con otro usuario');
		}
		
		query = "INSERT INTO main (uname, poema, email) VALUES ('"+s2w.getValue('uname')+"',"+
																"'"+s2w.getValue('poema')+"',"+
																"'"+s2w.getValue('email')+"')";
							
		s2w.rpc.post(this.serverurl,"\\s2w\\db\\query",query);
	}
	function input_onfocus(){
		this.value = (this.value != s2w.get(this, s2w.DEFAULTS))? this.value : '';
		this.style.color = 'black';
	}
	function input_onblur(){
		if (this.value == ''){
			this.value = s2w.get(this, s2w.DEFAULTS);
			this.style.color = "";
		}
	}
	function input_onkeyup(){
		cond = false;
		input_check(this);
	}
	function updateStatus(m){
		s2w.login.status.innerHTML=m;
		s2w.login.status.style.display = 'block';
		s2w.login.status.style.color = 'red';
	}
	//returns true if the pattern is ok
	function input_check(e){
		if(s2w.get(e,s2w.IDS) == "poema") wrong = (e.value.length <5) && (e.value != null);
		else wrong = s2w.get(e, s2w.PATTERNS).test(e.value);
		if(wrong){
			label_write(e, s2w.get(e, s2w.ERROR_MSGS));
			return false;
		}else
			label_write(e, '');
		
		return true;
	}
	function label_write(e, mens){
		label = getLabel(e);
			label.style.display = 'block';
			label.innerHTML = mens;
	}
	function label_reset(e){
		label = getLabel(e);
			label.style.visibility = 'hidden';
			label.innerHTML = '';
	}
	function getLabel(e){
		return document.getElementById('label_'+s2w.get(e, s2w.IDS));
	}
	this.outInfo = function(m){
		s2w.log.info(this,m);
	}
	this.readyToSend = function(){
		for(i in s2w.IDS){
			input = document.getElementById(s2w.IDS[i]);
			if(!input_check(input)) return false;
		}
		return true;
	}
	this.loadEvents = function(){
		document.getElementById('button_s2w_login').onclick = function(){
			if(s2w.login.readyToSend()){
				s2w.login.submit();
			}else{
				s2w.log.error(this, 'should recheck the inputs');
			}
			
		}
		document.getElementById('a_s2w_login_new').onclick = function(){
			but = document.getElementById('button_s2w_login');
			anch = document.getElementById('a_s2w_login_new');
			email = document.getElementById('email');
			if(but.innerHTML == "Login"){
				email.style.display = "block";
				but.innerHTML = "Registrar";
				anch.innerHTML = "login";
				s2w.login.submit = s2w.login.submitRegister;
			}else{
				email.style.display = "none";
				but.innerHTML = "Login";
				anch.innerHTML = "nuevo usuario";
				s2w.login.submit = s2w.login.submitLogin;
			} 
			s2w.login.status.style.display = 'none';
		}
	}
	
	this.loadEvents();
	
}
S2W_Login.prototype.toString = function(){return "[object S2W_Login]";}

window.addEventListener('load', function(){
	s2w.login = new S2W_Login();
		s2w.login.status = document.getElementById('div_s2w_login_status');
		s2w.login.redirect = "http://sens2web.es";
		s2w.login.serverurl = 'http://localhost/mod/s2w/login/php/s2w.login.mod.php';
});
