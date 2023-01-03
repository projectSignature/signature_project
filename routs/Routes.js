//CONFIGS
const express = require('express');
const router = express.Router();
const database = require('../db');

//SCHEMAS
const Member = require('../schema/members');
const Client = require('../schema/clients');
const Calender = require('../schema/calender');
const Entrance = require('../schema/registerEntrance');
const Plan = require('../schema/plans');
const Graduation = require('../schema/graduation');
const mailerGrau = require('./sendGrau');
const mailer = require('./sendMailer');
const Pay = require('../schema/payment');

//LIBS
const pdf = require('html-pdf');
const ejs = require('ejs');
const { Op, Sequelize } = require('sequelize');

//middleware
router.use(function timelog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

//rota principal-------------------------->
router.get('/', (req, res) => {

  res.json({ message: 'funcionando', status: 200 });
});

//envio de e-mail----------------------------->
router.get('/mailer', async (req, res) => {
  try {
    let a = await mailer('./routs/hello.txt');
    res.send(a);
  }
  catch (err) {
    return res.status(400).json(err)
  }

});

//rotas de testes------------------------------>
router.get('/client', async (req, res) => {
  try {
    await database.sync();

    const newClient = await Client.create({
      GYM_NAME: 'marrone doe',
      REPRESENTATIVE: 'novo rep',
      UNIQUE_CODE: 2,
      PASSWORD: '1234',
      ADRESS: 'marrone doe',
      TEL: 999999999,
      EMAIL: 'john.doe@gmail.com',
      SAVE_DAY: '12-85-22',
      STATUS: 'ativo',
      LANGUAGE: 'EN'
    });

    //console.log(req.body) 

    res.json(newClient);

  } catch (err) {
    return res.status(400).json(err)
  }

});

//autenticação de usuario------------------------>
router.post('/auth', async (req, res) => {
  const [numbers, password] = [req.body.numbers, req.body.password];
  const [primaryKey, secondKey] = [1234, 567]

  const clients = await Client.findAll({
    where: {
      GYM_NAME: numbers,
      PASSWORD: password
    }
  });
  console.log(clients)
  try {
    let name = clients[0].REPRESENTATIVE;
    let code = clients[0].UNIQUE_CODE;
    var gymname = clients[0].GYM_NAME;
    var id = clients[0].id

    switch (code) {
      case '1':
        validationRes(primaryKey, name, code, gymname, id)
        break;
      case '2':
        validationRes(secondKey, name, code, gymname, id)
        break;
      default:
        console.log("eroor")
    };

    function validationRes(key, name, code, gymname, id) {
      if (key > 0) {
        res.json({
          status: 200,
          token: key,
          gym: gymname,
          number: { NAME: name, AUTHORITY: code , ID: id },
        });
      } else {
        res.json({ message: 'internal error1' })
      }
    };
  } catch (err) {
    res.json({ message: 'internal error' })
  }

});

//insert de dados-------------------------------->
router.post('/member', async (req, res) => {
  console.log('in')
  try {
    await database.sync();
    const newMember = await Member.create({
      nm_member: req.body.nm_member,
      birthday_year: req.body.birthday_year,
      birthday_month: req.body.birthday_month,
      birthday_day: req.body.birthday_day,
      birthday_age: req.body.birthday_age,
      genero: req.body.genero,
      adress_input: req.body.adress_input,
      phone01: req.body.phone01,
      phone02: req.body.phone02,
      phone03: req.body.phone03,
      email: req.body.email,
      lang01: req.body.lang01,
      plans: req.body.plans,
      status: "active",
      signature: req.body.signature,
      pass: req.body.phone03,
      gym: req.body.gymname,
      gymid: req.body.gymid,
      active_date: req.body.active_date,
  		inactive_date: req.body.inactive_date
    });
    console.log(req.body)
    res.json(newMember);
  }
  catch (err) {
    console.log('in2')
    console.log(err)
    return res.status(400).json(err)
  }

});

//insert de dados-------------------------------->USE MYSQL TRIGGER
//router.post('/graduation', async (req, res) => {
  //try {
  //  await database.sync();
     //   const newgraduation = await Graduation.create({
    //  nm_member: req.body.nm_member,
   //   color: req.body.color,
    //  status: req.body.status,
   //   graduation_dt: req.body.graduation_dt,
    //  first_point: req.body.first_point,
    //  second_point: req.body.second_point,
    //  third_point: req.body.third_point,
    //  fourth_point: req.body.fourth_point,
     // lesson_after: req.body.lesson_after,
     // obs: req.body.obs,
     // gym: req.body.gymname
   // });
   //   console.log(req.body)
   // res.json(newgraduation);
  //}
 // catch (err) {
 //   return res.status(400).json(err)
 // }
//});

//read de dados------------------------------->
router.get('/info', async (req, res) => {
  const members = await Member.findAll({
    where: {
      status: "active"
    }
  }); //findAll findByPk

  res.json(members.length)
  
});

//read de dados------------------------------->
router.get('/paymentall', async (req, res) => {
  const members = await Pay.findAll({
  });   where: {
    division: 1
  }
  res.json(members)
});


//read de dados do pay------------------------------->
router.get('/paymentallexist', async (req, res) => {
  const members = await Pay.findAll({
    where: {
      year: req.body.year,
      month: req.body.month,
      GYM_ID: req.body.gymid
    }
  });
  res.json(members)
});



//read dos planos------------------------------->
router.get('/planget', async (req, res) => {
  const plans = await Plan.findAll({
  }); //findAll findByPk

  res.json(plans)

});

//List Alunos---------------------------------->
router.post('/list', async (req, res) => {
  var filter1 = req.body.opt1;
  var filter2 = req.body.opt2;

  if (filter1 == 'All') { //executar filtro em todos os registros
    let members = await Member.findAll();
    res.json(members)
  }

  else if (filter1 != 'teenagers' && filter1 != '' && filter2 != '') { //executar com dois filtros
    let members = await Member.findAll({
      where: {
        genero: filter1,
        plans: filter2
      }
    });
    res.json(members)
  }

  else if (filter1 == 'teenagers' && filter2 != '') { //executar com filtro para menores de 18 com o filtro do plano
    let members = await Member.findAll({
      where: {
        birthday_age: {
          [Op.lte]: 18,
        },
        plans: filter2
      }
    });
    res.json(members)
  }

  else if (filter1 == 'teenagers' && filter2 == '') { //executar com filtro para menores de 18 sem filtro do plano
    let members = await Member.findAll({
      where: {
        birthday_age: {
          [Op.lte]: 18,
        },
      }
    });
    res.json(members)
  }

  else if (filter1 != '') {
    let members = await Member.findAll({ //executar apenas com o primeiro filtro
      where: {
        genero: filter1,
      }
    });
    res.json(members)
  }

  else if (filter2 != '') {
    let members = await Member.findAll({ //executar apenas com o segundo filtro
      where: {
        plans: filter2,
      }
    });
    res.json(members)
  }

  else if (filter1 == '' && filter2 == '') {
    let members = await Member.findAll(); //executar sem os filtros, busca todos regitros do banco
    res.json(members);
  }

});

//List graduation---------------------------------->
router.post('/graduationlist', async (req, res) => {
  var filter1 = req.body.opt1;
  var filter2 = req.body.opt2;
let members = await Graduation.findAll();
  res.json(members);
});



//List Alunos Update---------------------------------->
router.post('/listUpdate', async (req, res) => {
 try{
  const members = await Member.update({
    nm_member: req.body.nm_member,
    birthday_year: req.body.birth1,
    birthday_month: req.body.birth2,
    birthday_day: req.body.birth3,
    birthday_age: req.body.age,
    genero: req.body.gender,
    adress_input: req.body.address,
    phone01: req.body.tel1,
    phone02: req.body.tel2,
    phone03: req.body.tel3,
    email: req.body.email,
    lang01: req.body.language,
    plans: req.body.plan,
    status: req.body.status,
    pass: req.body.pass,
  }, {
    where: {
      id: req.body.id,
    }
  });
  return res.json(members)
 } catch(err) {
   console.log(err)
  return res.status(400).json(err)
 }
});


//List Graduação Update---------------------------------->
router.post('/graduationUpdate', async (req, res) => {
  console.log('in')
  console.log(req.body)
 try{

  const members = await Graduation.update({
    color: req.body.color,
    status: req.body.status,
    graduation_dt: req.body.graduation_dt,
    first_point: req.body.first_point,
    second_point: req.body.second_point,
    third_point: req.body.third_point,
    fourth_point: req.body.fourth_point,
    lesson_after: req.body.lesson_after,
     obs:req.body.obs,
  }, {
    where: {
      nm_member_id: req.body.id,
    }
  });

 console.log(members)
  res.json(members)
 } catch(err) {
  return res.status(400).json(err)
 }
});


// Graduação Update da quantidade de aulas---------------------------------->
router.post('/graduationafter', async (req, res) => {
  console.log('in')
  console.log(req.body)
 try{
  const members = await Graduation.update({
    lesson_after: req.body.lesson_after
  }, {
    where: {
      nm_member_id: req.body.id,
    }
  });
  res.json(members)
 } catch(err) {
  return res.status(400).json(err)
 }
});

//rota para verificar graduação-------------------------------------------->
router.get('/lesson_after/:id', async (req, res) => {
  try{
   let index = req.params.id;
    const grau = await Graduation.findAll({
      where: { nm_member_id: index }
    });

    if (grau[0].lesson_after === "39") {
      await mailerGrau(grau[0].nm_member);
    };
    res.send("enviado");
  } catch(err) {
    return res.status(400).json(err)
  };

});


//list alunos delete------------------->
router.post('/listDelete', async (req, res) => {
  Member.destroy({ where: { id: req.body.id } })
  Graduation.destroy({ where: { nm_member_id: req.body.id } })
  Pay.destroy({ where: { nm_member_id: req.body.id } })
  res.json('deletado');
});

//gerar PDF inscrição
router.get('/pdf', async (req, response) => {
try{
  const countMax = await Member.findAll({
    attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'id']],
    raw: true,
  });
  const members = await Member.findAll({
    where: {
      id: countMax[0].id
    }
  });
  
  const client = await Client.findAll({
    where: {
      GYM_NAME: members[0].gym
    }
   });

  var obj = {
    'uuid': members[0].id.toString(),
    'nm_member': members[0].nm_member,
    'birthday': `${members[0].birthday_year}/${members[0].birthday_month}/${members[0].birthday_day}`,
    'genero': members[0].genero,
    'adress': members[0].adress_input,
    'phone': `0${members[0].phone01}-${members[0].phone02}-${members[0].phone03}`,
    'email': members[0].email,
    'language': members[0].lang01,
    'plan': members[0].plans,
    'signature': members[0].signature,
    'entryDate': new Intl.DateTimeFormat('ja-JP').format(members[0].createdAt),
    'gymname': members[0].gym
  };
console.log(obj)
  ejs.renderFile('./views/email.ejs', obj, async (err, html) => {
    if (err) {
      console.log("erro!!!!!")
    } else {
      pdf.create(html, { "orientation": "landscape", format: 'a10' })
        .toFile(`./historico/Ficha de Inscricao.pdf`, async (err, res) => {
          if (err) {
            console.log('erro')
          } else {
            //response.send(res)
            try {
              let memberEmail = await mailer(`./historico/Ficha de Inscricao.pdf`, obj.email, obj.nm_member, obj.language, client[0].LANGUAGE, client[0].EMAIL, obj.gymname);
              response.send(memberEmail);
            } catch (err) { console.log(err) }
          }
        });
      }
  });
} catch(err) {
  console.log(err)
 //return status(400).json(err)
}
 

});

//Rota para gerar pdf do calender
router.get('/pdf/calender', async (req, response) => {
  try {
    const newCalender = await Calender.findAll();
    await ejs.renderFile('./views/calender.ejs', {
      days: newCalender,
    }, async (err, html) => {
      if (err) {
        console.log("erro!!!!!", err)
      } else {
        pdf.create(html, { "orientation": "landscape" })
          .toFile(`./historico/teste.pdf`, async (err, res) => {
            if (err) {
              console.log('erro')
            } else {
              try {
                let a = await mailer(`./historico/teste.pdf`);
                response.send(a);
              } catch (err) { console.log(err) }
            }
          });
      }
    });
  }
  catch (err) { console.log(err) }
});

//Rota para atualizar DADOS do calendario
router.put('/calender', async (req, res) => {
    try {
      const newCalender = await Calender.update({
        GYM_ID: req.body.GYM,
        START_TIME: req.body.START,
        FINISH_TIME: req.body.FINISH,
        DESCRITION_1: req.body.DESC1,
        DESCRITION_2: req.body.DESC2,
        IMAGE: req.body.IMAGE,
        COLOR: req.body.COLOR
      }, {
        where: {
          DAY: req.body.DAY,
          LINE_NO: req.body.LINE
        }
      });
      console.log(req.body)
      res.json(newCalender)
    }
    catch (err) { console.log(err) }
});

//Rota para recuperar DADOS do calendario
router.get('/calenderteste', async (req, res) => {
  const newCalender = await Calender.findAll();
  res.json(newCalender)
});

//Rota para recuperar DADOS do calendario para o front do entrance
router.get('/calender/entrance', async (req, res) => {
  const newCalender = await Calender.findAll({
    where: { DAY: atualDay() }
  });
  res.json(newCalender)

  function atualDay() {
    //new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const japanStandardTime = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
   // const japantime = new Date(japanStandardTime)
    const japanweekeday = japanStandardTime.getDay()
    //console.log(japantime)
    console.log(japanweekeday)
     switch (japanweekeday) {
      case 0:
        return 'sunday';
      case 1:
        return 'monday';
      case 2:
        return 'tuesday';
      case 3:
        return 'wednesday';
      case 4:
        return 'thursday';
      case 5:
        return 'friday';
      case 6:
        return 'saturday';
      default:
        console.log('error..')
    };
  };

});

//Rota para registrar entradas da entrance
router.post('/registerEntrance', async (req, res) => {
  try {
    await database.sync();

    const newEntrance = await Entrance.create({
      LESSON_NAME: req.body.LESSON_NAME,
      LESSON_HOUR: req.body.LESSON_HOUR,
      MEMBER_ID: req.body.MEMBER_ID,
      GYM_ID: 1
    });

    res.json(newEntrance)
  } catch (err) {
    return res.status(400).json(err)
  };

});

//rota para verificar passe do aluno
router.post('/pass', async (req, res) => {
  const members = await Member.findAll({
    where: {
      pass: req.body.pass
    }
  });
  res.json(members)

});

//rota para pagamentos
router.get('/payment/:name/:gym_id/:plan', async (req, res) => {
  const countMax = await Member.findAll({
    attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'id']],
    raw: true,
  });
  var month = new Date().getMonth();
  var year = new Date().getFullYear();
  var param = req.params;

   //var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//  for (let i = (month - 1); i < arr.length; i++) {

  //  arr[i] = 1;
  //}

  await database.sync();
  let newPay = await Pay.create({
    nm_member_id: countMax[0].id,
    nm_member: param.name,
    year: year,
    month: month,
    division: 1,
    //mar: arr[2],
    //abr: arr[3],
    //may: arr[4],
  //  jun: arr[5],
  //  jul: arr[6],
  //  aug: arr[7],
  //sep: arr[8],
  //  oct: arr[9],
    //nov: arr[10],
    //dez: arr[11],
    obs: 0,
    plan: param.plan,
    GYM_ID: param.gym_id
  });


  res.json(newPay);
});

module.exports = router;


//bae

