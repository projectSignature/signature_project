const Orders = require('../schema/orders/orders_ver2');
const OrderItems = require('../schema/orders/order_items_ver2');
const { Op } = require('sequelize');

const orderService = {
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
                total_price: item.amount ,//* item.quantity
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
    createNewOrder: async (user_id, table_no, order_name, items,pickup_time) => {
        const newOrder = await Orders.create({
            user_id: user_id,
            table_no: table_no,
            order_name: order_name,
            total_amount: items.reduce((acc, item) => acc + (item.amount ), 0),//* item.quantity
            order_status: 'pending',
            coupon_printed: false,
            created_at: new Date(),
            updated_at: new Date(),
            pickup_time:pickup_time
        });

        const orderItems = items.map(item => ({
            order_id: newOrder.id,
            menu_id: item.id,
            quantity: item.quantity,
            options: JSON.stringify(item.options),
            item_price: item.amount,
            total_price: item.amount ,//* item.quantity
            created_at: new Date(),
            updated_at: new Date()
        }));

        await OrderItems.bulkCreate(orderItems);

         return { message: 'Order confirmed successfully', success: true, order: newOrder, orderItems: orderItems };
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
      getOrdersByStatus: async (client_id, table_no,status) => {//get data by status
        try {
            const whereCondition = {
                  user_id: client_id,
                  order_status: {
                      [Op.ne]: status  // confirmed以外
                  }
              };
            if (table_no) {
                whereCondition.table_no = table_no;
            }
            const orders = await Orders.findAll({
                where: whereCondition,
                include: [{ model: OrderItems }]
            });
            return orders;
        } catch (error) {
          console.log(error)
            throw new Error('Failed to fetch pending orders');
        }
    },
  // 注文アイテムのステータスを更新するサービス
   updateOrderItemStatus: async (orderItemId, newStatus) => {
       try {
         console.log('newStatus:'+newStatus)
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
           const pendingOrPreparedItems = await OrderItems.findAll({
                   where: {
                       order_id: orderItem.order_id,
                       serve_status: {
                           [Op.or]: ['pending', 'prepared']  // "pending" または "prepared" のものを取得
                       }
                   }
               });
             console.log('pendingItems:'+pendingItems)

             if (pendingItems.length === 0) {
                 // 全てのアイテムが提供済みなら、Orders の order_status を confirmed に更新
                 const order = await Orders.findOne({
                     where: { id: orderItem.order_id }
                 });

                 if (order) {
                     order.order_status = 'prepared';
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
 },
 // 注文の支払い情報を更新するメソッドを追加
    updateOrderPayment: async (order_id, payment_method, order_status) => {
        try {
            const order = await Orders.findByPk(order_id);
            if (!order) {
                return { success: false, error: 'Order not found' };
            }
            console.log(order_id, payment_method, order_status)

            order.payment_method = payment_method;
            //order.order_status = order_status;
            await order.save();

            return { success: true, message: 'Order updated successfully' };
        } catch (error) {
            console.error('Error updating order:', error);
            return { success: false, error: 'Failed to update order' };
        }
    },
    updateConfirmd:async (order_id, order_status) => {
        try {
            const order = await Orders.findByPk(order_id);
            if (!order) {
                return { success: false, error: 'Order not found' };
            }

            order.order_status = order_status;
            //order.order_status = order_status;
            await order.save();

            return { success: true, message: 'Order updated successfully' };
        } catch (error) {
            console.error('Error updating order:', error);
            return { success: false, error: 'Failed to update order' };
        }
    },
    getOrdersByPickupTime:async (pickupTime,clientsId) => {
    try {
      console.log(clientsId)
      console.log('de-ta syutoku kaisini')
      // 日本時間の「今日の00:00:00」を取得する
      const now = new Date();
      // UTC時間に日本時間の9時間分のオフセットを追加
      const jstOffset = 9 * 60 * 60 * 1000;  // 日本のタイムゾーン UTC+9
      // UTCの現在時刻に対して、JSTオフセットを追加して、今日の00:00:00を設定
      const startDate = new Date(now.getTime() + jstOffset);
      startDate.setUTCHours(0, 0, 0, 0);  // 日本時間で00:00:00に設定
      console.log(startDate)
      console.log(pickupTime)
      console.log(clientsId)
        const orders = await Orders.findAll({
          where: {
              pickup_time: {
                  [Op.between]: [startDate, pickupTime]  // 今日の00:00:00からフロントから来た日付まで
              },
              user_id: clientsId
          },
            include: [{ model: OrderItems }]  // 関連するOrderItemsも含める
        });
        return orders;
    } catch (error) {
        console.error('Error fetching orders by pickup time:', error);
        throw new Error('Failed to fetch orders by pickup time');
    }
  },

};

module.exports = orderService;
