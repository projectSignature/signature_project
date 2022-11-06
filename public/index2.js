

document.getElementById("img2").addEventListener("click", swallopen1)
document.getElementById("img").addEventListener("click", swallopen2)

function swallopen2() {
    Swal.fire({
        title: 'Enviar calendário ',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        width: 500,
        customClass: "sweet-alert-acess",
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                icon: "success",
                title: 'concluido',
            }
            )
        }
    });
}


function swallopen1() {
    Swal.fire({
        html: `
        <div id='swall-title-div'>
            <h1 id='swal-title'>Alterar calendário</h1>
        </div>
        <div id='swal-maindiv'>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Dia</h2>
          <select id='days' class='input'>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
          </select>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Linha</h2>
          <select id='line' class='input'>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
          </select>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Horário inicial</h2>
          <input type='time' id='swall-input-time1' class='input' />
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Horário final</h2>
          <input type='time' id='swall-input-time2' class='input' />
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Descrição 1</h2>
          <textarea id='input1' class='input'></textarea>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Descrição 2</h2>
          <textarea id='input2' class='input'></textarea>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Cor</h2>
          <select id="color" class='input'>
              <option value="blue">azul</option>
              <option value="green">verde</option>
              <option value="red">vermelho</option>
              <option value="yellow">amarelo</option>
              <option value="gray">cinza</option>
              <option value="pink">rosa</option>
              <option value="black">preto</option>
              <option value="white">branco</option>
              <option value="purple">roxo</option>
              <option value="branco">branco</option>
          </select>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Kimono</h2>
          <select id="kimono-selected" class='input'>
              <option value="monday1">monday1</option>
              <option value="monday2">monday2</option>
          </select>

      </div>
      <style>
          * {
              font-family: sans-serif;
          }

          #swal-maindiv {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: center;
          }

          #swal-maindiv div {
              width: 49%;
          }

          .input {
              width: 60%;
              height: 5vh;
              border-radius: 10px;
              border: 1px solid gray;
              text-align: center;
              transition: 0.5s;
              outline: none;
              cursor: pointer;
              font-size: 1.5vw;
          }

          .input:focus {
              width: 65%;
              height: 7vh;
          }

          .input:hover {
              background-color: rgb(243, 242, 242);
              box-shadow: 1px 1px 4px 0px black;
          }

          input[type="file"] {
              display: none;
          }

          label {
              padding: 10px 10px;
              width: 49%;
              border-radius: 10px;
              background-color: #333;
              color: #FFF;
              text-transform: uppercase;
              text-align: center;
              display: block;
              margin-top: 15px;
              margin-left: 100px;
              cursor: pointer;
          }

          @media only screen and (max-width: 600px) {
              #swal-maindiv {
                  flex-direction: column;
              }

              #swal-maindiv div {
                  width: 100%;
              }

              .input {
                  font-size: 1em;
                  width: 80%;
              }
          }
      </style>
     </div>`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        width: 900,
    })
        .then(() => {
            const objSwal = {
                day: document.querySelector('#days').value,
                line: document.querySelector('#line').value,
                start: document.querySelector('#swall-input-time1').value,
                end: document.querySelector('#swall-input-time2').value,
                desc1: document.querySelector('#input1').value,
                desc2: document.querySelector('#input2').value,
                cor: document.querySelector('#color').value,
                img: document.querySelector('#kimono-selected').value
            }
            update(objSwal) //chama função de update 
            console.log(objSwal.start)
        })
};

//INICIO DOS TESTES NO CALENDARIO
const line1 = document.querySelectorAll('#second-row')[0];
const line2 = document.querySelectorAll('#second-row')[1];
const line3 = document.querySelectorAll('.master-image');
const line4 = document.querySelectorAll('h4');
const line5 = document.querySelectorAll('h1');
const line6 = document.querySelectorAll('.sechedule')[0];


//função de load e reload de dados.
function getDados() {
    fetch('http://localhost:3000/calenderteste')
        .then((x) => x.json())
        .then((res) => {
            console.log(res);
            cols(res);
        });
};

getDados();

async function cols(data) {
    //Primary column
    /* for (let i = 0; i < 6; i++) {
        var time = `${data[i].START_TIME}~${data[i].FINISH_TIME}`;
        var desc1 = data[i].DESCRITION_1;
        var desc2 = data[i].DESCRITION_2;

        line4[0].innerHTML = time;
        line4[7].innerHTML = time;
        line4[14].innerHTML = time;
        line4[21].innerHTML = time;
        line4[28].innerHTML = time;
        line4[35].innerHTML = time;

        line5[0 ].innerHTML = desc1;
        line5[1 ].innerHTML = desc2;
        line5[14].innerHTML = desc1;
        line5[15].innerHTML = desc2;
        line5[28].innerHTML = desc1;
        line5[29].innerHTML = desc2;
        line5[42].innerHTML = desc1;
        line5[43].innerHTML = desc2;
        line5[56].innerHTML = desc1;
        line5[57].innerHTML = desc2;
        line5[70].innerHTML = desc1;
        line5[71].innerHTML = desc2;
    }; */
    //Second column
    /* for (let i = 6; i < 12; i++) {
        var time = `${data[i].START_TIME}~${data[i].FINISH_TIME}`;
        var desc1 = data[i].DESCRITION_1;
        var desc2 = data[i].DESCRITION_2;

        line4[1].innerHTML = time;
        line4[8].innerHTML = time;
        line4[15].innerHTML = time;
        line4[22].innerHTML = time;
        line4[29].innerHTML = time;
        line4[36].innerHTML = time;

        line5[2 ].innerHTML = desc1;
        line5[3 ].innerHTML = desc2;
        line5[16].innerHTML = desc1;
        line5[17].innerHTML = desc2;
        line5[30].innerHTML = desc1;
        line5[31].innerHTML = desc2;
        line5[44].innerHTML = desc1;
        line5[45].innerHTML = desc2;
        line5[58].innerHTML = desc1;
        line5[59].innerHTML = desc2;
        line5[72].innerHTML = desc1;
        line5[73].innerHTML = desc2;
    }; */
    //Third column
    /* for (let i = 12; i < 18; i++) {
        var time = `${data[i].START_TIME}~${data[i].FINISH_TIME}`;
        var desc1 = data[i].DESCRITION_1;
        var desc2 = data[i].DESCRITION_2;

        line4[2].innerHTML = time;
        line4[9].innerHTML = time;
        line4[16].innerHTML = time;
        line4[23].innerHTML = time;
        line4[30].innerHTML = time;
        line4[37].innerHTML = time;

        line5[4 ].innerHTML = desc1;
        line5[5 ].innerHTML = desc2;
        line5[18].innerHTML = desc1;
        line5[19].innerHTML = desc2;
        line5[32].innerHTML = desc1;
        line5[33].innerHTML = desc2;
        line5[46].innerHTML = desc1;
        line5[47].innerHTML = desc2;
        line5[60].innerHTML = desc1;
        line5[61].innerHTML = desc2;
        line5[74].innerHTML = desc1;
        line5[75].innerHTML = desc2;
    }; */
    //Fourth column
    /*    for (let i = 18; i < 24; i++) {
           var time = `${data[i].START_TIME}~${data[i].FINISH_TIME}`;
           var desc1 = data[i].DESCRITION_1;
           var desc2 = data[i].DESCRITION_2;
   
           line4[3].innerHTML = time;
           line4[10].innerHTML = time;
           line4[17].innerHTML = time;
           line4[24].innerHTML = time;
           line4[31].innerHTML = time;
           line4[38].innerHTML = time;
   
           line5[6 ].innerHTML = desc1;
           line5[7 ].innerHTML = desc2;
           line5[20].innerHTML = desc1;
           line5[21].innerHTML = desc2;
           line5[34].innerHTML = desc1;
           line5[35].innerHTML = desc2;
           line5[48].innerHTML = desc1;
           line5[49].innerHTML = desc2;
           line5[62].innerHTML = desc1;
           line5[63].innerHTML = desc2;
           line5[76].innerHTML = desc1;
           line5[77].innerHTML = desc2;
       }; */
    //Fifth column

    var arr0 = [
        [0, 7, 14, 21, 28, 35], //define os indices para buscar as horas 
        [1, 8, 15, 22, 29, 36],
        [2, 9, 16, 23, 30, 37],
        [3, 10, 17, 24, 31, 38],
        [4, 11, 18, 25, 32, 39],
        [5, 12, 19, 26, 33, 40],
        [6, 13, 20, 27, 34, 41]
    ];

    var arr1 = [
        [0, 1, 14, 15, 28, 29, 42, 43, 56, 57, 70, 71], //define os indices para buscar as decrições
        [2, 3, 16, 17, 30, 31, 44, 45, 58, 59, 72, 73],
        [4, 5, 18, 19, 32, 33, 46, 47, 60, 61, 74, 75],
        [6, 7, 20, 21, 34, 35, 48, 49, 62, 63, 76, 77],
        [8, 9, 22, 23, 36, 37, 50, 51, 64, 65, 78, 79],
        [10, 11, 24, 25, 38, 39, 52, 53, 66, 67, 80, 81],
        [12, 13, 26, 27, 40, 41, 54, 55, 68, 69, 82, 83],
    ];

    var arr2 = [
        [0, 1, 2, 3, 4, 5], //define os indices para buscar os dados no banco 
        [6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17],
        [18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29],
        [30, 31, 32, 33, 34, 35],
        [36, 37, 38, 39, 40, 41]
    ];

    var arr3 = [
        [0, 7, 14, 21, 28, 35], //define os indices para buscar as imagens do kimono 
        [1, 8, 15, 22, 29, 36],
        [2, 9, 16, 23, 30, 37],
        [3, 10, 17, 24, 31, 38],
        [4, 11, 18, 25, 32, 39],
        [5, 12, 19, 26, 33, 40],
        [6, 13, 20, 27, 34, 41]
    ];



    function cards(hours, descs, index, indexIMG) {
        //horarios
        line4[hours[0]].innerHTML = `aa${data[index[0]].START_TIME}~${data[index[0]].FINISH_TIME}`;
        line4[hours[1]].innerHTML = `${data[index[1]].START_TIME}~${data[index[1]].FINISH_TIME}`;
        line4[hours[2]].innerHTML = `${data[index[2]].START_TIME}~${data[index[2]].FINISH_TIME}`;
        line4[hours[3]].innerHTML = `${data[index[3]].START_TIME}~${data[index[3]].FINISH_TIME}`;
        line4[hours[4]].innerHTML = `${data[index[4]].START_TIME}~${data[index[4]].FINISH_TIME}`;
        line4[hours[5]].innerHTML = `${data[index[5]].START_TIME}~${data[index[5]].FINISH_TIME}`;

        //cor do h4
        line4[hours[0]].style.backgroundColor = data[index[0]].COLOR;
        line4[hours[1]].style.backgroundColor = data[index[1]].COLOR;
        line4[hours[2]].style.backgroundColor = data[index[2]].COLOR;
        line4[hours[3]].style.backgroundColor = data[index[3]].COLOR;
        line4[hours[4]].style.backgroundColor = data[index[4]].COLOR;
        line4[hours[5]].style.backgroundColor = data[index[5]].COLOR;

        for (let i = 0; i < 6; i++) {

            switch (data[index[i]].COLOR) {
                case 'blue':
                    line4[hours[i]].style.color = '#fff';
                    break;
                case 'green':
                    line4[hours[i]].style.color = '#fff';
                    break;
                case 'red':
                    line4[hours[i]].style.color = '#000';
                    break;
                case 'yellow':
                    line4[hours[i]].style.color = '#000';
                    break;
                case 'gray':
                    line4[hours[i]].style.color = '#fff';
                    break;
                case 'pink':
                    line4[hours[i]].style.color = 'blue';
                    break;
                case 'black':
                    line4[hours[i]].style.color = '#fff';
                    break;
                case 'white':
                    line4[hours[i]].style.color = '#000';
                    break;
                case 'purple':
                    line4[hours[i]].style.color = 'green';
                    break;
            }
        };

        for (let i = 0; i < 6; i++) {
            line3[hours[i]].src = `../image/${data[index[i]].IMAGE}.png`;
        };

        //descrições
        line5[descs[0]].innerHTML = data[index[0]].DESCRITION_1;
        line5[descs[1]].innerHTML = data[index[0]].DESCRITION_2;
        line5[descs[2]].innerHTML = data[index[1]].DESCRITION_1;
        line5[descs[3]].innerHTML = data[index[1]].DESCRITION_2;
        line5[descs[4]].innerHTML = data[index[2]].DESCRITION_1;
        line5[descs[5]].innerHTML = data[index[2]].DESCRITION_2;
        line5[descs[6]].innerHTML = data[index[3]].DESCRITION_1;
        line5[descs[7]].innerHTML = data[index[3]].DESCRITION_2;
        line5[descs[8]].innerHTML = data[index[4]].DESCRITION_1;
        line5[descs[9]].innerHTML = data[index[4]].DESCRITION_2;
        line5[descs[10]].innerHTML = data[index[5]].DESCRITION_1;
        line5[descs[11]].innerHTML = data[index[5]].DESCRITION_2;
    };

    cards(arr0[0], arr1[0], arr2[0]); //chamada 01
    cards(arr0[1], arr1[1], arr2[1]); //chamada 02
    cards(arr0[2], arr1[2], arr2[2]); //chamada 03
    cards(arr0[3], arr1[3], arr2[3]); //chamada 04
    cards(arr0[4], arr1[4], arr2[4]); //chamada 05
    cards(arr0[5], arr1[5], arr2[5]); //chamada 06  
    cards(arr0[6], arr1[6], arr2[6]); //chamada 06  



    //Sixth column
    /* line4[5].innerHTML = `${data[30].START_TIME}~${data[30].FINISH_TIME}`;
    line4[12].innerHTML = `${data[31].START_TIME}~${data[31].FINISH_TIME}`;
    line4[19].innerHTML = `${data[32].START_TIME}~${data[32].FINISH_TIME}`;
    line4[26].innerHTML = `${data[33].START_TIME}~${data[33].FINISH_TIME}`;
    line4[33].innerHTML = `${data[34].START_TIME}~${data[34].FINISH_TIME}`;
    line4[40].innerHTML = `${data[35].START_TIME}~${data[35].FINISH_TIME}`;

    line5[10].innerHTML = data[30].DESCRITION_1;
    line5[11].innerHTML = data[30].DESCRITION_2;
    line5[24].innerHTML = data[31].DESCRITION_1;
    line5[25].innerHTML = data[31].DESCRITION_2;
    line5[38].innerHTML = data[32].DESCRITION_1;
    line5[39].innerHTML = data[32].DESCRITION_2;
    line5[52].innerHTML = data[33].DESCRITION_1;
    line5[53].innerHTML = data[33].DESCRITION_2;
    line5[66].innerHTML = data[34].DESCRITION_1;
    line5[67].innerHTML = data[34].DESCRITION_2;
    line5[80].innerHTML = data[35].DESCRITION_1;
    line5[81].innerHTML = data[35].DESCRITION_2; */

    //Seventh column
    /*  for (let i = 36; i < 41; i++) {
         var time = `${data[i].START_TIME}~${data[i].FINISH_TIME}`;
         var desc1 = data[i].DESCRITION_1;
         var desc2 = data[i].DESCRITION_2;
 
         line4[6 ].innerHTML = time;
         line4[13].innerHTML = time;
         line4[20].innerHTML = time;
         line4[27].innerHTML = time;
         line4[34].innerHTML = time;
         line4[41].innerHTML = time;
 
         line5[12].innerHTML = desc1;
         line5[13].innerHTML = desc2;
         line5[26].innerHTML = desc1;
         line5[27].innerHTML = desc2;
         line5[40].innerHTML = desc1;
         line5[41].innerHTML = desc2;
         line5[54].innerHTML = desc1;
         line5[55].innerHTML = desc2;
         line5[68].innerHTML = desc1;
         line5[69].innerHTML = desc2;
         line5[82].innerHTML = desc1;
         line5[83].innerHTML = desc2;
     }; */
};


async function update(obj) {
    const up = {
        GYM: 1,
        DAY: obj.day,
        START: obj.start,
        FINISH: obj.end,
        LINE: obj.line,
        DESC1: obj.desc1,
        DESC2: obj.desc2,
        IMAGE: obj.img,
        COLOR: obj.cor,
    };

    fetch('http://localhost:3000/calender', {
        method: 'PUT',
        body: JSON.stringify(up),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then((x) => x.json())
        .then((response) => {
            getDados();
        });

};

document.querySelector('#gym-name').innerHTML = sessionStorage.getItem("gym");

/* var a = document.querySelector('#maindiv')
console.log(a)

html2canvas(a).then((canvas) => {


    //document.body.appendChild(canvas)

 /*    window.onload = function () {
        var canvas = document.getElementById("hadas");
        var ctx = canvas.getContext("2d");
        var img = document.getElementById("canvas");
        ctx.drawImage(img, 100, 100);
    }; 

}) */

