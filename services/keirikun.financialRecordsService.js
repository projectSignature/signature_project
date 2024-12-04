const FinancialRecord = require('../schema/keirikun/financial_records.schema.js');

// レコードを更新するサービス関数
async function updateRecord(id, updatedData) {
    const record = await FinancialRecord.findByPk(id);
    if (!record) {
        return null;
    }

    record.description = updatedData.description || record.description;
    record.memo = updatedData.memo || record.memo;
    record.payment_method = updatedData.payment_method
    record.party_code = updatedData.party_code
    console.log('payment mthod is '+ updatedData.payment_method)
    console.log('party_code is '+ updatedData.party_code)

    if (updatedData.income !== undefined) {
        record.income = updatedData.income;
    } else if (updatedData.expense !== undefined) {
        record.expense = updatedData.expense;
    }

    await record.save();
    return record;
}

// レコードを削除するサービス
async function deleteRecord(id) {
    // データベース内の該当レコードを削除
    const result = await FinancialRecord.destroy({ where: { id } });

    // 削除が成功した場合は 1、それ以外は 0
    return result > 0;
}

module.exports = {
    updateRecord,
    deleteRecord
};
