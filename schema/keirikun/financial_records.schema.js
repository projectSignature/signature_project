const Sequelize = require('sequelize');
const database = require('../../registerDb');

const FinancialRecord = database.define('financial_records', {
    record_date: {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('record_date');
            if (rawValue) {
                const date = new Date(rawValue);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}.${month}.${day}`;
            }
            return null;
        }
    },
    settlement: {
        type: Sequelize.STRING,
        allowNull: true
    },
    voucher_number: {
        type: Sequelize.STRING,
        allowNull: true
    },
    department_code: {
        type: Sequelize.STRING,
        allowNull: true
    },
    party_code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    party_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    party_branch_number: {
        type: Sequelize.STRING,
        allowNull: true
    },
    party_branch_summary: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    party_branch_kana: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    income: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
    },
    expense: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
    },
    balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
    },
    tax_category: {
        type: Sequelize.STRING,
        allowNull: true
    },
    purchase_category: {
        type: Sequelize.STRING,
        allowNull: true
    },
    sales_industry_category: {
        type: Sequelize.STRING,
        allowNull: true
    },
    journal_entry_category: {
        type: Sequelize.STRING,
        allowNull: true
    },
    consideration: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dummy1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dummy2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dummy3: {
        type: Sequelize.STRING,
        allowNull: true
    },
    evidence_number: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bill_number: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bill_due_date: {
        type: Sequelize.DATE,
        allowNull: true
    },
    sticky_note_number: {
        type: Sequelize.STRING,
        allowNull: true
    },
    sticky_note_comment: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    payment_method: {
        type: Sequelize.STRING,
        allowNull: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false // 初期値は未確定
    }
}, {
    timestamps: false
});

module.exports = FinancialRecord;
