const Sequelize = require('sequelize');
const database = require('../db');
const mSuppliers = require('./m_suppliers');
const costCategory = require('./costCategory');

const Costrests = database.define('costrest', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    worker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    cost_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    amount: {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    payday:{
      type: Sequelize.DATE,
      validate: {
       notEmpty: {
          msg: "Esse campo não pode está vazio.."
       },
      }
    },
    memo:{
      type:Sequelize.STRING(200),
      allowNull: false
    },
    paykubun: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
         notEmpty: {
            msg: "Esse campo não pode está vazio.."
         },
        }
    },
    seq:{
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
       notEmpty: {
          msg: "Esse campo não pode está vazio.."
       },
      }
    },
    suppliers_id:{
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    checked_kubun:{
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    category:{
      type: Sequelize.INTEGER,
      allowNull: false,
    }
});

Costrests.belongsTo(mSuppliers, { foreignKey: 'suppliers_id', as: 'supplier' });
// Costrests.belongsTo(costCategory, { foreignKey: 'cost_id', as: 'kamokus' });
Costrests.belongsTo(costCategory, {
  foreignKey: 'cost_id',
  as: 'kamokus',
  targetKey: 'control_id', // costCategory テーブルの特定のカラムを指定
  // または
  // targetKey: costCategory.col,
});



module.exports = Costrests;
