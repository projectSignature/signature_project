
const orderService = require('../services/orders.service');

const orderController = {
    confirmOrder: async (req, res) => {
        const { order_name, user_id, table_no, items, orderId,pickup_time } = req.body;
        try {
            // 既存の注文を確認
            let result = await orderService.updateExistingOrder(user_id, table_no, order_name, items, orderId);
            if (!result.success) {
                // 新規注文を作成
                result = await orderService.createNewOrder(user_id, table_no, order_name, items,pickup_time);
                  res.status(200).json({ message: result.message,newflug: true, order: result.order, orderItems:result.orderItems});
            }else{
              res.status(200).json({ message: result.message,newflug: false});
            }
        } catch (error) {
            console.error('Error confirming order:', error);
            res.status(500).json({ error: 'Failed to confirm order' });
        }
    },
    getPendingOrders: async (req, res) => {
        const { client_id, table_no } = req.body; // table_no を追加で取得
        try {
            const orders = await orderService.getPendingOrders(client_id, table_no); // table_no をサービスに渡す
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },
    getOrdersByStatus: async (req, res) => {
        const { client_id, table_no,status } = req.body; // table_no を追加で取得
        try {
            const orders = await orderService.getOrdersByStatus(client_id, table_no,status); // table_no をサービスに渡す
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },
    // 新しいエンドポイント: 注文アイテムのステータス更新
   updateOrderStatus: async (req, res) => {
       const { orderItemId, newStatus } = req.body;  // フロントから送信されたデータを取得
       try {
           const result = await orderService.updateOrderItemStatus(orderItemId, newStatus);
           res.status(200).json({ message: result.message });
       } catch (error) {
           console.error('Error updating order item status:', error);
           res.status(500).json({ error: 'Failed to update order item status' });
       }
   },
   // alarm_enabled を true または false に更新するメソッド
   updateAlarmStatus: async (req, res) => {
       const { orderId, alarmStatus } = req.body;  // リクエストから orderId と alarmStatus を取得
       try {
           // サービスを呼び出して alarm_enabled を更新
           const result = await orderService.updateAlarmStatus(orderId, alarmStatus);
           if (result.success) {
               res.status(200).json({ message: 'Alarm status updated successfully' });
           } else {
               res.status(404).json({ message: 'Order not found' });
           }
       } catch (error) {
           console.error('Error updating alarm status:', error);
           res.status(500).json({ error: 'Failed to update alarm status' });
       }
   },
   deleteOrder: async (req, res) => {
    const orderId = req.params.orderId; // パラメータから orderId を取得
    try {
      // サービス層を呼び出してオーダーとアイテムを削除
      const result = await orderService.deleteOrder(orderId);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '注文の削除中にエラーが発生しました' });
    }
  },
  updatePayment: async (req, res) => {
        const { order_id, payment_method, order_status } = req.body;

        const result = await orderService.updateOrderPayment(order_id, payment_method, order_status);
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else if (result.error === 'Order not found') {
            res.status(404).json({ error: result.error });
        } else {
            res.status(500).json({ error: result.error });
        }
    },
    updateConfirmd: async (req, res) => {
          const { order_id, order_status } = req.body;

          const result = await orderService.updateConfirmd(order_id, order_status);
          if (result.success) {
              res.status(200).json({ message: result.message });
          } else if (result.error === 'Order not found') {
              res.status(404).json({ error: result.error });
          } else {
              res.status(500).json({ error: result.error });
          }
      },
      getOrdersByPickupTime : async (req, res) => {
    try {
        const { pickupTime,clientsId } = req.query;  // クエリパラメータからpickup_timeを取得
        if (!pickupTime) {
            return res.status(400).json({ message: 'pickup_time is required' });
        }
        console.log(pickupTime,clientsId)

        const orders = await orderService.getOrdersByPickupTime(pickupTime,clientsId);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the given pickup time' });
        }

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error in getOrdersByPickupTime controller:', error);
        return res.status(500).json({ message: 'Server error' });
    }
},

};

module.exports = orderController;
