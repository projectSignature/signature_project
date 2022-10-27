const express = require('express');
const router = express.Router();
const database = require('../db');
const Member = require('../schema/members');
const Client = require('../schema/clients');
const mailer = require('./sendMailer');
const pdf = require('html-pdf');
const ejs = require('ejs');
const { Op } = require('sequelize');

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
      REPRESENTATIVE: 'marrone doe',
      UNIQUE_CODE: 2,
      PASSWORD: '1234',
      ADRESS: 'marrone doe',
      TEL: 999999999,
      EMAIL: 'john.doe@gmail.com',
      SAVE_DAY: '12-85-22',
      STATUS: 'ativo'
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

    switch (code) {
      case '1':
        validationRes(primaryKey, name, code, gymname)
        break;
      case '2':
        validationRes(secondKey, name, code, gymname)
        break;
      default:
        console.log("eroor")
    };

    function validationRes(key, name, code, gymname) {
      if (key > 0) {
        res.json({
          status: 200,
          token: key,
          gym: gymname,
          number: { NAME: name, AUTHORITY: code },
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
      status: "ativo",
      signature: req.body.signature
    });
    console.log(req.body)

    res.json(newMember);
  }
  catch (err) {
    return res.status(400).json(err)
  }

});

//read de dados------------------------------->
router.get('/info', async (req, res) => {
  const members = await Member.findAll({
    where: {
      status: "ativo"
    }
  }); //findAll findByPk

  let createdAt = members[0].createdAt;
  let enrollmentDate = createdAt.toString().split(" ");
  let atualDate = new Date().getDate();

  res.json(members.length)
  /* res.send(enrollmentDate[2]); */
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

//List Alunos Update---------------------------------->
router.post('/listUpdate', async (req, res) => {

  var separateDate = req.body.birth;
  var separateTel = req.body.tel;

  const members = await Member.update({
    nm_member: req.body.nm_member,
    birthday_year: `${separateDate[0]}${separateDate[1]}${separateDate[2]}${separateDate[3]}`,
    birthday_month: `${separateDate[5]}${separateDate[6]}`,
    birthday_day: `${separateDate[8]}${separateDate[9]}`,
    birthday_age: req.body.age,
    genero: req.body.gender,
    adress_input: req.body.address,
    phone01: `${separateTel[1]}${separateTel[2]}${separateTel[3]}`,
    phone02: `${separateTel[5]}${separateTel[6]}${separateTel[7]}${separateTel[8]}`,
    phone03: `${separateTel[10]}${separateTel[11]}${separateTel[12]}${separateTel[13]}`,
    email: req.body.email,
    lang01: req.body.language,
    plan: req.body.plan,
    status: req.body.status,
  }, {
    where: {
      id: req.body.id,
    }
  });
  console.log(`${separateTel[5]}${separateTel[6]}${separateTel[7]}${separateTel[8]}`) //5-6 mês

  res.json(members)

});

//list alunos delete------------------->
router.post('/listDelete', async (req, res) => {
  Member.destroy({ where: { id: req.body.id } })
  res.json('deletado');
});

//gerar PDF------------------------------------->
router.get('/pdf', async (req, response) => {

  const count = await Member.count();
  const members = await Member.findAll({
    where: {
      id: count,
    }
  });

  var obj = {
    'nm_member': members[0].nm_member,
    'birthday': members[0].birthday_year + members[0].birthday_month + members[0].birthday_day,
    'genero': members[0].genero,
    'adress': members[0].adress_input,
    'phone': members[0].phone01 + members[0].phone02 + members[0].phone03,
    'email': members[0].email,
    'language': members[0].lang01,
    'plan': members[0].plans,
    'signature': members[0].signature
  };

  ejs.renderFile('./email.ejs', obj, (err, html) => {
    if (err) {
      console.log("erro!!!!!")
    } else {
      pdf.create(html, { "orientation": "portrait" }).toFile(`./historico/${obj.nm_member}.pdf`, async (err, res) => {
        if (err) {
          console.log('erro')
        } else {
          console.log(res)
          try {
            let a = await mailer(`./historico/${obj.nm_member}.pdf`);
            response.send(a);
          } catch (err) { console.log(err) }
        }
      });
    }
  });

  response.send('salvo')

});

module.exports = router;


//bae

