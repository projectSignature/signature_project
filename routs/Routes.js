//CONFIGS
const express = require('express');
const router = express.Router();
const database = require('../db');
const credentials = require('./credentials');
//const cheerio = require('cheerio');
//const axios = require('axios');
const AWS = require('aws-sdk');


//SCHEMAS
const Member = require('../schema/members');
const Parent = require('../schema/parents');
const myClient = require('../schema/clients');
const Calender = require('../schema/calender');
const Entrance = require('../schema/registerEntrance');
const Plan = require('../schema/plans');
const Graduation = require('../schema/graduation');
const mailerGrau = require('./sendGrau');
const mailer = require('./sendMailer');
const restaurant = require('./contactRestaurant');
const Pay = require('../schema/payment');
const MemberCount = require('../schema/member_count');
const Finencepay = require('../schema/finencepays');
const Finence_category = require('../schema/finence_category');
const Expense = require('../schema/expenses');
const RestClient = require('../schema/rest_clients');
const RestMenu = require('../schema/restmenu');
const Historyorder = require('../schema/historyorder');
const Restadmin = require('../schema/restadmins');
const Costrest = require('../schema/costrests');
const Rest_maneger = require('../schema/rest_manegers')
const CloseCaixa = require('../schema/closecaixas');
const Costcategory = require('../schema/costCategory');
const Dakoku = require('../schema/dakoku');
const Iventory = require('../schema/inventorys');
const Suppliers = require('../schema/m_suppliers');
const { encryptPassword, verifyPassword } = require('../libs/encypt/password-crypto'); // comparePasswordをverifyPasswordに変更



//LIBS
const pdf = require('html-pdf');
const ejs = require('ejs');
const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Armazenar em memória
require('dotenv').config(); // Carrega as variáveis do arquivo .env

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT),
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
  region: process.env.DO_SPACES_REGION,
});

//middleware
router.use(function timelog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/KetsugouTestcostRestGet', async (req, res) => {
  try {
   const costrestsWithSuppliers = await Costrest.findAll({
     include: [
       {
         model: Suppliers,
         as: 'supplier',
         attributes: ['name_jp'], // 取得する列を指定
       },
       {
         model: Costcategory,
         as: 'kamokus',
         attributes: ['name_jp'], // AnotherTableテーブルから取得する列を指定
       },
     ],
      where: {
        // ここに条件を追加
        // 例: idが1のものだけ取得する場合
        category: req.query.category,
      },
   });
res.json(costrestsWithSuppliers)
   // return costrestsWithSuppliers;
 } catch (error) {
   console.error('Error getting costrests with suppliers:', error);
   throw error;
 }
});

router.get('/getsupplires', async (req, res) => {
  try {
  const supplireget = await Suppliers.findAll({
  });
  res.json(supplireget)
} catch (err) {
  res.json(err)
  console.log(err)
}
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

router.get('/dakokusget', async (req, res) => {
  try {
  const dakokus = await Dakoku.findAll({
    where: {
      worker_id: req.query.id,
      workday: req.query.dt
    }
  });
  res.json(dakokus)
} catch (err) {
  res.json(err)
  console.log(err)
}
});

//rotas de testes------------------------------>
router.get('/client', async (req, res) => {
  try {
    await database.sync();

    const newClient = await myClient.create({
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
  const members = await myClient.findAll({
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

router.post('/updateorderHistory', async (req, res) => {
  try {
    console.log(req.body)
    const newClient = await Historyorder.update({
      menu_id: req.body.d1,
      menu_child_id: req.body.d2,
      menu_value: req.body.d3,
      quantity_menu: req.body.d4,
      opt1:req.body.d6,
      opt2:req.body.d7,
      opt3:req.body.d8,
      opt4:req.body.d9,
      total_amount:req.body.d10
    },{
        where: {
          id: req.body.d5
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/addnewzaiko', async (req, res) => {
    try {
  let newParents = await Iventory.create({
    rest_id:0,
    name:req.body.d0,
    quantity:req.body.d2 ,
    cust: req.body.d3,
    updt: req.body.d6,
    categorys: req.body.d1,
    mercado: req.body.d4,
    kijun: req.body.d5,
    tani:req.body.d7,
    suplires_id:req.body.d8
  });
   res.json(newParents);
   }
  catch (err) {
     console.log(err)
    return res.status(400).json(err)

  }
});

router.post('/updatefinaldakoku', async (req, res) => {
  try {
    const newClient = await Dakoku.update({
      fn: req.body.d2
    },{
        where: {
          id: req.body.d1
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/dakokuupdt', async (req, res) => {
  try {
    const newClient = await Dakoku.update({
      st: req.body.d2
    },{
        where: {
          id: req.body.d1
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/updatasOrderslist', async (req, res) => {
  try {
    const newClient = await Historyorder.update({
      paykubun: req.body.d1,
      pickUp_way: req.body.d0,
    },{
        where: {
          id: req.body.ids
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});


router.get('/ordergetstatusyet', async (req, res) => {
  try {
  const clients = await Historyorder.findAll({
    where: {
      status: 0,
    }
  });
    res.json({
         clients
    })
} catch (err) {
  res.json({ message: 'internal error' })
}
});

router.post('/updateRestMenus', async (req, res) => {
  try {
    const newClient = await RestMenu.update({
      status: req.body.d1
    },{
        where: {
          id: req.body.d2
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/editsmenus', async (req, res) => {
  try {
     const newClient = await RestMenu.update({
      menu_name_0:req.body.d0,
      menu_name_1:req.body.d1,
      menu_name_2:req.body.d2,
      menu_value:req.body.d3,
      control_name:req.body.d4,
      bbq_kubun:req.body.d5,

    },{
        where: {
          id:req.body.d6
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.get('/gategorycostGet', async (req, res) => {
  try {
  const clients = await Costcategory.findAll({
  });
    res.json({
         clients
    })
} catch (err) {
  console.log(err)
  res.json({ message: 'internal error' })
}
});

router.get('/gategorycostGet2', async (req, res) => {
  try {
    console.log('haiterukedo2')
  const clients = await Iventory.findAll({
  });
    res.json({
         clients
    })
} catch (err) {
  console.log(err)
  res.json({ message: 'internal error' })
}
});

router.post('/changezaiko', async (req, res) => {
  try {
      const newClient = await Iventory.update({
        quantity: req.body.d0
      },{
          where: {
            id: req.body.d1
          }
      });
      res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/changezaikobyorderFinish', async (req, res) => {
  try {
    const quantityChange = parseInt(req.body.d0); // req.body.dを数値に変換
    // Iventoryの該当レコードを取得
    const inventoryRecord = await Iventory.findOne({
      where: {
        id: req.body.d1
      }
    });
    if (!inventoryRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    // quantityを計算して更新
    const newQuantity = inventoryRecord.quantity + quantityChange;
    // Iventoryを更新
    const updatedInventory = await Iventory.update(
      { quantity: newQuantity },
      { where: { id: req.body.d1 } }
    );

    res.json({ success: true, newQuantity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


//レストアプリの支出追加ルート------------------------------>
router.post('/createCostRest', async (req, res) => {
  try {
    console.log(req.body.d5)//'2024-02-20'
    const newClient = await Costrest.create({
      rest_id: req.body.d1,
      worker_id: req.body.d2,
      cost_id: req.body.d3,
      amount: req.body.d4,
      payday: req.body.d5,
      memo: req.body.d6,
      paykubun: req.body.d7,
      status: req.body.d8,
      seq:req.body.d9,
      suppliers_id:req.body.d10,
      checked_kubun:req.body.d11,
      category:req.body.d12
    });
    console.log(newClient.toJSON());
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/updatecostrest', async (req, res) => {
  try{
      const newClient = await Costrest.update({
        status: req.body[i].status
      },{
          where: {
            id: req.body.id
          }
      });
    return res.status(200).json('OK')
  }catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }

});

router.post('/updatechecked_kubun', async (req, res) => {
  try{
      const newClient = await Costrest.update({
        checked_kubun: req.body.kubun
      },{
          where: {
            id: req.body.id
          }
      });
    return res.status(200).json('OK')
  }catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }

});

router.post('/updatecostfluxo', async (req, res) => {
  try{
      const newClient = await Costrest.update({
        payday: req.body.d1,
        amount: req.body.d2,
        cost_id:req.body.d3,
        memo:req.body.d4,
        paykubun:req.body.d5,
        suppliers_id:req.body.d6
      },{
          where: {
            id: req.body.id
          }
      });
    return res.status(200).json('OK')
  }catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }

});

router.post('/destroycost', async (req, res) => {

  try {
    Costrest.destroy({ where: { id: req.body.id } })
    return res.status(200).json('OK')
  }
  catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }

});

router.post('/dakokuistfinaldata', async (req, res) => {
  try {
    const newClient = await Dakoku.create({
      worker_id: req.body.d1,
      fn: req.body.d2,
      workday: req.body.d3
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/dakokuistdata', async (req, res) => {
  try {
    const newClient = await Dakoku.create({
      worker_id: req.body.d1,
      st: req.body.d2,
      workday: req.body.d3
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});


router.post('/updateBBQmenus', async (req, res) => {
  try {
    let bbqkubun = 0
    if(req.body.d1==1){
      bbqkubun = 1
    }
    const newClient = await RestMenu.update({
      status: bbqkubun
    },{
        where: {
          bbq_kubun: 1
        }
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});





router.post('/updateAllmenus', async (req, res) => {
  try{
    for(let i=0;i<req.body.length;i++){
      const newClient = await RestMenu.update({
        status: req.body[i].status
      },{
          where: {
            id: req.body[i].id
          }
      });
    }
    return res.status(200).json('OK')
  }catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }

});

//レストアプリの収出テーブルから取得------------------------->
router.get('/costRestGet', async (req, res) => {
  try {
  const members = await Costrest.findAll({
    where: {
      rest_id: req.query.id
    }
  }); //findAll findByPk
  res.json(members)
} catch (err) {
  res.json(err)
  console.log(err)
}
});

router.get('/serchcosts', async (req, res) => {
  try {
  if(req.query.costid!=0){
    const costs = await Costrest.findAll({
      where: {
        rest_id: req.query.id,
        cost_id: req.query.costid,
        payday :{
          [Op.between]:[req.query.stdt,req.query.fndt]
        }
      }
    });
    res.json(costs)
  }else{
    const costs = await Costrest.findAll({
      where: {
        rest_id: req.query.id,
        payday :{
          [Op.between]:[req.query.stdt,req.query.fndt]
        }
      }
    });
    res.json(costs)
  }
} catch (err) {
  res.json(err)
  console.log(err)
}
});

router.get('/serchsyunyuu', async (req, res) => {
  try {
    const costs = await Historyorder.findAll({
      where: {
        rest_id: req.query.id,
        pickUp_day :{
          [Op.between]:[req.query.stdt,req.query.fndt]
        }
      }
    });
    res.json(costs)
    } catch (err) {
      res.json(err)
      console.log(err)
    }
});

router.get('/serchcostsidselects', async (req, res) => {
  try {
    const costs = await Costrest.findAll({
      where: {
        id: req.query.id
      }
    });
    res.json(costs)
} catch (err) {
  res.json(err)
  console.log(err)
}
});

router.post('/createcaixadata', async (req, res) => {
  try {
    const newClient = await CloseCaixa.create({
      rest_id: req.body.d1,
      p_day: req.body.d2,
      start: req.body.d3,
      crete_id:req.body.d4,
      demae:0,
      uber:0,
      finel_id:0,
      squere:0,
      final:0
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.get('/caixaCloseGet', async (req, res) => {
  try {
    console.log(req.query.dt)
    console.log(req.query.id)
  const caixa = await CloseCaixa.findAll({
    where: {
      p_day: req.query.dt,
      rest_id:req.query.id
    }
  }); //findAll findByPk
  res.json(caixa)
} catch (err) {
  res.json(err)
  console.log(err)
}
});
//update do caixa history------------------------------->
router.post('/caixaupdates', async (req, res) => {
  try{
  const members = await CloseCaixa.update({
    finel_id:d0,
    uber:d1,
    squere:d2,
    demae:d3,
    final:d4,
    obs:d5
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

//rotas de testes------------------------------>
router.post('/clientTest', async (req, res) => {
  try {
   // await database.sync();

    const newClient = await myClient.create({
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
router.post('/authRestmember', async (req, res) => {
  try {
      const [numbers, password] = [req.body.numbers, req.body.password];
      const clients = await Restadmin.findAll({
        where: {
          adress: numbers,
          password: password
        }
      });
    let name = clients[0].rest_id;
    let code = clients[0].worker_name;
    var gymname = clients[0].status;
    res.json(clients)
  } catch (err) {
    res.json({ message: 'internal error' })
  }

});

router.get('/getworkernamerest', async (req, res) => {
  try {
      const clients = await Restadmin.findAll({
        where: {
          id:req.query.id
        }
      });
    res.json(clients)
  } catch (err) {
    res.json({ message: 'internal error' })
  }

})

//autenticação de usuario------------------------>
router.post('/auth', async (req, res) => {
  const [numbers, password] = [req.body.numbers, req.body.password];
  const [primaryKey, secondKey] = [1234, 567]
  const clients = await myClient.findAll({
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
  try{
    const newCalender = await Calender.findAll({
      where: {
        DAY: atualDay(),
        GYM_ID:4
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
  }catch(e){
    console.log(e)
  }

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

router.post('/updatehistoryStatus', async (req, res) => {
  try{
  const members = await Historyorder.update({
    status:req.body.status
  }, {
    where: {
      id:req.body.d1
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});
router.post('/updatehistoryUtenStatus', async (req, res) => {
  try{
  const members = await Historyorder.update({
    cutlery:req.body.status
  }, {
    where: {
      id:req.body.id
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

router.post('/updatehistoryprapareStatus', async (req, res) => {
  try{
  const members = await Historyorder.update({
    prepare_status:req.body.status
  }, {
    where: {
      id:req.body.d1
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

router.post('/updatehistorypayed', async (req, res) => {
  try{
  const members = await Historyorder.update({
    pay_status:req.body.status
  }, {
    where: {
      id:req.body.d1
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
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
  const members = await myClient.update({
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
  const members = await myClient.update({
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

router.post('/updatehistoryPayStatus', async (req, res) => {
  try{
  const members = await Historyorder.update({
    paykubun:req.body.status
  }, {
    where: {
      id:req.body.id
    }
  });
  res.json(members)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

router.post('/updatehistoryPicupStatus', async (req, res) => {
  try{
  const members = await Historyorder.update({
    pickUp_way:req.body.status
  }, {
    where: {
      id:req.body.id
    }
  });
  res.json(members)
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


//rota para enviar email de contacto-------------------------------------------->
router.post('/restaurantContact', async (req, res) => {
  try{
      await restaurant(req.body.name,req.body.tel,req.body.email,req.body.mens);
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

  const client = await myClient.findAll({
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
  try{
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
  }catch(e){
    console.log(e)
  }
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

//rest app menu Get------------------------>
router.get('/menuGet', async (req, res) => {
  console.log("in")
  console.log(req.query.id)
  console.log(req.query.menuid)
   try{
  const menuAnswer = await RestMenu.findAll({
   where: {
   rest_id: req.query.id,
   //menu_id: req.query.menuid
    }
  });
  res.json(menuAnswer)
} catch(err) {
  console.log(err)
 return res.status(400).json(err)
}
});

//-------------------Order rout--------------------------------------->
router.post('/newOrder', async (req, res) => {
  try {
    //const maxIdorder = maxorder()
    const newClient = await Historyorder.create({
        rest_id:req.body.d0,
      menu_id:req.body.d1,
      menu_child_id:req.body.d2,
      menu_value:req.body.d3,
      quantity_menu:req.body.d4,
      order_id:req.body.d5,
      status:0,
      client_name:req.body.d10 ,
      paykubun:(req.body.d6) ? req.body.d6 : 0,
      obs:(req.body.d9) ? req.body.d9 : "default value",
      pickUp_day:(req.body.d8) ? req.body.d8 : "default value",
      pickUp_way:(req.body.d7) ? req.body.d7 : 0,
      pay_status:0,
      prepare_status:0
    });
    res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/RegisterOrder', async (req, res) => {
  try {
    //const maxIdorder = maxorder()
    console.log(req.body)
    const newClient = await Historyorder.create({
        rest_id:req.body.d0,
      menu_id:req.body.d1,
      menu_child_id:req.body.d2,
      menu_value:req.body.d3,
      quantity_menu:req.body.d4,
      order_id:req.body.d5,
      status:0,
      client_name:(req.body.d10!="") ? req.body.d10 : 'Clients' ,
      paykubun:(req.body.d6) ? req.body.d6 : 0,
      obs:(req.body.d9) ? req.body.d9 : "default value",
      pickUp_day:req.body.d8.split(":")[0]+":"+req.body.d8.split(":")[1],
      pickUp_way:(req.body.d7) ? req.body.d7 : 0,
      pay_status:0,
      prepare_status:0,
      opt1:req.body.d11,
      opt2:req.body.d12,
      opt3:req.body.d13,
      opt4:req.body.d14,
      opt5:req.body.d17,
      cutlery:req.body.d15,
      total_amount:req.body.d16,

    });

    const newOrderId = newClient.id; // これが新しいオーダーのID
    console.log(newOrderId)
    res.json({
      message: 'Order registered successfully',
      orderId: newOrderId,
      status:200
      // 他の必要な情報もここで返すことができます
    });


    // res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.get('/orderdayscheck', async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const startDate = new Date(req.query.getdat);
    const endDate = new Date(req.query.getdat);
    endDate.setDate(endDate.getDate() + 1); // 次の日の0時に設定する

    const clients = await Historyorder.findAll({
      where: {
        pickUp_day: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      }
    });

    res.json({
      clients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});


router.get('/orderget', async (req, res) => {
  try {
  const clients = await Historyorder.findAll({

  });
    res.json({
         clients
    })
} catch (err) {
  res.json({ message: 'internal error' })
}
});

router.get('/ordergetstatusconfirm', async (req, res) => {
  try {
  const clients = await Historyorder.findAll({
    where: {
      status: 1,
    }
  });
    res.json({
         clients
    })
} catch (err) {
  res.json({ message: 'internal error' })
}
});

//----------------------------SQUARE------------------------------------------>
router.post('/backend/create-payment-link', async (req, res) => {
  try {
    const crypto = require('crypto');
    const { Client, Environment } = require('square');
    console.log(req.body.amount)
    // Configure as informações do seu aplicativo Square
    const client = new Client({
      environment: Environment.Production,
      accessToken: credentials.production.accessToken
    });

    const response = await client.checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: credentials.production.locationId,
        lineItems: [
          {
            name: req.body.name,
            quantity: req.body.quantity,
            basePriceMoney: {
              amount: req.body.amount,
              currency: req.body.currency
            }
          }
        ]
      },
      checkoutOptions: {
        // redirectUrl: `http://127.0.0.1:8080/pages/confirmorder.html?id=${req.body.orderId}`,
        redirectUrl: `https://seashell-app-s8r4y.ondigitalocean.app/pages/confirmorder.html?id=${req.body.orderId}`,
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true,
          cashAppPay: true
        }
      }
    });

    res.json(response.result.paymentLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});


//clients data get------------------------->
router.get('/restmanegerTimeGet', async (req, res) => {
  try {
  const members = await Rest_maneger.findAll({
    where: {
      rest_id:0
    }
  }); //findAll findByPk

  res.json(members)
} catch (err) {
  res.json(err)
  console.log(err)
}
});

module.exports = router;

router.post('/cachChange', async (req, res) => {
  try {
    if(req.body.d0==0){
      const newClient = await Rest_maneger.update({
        cach: req.body.d2,
        bank: req.body.d3,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==1){
      const newClient = await Rest_maneger.update({
        cach: req.body.d3,
        bank: req.body.d2,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==2&&req.body.d1==1){
      const newClient = await Rest_maneger.update({
        uber: req.body.d2,
        bank: req.body.d3,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==2&&req.body.d1==0){
      const newClient = await Rest_maneger.update({
        uber: req.body.d2,
        cach: req.body.d3,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==3&&req.body.d1==1){
      const newClient = await Rest_maneger.update({
        squere: req.body.d2,
        bank: req.body.d3,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==3&&req.body.d1==0){
      const newClient = await Rest_maneger.update({
        squere: req.body.d2,
        cach: req.body.d3,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==4){
      const newClient = await Rest_maneger.update({
        cach2: req.body.d2,
        bank: req.body.d3,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==5){
      const newClient = await Rest_maneger.update({
        caixa: req.body.d2,
        bank: req.body.d3,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }

  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/cachChangeonly', async (req, res) => {
  try {
    if(req.body.d0==0){
      const newClient = await Rest_maneger.update({
        caixa: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==1){
      const newClient = await Rest_maneger.update({
        squere: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else{
      const newClient = await Rest_maneger.update({
        uber: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }

  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/delehistoryorder', async (req, res) => {
  Historyorder.destroy({ where: { id: req.body.id } })
  res.json('deletado');
});

router.post('/openclosescahnge', async (req, res) => {
  try {
      const newClient = await Rest_maneger.update({
        pickup_time: req.body.d0,
        work_status: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/deletesmenus', async (req, res) => {
  RestMenu.destroy({ where: { id: req.body.id } })
  res.json('deletado');
});

router.post('/caixaopen', async (req, res) => {
try {
   let nwvalue = await getscaixas(req.body.d0)
   let vl = nwvalue - req.body.d1

   if(req.body.d0==0){
     const newClient = await Rest_maneger.update({
       caixa: req.body.d1,
       cach: vl,
     },{
         where: {
           rest_id: 0
         }
     });
     res.json(newClient);
   }else{
     const newClient = await Rest_maneger.update({
       caixa: req.body.d1,
       cach2: vl,
     },{
         where: {
           rest_id: 0
         }
     });
     res.json(newClient);
   }
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});



async function getscaixas(d){
    const members = await Rest_maneger.findAll({
    });
    let tgt = 0
    if(d==0){
      tgt = members[0].cach
    }else if(d==1){
      tgt = members[0].cach2
    }
   return tgt
}

router.post('/confirmclosecaixa', async (req, res) => {
try {

  const newClient = await CloseCaixa.update({
    uber: req.body.d1,
    squere: req.body.d3,
    demae:req.body.d2,
    final:req.body.d4,
    obs:req.body.d7
  },{
      where: {
        id: req.body.d5
      }
  });

   let nwvalue = await getscaixas(req.body.d6)
   let vl = (nwvalue-0) + (req.body.d4 -0)

   if(req.body.d6==0){
     const newClient = await Rest_maneger.update({
       caixa: 0,
       cach: vl,
     },{
         where: {
           rest_id: 0
         }
     });
     res.json(newClient);
   }else{
     const newClient = await Rest_maneger.update({
       caixa: 0,
       cach2: vl,
     },{
         where: {
           rest_id: 0
         }
     });
     res.json(newClient);
   }
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});

router.post('/cachChangeonlykaikei', async (req, res) => {
  try {
    console.log("CD is:"+ req.body.d0)
    if(req.body.d0==0){
      const newClient = await Rest_maneger.update({
        cach: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==4){
      const newClient = await Rest_maneger.update({
        cach2: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==1){
      const newClient = await Rest_maneger.update({
        squere: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else if(req.body.d0==99){
      const newClient = await Rest_maneger.update({
        bank: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }else{
      const newClient = await Rest_maneger.update({
        uber: req.body.d1,
      },{
          where: {
            rest_id: 0
          }
      });
      res.json(newClient);
    }

  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
});


//bae

//PosMenu

const PosMenu = require('../schema/pos/menu')
const PosUser = require('../schema/pos/user')
const RegisterOpenClose = require('../schema/pos/RegisterOpenClose');
const Sale = require('../schema/pos/Sales');

//POS/MENU----------->
//PO/MENU/取得
router.get('/pos/getmenu', async (req, res) => {
  try {
  const supplireget = await PosMenu.findAll({
  });
  res.json(supplireget)
} catch (err) {
  res.json(err)
  console.log(err)
}
});
//POS/MENU/削除
router.post('/pos/menu/delete', async (req, res) => {
    try {
        const id = req.body.id;  // リクエストボディからIDを取得

        // メニューアイテムを検索して削除
        const deleted = await PosMenu.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(200).json({ success: true,message: 'メニューアイテムが削除されました' });
        } else {
            res.status(404).json({ success: false,message: 'メニューアイテムが見つかりませんでした' });
        }
    } catch (error) {
        res.status(500).json({ success: false,message: 'メニューアイテムの削除に失敗しました', error: error.message });
    }
});
//POS/MENU/更新
router.post('/pos/menu/update', async (req, res) => {
    try {
        const { id, menu_id, item_name, category, price, description, available } = req.body;
        
        // メニューアイテムを検索して更新
        const updated = await PosMenu.update(
            { menu_id, item_name, category, price, description, available },
            { where: { id: id } }
        );
        
        if (updated[0] === 1) {  // updateメソッドは[更新された行数]を返すので、それをチェック
            res.status(200).json({ success: true,message: 'メニューアイテムが更新されました' });
        } else {
            res.status(404).json({ success: false,message: 'メニューアイテムが見つかりませんでした' });
        }
    } catch (error) {
        res.status(500).json({ success: false,message: 'メニューアイテムの更新に失敗しました', error: error.message });
    }
});

router.post('/pos/createmenu', async (req, res) => {
    try {
        const { menu_id, item_name, category, price, description, available } = req.body;
        // メニューアイテムを新規作成
        const newItem = await PosMenu.create({
            menu_id,
            item_name,
            category,
            price,
            description,
            available
        });

        res.status(201).json({
          success: true,
            message: 'Successfully updated',
            data: newItem
        });
    } catch (error) {
      console.log(error)
        res.status(500).json({
          success: false,
            message: 'Failed to update',
            error: error.message
        });
    }
});

router.post('/pos/createmenuaddcolomun', async (req, res) => {
    try {
        const {
            menu_id,
            item_name,
            item_name_jp,
            category,
            category_jp,
            price,
            unit,
            description,
            available,
            isVisible
        } = req.body;

        // メニューアイテムを新規作成
        const newItem = await PosMenu.create({
            menu_id,
            item_name,
            item_name_jp,
            category,
            category_jp,
            price,
            unit,
            description,
            available,
            isVisible
        });

        res.status(201).json({
            success: true,
            message: 'Successfully created',
            data: newItem
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            // 重複エラーの場合
            return res.status(400).json({
                message: 'Menu ID is already in use. Please choose a different ID.',
                error: error.message
            });
        }

        // その他のエラー
        console.log(error);
        res.status(500).json({
            message: 'Failed to create',
            error: error.message
        });
    }
});

router.put('/pos/updatemenucolumnAdd/:id', async (req, res) => {
  console.log('posupdate')
    try {
        const { id } = req.params;
        const {
            item_name,
            item_name_jp,
            category,
            category_jp,
            price,
            unit,
            description,
            available,
            isVisible
        } = req.body;

        // メニューアイテムを更新
        const [updated] = await PosMenu.update({
            item_name,
            item_name_jp,
            category,
            category_jp,
            price,
            unit,
            description,
            available,
            isVisible
        }, {
            where: { id }
        });

        if (updated) {
            const updatedMenuItem = await PosMenu.findOne({ where: { id } });
            res.status(200).json({
                success: true,
                message: 'Menu item successfully updated',
                data: updatedMenuItem
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to update menu item',
            error: error.message
        });
    }
});


//POS/MENU/Finish

//POS/SALES/---->
//Salesの登録エンドポイント-------------------------------->
router.post('/pos/sales', async (req, res) => {
    try {
      console.log(req.body)
      const data = req.body;  // クライアントから送信されたデータ
     // console.log(data)
     // total_priceの計算
     let totalPrice = 0;
     for (let key in data) {
         totalPrice += parseFloat(data[key].total_price);
     }

     const transactionTime = new Date();
transactionTime.setHours(transactionTime.getHours() + 9);  // UTC+9に設定

     // item_detailsに含めるアイテムの詳細
     const itemDetails = JSON.stringify(data);

     // 最初のアイテムのcashier_idとpay_typeを取得
     const cashierId = data[Object.keys(data)[0]].cashier_id;
     const payType = data[Object.keys(data)[0]].pay_type;
     const  registerId= data[Object.keys(data)[0]].register_id;

     // Saleモデルに新しいレコードを作成
     const newSale = await Sale.create({
         total_price: totalPrice,
         register_id:registerId,
         item_details: itemDetails,
         cashier_id: cashierId,
         pay_type: payType,
         transaction_time: transactionTime  // 現在の日時を使用
     });

     // 成功レスポンスを返す
     res.status(201).json({ success: true, sale: newSale });
 } catch (error) {
     console.error('エラーが発生しました:', error);
     res.status(500).json({ success: false, message: 'サーバーエラーが発生しました。' });
 }
});
//Salesのデータを取得するエンドポイント-------------------->





router.get('/pos/get/sales', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        // クエリパラメータを基に検索条件を作成
        const whereCondition = {};
        if (start_date && end_date) {
            whereCondition.transaction_time = {
                [Op.between]: [
                    new Date(start_date + ' 00:00:00'),
                    new Date(end_date + ' 23:59:59')
                ]
            };
        } else if (start_date) {
            whereCondition.transaction_time = {
                [Op.gte]: new Date(start_date + ' 00:00:00')
            };
        } else if (end_date) {
            whereCondition.transaction_time = {
                [Op.lte]: new Date(end_date + ' 23:59:59')
            };
        }
        // Sale テーブルから条件に一致するレコードを取得
        const sales = await Sale.findAll({ where: whereCondition });
        res.status(200).json({
            data: sales
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get data',
            error: error.message
        });
    }
});

// POSTエンドポイントで特定のIDのSaleデータを削除
router.post('/pos/delete/sale', async (req, res) => {
    try {
        const { sale_id } = req.body;

        // sale_idが提供されているかチェック
        if (!sale_id) {
            return res.status(400).json({ error: 'sale_id は必須です' });
        }

        // Sale テーブルから該当するレコードを削除
        const deleted = await Sale.destroy({
            where: { sale_id: sale_id }
        });

        if (deleted) {
            res.status(200).json({ message: '販売データが削除されました' });
        } else {
            res.status(404).json({ message: '指定されたIDの販売データが見つかりませんでした' });
        }
    } catch (error) {
        res.status(500).json({ error: '販売データの削除に失敗しました', message: error.message });
    }
});

// POSTエンドポイントで特定のIDのSaleデータを更新
router.get('/pos/sales-history', async (req, res) => {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ error: '開始日と終了日は必須です。' });
    }

    try {
        // 売上履歴を取得
        const salesHistory = await Sale.findAll({
            where: {
                transaction_time: {
                    [Op.between]: [new Date(start_date), new Date(end_date)]
                }
            },
            order: [['transaction_time', 'ASC']]
        });

        if (salesHistory.length === 0) {
            return res.json([]); // 売上履歴がない場合
        }

        // 全てのitem_detailsからmenu_idを収集
        const allItemDetails = salesHistory.flatMap(sale => {
            const itemDetails = JSON.parse(sale.item_details);
            return Object.values(itemDetails).map(item => item.menu_id);
        });

        // 重複したmenu_idを削除
        const uniqueMenuIds = [...new Set(allItemDetails)];

        // まとめてメニューIDに対応するメニュー名を取得
        const menuDetails = await PosMenu.findAll({
            where: {
                menu_id: uniqueMenuIds
            }
        });

        // メニューIDをキーとしてメニュー名をマッピング
        const menuMap = menuDetails.reduce((map, menu) => {
            map[menu.menu_id] = menu.item_name;
            return map;
        }, {});

        // 各売上のitem_detailsにメニュー名を追加
        const detailedSales = salesHistory.map(sale => {
            const itemDetails = JSON.parse(sale.item_details);
            const parsedItems = Object.values(itemDetails).map(item => ({
                ...item,
                item_name: menuMap[item.menu_id] || '不明なメニュー'
            }));

            return {
                ...sale.toJSON(),
                item_details: parsedItems
            };
        });

        res.json(detailedSales);

    } catch (error) {
        console.error('Error fetching sales history:', error);
        res.status(500).json({ error: '売上履歴の取得中にエラーが発生しました' });
    }
});

//POS/SALE Finish




router.post('/pos/login', async (req, res) => {
    try {
        const { username, password_hash } = req.body;
        console.log(req.body);

        // ユーザーの存在を確認
        const user = await PosUser.findOne({
            where: {
                username: username,
                password_hash: password_hash
            }
        });

        console.log(user);

        if (user) {
            if (user.status === 'active') {
                res.json({
                    success: true,
                    message: 'ログイン成功',
                    user: user
                });
            } else {
                res.status(403).json({
                    success: false,
                    message: 'アカウントがアクティブではありません'
                });
            }
        } else {
            res.status(401).json({
                success: false,
                message: 'ユーザー名またはパスワードが間違っています'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー',
            error: err
        });
    }
});

// POSTエンドポイント - 登録データ確認と集計
router.post('/pos/register_open_close', async (req, res) => {
    try {
        const { register_id, cashier_id, cash_opening_balance } = req.body;
        // const { register_id, cashier_id, open_time, cash_opening_balance } = req.body;

        // 日本時間の「今日」の開始時刻と終了時刻を正確に計算
        const now = new Date(); // 現在のUTC時刻
        const japanOffset = 9 * 60 * 60 * 1000; // UTC+9 のミリ秒
        const nowJapanTime = new Date(now.getTime() + japanOffset); // 日本時間に変換


        // 日本時間での「今日」の開始時刻
        const todayStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0, 0, 0, 0 // UTC基準で開始時刻を設定
        );

        // 日本時間での「今日」の終了時刻
        const todayEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23, 59, 59, 999 // UTC基準で終了時刻を設定
        );

        // タイムゾーン補正 (UTC -> 日本時間)
        const todayStartJapan = new Date(todayStart.getTime() + japanOffset);
        const todayEndJapan = new Date(todayEnd.getTime() + japanOffset);
        const open_time = nowJapanTime;

        // 2024-11-21T00:00:00.000Z
        const tgtStartTime = todayStartJapan.toISOString().split('.000Z')[0].replace('T', ' ')
        const tgtFinishTime = todayEndJapan.toISOString().split('.999Z')[0].replace('T', ' ')
        const tgtid = register_id-0
        // 今日の登録データをチェック
        const existingRecord = await RegisterOpenClose.findOne({
            where: {
                register_id:tgtid,
                open_time: {
                    [Op.between]: [tgtStartTime, tgtFinishTime]
                },
                close_time: {
                  [Op.is]: null
                }

            }
        });

        console.log('Existing Record:', existingRecord);

        // 支払いタイプ一覧
        const payTypes = ['cash', 'credit', 'other', 'online'];

        // Salesテーブルからpay_typeごとにtotal_priceを集計
        const rawSalesSummary = await Sale.findAll({
            attributes: [
                'pay_type',
                [Sequelize.fn('SUM', Sequelize.col('total_price')), 'total_price_sum']
            ],
            where: {
                register_id,
                transaction_time: {
                    [Op.between]: [todayStartJapan, todayEndJapan]
                }
            },
            group: ['pay_type']
        });

        console.log('Raw Sales Summary:', rawSalesSummary);

        // rawSalesSummaryを加工して、すべてのpay_typeを含む形式に変換
        const salesSummary = payTypes.map(type => {
            const match = rawSalesSummary.find(record => record.pay_type === type);
            return {
                pay_type: type,
                total_price_sum: match ? match.dataValues.total_price_sum : "0.00"
            };
        });

        console.log('Sales Summary:', salesSummary);

        if (existingRecord) {
            // 結果を返す
            return res.json({
                success: true,
                registerFlag: true,
                register_open_close_id: existingRecord.register_open_close_id, // IDを追加
                cash_opening_balance: existingRecord.cash_opening_balance,
                salesSummary
            });
        }

        // 登録データがない場合、新しいレコードを挿入
        const newRecord = await RegisterOpenClose.create({
            register_id,
            cashier_id,
            open_time,
            cash_opening_balance
        });

        res.json({
            success: true,
            registerFlag: false,
            message: '新しいレコードが挿入されました',
            register_open_close_id: newRecord.register_open_close_id, // ここを追加
            record: newRecord,
            salesSummary
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー',
            error: err
        });
    }
});

router.post('/pos/register_open_close/close', async (req, res) => {
    try {
      console.log('close star')
        const {
            register_open_close_id,
            close_time,
            cash_opening_balance,
            other_opening_balance,
            cash_closing_balance,
            other_closing_balance
        } = req.body;

        console.log(req.body)

        // 指定されたIDのレコードを更新
        const updatedRecord = await RegisterOpenClose.update({
            close_time,
            cash_opening_balance,
            other_opening_balance,
            cash_closing_balance,
            other_closing_balance
        }, {
            where: { register_open_close_id }
        });

        if (updatedRecord[0] > 0) { // 更新された行があるかどうかをチェック
            res.json({
                success: true,
                message: 'レジが正常にクローズされました'
            });
        } else {
            res.status(404).json({
                success: false,
                message: '指定されたIDのレコードが見つかりません'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー',
            error: err
        });
    }
});





// 当月の支出データと日別の支出合計を取得するエンドポイント
router.get('/pos/monthly-expenses', async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id は必須です' });
        }

        // 当月の開始日と終了日を取得
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        // 当月の支出合計を計算
        const totalExpenses = await FinancialRecord.sum('expense', {
            where: {
                user_id: user_id,
                expense: {
                    [Op.ne]: null  // expense が NULL でないレコードを取得
                },
                record_date: {
                    [Op.between]: [startOfMonth, endOfMonth]  // 当月のレコードに限定
                }
            }
        });

        // 日別の支出合計を計算
        const dailyExpenses = await FinancialRecord.findAll({
        attributes: [
            [Sequelize.fn('DATE', Sequelize.col('record_date')), 'date'],
            'expense'  // 各レコードの支出額をそのまま取得
        ],
        where: {
            user_id: user_id,
            expense: {
                [Op.ne]: null
            },
            record_date: {
                [Op.between]: [startOfMonth, endOfMonth]
            }
        },
        order: [[Sequelize.fn('DATE', Sequelize.col('record_date')), 'ASC']]
    });

    // データをクライアントに返す
    res.json({
        totalExpenses: totalExpenses || 0,
        dailyExpenses: dailyExpenses
    });

    } catch (error) {
        console.error('Error fetching monthly expenses:', error);
        res.status(500).json({ error: '当月の支出データを取得中にエラーが発生しました' });
    }
});

router.get('/pos/register-history', async (req, res) => {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ error: '開始日と終了日は必須です。' });
    }
    try {
        const registerHistory = await RegisterOpenClose.findAll({
            where: {
                open_time: {
                    [Op.gte]: new Date(start_date)
                },
                close_time: {
                    [Op.lte]: new Date(end_date)
                }
            },
            order: [['open_time', 'ASC']]
        });

        res.json(registerHistory);
    } catch (error) {
        console.error('Error fetching register history:', error);
        res.status(500).json({ error: 'レジ履歴の取得中にエラーが発生しました' });
    }
});
router.get('/pos/total-sales/Start/finish', async (req, res) => {
  try {
    const { user_id, start, finish } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id は必須です' });
    }
    if (!start || !finish) {
      return res.status(400).json({ error: '開始日と終了日が必要です' });
    }

    const startDate = new Date(start);
    const endDate = new Date(finish);

    const salesData = await Sale.findAll({
      where: {
        transaction_time: {
          [Op.between]: [startDate, endDate]
        },
        register_id: user_id
      }
    });

    res.json({ salesData });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: '売上データを取得中にエラーが発生しました' });
  }
});




router.get('/pos/register-open-close', async (req, res) => {
    try {
        const records = await RegisterOpenClose.findAll();
        res.status(200).json({
            message: 'データの取得に成功しました。',
            data: records
        });
    } catch (error) {
        res.status(500).json({
            message: 'データの取得に失敗しました。',
            error: error.message
        });
    }
});



router.delete('/menu/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // メニューアイテムを検索して削除
        const deleted = await Menu.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(200).json({ message: 'メニューアイテムが削除されました' });
        } else {
            res.status(404).json({ message: 'メニューアイテムが見つかりませんでした' });
        }
    } catch (error) {
        res.status(500).json({ message: 'メニューアイテムの削除に失敗しました', error: error.message });
    }
});

router.get('/pos/total-sales', async (req, res) => {
  try {
     const { user_id } = req.query;

     if (!user_id) {
         return res.status(400).json({ error: 'user_id は必須です' });
     }
     // 30日前の日付を計算
     const startDate = new Date();
     startDate.setDate(startDate.getDate() - 30);

     // 今日の日付を設定（時刻を23:59:59に設定して、今日のデータを含める）
     const endDate = new Date();
     // endDate.setHours(23, 59, 59, 999);

     // 総売上を計算
     const totalSales = await Sale.sum('total_price', {
         where: {
             transaction_time: {
                 [Op.between]: [startDate, endDate]
             },
             register_id: user_id
         }
     });

     // 日別の売上を計算
     const dailySales = await Sale.findAll({
         attributes: [
             [Sequelize.fn('DATE', Sequelize.col('transaction_time')), 'date'],
             [Sequelize.fn('SUM', Sequelize.col('total_price')), 'total_sales']
         ],
         where: {
             transaction_time: {
                 [Op.between]: [startDate, endDate]
             },
             register_id: user_id
         },
         group: [Sequelize.fn('DATE', Sequelize.col('transaction_time'))],
         order: [[Sequelize.fn('DATE', Sequelize.col('transaction_time')), 'ASC']]
     });

     // 日ごとのtotal_priceを配列として集計
     const dailyTotals = dailySales.map(sale => ({
         date: sale.get('date'),
         total_sales: parseFloat(sale.get('total_sales'))
     }));

     // データを返す
     res.json({
         totalSales: totalSales || 0,
         dailySales: dailyTotals
     });
 } catch (error) {
     console.error('Error fetching sales data:', error);
     res.status(500).json({ error: '売上データを取得中にエラーが発生しました' });
 }
});

//new endpoint for pos
router.get('/pos/total-sales/Byyear', async (req, res) => {
  try {
    const { user_id, year } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id は必須です' });
    }
    if (!year || isNaN(year)) {
      return res.status(400).json({ error: '年度 (year) は必須です' });
    }

    // 年度の開始日と終了日を設定
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    // 総売上を計算
    const totalSales = await Sale.sum('total_price', {
      where: {
        transaction_time: {
          [Op.between]: [startDate, endDate]
        },
        register_id: user_id
      }
    });

    // 日別の売上を計算
    const dailySales = await Sale.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('transaction_time')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('total_price')), 'total_sales']
      ],
      where: {
        transaction_time: {
          [Op.between]: [startDate, endDate]
        },
        register_id: user_id
      },
      group: [Sequelize.fn('DATE', Sequelize.col('transaction_time'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('transaction_time')), 'ASC']]
    });

    // 日ごとのtotal_priceを配列として集計
    const dailyTotals = dailySales.map(sale => ({
      date: sale.get('date'),
      total_sales: parseFloat(sale.get('total_sales'))
    }));

    // データを返す
    res.json({
      totalSales: totalSales || 0,
      dailySales: dailyTotals
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: '売上データを取得中にエラーが発生しました' });
  }
});

router.post('/pos/updateSettings', async (req, res) => {

    try {
      const { user_id,current_password,representativeName,language,confirm_password,password,email } = req.body;
      console.log(req.body)
        // ユーザーをDBから検索
        const user = await PosUser.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: 'ユーザーが見つかりません' });
        }
        if(current_password){
          console.log('pass来たから変更するぜ')
          if (current_password !== user.password_hash) {
              return res.status(401).json({ message: '現在のパスワードが正しくありません' });
          }else{
            user.password_hash = confirm_password;
          }
        }
        if(email){
          user.username = email
        }
        if(representativeName){
          user.representative_name = representativeName;
        }
        if(language){
          user.language = language
        }

        const result = await user.save();
        res.json({
            message: '設定が正常に更新されました',
            user: {
                user_id: user.user_id,
                username: user.username,
                language: user.language
            }
        });
    } catch (error) {
        console.error('エラー発生:', error);
        res.status(500).json({ message: '設定の更新に失敗しました', error: error.message });
    }
});

//POS Finish


//room sync system

const RoomsOperation = require('../controllers/rooms/roomsOperation');
const RoomAuth = require("../controllers/rooms/roomAuthController");

// 🔐 すべての /api/room/xxx を JWT 認証必須に
// router.use("/api/room", auth);

// GET
router.get('/api/room/status', RoomsOperation.getRoomStatus);
router.get('/api/room/amenity', RoomsOperation.getAmenityRequests);
router.get('/api/room/amenity/list', RoomsOperation.getAmenityRequests);
router.get('/api/room/other-request/list', RoomsOperation.getOtherRoomRequests);

// PUT
router.put('/api/room/status', RoomsOperation.updateRoomStatus);
router.put('/api/room/details', RoomsOperation.updateRoomDetails);
router.put('/api/room/status/checkOut/after', RoomsOperation.updateRoomStatusForCheckOutAfter);
router.put('/api/room/status/singleGuest', RoomsOperation.updateRoomStatusSingleGuest);

// POST
router.post('/api/room/amenity', RoomsOperation.registerAmenityAction);
router.post('/api/room/other-request', RoomsOperation.registerOtherRoomRequest);

// DELETE
router.delete('/api/room/amenity/:id', RoomsOperation.completeAmenityRequest);
router.delete('/api/room/other-request/:id', RoomsOperation.deleteOtherRoomRequest);

// 一括
router.put('/api/room/status/bulk', RoomsOperation.bulkUpdateRoomStatus);
router.put("/api/room/stay_type/bulk", RoomsOperation.bulkUpdateStayType);
router.put("/api/room/checkout_status/bulk", RoomsOperation.bulkUpdateCheckoutStatus);

router.put('/api/room/cleaning/start', RoomsOperation.startCleaning);
router.put('/api/room/cleaning/finish', RoomsOperation.finishCleaning);
router.put('/api/room/cleaning/undo', RoomsOperation.undoCleaning);
router.put("/api/room/inspector/checked", RoomsOperation.inspectorChecked);
router.post("/api/room/daily-list/close",  RoomsOperation.closeDailyList);
router.get("/api/room/daily_room_list", RoomsOperation.getDailyRoomList);
router.post("/api/room/assign_bulk", RoomsOperation.assignBulk);
router.put("/api/room/daily-list/update", RoomsOperation.updateDailyRoomList);
router.post("/api/room/login", RoomAuth.login);
router.put("/api/room/daily_checkout/bulk", RoomsOperation.updateDailyCheckoutBulk);
router.put("/api/room/update_status", RoomsOperation.updateDailyRoomStatus);
router.get("/api/room/summary", RoomsOperation.getHistorySummary);
router.get("/api/room/day-detail", RoomsOperation.getDayDetail);
router.put("/api/room/undo_restore", RoomsOperation.undoRestore);
router.get("/api/room/range-detail",RoomsOperation.getRoomDetailByDateRange);

const UserController = require("../controllers/rooms/userController");

// 認証があるなら↓
// const auth = require("../middleware/roomSyncAuth");
// router.use("/api/user", auth);

// === CREATE ===
router.post("/api/user/create", UserController.createUser);

// === UPDATE ===
router.put("/api/user/update", UserController.updateUser);

// === DELETE ===
router.delete("/api/user/delete", UserController.deleteUser);

// === GET ALL USERS ===
router.get("/api/user/list", UserController.getAllUsers);

router.get("/api/user/list", UserController.getUserList);


//order App

const OrdersUser = require('../schema/orders/user')
const OrdersMenu = require('../schema/orders/menu')
const CategoryHours = require('../schema/orders/CategoryHours')
const OrdersCategory = require('../schema/orders/category')
const OrdersOption = require('../schema/orders/option')
const Orders = require('../schema/orders/orders');
const MenuCostHistory = require('../schema/orders/MenuCostHistory');
const OrderItems = require('../schema/orders/order_items');
const ReservationController = require('../controllers/reservation.controller');
const orderController = require('../controllers/orderskun.order.controller');
const registerController = require('../controllers/orderskun.registerController');



// 全ての予約を取得するエンドポイント
router.get('/reservations', ReservationController.getAllReservations);
// 予約を日付範囲を指定してエンドポイント
router.get('/reservations/daterange', ReservationController.getReservationsByDateRange);
// 特定の予約を取得するエンドポイント
router.get('/reservations/:id', ReservationController.getReservationById);
// 予約をIDで削除するエンドポイント
router.delete('/reservations/delete/:id', ReservationController.deleteReservation);
// 新しい予約を追加するエンドポイント
router.post('/reservations/create', ReservationController.addReservation);
// 予約をIDで更新するエンドポイント
router.put('/reservations/update/:id', ReservationController.updateReservation);
// 注文確認エンドポイント
router.post('/orderskun/confirm', orderController.confirmOrder);
// 準備中オーダーを取得
router.post('/orderskun/pending', orderController.getPendingOrders);
// フロントから受け取ったステータス
router.post('/orderskun/get-by-status', orderController.getOrdersByStatus);
// 新しいルート: 注文アイテムのステータスを更新
router.post('/orderskun/update-status', orderController.updateOrderStatus);
// alarm_enabledをfalseにする
router.post('/orderskun/update-alarm', orderController.updateAlarmStatus);
//オーダーを完全削除
router.delete('/orderskun/delete/:orderId', orderController.deleteOrder);
//支払い完了とする
router.post('/orderskun/updatePayment', orderController.updatePayment);
//提供完了とする
router.post('/orderskun/updateConfirmd', orderController.updateConfirmd);
// レジ情報の取得エンドポイント
router.get('/orderskun/registers', registerController.getRegisters);
// レジオープン金額
router.post('/orderskun/registers/open', registerController.openRegister);
// pickup_timeに基づいて注文を取得するエンドポイント
router.get('/orderskun/pickup-time', orderController.getOrdersByPickupTime);
// レジクローズ金額
// pickup_timeに基づいて注文を取得するエンドポイント
router.get('/orderskun/pickup-time/range', orderController.getOrdersByPickupRange);
router.post('/orderskun/registers/close', registerController.closeRegister);
//POSより、オーダーのupdateのエンドポイント
router.post('/orderskun/update/order/admin', orderController.updateMenuByAdmin)
//ーだー履歴を取得する
router.get('/orderkuns/historico/pedidos/daterange', orderController.historyPedidosBydate)
//Orderの状態をupdate
router.put('/orderskun/update/:orderId', orderController.updateOrder);

router.post('/orderskun/updateStock', orderController.updateStockStatus);

router.post('/orderskun/updateSettings', async (req, res) => {
    try {
        const { id, current_password, representativeName, language, confirm_password, password, email } = req.body;
        console.log(req.body);

        // ユーザーをDBから検索
        const user = await OrdersUser.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'ユーザーが見つかりません' });
        }

        // パスワードの検証と変更処理
        if (current_password) {
            // 現在のパスワードとDBのハッシュ化パスワードを比較
            const match = await verifyPassword(current_password, user.password);
            if (!match) {
                return res.status(401).json({ message: '現在のパスワードが正しくありません' });
            }

            // 新しいパスワードが入力された場合、ハッシュ化して保存
            if (confirm_password && password === confirm_password) {
                user.password = await encryptPassword(confirm_password);
            } else {
                return res.status(400).json({ message: '新しいパスワードが一致しません' });
            }
        }

        // 他の設定の更新
        if (email) {
            user.email = email;
        }
        if (representativeName) {
            user.username = representativeName;
        }
        if (language) {
            user.language = language;
        }

        const result = await user.save();
        res.json({
            message: '設定が正常に更新されました',
            user: {
                user_id: user.id,
                username: user.username,
                language: user.language
            }
        });
    } catch (error) {
        console.error('エラー発生:', error);
        res.status(500).json({ message: '設定の更新に失敗しました', error: error.message });
    }
});

const uploadImageToSpace = async (userId, file) => {
  try {
    // Recupera o usuário pelo ID para obter o nome da pasta (pode ser personalizado conforme sua lógica)
    const user = await OrdersUser.findByPk(userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Cria a pasta com base no ID ou nome do usuário
    const folderName = `clients/${user.id}-${user.username}`;

    // Configura o nome do arquivo e o caminho no Space
    const fileName = `${folderName}/${Date.now()}-${file.originalname}`;

    // Faz o upload do arquivo
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read', // Deixa a imagem acessível publicamente
      ContentType: file.mimetype, // Define o tipo MIME
    };

    const data = await s3.upload(params).promise();
    return data.Location; // URL gerada pelo Space
  } catch (error) {
    console.error('Erro ao fazer upload para o Space:', error);
    throw error;
  }
};


router.delete('/orders/delete/:orderId', async (req, res) => {
  const orderId = req.params.orderId; // パラメータから orderId を取得

  try {
    // まず、該当する order_id を持つアイテムを削除
    await OrderItems.destroy({
      where: { order_id: orderId } // order_id を条件にアイテムを削除
    });

    // 次に、該当するオーダー自体を削除
    const result = await Orders.destroy({
      where: { id: orderId }
    });

    if (result === 0) {
      return res.status(404).json({ message: '注文が見つかりません' });
    }

    res.status(200).json({ message: '注文と関連アイテムが削除されました' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '注文の削除中にエラーが発生しました' });
  }
});

router.get('/orders/getBasedata', async (req, res) => {
  try {
    const userId = req.query.user_id; // クエリパラメータからuser_idを取得

    // Category, Menu, Option のデータをそれぞれ取得
    const categories = await OrdersCategory.findAll({
      where: { user_id: userId }
    });

    const menus = await OrdersMenu.findAll({
      where: { user_id: userId }
    });

    // Mapeia o resultado da consulta, convertendo as imagens de BLOB para Base64
    const menusWithBase64Images = menus.map(menu => {
      return {
        id: menu.id,
        user_id: menu.user_id,
        category_id: menu.category_id,
        menu_name_en: menu.menu_name_en,
        menu_name_pt: menu.menu_name_pt,
        menu_name_ja: menu.menu_name_ja,
        description_en: menu.description_en,
        description_pt: menu.description_pt,
        description_ja: menu.description_ja,
        price: menu.price,
        display_order: menu.display_order,
        stock_status: menu.stock_status,
        imagem_string: menu.imagem_string,
        is_takeout:menu.is_takeout,
        admin_item_name:menu.admin_item_name
      };
    });

    const options = await OrdersOption.findAll({
      where: { user_id: userId }
    });

    console.log('operatehourGEt')

    const oparatingHours = await CategoryHours.findAll({
      include: [{
        model: OrdersCategory,
        as: 'm_categories',
        where: { user_id: userId }
      }],
      logging: console.log  // クエリをコンソールに出力
    });

        const menuCostHistories = await MenuCostHistory.findAll({
  where: {
    rest_id: userId
  }
});

    // 取得したデータをまとめてJSONで返す
    const getData = {
      categories: categories,
      menus: menusWithBase64Images,
      options: options,
      oparatingHOurs:oparatingHours,
      menuCostHistories: menuCostHistories
    };

    res.json(getData); // 結果をJSONとして返す
  } catch (err) {
    res.json({ error: err.message }); // エラー時のレスポンス
    console.log(err);
  }
});

//原価のポスト
router.post('/orderskun/menu-cost-history', async (req, res) => {
  try {
    const {
      rest_id,
      menu_id,
      cost_price_ex_tax,
      cost_breakdown_json
    } = req.body;

    console.log(req.body)

    if (!rest_id || !menu_id || !cost_price_ex_tax) {
      return res.status(400).json({ error: 'required fields missing' });
    }

    // ① 既存の有効レコードを終了させる
    await MenuCostHistory.update(
      { end_date: new Date() },
      {
        where: {
          rest_id,
          menu_id,
          end_date: null
        }
      }
    );

    // ② 新しい原価履歴を作成
    const newHistory = await MenuCostHistory.create({
      rest_id,
      menu_id,
      cost_price_ex_tax,
      cost_breakdown_json,
      start_date: new Date(),
      end_date: null
    });

    res.json({
      success: true,
      data: newHistory
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



router.get('/orders/getmenu', async (req, res) => {
  try {
    const userId = req.query.user_id; // クエリパラメータからuser_idを取得
    const getData = await OrdersMenu.findAll({
      where: {
        user_id: userId // user_idを条件にデータを取得
      }
    });
    res.json(getData);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

router.get('/orders/getuser', async (req, res) => {
  try {
    const userId = req.query.email; // クエリパラメータからuser_idを取得
    const getData = await OrdersUser.findAll({
      where: {
        email: userId // user_idを条件にデータを取得（この場合、OrdersUserの主キーと一致することが想定されます）
      }
    });
    res.json(getData);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

router.get('/orders/getcategory', async (req, res) => {
  try {
    const userId = req.query.user_id; // クエリパラメータからuser_idを取得
    console.log('id is' + userId)
    const getData = await OrdersCategory.findAll({
      where: {
        user_id: userId // user_idを条件にデータを取得
      }
    });
    res.json(getData);
  } catch (err) {
    console.log(err)
    res.json(err);
    console.log(err);
  }
});

router.get('/orders/getoption', async (req, res) => {
  try {
    const userId = req.query.user_id; // クエリパラメータからuser_idを取得
    const getData = await OrdersOption.findAll({
      where: {
        user_id: userId // user_idを条件にデータを取得
      }
    });
    res.json(getData);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

router.post('/orders/confirm', async (req, res) => {
    const { order_name, user_id, table_no, items } = req.body;
    try {
        // 既存の注文を確認
        let existingOrder = await Orders.findOne({
            where: {
                user_id: user_id,
                table_no: table_no,
                order_name: order_name,
                order_status: 'pending'
            },
            order: [['id', 'DESC']]
        });
        if (existingOrder) {
            // 既存の注文が存在する場合、その注文IDにアイテムを追加
            const existingOrderId = existingOrder.id;
            await Orders.update(
                   { coupon_printed: false },
                   { where: { id: existingOrderId } }
               );

            const orderItems = items.map(item => ({
                order_id: existingOrderId,
                menu_id: item.id,
                quantity: item.quantity,
                options: JSON.stringify(item.options),
                item_price: item.amount,
                total_price: item.amount * item.quantity,
                coupon_printed:false,
                created_at: new Date(),
                updated_at: new Date()
            }));
            await OrderItems.bulkCreate(orderItems);
            // 総額を更新
            const additionalAmount = items.reduce((acc, item) => acc + (item.amount), 0);//ここかも
            existingOrder.total_amount = parseFloat(existingOrder.total_amount) + parseFloat(additionalAmount);
            existingOrder.updated_at = new Date();

            // データベースに保存
            await existingOrder.save();

            res.status(200).json({ message: 'Order updated successfully' });
        } else {
            // 新規注文を作成
            const newOrder = await Orders.create({
                user_id: user_id,
                table_no: table_no,
                order_name: order_name,
                total_amount: items.reduce((acc, item) => acc + item.amount, 0),
                order_status: 'pending',
                coupon_printed:false,
                created_at: new Date(),
                updated_at: new Date()
            });

            // 各アイテムを OrderItems テーブルに追加
            const orderItems = items.map(item => ({
                order_id: newOrder.id,
                menu_id: item.id,
                quantity: item.quantity,
                options: JSON.stringify(item.options),
                item_price: item.amount,
                total_price: item.amount * item.quantity,
                created_at: new Date(),
                updated_at: new Date()
            }));

            await OrderItems.bulkCreate(orderItems);

            res.status(200).json({ message: 'Order confirmed successfully' });
        }
        //プリンターにデータを転送
       // const printerDt = await  groupItemsByPrinter(items)
        //sendToPrinters(printerDt)

    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ error: 'Failed to confirm order' });
    }
});

//sendToPrinters({ '172.16.41.1': [ { name: 'R/gigante de coxinha', quantity: 1 } ] })

async function sendToPrinters(groupedItems) {
  console.log(groupedItems)
    for (const printerIp in groupedItems) {
        const items = groupedItems[printerIp];

        // ネットワークプリンターを設定
        const device = new escpos.Network(printerIp);
        const printer = new escpos.Printer(device);

        // プリンター接続
        device.open(function(error){
            if (error) {
                console.error(`Error connecting to printer ${printerIp}:`, error);
                return;
            }

            // クーポンのヘッダー
            printer
              .align('CT')
              .text(`Printer IP: ${printerIp}`)
              .text(`Order Items:`)
              .newline();

            // アイテムをプリント
            items.forEach(item => {
                printer
                  .align('LT')
                  .text(`- ${item.name}  x${item.quantity}`)
                  .newline();
            });

            // クーポンのフッター
            printer
              .newline()
              .text('Thank you for your order!')
              .cut();

            // プリント完了
            printer.close();
        });
    }
}

function groupItemsByPrinter(items) {
    const groupedItems = {};

    items.forEach(item => {
        const printer = item.printer;

        if (!groupedItems[printer]) {
            groupedItems[printer] = [];
        }

        groupedItems[printer].push({
            name: item.name,
            quantity: item.quantity
        });
    });

    return groupedItems;
}


// オーダー履歴を取得するエンドポイント
router.get('/orders/history', async (req, res) => {
    try {
        const orders = await Orders.findAll({
            where: { order_status: 'confirmed' }, // もしくは適切な条件で絞り込む
            attributes: ['id', 'order_name']
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Failed to fetch order history' });
    }
});

// 特定のオーダー詳細を取得するエンドポイント
router.get('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Orders.findOne({
            where: { id: orderId },
            include: [{ model: OrderItems }] // OrderItemsを含めて取得
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

// ルートの設定例
router.post('/orders/getOrder', async (req, res) => {
    const { user_id, table_no, order_name } = req.body;

    try {
        // データベースからオーダー情報を取得
        const order = await Orders.findOne({
            where: {
                user_id: user_id,
                table_no: table_no,
                order_name: order_name,
                order_status: 'pending', // 'pending'のオーダーを取得
            },
            include: [{ model: OrderItems }] // 関連するOrderItemsも一緒に取得
        });

        console.log(req.body)
        console.log(order)

        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});


//const escpos = require('escpos');
//escpos.Network = require('escpos-network');

//const device  = new escpos.Network('192.168.0.100'); // プリンターのIPアドレス
//const printer = new escpos.Printer(device);

//device.open(function(){
 // printer
    //.text('Hello World')
   // .cut()
   // .close();
//});


router.post('/orders/pending', async (req, res) => {
    const { client_id } = req.body;
    try {
        const orders = await Orders.findAll({
            where: {
                user_id: client_id,
                order_status: 'pending'
            },
            include: [{ model: OrderItems }] // OrderItemsを含めて取得

        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.post('/orders/updatePayment', async (req, res) => {
    const { order_id, payment_method, order_status } = req.body;

    try {
        const order = await Orders.findByPk(order_id);
        if (order) {
            order.payment_method = payment_method;
            order.order_status = order_status;
            await order.save();
            res.status(200).json({ message: 'Order updated successfully' });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

//const express = require('express');
//const router = express.Router();
//const Orders = require('../models/orders');  // Ordersモデルのインポート
//const OrderItems = require('../models/order_items'); // OrderItemsモデルのインポート

// プリンターしていない注文を取得するエンドポイント
router.get('/orders/unprinted', async (req, res) => {
    try {
        const unprintedOrders = await Orders.findAll({
            where: { coupon_printed: false },
            include: [{
                model: OrderItems,
                as: 'orderItems'
            }]
        });

        res.json(unprintedOrders);
    } catch (error) {
        res.status(500).json({ error: 'データの取得に失敗しました。' });
    }
});

const updateCouponPrintedStatus = async (orderId) => {
    try {
        const result = await Orders.update(
            { coupon_printed: true },
            { where: { id: orderId } }
        );
        
        if (result[0] > 0) {
            console.log(`Order ID ${orderId} のクーポンプリントステータスが更新されました。`);
        } else {
            console.log(`Order ID ${orderId} が見つかりませんでした。`);
        }
    } catch (error) {
        console.error(`Order ID ${orderId} の更新に失敗しました。`, error);
    }
};

router.post('/orders/delete/option', async (req, res) => {
    try {
        const deletedOption = await OrdersOption.destroy({
            where: { id: req.body.id }
        });
        if (deletedOption) {
            res.status(200).json({ message: 'Option deleted successfully' });
        } else {
            res.status(404).json({ message: 'Option not found' });
        }
    } catch (error) {
        console.error('Failed to delete option:', error);
        res.status(500).json({ message: 'Failed to delete option' });
    }
});

// 更新：該当 menu_id のオプションを全削除 → 再登録
router.post('/orders/update/options', async (req, res) => {
    const { menu_id, user_id, options } = req.body;

    if (!menu_id || !user_id || !Array.isArray(options)) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        // 既存削除
        await OrdersOption.destroy({ where: { menu_id } });

        // 再登録
        const createdOptions = await Promise.all(options.map(opt =>
            OrdersOption.create({
                user_id,
                menu_id,
                option_name_en: opt.option_name_en,
                option_name_pt: opt.option_name_pt,
                option_name_ja: opt.option_name_ja,
                additional_price: opt.additional_price || 0
            })
        ));

        res.status(200).json({ message: 'Options updated successfully', data: createdOptions });
    } catch (error) {
        console.error('Failed to update options:', error);
        res.status(500).json({ message: 'Failed to update options' });
    }
});

router.post('/orders/delete/menu', async (req, res) => {
    try {
        const deletedOption = await OrdersMenu.destroy({
            where: { id: req.body.id }
        });
        if (deletedOption) {
            res.status(200).json({ message: 'Option deleted successfully' });
        } else {
            res.status(404).json({ message: 'Option not found' });
        }
    } catch (error) {
        console.error('Failed to delete option:', error);
        res.status(500).json({ message: 'Failed to delete option' });
    }
});

router.post('/orders/add/option', async (req, res) => {
    const { user_id, menu_id, option_name_en, option_name_pt, option_name_ja, additional_price } = req.body;
    // 必須フィールドのバリデーション
    if (!user_id || !menu_id || !option_name_en || !additional_price) {
        return res.status(400).json({ error: 'User ID, Menu ID, Option name (EN), and Additional price are required.' });
    }
    try {
      // 新しいオプションを作成
              const newOption = await OrdersOption.create({
                  user_id: user_id,
                  menu_id: menu_id,
                  option_name_en: option_name_en,
                  option_name_pt: option_name_pt,
                  option_name_ja: option_name_ja,
                  additional_price: additional_price
              });
              res.status(201).json(newOption);
    } catch (error) {
        console.error('Error adding option:', error);
        res.status(500).json({ error: 'Failed to add option' });
    }
});

router.post('/orders/updates/menu', upload.single('menu_image'), async (req, res) => {
  

  try {
    const menuData = JSON.parse(req.body.menuData); // Parse para converter string JSON em objeto
    let menuItem;

    if (menuData.id) {
      // Recupera o item de menu existente para obter a URL da imagem antiga
      const existingMenuItem = await OrdersMenu.findByPk(menuData.id);

      if (!existingMenuItem) {
        return res.status(404).json({ error: 'Item do menu não encontrado.' });
      }

      // Se uma nova imagem foi enviada
      if (req.file) {
        const imageBuffer = req.file.buffer;
        const imageType = req.file.mimetype;
        const imageSize = req.file.size;

        // Verificar se o tamanho da imagem é maior que 2MB
        if (imageSize > 2 * 1024 * 1024) {
          return res.status(400).json({ error: 'A imagem não pode ser maior que 2MB.' });
        }

        // Faz upload da nova imagem para o Space e obtém a nova URL
        const newImageUrl = await uploadImageToSpace(menuData.user_id, req.file);

        // (Opcional) Verifica se uma imagem antiga existe e remove do Space
       // if (existingMenuItem.imagem_string) {
         // await deleteImageFromSpace(existingMenuItem.imagem_string); // Função de remoção explicada abaixo
       // }

        // Atualiza o campo de URL de imagem
        menuData.imagem_string = newImageUrl;
      } else {
        // Mantém a imagem antiga se nenhuma nova for enviada
        menuData.imagem_string = existingMenuItem.imagem_string;
      }

      // Atualizando o item existente do menu
      const updated = await OrdersMenu.update(menuData, {
        where: { id: menuData.id }
      });

      if (updated[0] === 0) {
        return res.status(404).json({ error: 'Item do menu não encontrado.' });
      }

      // Buscar todos os itens de menu do usuário após a atualização
      menuItem = await OrdersMenu.findAll({ where: { user_id: menuData.user_id } });
      return res.status(200).json(menuItem);

    } else {
      // Criar um novo item de menu, se necessário
      if (req.file) {
        const imageBuffer = req.file.buffer;
        const imageType = req.file.mimetype;
        const imageSize = req.file.size;

        if (imageSize > 2 * 1024 * 1024) {
          return res.status(400).json({ error: 'A imagem não pode ser maior que 2MB.' });
        }

        // Faz upload da imagem para o Space e obtém a URL
        const imageUrl = await uploadImageToSpace(menuData.user_id, req.file);
        menuData.imagem_string = imageUrl;
      }

      menuItem = await OrdersMenu.create(menuData);
      return res.status(201).json(menuItem);
    }

  } catch (error) {
    console.error('Error saving menu item:', error);
    res.status(500).json({ error: 'Failed to save menu item' });
  }
});

router.post('/orders/create/menu', upload.single('menu_image'), async (req, res) => {
  const menuData = JSON.parse(req.body.menuData);
  const {
    user_id, category_id,
    menu_name_pt, menu_name_en, menu_name_ja,
    description_pt, description_en, description_ja,
    price, display_order, stock_status, admin_item_name,is_takeout 
  } = menuData;

  try {
    console.log(`【開始】新規メニューの登録 クライアント:${user_id}`);

    const maxDisplayOrder = await OrdersMenu.max('display_order', {
      where: { user_id, category_id }
    });
    const newDisplayOrder = (maxDisplayOrder || 0) + 1;

    let imageUrl = null;
    let imageType = null;

    if (req.file) {
      const imageSize = req.file.size;
      if (imageSize > 2 * 1024 * 1024) {
        return res.status(400).json({ error: 'A imagem não pode ser maior que 2MB.' });
      }

      imageUrl = await uploadImageToSpace(user_id, req.file);
      imageType = req.file.mimetype;
      console.log(imageUrl, 'imageUrl');
    }

    const newMenuItem = await OrdersMenu.create({
      user_id,
      category_id,
      menu_name_pt,
      menu_name_en,
      menu_name_ja,
      description_pt,
      description_en,
      description_ja,
      price,
      display_order: newDisplayOrder,
      stock_status,
      admin_item_name,
      image_type: imageType,
      imagem_string: imageUrl,
      is_takeout
    });

    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Error saving menu item:', error);
    res.status(500).json({ error: 'Failed to save menu item' });
  }
});

router.post('/orders/updateMenuOrder', async (req, res) => {
    const updatedOrder = req.body; // フロントエンドから送信された順序

    try {
        for (let item of updatedOrder) {
            await OrdersMenu.update(
                { display_order: item.display_order }, // 新しい順序を設定
                { where: { id: item.id } } // 対象メニューを指定
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

//App KEirikun 2024/07/15 Created by Paulo
const KeiriUsers = require('../schema/keirikun/user.schema');
const SuppliresKeiri = require('../schema/keirikun/suppliers.schema')
const UserCategory = require('../schema/keirikun/UserCategory.schema');
const Category = require('../schema/keirikun/Category.schema');
const Client = require('../schema/keirikun/client.schema');
const FinancialRecord = require('../schema/keirikun/financial_records.schema');
const financialRecordsController = require('../controllers/keirikun.financialRecordsController');

// PUT エンドポイント
router.put('/keirikun/financial-records/:id', financialRecordsController.updateFinancialRecord);
// DELETE エンドポイントを設定
router.delete('/keirikun/financial-records-delete/:id', financialRecordsController.deleteFinancialRecord);
router.get('/keirikun/annual-summary', async (req, res) => {
    const { year, id } = req.query; // クエリから `id` を取得
    try {
        const records = await FinancialRecord.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('record_date')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('income')), 'total_income'],
                [Sequelize.fn('SUM', Sequelize.col('expense')), 'total_expense']
            ],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('record_date')), year),
                    { user_id: id } // IDフィルタ条件を追加
                ]
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('record_date'))]
        });

        res.status(200).json({ success: true, records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch monthly summary.' });
    }
});

router.post('/keirikun/add/suppliers', async (req, res) => {
    try {
        // user_id から現在の最大 supplier_id を取得
        const maxSupplier = await SuppliresKeiri.findOne({
            where: { user_id: req.body.user_id },
            attributes: [[Sequelize.fn('MAX', Sequelize.col('supplier_id')), 'maxSupplierId']],
            raw: true
        });

        // supplier_id を 1 増加させる
        const nextSupplierId = (maxSupplier.maxSupplierId || 0) + 1;

        // 新しい supplier データを作成
        const supplierData = {
            ...req.body, // リクエストボディのデータをコピー
            supplier_id: nextSupplierId // supplier_id を最大値 + 1 に更新
        };

        // データベースにサプライヤーを作成
        const supplier = await SuppliresKeiri.create(supplierData);

        res.json({ success: true, supplier });
    } catch (error) {
        console.error('登録中にエラーが発生しました:', error);
        res.status(500).json({ success: false, message: '登録に失敗しました', error });
    }
});

// 収入先の追加
router.post('/keirikun/add/clients', async (req, res) => {
    try {
        // user_id から現在の最大 client_id を取得
        const maxClient = await Client.findOne({
            where: { user_id: req.body.user_id },
            attributes: [[Sequelize.fn('MAX', Sequelize.col('client_id')), 'maxClientId']],
            raw: true
        });
        // client_id を 1 増加させる
        const nextClientId = (maxClient.maxClientId || 0) + 1;
        // 新しい client データを作成
        const clientData = {
            ...req.body, // リクエストボディのデータをコピー
            client_id: nextClientId // client_id を最大値 + 1 に更新
        };
        // データベースにクライアントを作成
        const client = await Client.create(clientData);
        res.json({ success: true, client });
    } catch (error) {
        console.error('登録中にエラーが発生しました:', error);
        res.status(500).json({ success: false, message: '登録に失敗しました', error });
    }
});

//年度の取得
router.get('/keirikun/category-summary/:year/:month/:id', async (req, res) => {
  console.log('keirikun is')
    const { year, month, id } = req.params;
    console.log('year is:' + year)
    console.log(`id is :` +id)
    try {
        const records = await FinancialRecord.findAll({
            attributes: [
                'party_code',
                [Sequelize.fn('SUM', Sequelize.col('income')), 'total_income'],
                [Sequelize.fn('SUM', Sequelize.col('expense')), 'total_expense']
            ],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('record_date')), year),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('record_date')), month)
                ],
                user_id:id
            },
            group: ['party_code']
        });

        res.status(200).json({ success: true, records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch category summary.' });
    }
});

router.post('/keirikun/updateSettings', async (req, res) => {
    try {
      const { id,current_password,representativeName,language,confirm_password,password,email } = req.body;
      console.log(req.body)
        // ユーザーをDBから検索
        const user = await KeiriUsers.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'ユーザーが見つかりません' });
        }
        if (current_password) {
            // 現在のパスワードとDBのハッシュ化パスワードを比較
            const match = await verifyPassword(current_password, user.password);
            if (!match) {
                return res.status(401).json({ message: '現在のパスワードが正しくありません' });
            }

                user.password = await encryptPassword(password);

        }
        if(email){
          user.username = email
        }
        if(representativeName){
          user.representative_name = representativeName;
        }
        if(language){
          user.language = language
        }

        const result = await user.save();
        res.json({
            message: '設定が正常に更新されました',
            user: {
                id: user.id,
                username: user.username,
                language: user.language
            }
        });
    } catch (error) {
        console.error('エラー発生:', error);
        res.status(500).json({ message: '設定の更新に失敗しました', error: error.message });
    }
});


// const { Client, Supplier } = require('../../models');
const jwt = require('jsonwebtoken'); // ここでjsonwebtokenをインポート
// const bcrypt = require('bcrypt'); // bcryptをインポート

UserCategory.belongsTo(Category, { foreignKey: 'category_id', targetKey: 'identification_id' });
Category.hasMany(UserCategory, { foreignKey: 'category_id', sourceKey: 'identification_id' });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token); // トークンを表示

  if (!token) {
    console.log('Token is missing');
    return res.sendStatus(401);
  }

  jwt.verify(token, 'abracadabra', (err, user) => {
    if (err) {
      console.log('Token verification failed', err);
      return res.sendStatus(403);
    }
    console.log('Token verified successfully', user);
    req.user = user;
    next();
  });
};

router.get('/keirikun/masterdata/get', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // トークンから取得
    console.log('User ID:', userId); // ユーザーIDの内容をログ出力
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // サプライヤーデータの取得
    const suppliers = await SuppliresKeiri.findAll({
      where: { user_id: userId }
    });

    // ユーザーカテゴリデータの取得
    const userCategories = await UserCategory.findAll({
      where: { user_id: userId },
      include: [{
        model: Category,
        required: true
      }]
    });

    const clients = await Client.findAll({
    where: { user_id: userId }
  });

    res.status(200).json({
      success: true,
      data: {
        suppliers,
        userCategories,
        clients
      }
    });
  } catch (err) {
    console.error('Error fetching master data:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch master data',
      error: err.message
    });
  }
});

// 支出データの登録エンドポイント
router.post('/keirikun/data/regist/otherImportantRegister', authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        const { userId, date, amount, kubun, memo } = req.body;

        console.log('user id is ' + userId);

        // 入力チェック
        if (!date || !amount || !userId || kubun === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            });
        }

        // 金額を数値に変換
        const parsedAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));

        // 処理内容を設定
        const actions = {
            0: { description: '銀行引出', from: 'bank', to: 'cash'},
            1: { description: '銀行預入', from: 'cash', to: 'bank' },
            // 3: { description: '事業主借', from: 'cash', to: 'bank',code:327 },
            // 4: { description: '事業主借', from: 'cash', to: 'bank',code:327 }
        };

        const action = actions[kubun];
        if (!action) {
            return res.status(400).json({
                success: false,
                message: 'Invalid kubun value'
            });
        }

        // データ作成
        await createDataOtherRegistKeirikun({
            record_date: date,
            party_code: 999,
            description: `内容:${action.description}　メモ:${memo}`,
            user_id: userId,
            payment_method: action.from,
            created_at: new Date(),
            updated_at: new Date(),
            expense: parsedAmount
        });

        await createDataOtherRegistKeirikun({
            record_date: date,
            party_code: 999,
            description: `内容:${action.description}　メモ:${memo}`,
            user_id: userId,
            payment_method: action.to,
            created_at: new Date(),
            updated_at: new Date(),
            income: parsedAmount
        });

        res.status(201).json({
            success: true,
            message: 'Expense recorded successfully'
        });
    } catch (error) {
        console.error('Error recording expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record expense',
            error: error.message
        });
    }
});

async function createDataOtherRegistKeirikun(data) {
    return await FinancialRecord.create(data);
}

// 支出データの登録エンドポイント
router.post('/keirikun/data/regist/expenses', authenticateToken, async (req, res) => {
    try {
      console.log(req.body)
    const { userId, date, supplier, method, amount, memo, category, kubun } = req.body;
    console.log(supplier)
    console.log('user id is'+ userId)
    // 入力チェック
    if (!date || !supplier || !amount || !category) {
        return res.status(400).json({
            success: false,
            message: 'Required fields are missing'
        });
    }
        // データの登録
        const newRecord = await FinancialRecord.create({
            record_date: date,
            party_code: category,
            description: `取引先:${supplier} 内容:${memo}`,

            user_id: userId,
            category_id: category,
            payment_method: method,
            created_at: new Date(),
            updated_at: new Date(),
            expense:kubun===0?parseFloat(amount.replace(/[^\d.-]/g, '')):null,
            income:kubun===1?parseFloat(amount.replace(/[^\d.-]/g, '')):null
            // kubun===0?expense: parseFloat(amount.replace(/[^\d.-]/g, '')):income:parseFloat(amount.replace(/[^\d.-]/g, '')), // 金額を数値に変換:
        });

        res.status(201).json({
            success: true,
            data: newRecord,
            message: 'Expense recorded successfully'
        });
    } catch (error) {
        console.error('Error recording expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record expense',
            error: error.message
        });
    }
});

// 支出データ（更新・登録）エンドポイント
router.post('/keirikun/data/upsert/expenses/by/orderskun', authenticateToken, async (req, res) => {
    try {
        const { userId, date, supplier, method, amount, memo, category, kubun } = req.body;

        // 入力チェック
        if (!date || !supplier || !amount || !category) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            });
        }

        console.log('keirikun no jyoutai')
        console.log(date)
        console.log(category)
        console.log(userId)

        // 既存データの削除
        await FinancialRecord.destroy({
            where: {
                record_date: {
                    [Op.gte]: `${date} 00:00:00`,
                    [Op.lt]:  `${date} 23:59:59`
                },
                party_code: category,
                user_id: userId
            }
        });

        // 新規登録
        const newRecord = await FinancialRecord.create({
            record_date: date,
            party_code: category,
            description: `取引先:${supplier} 内容:${memo}`,
            user_id: userId,
            category_id: category,
            payment_method: method,
            created_at: new Date(),
            updated_at: new Date(),
            expense: kubun === 0 ? parseFloat(amount.replace(/[^\d.-]/g, '')) : null,
            income: kubun === 1 ? parseFloat(amount.replace(/[^\d.-]/g, '')) : null
        });

        res.status(201).json({
            success: true,
            data: newRecord,
            message: 'Expense upserted successfully'
        });

    } catch (error) {
        console.error('Error upserting expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upsert expense',
            error: error.message
        });
    }
});

// 支出データの登録エンドポイント
router.post('/keirikun/data/regist/RegisterShakinOrKari', authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        const { userId, date, amount, kubun, memo } = req.body;

        if (!date || !amount || !userId || kubun === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            });
        }
        // 金額を数値に変換
        const parsedAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));

        // 処理内容を設定
        const actions = {
            2: { description: '事業主貸し', from: 'bank', to: 'bank',code:189 },
            3: { description: '事業主借り', from: 'bank', to: 'bank',code:327 },
            // 3: { description: '事業主借', from: 'cash', to: 'bank',code:327 },
            // 4: { description: '事業主借', from: 'cash', to: 'bank',code:327 }
        };

        const action = actions[kubun];
        if (!action) {
            return res.status(400).json({
                success: false,
                message: 'Invalid kubun value'
            });
        }
        // データ作成
        await createDataOtherRegistKeirikun({
            record_date: date,
            party_code: action.code,
            description: `内容:${action.description}　メモ:${memo}`,
            user_id: userId,
            payment_method: action.from,
            created_at: new Date(),
            updated_at: new Date(),
            expense:kubun===2?parsedAmount:null,
            income:kubun===3?parsedAmount:null
        });
        res.status(201).json({
            success: true,
            message: 'Expense recorded successfully'
        });
    } catch (error) {
        console.error('Error recording expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record expense',
            error: error.message
        });
    }
});

router.post('/keirikun/data/regist/income', authenticateToken, async (req, res) => {
  console.log(req.body)
  const { userId, date, clients, method, amount, memo, category } = req.body;

  // 入力チェック
  if (!date || !clients || !amount || !category) {
    console.log(2853)
    return res.status(400).json({
      success: false,
      message: 'Required fields are missing'
    });
  }

  try {
    // データの登録
    const newRecord = await FinancialRecord.create({
      record_date: date,
      payment_method: method,
      party_code: category,
      // party_name: client,
      description: `請求先:${clients} 内容:${memo}`,
      income: parseFloat(amount.replace(/[^\d.-]/g, '')), // 金額を数値に変換
      user_id: userId
    });

    res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Income recorded successfully'
    });
  } catch (error) {
    console.error('Error recording income:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record income',
      error: error.message
    });
  }
});

// router.put('/keirikun/settings/update', authenticateToken, async (req, res) => {
//     const userId = req.user.id; // トークンからユーザーIDを取得
//     const { password, email, language, invoice_number, company_name, phone_number } = req.body;
//
//     try {
//         const user = await User.findByPk(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//
//         user.password = password || user.password; // パスワードが提供されていない場合、既存のパスワードを保持
//         user.email = email || user.email;
//         user.language = language || user.language;
//         user.invoice_number = invoice_number || user.invoice_number;
//         user.company_name = company_name || user.company_name;
//         user.phone_number = phone_number || user.phone_number;
//
//         await user.save();
//
//         res.status(200).json({ success: true, message: 'Settings updated successfully' });
//     } catch (error) {
//         console.error('Error updating settings:', error);
//         res.status(500).json({ success: false, message: 'Failed to update settings' });
//     }
// });


router.get('/keirikun/data/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // トークンからユーザーIDを取得
        const { startDate, endDate } = req.query; // クエリパラメータから日付範囲を取得
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Both startDate and endDate are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999); // End dateを23:59:59に設定して1日の範囲をカバー

        const startISO = start.toISOString();
        const endISO = end.toISOString();


        // SQLクエリを実行してデータを取得
        const records = await FinancialRecord.findAll({
            where: {
                user_id: userId,
                record_date: {
                    [Sequelize.Op.between]: [startISO, endISO]
                }
            },
            order: [['record_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            records
        });
    } catch (err) {
        console.error('Error fetching history data:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch history data',
            error: err.message
        });
    }
});


router.put('/keirikun/data/update', authenticateToken, async (req, res) => {
    const { id, date, amount, memo } = req.body;

    console.log(req.body);
    try {
        const record = await FinancialRecord.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }
        record.record_date = date;
        if (record.income !== null) {
            record.income = amount;
        } else {
            record.expense = amount;
        }
        record.description = memo;
        await record.save();

        res.status(200).json({ success: true, message: 'Record updated successfully' });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ success: false, message: 'Failed to update record' });
    }
});


router.delete('/keirikun/data/delete', authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        const record = await FinancialRecord.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        await record.destroy();
        res.status(200).json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ success: false, message: 'Failed to delete record' });
    }
});

// ユーザー情報取得エンドポイント
router.get('/keirikun/user-info', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
     console.log("ID is: "+userId)
    try {
        const user = await KeiriUsers.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        console.log(user)

        res.status(200).json({
            email: user.email,
            language: user.language,
            invoice_number: user.invoiceNumber,
            company_name: user.companyName,
            phone_number: user.phoneNumber
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user info' });
    }
});

// 設定更新エンドポイント
router.put('/keirikun/settings/update', authenticateToken, async (req, res) => {
    console.log('update backend its is');
    const userId = req.user.userId;
    console.log("ID is: " + userId);
    const { email, language, invoice_number, company_name, phone_number } = req.body;

    console.log(req.body);

    try {
        const user = await KeiriUsers.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (email) user.email = email;
        if (language) user.language = language;
        if (invoice_number) {
            console.log("Updating invoice_number: ", invoice_number);
            user.invoiceNumber = invoice_number;
        }
        if (company_name) {
            console.log("Updating company_name: ", company_name);
            user.companyName = company_name;
        }
        if (phone_number) {
            console.log("Updating phone_number: ", phone_number);
            user.phoneNumber = phone_number;
        }

        await user.save();

        res.status(200).json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
});


// パスワード変更エンドポイント
router.put('/keirikun/settings/change-password', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    console.log("ID is: " + userId);
    const { current_password, new_password } = req.body;

    try {
        const user = await KeiriUsers.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const validPassword = await verifyPassword(current_password, user.password); // comparePasswordをverifyPasswordに変更
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = await encryptPassword(new_password);
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Failed to update password' });
    }
});

// 新しいトークンを発行するエンドポイント
router.post('/keirikun/new-token', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { language } = req.body;

    try {
        const user = await KeiriUsers.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 新しいトークンを作成
        const newToken = jwt.sign({ userId: user.id, language: language || user.language }, 'abracadabra', { expiresIn: '1h' });

        res.status(200).json({ success: true, token: newToken });
    } catch (error) {
        console.error('Error creating new token:', error);
        res.status(500).json({ success: false, message: 'Failed to create new token' });
    }
});


// 収入データ取得エンドポイント
router.get('/keirikun/data/income', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const startDate = new Date(date);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    const startISO = startDate.toISOString();
    const endISO = new Date(endDate.setUTCHours(23, 59, 59, 999)).toISOString();

    try {
        const records = await FinancialRecord.findAll({
            where: {
                user_id: userId,
                income: { [Op.ne]: null },
                record_date: {
                    [Op.between]: [startISO, endISO]
                }
            },
            attributes: ['record_date', 'income'],
            order: [['record_date', 'ASC']]
        });

        const data = records.map(record => ({
            date: record.record_date,
            amount: record.income
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching income data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch income data' });
    }
});

// 支出データ取得エンドポイント
router.get('/keirikun/data/expense', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const startDate = new Date(date);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    const startISO = startDate.toISOString();
    const endISO = new Date(endDate.setUTCHours(23, 59, 59, 999)).toISOString();

    try {
        const records = await FinancialRecord.findAll({
            where: {
                user_id: userId,
                expense: { [Op.ne]: null },
                record_date: {
                    [Op.between]: [startISO, endISO]
                }
            },
            attributes: ['record_date', 'expense'],
            order: [['record_date', 'ASC']]
        });

        const data = records.map(record => ({
            date: record.record_date,
            amount: record.expense
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching expense data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch expense data' });
    }
});

// クライアントとサプライヤーを取得するエンドポイント
router.get('/partners', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        // クライアントとサプライヤーを取得
        const clients = await Client.findAll({ where: { user_id: userId } });
        const suppliers = await SuppliresKeiri.findAll({ where: { user_id: userId } });

        res.json({ success: true, clients, suppliers });
    } catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching partners' });
    }
});

router.put('/partners/:type/:id', authenticateToken, async (req, res) => {
    const { type, id } = req.params;
    const updatedData = req.body;
    try {
        if (type === 'client') {
            await Client.update(updatedData, { where: { id } });
        } else if (type === 'supplier') {
            await SuppliresKeiri.update(updatedData, { where: { id } });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }
        res.json({ success: true, message: 'Partner updated successfully' });
    } catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).json({ success: false, message: 'Failed to update partner' });
    }
});


// 新しいパートナーを追加
router.post('/partners', authenticateToken, async (req, res) => {
    const { name, type, address, phone, contact_person } = req.body;
    const userId = req.user.userId;

    try {
        // 既存のパートナー名を確認
        if (type === 'supplier') {
            const existingSupplier = await SuppliresKeiri.findOne({ where: { user_id: userId, supplier_name: name } });
            if (existingSupplier) {
                return res.status(400).json({ success: false, message: 'Supplier name already exists' });
            }
        } else if (type === 'customer') {
            const existingClient = await Client.findOne({ where: { user_id: userId, client_name: name } });
            if (existingClient) {
                return res.status(400).json({ success: false, message: 'Client name already exists' });
            }
        }

        // 最大値を取得し、新しいIDを生成
        let newId = 1;
        if (type === 'supplier') {
            const maxSupplier = await SuppliresKeiri.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('supplier_id')), 'maxId']],
                where: { user_id: userId }
            });
            newId = (maxSupplier.dataValues.maxId || 0) + 1;
        } else if (type === 'customer') {
            const maxClient = await Client.findOne({
                attributes: [[Sequelize.fn('MAX', Sequelize.col('client_id')), 'maxId']],
                where: { user_id: userId }
            });
            newId = (maxClient.dataValues.maxId || 0) + 1;
        }

        // 新しいパートナーを作成
        if (type === 'customer') {
            await Client.create({
                client_id: newId,
                client_name: name,
                client_address: address,
                client_phone: phone,
                client_contact_person: contact_person,
                user_id: userId
            });
        } else if (type === 'supplier') {
            await SuppliresKeiri.create({
                supplier_id: newId,
                supplier_name: name,
                supplier_address: address,
                supplier_phone: phone,
                supplier_contact_person: contact_person,
                user_id: userId
            });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid partner type' });
        }
        res.json({ success: true, message: 'Partner added successfully' });
    } catch (error) {
        console.error('Error adding partner:', error);
        res.status(500).json({ success: false, message: 'An error occurred while adding the partner' });
    }
});

// パートナー情報の削除
router.delete('/partners/:type/:id', authenticateToken, async (req, res) => {
    const { type, id } = req.params;
    try {
        if (type === 'client') {
            await Client.destroy({ where: { id } });
        } else if (type === 'supplier') {
            await SuppliresKeiri.destroy({ where: { id } });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid type' });
        }
        res.json({ success: true, message: 'Partner deleted successfully' });
    } catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).json({ success: false, message: 'Failed to delete partner' });
    }
});

//タイ旅行のための暫定APP
const ImageUpload = require('../schema/imagesSystem/uploadImage');
router.post('/tairyokou/upload', upload.single('image'), async (req, res) => {
    try {

      console.log('image hozon start')
        const { date, comment } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: '画像がアップロードされていません' });
        }

        // S3またはDigitalOcean Spacesに画像をアップロード
        const imageUrl = await uploadImageToSpaceNaisho(10000, req.file);

        // データベースに保存
        const newRecord = await ImageUpload.create({
            user_id: 10000, // ユーザーID
            image_url: imageUrl,
            date,
            comment,
        });

        res.status(201).json({ message: 'アップロード成功', record: newRecord });
    } catch (error) {
        console.error('画像アップロード中にエラー:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

router.get('/tairyokou/images', async (req, res) => {
    try {
        // 全ての画像を取得
        const images = await ImageUpload.findAll({
            attributes: ['id', 'image_url', 'date', 'comment'], // 必要なフィールドのみ取得
            order: [['date', 'ASC']], // 日付順にソート（必要に応じて変更）
        });

        if (images.length === 0) {
            return res.status(404).json({ message: '画像が見つかりませんでした' });
        }

        res.status(200).json({ images });
    } catch (error) {
        console.error('画像取得中にエラーが発生しました:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

const uploadImageToSpaceNaisho = async (userId, file) => {
  try {
    // Recupera o usuário pelo ID para obter o nome da pasta (pode ser personalizado conforme sua lógica)
    // const user = await OrdersUser.findByPk(userId);
    //
    // if (!user) {
    //   throw new Error('Usuário não encontrado');
    // }

    // Cria a pasta com base no ID ou nome do usuário
    const folderName = `clients/${userId}-Tailandia`;

    // Configura o nome do arquivo e o caminho no Space
    const fileName = `${folderName}/${Date.now()}-${file.originalname}`;

    // Faz o upload do arquivo
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read', // Deixa a imagem acessível publicamente
      ContentType: file.mimetype, // Define o tipo MIME
    };

    const data = await s3.upload(params).promise();
    return data.Location; // URL gerada pelo Space
  } catch (error) {
    console.error('Erro ao fazer upload para o Space:', error);
    throw error;
  }
};


// ログイン処理
router.post('/access/hiketsu/login', (req, res) => {

  const correctAnswers = {
  answer1: '26', // 質問1の答え
  answer2: '4',     // 質問2の答え
};
    const { answer1, answer2 } = req.body;

    if (!answer1 || !answer2) {
        return res.status(400).json({ error: 'すべての質問に答えてください' });
    }

    // 答えを検証
    if (
        answer1.toLowerCase() === correctAnswers.answer1.toLowerCase() &&
        answer2 === correctAnswers.answer2
    ) {
        return res.status(200).json({ message: 'ログイン成功!' });
    }

    return res.status(401).json({ error: '回答が正しくありません' });
});



const ImageUploadAccess = require('../schema/imagesSystem/uploadImageAccess');
router.post('/access/upload', upload.single('image'), async (req, res) => {
    try {

      console.log('image hozon start')
        const { date, comment } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: '画像がアップロードされていません' });
        }

        // S3またはDigitalOcean Spacesに画像をアップロード
        const imageUrl = await uploadImageToSpaceNaishoAccess(20000, req.file);

        // データベースに保存
        const newRecord = await ImageUploadAccess.create({
            user_id: 20000, // ユーザーID
            image_url: imageUrl,
            date,
            comment,
        });

        res.status(201).json({ message: 'アップロード成功', record: newRecord });
    } catch (error) {
        console.error('画像アップロード中にエラー:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});


const uploadImageToSpaceNaishoAccess = async (userId, file) => {
  try {
    // Recupera o usuário pelo ID para obter o nome da pasta (pode ser personalizado conforme sua lógica)
    // const user = await OrdersUser.findByPk(userId);
    //
    // if (!user) {
    //   throw new Error('Usuário não encontrado');
    // }

    // Cria a pasta com base no ID ou nome do usuário
    const folderName = `clients/${userId}-Tailandia`;

    // Configura o nome do arquivo e o caminho no Space
    const fileName = `${folderName}/${Date.now()}-${file.originalname}`;

    // Faz o upload do arquivo
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read', // Deixa a imagem acessível publicamente
      ContentType: file.mimetype, // Define o tipo MIME
    };

    const data = await s3.upload(params).promise();
    return data.Location; // URL gerada pelo Space
  } catch (error) {
    console.error('Erro ao fazer upload para o Space:', error);
    throw error;
  }
};


router.get('/access/images', async (req, res) => {
    try {
        const images = await ImageUploadAccess.findAll({
            attributes: ['id', 'image_url', 'date', 'comment'],
            order: [['date', 'ASC']],
        });

        if (images.length === 0) {
            return res.status(404).json({ message: '画像が見つかりませんでした' });
        }

        res.status(200).json({ images });
    } catch (error) {
        console.error('画像取得中にエラーが発生しました:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});


/////////////////////////道場管理システム修正版///////////////////////////////////////
router.get('/gyminfoall', async (req, res) => {
  try {
    console.log(req.query.id)
    const gymId = req.query.id;

    // 並列実行で高速化
    const [graduationlist, paymentlist, members] = await Promise.all([
      Graduation.findAll({
        where: { GYM_ID: gymId }
      }),
      Pay.findAll({
        where: { division: 1, GYM_ID: gymId }
      }),
      Member.findAll({
        where: { status: "active", gymid: gymId }
      })
    ]);

    // まとめて返す
    res.json({
      graduationlist,
      paymentlist,
      members
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'データ取得に失敗しました', details: err });
  }
});




// module.exports = router;


//keirikun final



////////////////////////////////////////////////////////////////////////////////





















