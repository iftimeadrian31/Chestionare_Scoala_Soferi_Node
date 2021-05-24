var currentdate;
var hours0;
var minutes0;
var seconds0;
var hours1;
var minutes1;
var seconds1;
var timp;
var minute;
var secunde;

function laPornire(){
    if(document.getElementById("timp_terminare")!=null){
        currentdate = new Date();
        hours0=parseInt(currentdate.getHours());
        minutes0=parseInt(currentdate.getMinutes());
        seconds0=parseInt(currentdate.getSeconds());
        timp=document.getElementById("timp_terminare").value;
        hours1=parseInt(timp.split(":")[0]);
        minutes1=parseInt(timp.split(":")[1]);
        seconds1=parseInt(timp.split(":")[2]);
        if(hours1<hours0)
        {
            console.log("aici1");
            minutes1=minutes1+60;
        }
        else if(hours1>hours0)
        {
            console.log("aici2");
            minutes1=minutes1+60;
        }
        if(timp!=undefined)
        {
            minute=minutes1-minutes0;
            secunde=seconds1-seconds0;
        }
    decrement_timer()
    setInterval(decrement_timer,1000); 
    }

}
function decrement_timer()
{
        secunde=secunde-1;
        if(secunde<0)
        {
            secunde=secunde+60;
            minute=minute-1;
        }
        document.getElementById("prompter").innerText="Timp ramas "+minute+":"+secunde;
}
var raspuns="";
var numar_intrebare;
function SetAnswer()
{
    raspuns="";
    numar_intrebare=document.getElementById("numar_intrebare").value;
    if(document.getElementById(0).checked)
    {
        if(raspuns=="")
        raspuns+=0;
        else
        raspuns+=",0";
    }
    if(document.getElementById(1).checked)
    {
        if(raspuns=="")
        raspuns+=1;
        else
        raspuns+=",1";
    }
    if(document.getElementById(2).checked)
    {
        if(raspuns=="")
        raspuns+=2;
        else
        raspuns+=",2";
    }
    LoadQuestion();

}
function LoadQuestion() 
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            main=document.getElementById("continut")
            var obiect=JSON.parse(this.responseText);
            if (obiect.nr_intrebari < 27 && obiect.gresite < 5 ) 
            {
                main.innerHTML=
                `<div class="container">
                    <h2 class="intrebare">`+obiect.intrebare["intrebare"]+`</h2>
                    <br>
                </div>
                <label class="container raspuns">
                    <input type="hidden" id="numar_intrebare" value="`+obiect.nr_intrebare+`">
                    <input type="hidden" id="timp_terminare" value="`+obiect.timpTerminare+`">
                    <input id=0 type="checkbox" class="checkbox" name="intrebare" value=0>
                    <span class="checkmark"></span>`+obiect.intrebare["variante"][0]+`
                </label>
                <br>
                <label class="container raspuns">
                    <input id=1 type="checkbox" class="checkbox" name="intrebare" value=1>
                    <span class="checkmark"></span>`+obiect.intrebare["variante"][1]+`
                </label>
                <br>
                <label class="container raspuns">
                    <input id=2 type="checkbox" class="checkbox" name="intrebare" value=2>
                    <span class="checkmark"></span>`+obiect.intrebare["variante"][2]+`
                </label>
                <br>
                <div class="container">
                    <input type="submit" value="Submit" onClick="SetAnswer()">
                </div>
                `;
            } 
            else
            {
                main.innerHTML=
                `
                <h3>Sfarsitul Chestionarului</h3>
                <input type="submit" value="Submit">
                `;
            }
        }
    };
    xhttp.open("post", "/chestionar", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
    raspuns: raspuns,
    numar_intrebare:numar_intrebare
}));
}
