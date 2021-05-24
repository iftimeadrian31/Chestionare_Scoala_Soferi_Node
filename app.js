function incarcaIntrebari(){
	var fs = require('fs');
	fs.readFile('intrebari.json', (err, data) => 
	{
		if (err) throw err;
		listaIntrebari = JSON.parse(data);
	}
	);
}
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')

const app = express();

const port = 6789;

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret:'secret',
	resave:false,
	saveUninitialized:false,
	cookie:{
	maxAge:60 * 60 * 1000
	}}));
// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
var intrebari_primite=[];
var nr_raspunsuri_corecte=0;
var nr_raspunsuri_gresite=0;
var hours=0;
var minutes=0;
var seconds=0;
var date_ob;
var timp_terminare;
app.get('/', (req, res) =>{
	intrebari_primite=[];
	nr_raspunsuri_corecte=0;
	nr_raspunsuri_gresite=0;
	res.render('start');
	
});
var listaIntrebari;
incarcaIntrebari();
// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.post('/chestionar', (req, res) => {

	if(intrebari_primite.length!=0)
	{

		raspuns=""+req.body["raspuns"]
		numar_intrebare=req.body["numar_intrebare"]
		console.log(raspuns);
		console.log(numar_intrebare)
		console.log(listaIntrebari[numar_intrebare]["corect"])
		if(listaIntrebari[numar_intrebare]["corect"]==raspuns)
		{
			console.log("nu aici");
			nr_raspunsuri_corecte++;
		}
		else{
			console.log("aici");
			nr_raspunsuri_gresite++;
		}
	}
	else
	{
		date_ob = new Date();
		hours = date_ob.getHours();
		minutes = date_ob.getMinutes();
		seconds = date_ob.getSeconds();
		minutes=minutes+30;
		if(minutes>59)
		{
			hours=hours+1;
			minutes=minutes-60;
			if(hours>23)
			{
				hours=0;
			}
		}
		timp_terminare=hours+":"+minutes+":"+seconds;
		sess=req.session;
		sess.timp_terminare=timp_terminare;
	}
	do
	{
		index=(Math.random()*listaIntrebari.length)*0.99;
		index=Math.floor(index);
	}while(intrebari_primite.includes(listaIntrebari[index]));
	intrebari_primite.push(listaIntrebari[index])
	res.send({intrebare:listaIntrebari[index],nr_intrebari:intrebari_primite.length,corecte:nr_raspunsuri_corecte,gresite:nr_raspunsuri_gresite,nr_intrebare:index,timpTerminare:req.session.timp_terminare });
	//}
});
app.post('/rezultat-chestionar', (req, res) => {

	res.render("rezultat_chestionar",{nr_corecte:nr_raspunsuri_corecte,nr_gresite:nr_raspunsuri_gresite});
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:6789`));