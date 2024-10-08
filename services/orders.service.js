const Orders = require('../schema/orders/orders_ver2');
const OrderItems = require('../schema/orders/order_items_ver2');

const orderService = {
    // 既存の注文を確認して更新する
    updateExistingOrder: async (user_id, table_no, order_name, items, orderID) => {
        let existingOrder = await Orders.findOne({
            where: {
                user_id: user_id,
                table_no: table_no,
                order_name: order_name,
                order_status: 'pending',
                id:orderID
            },
            order: [['id', 'DESC']]
        });
        console.log(existingOrder)
        if (existingOrder) {
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
                coupon_printed: false,
                created_at: new Date(),
                updated_at: new Date()
            }));
            await OrderItems.bulkCreate(orderItems);

            const additionalAmount = items.reduce((acc, item) => acc + (item.amount * item.quantity), 0);
            existingOrder.total_amount = parseFloat(existingOrder.total_amount) + parseFloat(additionalAmount);
            existingOrder.updated_at = new Date();

            await existingOrder.save();

            return { message: 'Order updated successfully', success: true };
        }
        return { message: 'No existing order found', success: false };
    },

    // 新規注文を作成する
    createNewOrder: async (user_id, table_no, order_name, items) => {
        const newOrder = await Orders.create({
            user_id: user_id,
            table_no: table_no,
            order_name: order_name,
            total_amount: items.reduce((acc, item) => acc + (item.amount * item.quantity), 0),
            order_status: 'pending',
            coupon_printed: false,
            created_at: new Date(),
            updated_at: new Date()
        });

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

        return { message: 'Order confirmed successfully', success: true };
    },
    getPendingOrders: async (client_id, table_no) => {
      console.log(client_id, table_no)
      try {
          // 検索条件を動的に構築
          const whereCondition = {
              user_id: client_id,
              order_status: 'pending'
          };
          // table_no が指定されている場合は条件に追加
          if (table_no) {
              whereCondition.table_no = table_no;
          }
          const orders = await Orders.findAll({
              where: whereCondition, // 動的に構築された条件を使用
              include: [{ model: OrderItems }]
          });
          return orders;
      } catch (error) {
          throw new Error('Failed to fetch pending orders');
      }
  },
  // 注文アイテムのステータスを更新するサービス
   updateOrderItemStatus: async (orderItemId, newStatus) => {
       try {
           const orderItem = await OrderItems.findOne({
               where: { id: orderItemId }
           });

           if (!orderItem) {
               return { message: 'Order item not found', success: false };
           }

           // ステータスを更新
           orderItem.serve_status = newStatus;
           await orderItem.save();

           // 該当する order_id の他の OrderItems をチェック
             const pendingItems = await OrderItems.findAll({
                 where: {
                     order_id: orderItem.order_id,
                     serve_status: 'pending'  // まだ提供されていないものを取得
                 }
             });

             if (pendingItems.length === 0) {
                 // 全てのアイテムが提供済みなら、Orders の order_status を confirmed に更新
                 const order = await Orders.findOne({
                     where: { id: orderItem.order_id }
                 });

                 if (order) {
                     order.order_status = 'confirmed';
                     await order.save();
                 }

                 return { message: 'Order item status updated, and order confirmed', success: true };
             }

           return { message: 'Order item status updated successfully', success: true };
       } catch (error) {
           throw new Error('Failed to update order item status');
       }
   },
   // alarm_enabledを更新するメソッドを追加
   updateAlarmStatus: async (orderId, newStatus) => {
     try {
         const order = await Orders.findOne({ where: { id: orderId } });

         if (!order) {
             return { success: false };
         }

         // alarm_enabled を newStatus に更新
         order.alarm_enabled = newStatus;
         await order.save();

         return { success: true };
     } catch (error) {
         throw new Error('Failed to update alarm status');
     }
 },
 // オーダーと関連するアイテムを削除する
 deleteOrder: async (orderId) => {
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
       return { success: false, message: '注文が見つかりません' };
     }

     return { success: true, message: '注文と関連アイテムが削除されました' };
   } catch (error) {
     throw new Error('注文の削除中にエラーが発生しました');
   }
 }
};

module.exports = orderService;
