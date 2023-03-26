//CONFIGS
const express = require('express');
const router = express.Router();
const database = require('../db');

//SCHEMAS
const Member = require('../schema/members');
const Parent = require('../schema/parents');
const Client = require('../schema/clients');
const Calender = require('../schema/calender');
const Entrance = require('../schema/registerEntrance');
const Plan = require('../schema/plans');
const Graduation = require('../schema/graduation');
const mailerGrau = require('./sendGrau');
const mailer = require('./sendMailer');
const Pay = require('../schema/payment');
const MemberCount = require('../schema/member_count');
const Finencepay = require('../schema/finencepays');
const Finence_category = require('../schema/finence_category');
const Expense = require('../schema/expenses');
const RestClient = require('../schema/rest_clients');
const RestMenu = require('../schema/restmenu');

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
    res.json(newClient);

  } catch (err) {
    return res.status(400).json(err)
  }

});

//clients data get------------------------->
router.get('/clientesDados/:id', async (req, res) => {
  try {
  const members = await Client.findAll({
    where: {
      id: req.params.id
    }
  }); //findAll findByPk

  res.json(members)
} catch (err) {
  res.json(err)
  console.log(err)
}
});

router.post('/ParentsCreate', async (req, res) => {
    try {
  var param = req.body;
  let newParents = await Parent.create({
    nm_member_id: param.id,
    family_name: param.name,
    birthday: param.birthday,
    gender: param.gender,
    birthday_age: param.age,
    gymid: param.gymid,
  });
   res.json(newParents);
   }
  catch (err) {
    return res.status(400).json(err)
    console.log(err)
  }
});

//rotas de testes------------------------------>
router.post('/clientTest', async (req, res) => {
  try {
   // await database.sync();

    const newClient = await Client.create({
      GYM_NAME: req.body.gymname,
      REPRESENTATIVE: req.body.rep,
      UNIQUE_CODE: 5,
      PASSWORD: req.body.pass,
      ADRESS: req.body.end,
      TEL: req.body.tel,
      EMAIL: req.body.email,
      SAVE_DAY: req.body.save,
      STATUS: 'ativo',
      LANGUAGE: req.body.language
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

// 支出履歴の登録
router.post('/expenseHistory', async (req, res) => {
  try {
    const newClient = await Expense.create({
      category: req.body.category,
      expense_id: req.body.id,
      GYM_ID: req.body.gymid,
      NAME: req.body.name,
      KAKAKU: req.body.value,
      COLOR: req.body.color,
      KUBUN: req.body.kubun,
      STATUS: req.body.status,
      Date: req.body.date,
      note: req.body.note
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/expenseHistoryupdate', async (req, res) => {
  try {
    const newClient = await Expense.update({
      category: req.body.category,
      expense_id: req.body.id,
      GYM_ID: req.body.gymid,
      NAME: req.body.name,
      KAKAKU: req.body.value,
      COLOR: req.body.color,
      KUBUN: req.body.kubun,
      STATUS: req.body.status,
      Date: req.body.date,
      note: req.body.note
    },{
        where: {
          id: req.body.upid
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});


//支出項目の登録------------------------------>
router.post('/createexpenses', async (req, res) => {
  try {
    const newExpense = await Finencepay.create({
      GYM_ID: req.body.id,
      CATEGORY: req.body.category,
      NAME: req.body.name,
      VALUE:req.body.value,
      COLOR: req.body.color,
      KUBUN: req.body.kubun,
      Date: req.body.date
    });
    res.json(newExpense);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

//rotas de testes------------------------------>
router.post('/createCategory', async (req, res) => {
  try {
  //  await database.sync();
    const newClient = await Finence_category.create({
      GYM_ID: req.body.id,
      CATEGORY: req.body.category,
      KUBUN: req.body.kubun,
      COLOR: req.body.color
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

//メンバー数カウントGET------------------------->
router.get('/membersCount', async (req, res) => {
  try {
  const memberscount = await MemberCount.findAll({
    where: {
      GYM_ID: req.query.id
    }
  }); 
  res.json(memberscount)
} catch (err) {
  res.json(err)
}
});

//支出の履歴取得------------------------->
router.get('/expensesHistoryGet', async (req, res) => {
  try {
    const { Op } = require('sequelize')
  const clients = await Expense.findAll({
    where: {
      GYM_ID: req.query.id,
       Date :{
         [Op.gt]:req.query.getdat
       } ,
       kubun: req.query.kubun
    }
  });
  res.json(clients)
} catch (err) {
  res.json(err)
}
});

//支出のアイテム名をGET------------------------->
router.get('/finenceGet', async (req, res) => {
  try {
  const memberscount = await Finencepay.findAll({
    where: {
      GYM_ID: req.query.id,
      KUBUN:req.query.kubun
    }
  });
  res.json(memberscount)
} catch (err) {
  res.json(err)
}
});

//支出のアイテム名をGET------------------------->
router.get('/finenceCategoryGet', async (req, res) => {
  try {
  const memberscount = await Finence_category.findAll({
    where: {
      GYM_ID: req.query.id,
      KUBUN:req.query.kubun
    }
  });
  res.json(memberscount)
} catch (err) {
  res.json(err)
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
  try {
    let name = clients[0].REPRESENTATIVE;
    let code = clients[0].UNIQUE_CODE;
    var gymname = clients[0].GYM_NAME;
    var id = clients[0].id
    var language = clients[0].LANGUAGE
    switch (code) {
      case '1':
        validationRes(primaryKey, name, code, gymname, id, language)
        break;
      case '2':
        validationRes(secondKey, name, code, gymname, id, language)
        break;
      default:
        console.log("eroor")
    };

    function validationRes(key, name, code, gymname, id, language) {
      if (key > 0) {
        res.json({
          status: 200,
          token: key,
          gym: gymname,
          language: language,
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

router.get('/trygyminfo', async (req, res) => {
  const members = await Member.findAll({
    where: {
      status: "active",
      gymid: req.query.id,
    }
  });
  res.json(members)
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
      status: "active",
      signature: req.body.signature,
      pass: req.body.phone03,
      gym: req.body.gymname,
      gymid: req.body.gymid,
      active_date: req.body.active_date,
  		inactive_date: req.body.inactive_date
    });
    res.json(newMember);
  }
  catch (err) {
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
    where: {
    division: 1
  }
  });   
  res.json(members)
});

//read de dados do pay------------------------------->
router.post('/getpaymentAll', async (req, res) => {
   try{
  const members = await Pay.findAll({
    where: {
      year: req.body.year,
      GYM_ID: req.body.gymid
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});


//get de dados do pay------------------------------->
router.get('/gymgetpaymentAll', async (req, res) => {  //req.query
   try{
  const paymentdata = await Pay.findAll({
 where: {
     year: req.query.year,
     GYM_ID: req.query.id
    }
  });
  res.json(paymentdata)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

//get dos planos------------------------------->
router.get('/gymplanget', async (req, res) => {
  try{
    const plans = await Plan.findAll({
      where:{
        GYM_ID: req.query.id
      }
    }); //findAll findByPk
    res.json(plans)
  }catch(err) {
    console.log(err)
   return res.status(400).json(err)
  }
});
//get dos membros da academia------------------------------->
router.get('/gymmemberlist', async (req, res) => {
  console.log('in')
  console.log(req.query.id)
  try{
    let memberslist = await Member.findAll({
      where:{
        gymid: req.query.id
      }
    }); //findAll findByPk
    res.json(memberslist)
  }catch(err) {
    console.log(err)
   return res.status(400).json(err)
  }
});

//checar se existe dados do request------------------------------->
router.get('/gympaymonthcheck', async (req, res) => {
  try{
    let chechanswer = await Pay.findAll({
      where:{
        year: req.query.year,
        month: req.query.month,
        nm_member_id: req.query.id
      }
    }); //findAll findByPk
    res.json(chechanswer)
  }catch(err) {
    console.log(err)
   return res.status(400).json(err)
  }
});

//read de dados------------------------------->
router.post('/family', async (req, res) => {
  try{
  const members = await Parent.findAll({
    where: {
      nm_member_id: req.body.id
    }
  }); //findAll findByPk

  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

//read de dados------------------------------->
router.get('/newfamily', async (req, res) => {
  try{
  const members = await Parent.findAll({
    where: {
      nm_member_id: req.query.id
    }
  }); //findAll findByPk
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});


//Rota para recuperar DADOS do calendario para o front do entrance
router.get('/calender/gymentrance', async (req, res) => {
  const newCalender = await Calender.findAll({
    where: { 
      DAY: atualDay(),
      GYM_ID:req.query.id
     }
  });
  res.json(newCalender)
  function atualDay() {
    //new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const japanStandardTime = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
   // const japantime = new Date(japanStandardTime)
    const japanweekeday = japanStandardTime.getDay()
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
    };
  };
});


//update do familiar------------------------------->
router.post('/familyupdate', async (req, res) => {
  try{
  const members = await Parent.update({
    family_name:req.body.name,
    birthday:req.body.birth,
    gender:req.body.gender,
    birthday_age:req.body.age
  }, {
    where: {
      id: req.body.id
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400)
}
});

//update dos dados do membro na graduação------------------------------->
router.post('/graduationmemberupdate', async (req, res) => {
  try{
  const members = await Graduation.update({
    nm_member:req.body.name,
    status:req.body.status,
  }, {
    where: {
      nm_member_id: req.body.id
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

//update do pass------------------------------->
router.post('/passupdate', async (req, res) => {
  try{
  const members = await Client.update({
    PASSWORD:req.body.pass,
  }, {
    where: {
      id: req.body.id
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

//read de dados do pay------------------------------->
router.post('/paymentallexist', async (req, res) => {
   try{
  const members = await Pay.findAll({
    where: {
      year: req.body.year,
      month: req.body.month,
      GYM_ID: req.body.gymid
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

//create de dados do pay------------------------------->
router.post('/createpayment', async (req, res) => {
   try{
       let newPay = await Pay.create({
         nm_member_id: req.body.id,
         nm_member: req.body.name,
         year: req.body.year,
         month: req.body.month,
         division: req.body.division,
         obs: 0,
         plan: req.body.plans,
         GYM_ID: req.body.gymid,
         plan_value: req.body.valor
        });  
     res.json(newPay)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});



//create de dados do pay------------------------------->
router.post('/createplans', async (req, res) => {
   try{
       let newPlan = await Plan.create({
         GYM_ID: req.body.id,
         PLANS_NAME: req.body.name,
         PLAN_VALOR: req.body.valor,
         PLAN_KUBUN: req.body.kubun,
         PLAN_DISCRITION1: req.body.dis1,
         PLAN_DISCRITION2: req.body.dis2,
         PLAN_DISCRITION3: req.body.dis3,
         PLAN_DISCRITION4: req.body.dis4,
         PLAN_DISCRITION5: req.body.dis5,
         CONTROL_NAME: req.body.controlname,
         AGE: req.body.age,
        });
     res.json(newPlan)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

//read dos planos------------------------------->
router.get('/planget', async (req, res) => {
  const plans = await Plan.findAll({
  }); //findAll findByPk

  res.json(plans)

});

//pay table Update---------------------------------->
router.post('/paymentUpdate', async (req, res) => {
 try{
  const members = await Pay.update({
    division:req.body.division
  }, {
    where: {
      nm_member_id: req.body.id,
      year: req.body.year,
      month: req.body.month,
    }
  });
  return res.json(members)
 } catch(err) {
   console.log(err)
  return res.status(400).json(err)
 }
});

//client  Update---------------------------------->
router.post('/clientUpdate', async (req, res) => {
 try{
  const members = await Client.update({
    GYM_NAME:req.body.name2,
    REPRESENTATIVE:req.body.name1,
    TEL:req.body.tel,
    EMAIL:req.body.email,
    LANGUAGE:req.body.language  
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

//client  Age Update---------------------------------->
router.post('/memberAgeUpdate', async (req, res) => {
 try{
  const members = await Member.update({
    birthday_age:req.body.age,
  }, {
    where: {
      id: req.body.id,
    }
  });
  return res.json(members)
 } catch(err) {
  return res.status(400).json(err)
 }
});


//client  Update---------------------------------->
router.post('/planUpdate', async (req, res) => {
 try{
  const members = await Plan.update({
    PLANS_NAME:req.body.name,
    PLAN_VALOR:req.body.pvalue,
    PLAN_KUBUN:req.body.divi,
    PLAN_DISCRITION1:req.body.dis1,
    PLAN_DISCRITION2:req.body.dis2,
    PLAN_DISCRITION3:req.body.dis3,
    PLAN_DISCRITION4:req.body.dis4,
    PLAN_DISCRITION5:req.body.dis5,
    CONTROL_NAME:req.body.controlname,
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

//checar se existe os dados do mês------------------------------->
router.post('/paymonthcheck', async (req, res) => {
   try{
  const members = await Pay.findAll({
    where: {
      year: req.body.year,
      month: req.body.month,
      nm_member_id: req.body.id
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
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

//昇格管理テーブルを全セレクト------------------------------->
router.get('/gymgraduationlist', async (req, res) => {
  try{
    let graduationlist = await Graduation.findAll({
      where:{
        GYM_ID: req.query.id,
      }
    }); //findAll findByPk
    res.json(graduationlist)
  }catch(err) {
    console.log(err)
   return res.status(400).json(err)
  }
});

//未支払い者を支払い管理テーブルセレクト------------------------------->
router.get('/gympaymentall', async (req, res) => {
  const paymentlist = await Pay.findAll({
    where: {
    division: 1,
    GYM_ID: req.query.id,
  }
  });
  res.json(paymentlist)
});

//アクティブメンバー数をセレクト------------------------------->
router.get('/gyminfo', async (req, res) => {
  const members = await Member.findAll({
    where: {
      status: "active",
      gymid: req.query.id,
    }
  }); //findAll findByPk
  res.json(members)
});

//カレンダーテーブルから全レッスン取得
router.get('/gymcalenderGet', async (req, res) => {
  const newCalender = await Calender.findAll({
    where: {
      GYM_ID: req.query.id,
    }
  });
  res.json(newCalender)
});


//入場履歴の照会------------------------------->
router.get('/gymEntrancehistory', async (req, res) => {
    const { Op } = require('sequelize')
  const members = await Entrance.findAll({
    where: {
      LESSON_DATE: {
        [Op.gt]:req.query.entrancedate        
      },
      GYM_ID:req.query.id
    }
  }); //findAll findByPk
  res.json(members)
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
  res.json(members)
 } catch(err) {
  return res.status(400).json(err)
 }
});

  //ダッシュボードから支払いの更新------------------------------------------>
router.post('/payUpdatedashbord', async (req, res) => {
 try{
  const members = await Pay.update({
    division: '2'
  }, {
    where: {
      id: req.body.id,
    }
  });
  res.json(members)
 } catch(err) {
   res.status(400).json(err)
 }
});

// Graduação Update da quantidade de aulas---------------------------------->
router.post('/graduationafter', async (req, res) => {
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


  //支出カテゴリーのアップデート------------------------------------------>
router.post('/categoryupdate', async (req, res) => {
try{
const members = await Finence_category.update({
  CATEGORY: req.body.category,
  KUBUN:'1',
  COLOR:req.body.color,
  
}, {
  where: {
    id: req.body.id,
  }
});
res.json(members)
} catch(err) {
 res.status(400).json(err)
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
  Parent.destroy({ where: { nm_member_id: req.body.id } })
  res.json('deletado');
});

//支出カテゴリーを削除します------------------->
router.post('/destroyCategory', async (req, res) => {
  Finence_category.destroy({ where: { id: req.body.id } })
  try {
    const newCalender = await Expense.update({
      category: 0,
      COLOR: '#8B4513'
    }, {
      where: {
        category: req.body.id,
      }
    });
    res.json(newCalender)
  }
  catch (err) { console.log(err) }

});

//支出項目を削除します------------------->
router.post('/FinencepayCategory', async (req, res) => {
  Finencepay.destroy({ where: { id: req.body.id } })
  try {
    const newCalender = await Expense.update({
      category: '0',
      COLOR: '#8B4513',
      expense_id: '0'
    }, {
      where: {
        expense_id: req.body.id,
      }
    });
    res.json(newCalender)
  }
  catch (err) { console.log(err) }

});

router.post('/familyDelete', async (req, res) => {
  Parent.destroy({ where: { id: req.body.id } })
  res.json('deletado');
})


router.post('/planDelete', async (req, res) => {
  Plan.destroy({ where: { id: req.body.id } })
  res.json('deletado');
})

router.post('/expenseHistoryDelete', async (req, res) => {
  Expense.destroy({ where: { id: req.body.id } })
  res.json('deletado');
})

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
  ejs.renderFile('./views/email.ejs', obj, async (err, html) => {
    if (err) {
      console.log("erro!!!!!")
    } else {
      pdf.create(html, { "orientation": "landscape", format: 'a10' })
        .toFile(`./historico/Ficha de Inscricao.pdf`, async (err, res) => {
          if (err) {
            console.log(err)
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
        IMAGE:req.body.IMG,
        GRADUATION_FLUG: req.body.flug,
        COLOR: req.body.COLOR
      }, {
        where: {
          DAY: req.body.DAY,
          LINE_NO: req.body.LINE
        }
      });
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
      GYM_ID: req.body.GYM_ID,
      LESSON_DATE: req.body.LESSON_DATE,
      LESSON_DAY: req.body.LESSON_DAY,
    });
    console.log(res)
    res.json(newEntrance)
  } catch (err) {
    console.log(err)
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

//rota para pegar o history das aulas
router.post('/entrancehistory', async (req, res) => {
  const { Op } = require('sequelize')
  const members = await Entrance.findAll({
      where: {
      LESSON_DATE: {
        [Op.gt]:req.body.entrancedate        
      }
    }
  });
  res.json(members)
});

//rota para pagamentos
router.get('/payment/:name/:gym_id/:plan/:valor', async (req, res) => {
  const countMax = await Member.findAll({
    attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'id']],
    raw: true,
  });
  await console.log(countMax)
  var month = new Date().getMonth() +1;
  var year = new Date().getFullYear();
  var param = req.params;
  await database.sync();
    await console.log('in2')
  let newPay = await Pay.create({
    nm_member_id: countMax[0].id,
    nm_member: param.name,
    year: year,
    month: month,
    division: 1,
    obs: 0,
    plan: param.plan,
    GYM_ID: param.gym_id,
    plan_value: param.valor,
  });
  res.json(newPay);
});

//rota para criar dados dos parentes
router.get('/parents/:name/:birthday/:gender/:age/:gymid', async (req, res) => {
    try {
  const countMax = await Member.findAll({
    attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'id']],
    raw: true,
  });
  var param = req.params;
  let newParents = await Parent.create({
    nm_member_id: countMax[0].id,
    family_name: param.name,
    birthday: param.birthday,
    gender: param.gender,
    birthday_age: param.age,
    gymid: param.gymid,
  });
   return res.status(200)
   }
  catch (err) {
    return res.status(400).json(err)
    console.log(err)
  }
});

router.post('/newParentsCreate', async (req, res) => {
    try {
      const countMax = await Member.findAll({
        attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'id']],
        raw: true,
      });
  var param = req.body;
  let newParents = await Parent.create({
    nm_member_id: countMax[0].id,
    family_name: param.name,
    birthday: param.birthday,
    gender: param.gender,
    birthday_age: param.age,
    gymid: param.gymid,
  });
   return res.json(newParents)
   }
  catch (err) {
    return res.status(400).json(err)
    console.log(err)
  }
});

//Rotas para o app do rest------------------------------------------------------>
/////////////////////////////////////////////////////////////////////////////////

//rotas de testes------------------------------>
router.post('/newMemberRoots', async (req, res) => {
  try {
  //  await database.sync();
    const newClient = await RestClient.create({
      id: req.body.id,
      name: req.body.name,
      phone: req.body.phone,
      post: req.body.post,
      adress: req.body.adress,
      password:req.body.pass,
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

//router of login rest member----------------------------->
router.post('/authClients', async (req, res) => {
  const [numbers, password] = [req.body.numbers, req.body.password];
  const [primaryKey, secondKey] = [1234, 567]
  try {
  const clients = await RestClient.findAll({
    where: {
      phone: numbers,
      password: password
    }
  });
  console.log(clients)
  if(clients.length==0){
    res.json({ message: 'internal error' })
  }else{
    res.json({
         status: 200,
         name: clients[0].name,
         phone: clients[0].phone,
         post: clients[0].post,
         id: clients[0].id,
         adress: clients[0].adress,
          });
  }
} catch (err) {
  res.json({ message: 'internal error' })
}
});



module.exports = router;


//bae

