const inputs = document.querySelectorAll('input');

//tratamento da seleção de idioma
var idioma = '';
  inputs[13].addEventListener('click', () => {
    idioma = "Portugues";
  });
  inputs[14].addEventListener('click', () => {
    idioma = "日本語";
  });
  inputs[15].addEventListener('click', () => {
    idioma = "Inglês";
  });

  //tratamento da seleção de planos e preços
  var plan = '';
  inputs[16].addEventListener('click', (e) => {
    plan = "Plan A"
  });
  var plan = '';
  inputs[17].addEventListener('click', (e) => {
    plan = "Plan B"
  });
  var plan = '';
  inputs[18].addEventListener('click', (e) => {
    plan = "Plan C"
  });
  var plan = '';
  inputs[19].addEventListener('click', (e) => {
    plan = "Plan D"
  });
  var plan = '';
  inputs[20].addEventListener('click', (e) => {
    plan = "Plan E"
  });
  var plan = '';
  inputs[21].addEventListener('click', (e) => {
    plan = "Plan F"
  });

function saveData() {
  let gen = () => {       //tratamento da seleção de gênero
    if(inputs[5].checked) {
      return 'man'
    }
    else if(inputs[6].checked) {
      return 'women'
    } 
  }

  var obj =
  {
    "nm_member": inputs[0].value,
    "birthday_year": inputs[1].value,
    "birthday_month": inputs[2].value,
    "birthday_day": inputs[3].value,
    "birthday_age": inputs[4].value,
    "genero": gen(),
    "adress_input": inputs[7].value,
    "phone01": inputs[8].value,
    "phone02": inputs[9].value,
    "phone03": inputs[10].value,
    "email": inputs[11].value + inputs[12].value,
    "lang01": idioma,
    "plans": plan,
    "signature": signaturePad.toDataURL("image/png")
  };

  fetch('http://localhost:3333/member',
    {method: 'POST',
    body: JSON.stringify(obj),
    headers: {"Content-type": "application/json; charset=UTF-8"}})
    .then((x)=> x.json())
    .then((response) => {
      console.log(response)})
      .then((y) => {
      ejspdf();
      })
}

function ejspdf() {
  fetch('http://localhost:3333/pdf')
  .then((x) => x.json())
  .then((response) => {
    console.log(response)
  })
}

function generatePDF() {
/*   const element = document.getElementById("body");
  const element2 = document.getElementById('principal');
  element.style.width = '770px';
  element2.style.width = '770px';

  let opt = {
    margin: 0,
    filename: 'CTR.PDF',
    image: { type: 'jpeg', quality: 0.98 },
    htmlcanvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' }
  };
  
  html2pdf().from(element).set(opt).save(); */
}


const canvas = document.querySelector("canvas");
const btnClear = document.querySelector("#cancel-button");

const signaturePad = new SignaturePad(canvas);

signaturePad.minWidth = 1;
signaturePad.maxWidth = 1;
signaturePad.penColor = "#000";

function resizeCanvas() {
  const ratio =  Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
  signaturePad.clear(); // otherwise isEmpty() might return incorrect value
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

btnClear.addEventListener('click', function (event) {
  signaturePad.clear();
});

document.getElementById("confirm-button").addEventListener("click", confirm_check)
function confirm_check(){
  let name_error = document.getElementById("nameerror");
  let birthday_year_error = document.getElementById("birthday-error");
  let adress_error = document.getElementById("adress-error");
  let phone_error = document.getElementById("phone-error");
  let email_error = document.getElementById("email-error");
  let name_input = document.getElementById("name-input").value;
  let birthday_year = document.getElementById("birthday_year").value;
  let birthday_month = document.getElementById("birthday_month").value;
  let birthday_day = document.getElementById("birthday_day").value;
  let adress_input = document.getElementById("adress-input").value;
  let phone1 = document.getElementById("phone1").value;
  let phone2 = document.getElementById("phone2").value;
  let phone3 = document.getElementById("phone3").value;
  let email1 = document.getElementById("email1").value;
  let email2 = document.getElementById("email2").value;

  if(name_input==""){
    console.log(name_input);
    name_error.style.display ="block";
    location.href = "#fullnametitle";
  }else if(birthday_year=="" || birthday_month=="" || birthday_day==""){
    birthday_year_error.style.display ="block";
    location.href = "#birthdaytitle";
}else if(adress_input==""){
  adress_error.style.display ="block";
  location.href = "#adress";;
}else if(phone1=="" || phone2=="" || phone3==""){
  phone_error.style.display ="block";
  location.href = "#phonenumber";
}else if(email1=="" || email2==""){
  email_error.style.display ="block";
  location.href = "#email";
}

saveData();
generatePDF();
}

function yearfunc(){
  document.getElementById("birthday_year").value=""
}
function monthfunc(){
  document.getElementById("birthday_month").value=""
}
function dayfunc(){
  document.getElementById("birthday_day").value=""
}
if(birthday_year==""){

}


var past={
 pt:{
   buttons:{
   },
   Text:{
     Text1:"Seja bem-vindo　\n",
     Text2:"Seja bem-vindo\nInsira seus dados pessoais",
     Text3:"Nome completo:",
     Text4:"Por favor, digite um nome",
     Text5:"Data de nascimento",
     Text6:"Por favor, digite a data de nascimento",
     Text7:"Sexo",
     Text8:"Homem",
     Text9:"Mulher",
     Text10:"Por favor, Escolha o sexo",
     Text11:"Enderço",
     Text12:"Por favor, digite o seu endereço",
     Text13:"Número de telefone",
     Text14:"Por favor, digite o seu número de telefone",
     Text15:"E-mail",
     Text16:"Por favor, digite o seu email",
     Text17:"Idioma",
     Text18:"Por favor, selecione o idioma",
     Text19:"Escolha um plano",
     Text20:"Verifique as politicas da academia e assine no campo a baixo",
     Text21:"politicas da academia",
     Text22:"Escolher",
     Text23:"Apagar",
     Text24:"Confirmar"
   },
 },
 jp:{
   buttons:{
   },
   Text:{
     Text1:"ようこそ",
     Text2:"ようこそ\n下記にて個人情報をご入力ください。",
     Text3:"フルネーム:",
     Text4:"名前を入力してください。",
     Text5:"生年月日",
     Text6:"生年月日を入力してください。",
     Text7:"性別",
     Text8:"男性",
     Text9:"女性",
     Text10:"性別を選択してください。",
     Text11:"住所",
     Text12:"住所を入力してください。",
     Text13:"電話番号",
     Text14:"電話番号を入力してください。",
     Text15:"メールアドレス",
     Text16:"メールアドレスを入力してください",
     Text17:"言語",
     Text18:"言語を選択してください",
     Text19:"プランを選択してください。",
     Text20:"利用規約を確認し、署名をお願いします。",
     Text21:"利用規約に同意します",
     Text22:"選択",
     Text23:"クリア",
     Text24:"確定"
   },
 },
 en:{
  buttons:{
  },
  Text:{
    Text1:"Welcome",
    Text2:"Welcome\nPlease enter your personal details below.",
    Text3:"Full name",
    Text4:"Name is required",
    Text5:"Date of birth",
    Text6:"Date of birth is required.",
    Text7:"Gender",
    Text8:"Male",
    Text9:"Female",
    Text10:"Gender is required",
    Text11:"Address",
    Text12:"Adress is requiered",
    Text13:"Phone number",
    Text14:"Phone number",
    Text15:"Email",
    Text16:"Email is required",
    Text17:"Language",
    Text18:"Language is required",
    Text19:"Choose a membership",
    Text20:"Please read the terms and conditions and sign.",
    Text21:"I agree to the terms and conditions",
    Text22:"Select",
    Text23:"Clear",
    Text24:"Confirm"
  },
},
}


document.getElementById("selectlanguage").addEventListener("change",language_change)

function language_change(){
  const selectlanguage = document.getElementById( "selectlanguage" ).value
  console.log(selectlanguage)
if (selectlanguage=="Português"){
   portugues()
} else if(selectlanguage=="Inglês"){
 ingles()
}else{
japones()
}

function portugues() {
document.getElementById("welcomemessage").innerText=past.pt.Text.Text1;
document.getElementById("welcomemessage").innerText=past.pt.Text.Text2;
document.getElementById("fullnametitle").innerText=past.pt.Text.Text3;
document.getElementById("nameerror").innerText=past.pt.Text.Text4;
document.getElementById("birthdaytitle").innerText=past.pt.Text.Text5;
document.getElementById("birthday-error").innerText=past.pt.Text.Text6;
document.getElementById("gendertitle").innerText=past.pt.Text.Text7;
document.getElementById("gender-man").innerText=past.pt.Text.Text8;
document.getElementById("gender-women").innerText=past.pt.Text.Text9;
document.getElementById("gender-error").innerText=past.pt.Text.Text10;
document.getElementById("adress").innerText=past.pt.Text.Text11;
document.getElementById("adress-error").innerText=past.pt.Text.Text12;
document.getElementById("phonenumber").innerText=past.pt.Text.Text13;
document.getElementById("phone-error").innerText=past.pt.Text.Text14;
document.getElementById("email").innerText=past.pt.Text.Text15;
document.getElementById("email-error").innerText=past.pt.Text.Text16;
document.getElementById("language").innerText=past.pt.Text.Text17;
document.getElementById("languagen-error").innerText=past.pt.Text.Text18;
document.getElementById("planselect").innerText=past.pt.Text.Text19;
document.getElementById("politic-title").innerText=past.pt.Text.Text20;
document.getElementById("politiclink").innerText=past.pt.Text.Text21;
document.getElementById("select-plan-a").innerText=past.pt.Text.Text22;
document.getElementById("select-plan-b").innerText=past.pt.Text.Text22;
document.getElementById("select-plan-c").innerText=past.pt.Text.Text22;
document.getElementById("select-plan-d").innerText=past.pt.Text.Text22;
document.getElementById("select-plan-e").innerText=past.pt.Text.Text22;
document.getElementById("select-plan-f").innerText=past.pt.Text.Text22;
document.getElementById("cancel-button").value=past.pt.Text.Text23;
document.getElementById("confirm-button").value=past.pt.Text.Text24;
}
function japones() {
  document.getElementById("welcomemessage").innerText=past.jp.Text.Text1;
  document.getElementById("welcomemessage").innerText=past.jp.Text.Text2;
  document.getElementById("fullnametitle").innerText=past.jp.Text.Text3;
  document.getElementById("nameerror").innerText=past.jp.Text.Text4;
  document.getElementById("birthdaytitle").innerText=past.jp.Text.Text5;
  document.getElementById("birthday-error").innerText=past.jp.Text.Text6;
  document.getElementById("gendertitle").innerText=past.jp.Text.Text7;
  document.getElementById("gender-man").innerText=past.jp.Text.Text8;
  document.getElementById("gender-women").innerText=past.jp.Text.Text9;
  document.getElementById("gender-error").innerText=past.jp.Text.Text10;
  document.getElementById("adress").innerText=past.jp.Text.Text11;
  document.getElementById("adress-error").innerText=past.jp.Text.Text12;
  document.getElementById("phonenumber").innerText=past.jp.Text.Text13;
  document.getElementById("phone-error").innerText=past.jp.Text.Text14;
  document.getElementById("email").innerText=past.jp.Text.Text15;
  document.getElementById("email-error").innerText=past.jp.Text.Text16;
  document.getElementById("language").innerText=past.jp.Text.Text17;
  document.getElementById("languagen-error").innerText=past.jp.Text.Text18;
  document.getElementById("planselect").innerText=past.jp.Text.Text19;
  document.getElementById("politic-title").innerText=past.jp.Text.Text20;
  document.getElementById("politiclink").innerText=past.jp.Text.Text21;
  document.getElementById("select-plan-a").innerText=past.jp.Text.Text22;
  document.getElementById("select-plan-b").innerText=past.jp.Text.Text22;
  document.getElementById("select-plan-c").innerText=past.jp.Text.Text22;
  document.getElementById("select-plan-d").innerText=past.jp.Text.Text22;
  document.getElementById("select-plan-e").innerText=past.jp.Text.Text22;
  document.getElementById("select-plan-f").innerText=past.jp.Text.Text22;
  document.getElementById("cancel-button").value=past.jp.Text.Text23;
  document.getElementById("confirm-button").value=past.jp.Text.Text24;
}
function ingles() {
  document.getElementById("welcomemessage").innerText=past.en.Text.Text1;
    document.getElementById("welcomemessage").innerText=past.en.Text.Text2;
    document.getElementById("fullnametitle").innerText=past.en.Text.Text3;
    document.getElementById("nameerror").innerText=past.en.Text.Text4;
    document.getElementById("birthdaytitle").innerText=past.en.Text.Text5;
    document.getElementById("birthday-error").innerText=past.en.Text.Text6;
    document.getElementById("gendertitle").innerText=past.en.Text.Text7;
    document.getElementById("gender-man").innerText=past.en.Text.Text8;
    document.getElementById("gender-women").innerText=past.en.Text.Text9;
    document.getElementById("gender-error").innerText=past.en.Text.Text10;
    document.getElementById("adress").innerText=past.en.Text.Text11;
    document.getElementById("adress-error").innerText=past.en.Text.Text12;
    document.getElementById("phonenumber").innerText=past.en.Text.Text13;
    document.getElementById("phone-error").innerText=past.en.Text.Text14;
    document.getElementById("email").innerText=past.en.Text.Text15;
    document.getElementById("email-error").innerText=past.en.Text.Text16;
    document.getElementById("language").innerText=past.en.Text.Text17;
    document.getElementById("languagen-error").innerText=past.en.Text.Text18;
    document.getElementById("planselect").innerText=past.en.Text.Text19;
    document.getElementById("politic-title").innerText=past.en.Text.Text20;
    document.getElementById("politiclink").innerText=past.en.Text.Text21;
    document.getElementById("select-plan-a").innerText=past.en.Text.Text22;
    document.getElementById("select-plan-b").innerText=past.en.Text.Text22;
    document.getElementById("select-plan-c").innerText=past.en.Text.Text22;
    document.getElementById("select-plan-d").innerText=past.en.Text.Text22;
    document.getElementById("select-plan-e").innerText=past.en.Text.Text22;
    document.getElementById("select-plan-f").innerText=past.en.Text.Text22;
    document.getElementById("cancel-button").value=past.en.Text.Text23;
    document.getElementById("confirm-button").value=past.en.Text.Text24;
}
}
/* // Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible parameters)
signaturePad.toDataURL(); // save image as PNG
signaturePad.toDataURL("image/jpeg"); // save image as JPEG
signaturePad.toDataURL("image/jpeg", 0.5); // save image as JPEG with 0.5 image quality
signaturePad.toDataURL("image/svg+xml"); // save image as SVG

// Draws signature image from data URL (mostly uses https://mdn.io/drawImage under-the-hood)
// NOTE: This method does not populate internal data structure that represents drawn signature. Thus, after using #fromDataURL, #toData won't work properly.
signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...");

// Draws signature image from data URL and alters it with the given options
signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...", {
  ratio: 1,
  width: 400,
  height: 200,
  xOffset: 100,
  yOffset: 50,
});*/



/*
// Returns signature image as an array of point groups
const data = signaturePad.toData();

// Draws signature image from an array of point groups
signaturePad.fromData(data);

// Draws signature image from an array of point groups, without clearing your existing image (clear defaults to true if not provided)
signaturePad.fromData(data, { clear: false });

// Clears the canvas
signaturePad.clear();

// Returns true if canvas is empty, otherwise returns false
signaturePad.isEmpty();

// Unbinds all event handlers
signaturePad.off();

// Rebinds all event handlers
signaturePad.on();
 */
