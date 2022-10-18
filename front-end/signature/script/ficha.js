const canvas = document.querySelector("canvas");

const signaturePad = new SignaturePad(canvas); 

signaturePad.minWidth = 0;
signaturePad.maxWidth = 0;
signaturePad.penColor = "#000";

function resizeCanvas() {
  const ratio =  Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
  signaturePad.clear(); // otherwise isEmpty() might return incorrect value
}

resizeCanvas();

/* var data = {
    nm_member: 
}, */

fetch('http://localhost:3333/img')
.then((x) => x.json())
.then((response) => {
   signaturePad.fromDataURL(response[0].signature)
    console.log(response[0].signature)
});

function generatePDF() {
/*     const element = document.getElementById("body");
    const element2 = document.getElementById('principal');
  
    let opt = {
      margin: 0,
      filename: 'CTR.PDF',
      image: { type: 'jpeg', quality: 0.98 },
      htmlcanvas: { scale: 2 },
      jsPDF: { orientation: 'l' }
    };
    
    html2pdf().from(element).set(opt).save();  */
  }