const financialRecordsService = require('../services/keirikun.financialRecordsService');

// レコードを更新するコントローラ
async function updateFinancialRecord(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedRecord = await financialRecordsService.updateRecord(id, updatedData);
        if (!updatedRecord) {
            return res.status(404).json({ error: 'Record not found' });
        }
        return res.status(200).json({ message: 'Record updated successfully', record: updatedRecord });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while updating the record' });
    }
}

// レコードを削除するコントローラ
async function deleteFinancialRecord(req, res) {
    const { id } = req.params;

    try {
        const deleted = await financialRecordsService.deleteRecord(id);
        if (deleted) {
            return res.status(200).json({ message: 'Record deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while deleting the record' });
    }
}

module.exports = {
    updateFinancialRecord,
    deleteFinancialRecord
};
