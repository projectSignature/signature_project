const Orders = require('../schema/orders/orders_ver2');
const OrderItems = require('../schema/orders/order_items_ver2');
const Menu = require('../schema/orders/menu');
const { Op } = require('sequelize');

const orderService = {
    updateExistingOrder: async (user_id, table_no, order_name, items, orderID) => {
        let existingOrder = await Orders.findOne({
          where: {
            user_id: user_id,
            table_no: table_no,
            order_name: order_name,
            order_status: {
                [Op.ne]: 'confirmed'  // "confirmed" 以外のものを取得
            },
            id: orderID
        },
            order: [['id', 'DESC']]
        });
        if (existingOrder) {
            const existingOrderId = existingOrder.id;
            await Orders.update(
                  {
                      coupon_printed: false,
                      order_status: 'pending'  // 追加のフィールド
                  },
                  {
                      where: { id: existingOrderId }
                  }
              );
            const orderItems = items.map(item => ({
                order_id: existingOrderId,
                menu_id: item.id,
                quantity: item.quantity,
                options: JSON.stringify(item.options),
                item_price: item.amount/item.quantity,
                total_price: item.amount ,//* item.quantity
                coupon_printed: false,
                created_at: new Date(),
                updated_at: new Date()
            }));
            await OrderItems.bulkCreate(orderItems);
            const additionalAmount = items.reduce((acc, item) => acc + (item.amount), 0);
            existingOrder.total_amount = parseFloat(existingOrder.total_amount) + parseFloat(additionalAmount);
            existingOrder.updated_at = new Date();
            await existingOrder.save();

            return { message: 'Order updated successfully', success: true };
        }
        return { message: 'No existing order found', success: false };
    },

    // 新規注文を作成する
    createNewOrder: async (user_id, table_no, order_name, items,pickup_time,order_type) => {
      console.log('order is :' +order_type)
        const newOrder = await Orders.create({
            user_id: user_id,
            table_no: table_no,
            order_name: order_name,
            total_amount: items.reduce((acc, item) => acc + (item.amount ), 0),//* item.quantity
            order_status: 'pending',
            coupon_printed: false,
            created_at: new Date(),
            updated_at: new Date(),
            pickup_time:pickup_time,
            order_type:order_type
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
           const pendingItems = await OrderItems.findAll({
                   where: {
                       order_id: orderItem.order_id,
                       // serve_status: {
                         serve_status: 'pending'
                           // [Op.or]: ['pending', 'prepared']  // "pending" または "prepared" のものを取得
                       // }
                   }
               });
             console.log('pendingItems:'+pendingItems)

             console.log('件数は'+pendingItems.length)
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
         console.log('here')
        console.log(error)
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
            console.log('success')
            return { success: true, message: 'Order updated successfully' };
        } catch (error) {
            console.error('Error updating order:', error);
            return { success: false, error: 'Failed to update order' };
        }
    },
    updateConfirmd:async (order_id, order_status, casyType) => {
        try {
            const order = await Orders.findByPk(order_id);
            if (!order) {
                return { success: false, error: 'Order not found' };
            }
            order.order_status = order_status;
            order.payment_method = casyType;
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
      // 日本時間の「今日の00:00:00」を取得する
      const now = new Date();
      // UTC時間に日本時間の9時間分のオフセットを追加
      const jstOffset = 9 * 60 * 60 * 1000;  // 日本のタイムゾーン UTC+9
      // UTCの現在時刻に対して、JSTオフセットを追加して、今日の00:00:00を設定
      const startDate = new Date(now.getTime() + jstOffset);
      startDate.setUTCHours(0, 0, 0, 0);  // 日本時間で00:00:00に設定
      const pickupTimeUTC = new Date(pickupTime).toISOString();  // pickupTimeをISO形式に変換
      const orders = await Orders.findAll({
      where: {
        pickup_time: {
          [Op.between]: [startDate, pickupTimeUTC]  // 同じフォーマットで比較
        },
        user_id: clientsId
      },
      include: [{ model: OrderItems }]  // 関連するOrderItemsも含める
      });
      console.log(orders)
        return orders;
    } catch (error) {
        console.error('Error fetching orders by pickup time:', error);
        throw new Error('Failed to fetch orders by pickup time');
    }
  },
  updateMenuByAdmin: async (newOrder) => {
      try {
          const updatedItems = [];
          for (const item of newOrder.OrderItems) {
              if (item.kubun === 'delete' && item.id) {
                  // Delete operation for existing items
                  await OrderItems.destroy({ where: { id: item.id } });
                  // Check if any other items exist for this order_id
                  const remainingItems = await OrderItems.findAll({ where: { order_id: item.order_id } });
                  if (remainingItems.length === 0) {
                      // If no items remain for the order, delete the order itself
                      await Orders.destroy({ where: { id: item.order_id } });
                      console.log(`Order with id ${item.order_id} deleted because no items remain.`);
                  }
              } else if (item.kubun === 'add') {
                  // Add operation for new items
                  const options = Array.isArray(item.options) ? JSON.stringify(item.options) : item.options;

                  const newItem = await OrderItems.create({
                      order_id: item.order_id,
                      menu_id: item.menu_id,
                      quantity: item.quantity,
                      options: options,
                      item_price: item.item_price,
                      total_price: item.total_price,
                      coupon_printed: item.coupon_printed || false,
                      serve_status: item.serve_status || 'pending'
                  });
                  updatedItems.push(newItem);
                  console.log(`New item added:`, newItem);
              } else if (item.kubun !== 'delete' && item.id) {
                  // Update operation for existing items
                  const options = Array.isArray(item.options) ? JSON.stringify(item.options) : item.options;

                  const updatedItem = await OrderItems.update({
                      quantity: item.quantity,
                      options: options,
                      item_price: item.item_price,
                      total_price: item.total_price,
                      coupon_printed: item.coupon_printed,
                      serve_status: item.serve_status
                  }, {
                      where: { id: item.id }
                  });
                  updatedItems.push(updatedItem);
                  console.log(`Item with id ${item.id} updated.`);
              }
          }

          // 全てのOrderItemsを再取得して、合計金額を再計算
          const allOrderItems = await OrderItems.findAll({ where: { order_id: newOrder.id } });
          const totalAmount = allOrderItems.reduce((acc, item) => acc + parseFloat(item.total_price), 0);

          // Update total_amount in Orders table
          await Orders.update({ total_amount: totalAmount }, { where: { id: newOrder.id } });
          console.log(`Order total_amount updated to ${totalAmount}`);

          // 最新のOrderとその関連するOrderItemsを取得して返す
          const updatedOrder = await Orders.findOne({
              where: { id: newOrder.id },
              include: [{ model: OrderItems }]
          });

          return updatedOrder;  // フロントエンドに最新のOrderデータを返す

      } catch (error) {
          console.error('Error updating menu by admin:', error);
          throw new Error('Order update failed');
      }
  },
  getOrdersByPickupTimeBetween: async (startTime, endTime, clientsId) => {
    try {
      // endTime に 1 日を追加
      const adjustedEndTime = new Date(endTime);
      adjustedEndTime.setDate(adjustedEndTime.getDate() + 1);

      const orders = await Orders.findAll({
        where: {
          pickup_time: {
            [Op.between]: [startTime, adjustedEndTime]  // endTime に1日追加した範囲で検索
          },
          user_id: clientsId
        },
        include: [{
          model: OrderItems,
          include: [{ model: Menu }]
        }]  // 関連するOrderItemsも含める
      });

      return orders;
    } catch (error) {
      console.error('Error fetching orders by pickup time:', error);
      throw new Error('Failed to fetch orders by pickup time');
    }
  },
  getOrdersByPickupRange: async (startTime, endTime, clientsId) => {//期間で指定
    try {
      const orders = await Orders.findAll({
        where: {
          pickup_time: {
            [Op.between]: [startTime, endTime]  // endTime に1日追加した範囲で検索
          },
          user_id: clientsId
        },
        include: [{
          model: OrderItems,
          include: [{ model: Menu }]
        }]  // 関連するOrderItemsも含める
      });

      return orders;
    } catch (error) {
      console.error('Error fetching orders by pickup time:', error);
      throw new Error('Failed to fetch orders by pickup time');
    }
  },
  updateOrder : async (orderId, updateData) => {
    try {
        const order = await Orders.findByPk(orderId);
        if (!order) {
            return null; // 注文が見つからなかった場合
        }

        // 注文の更新処理
        const updatedOrder = await order.update(updateData);

        return updatedOrder;
    } catch (error) {
        console.error('注文の更新中にエラーが発生しました:', error);
        throw new Error('注文の更新に失敗しました');
    }
},
updateStock : async (id, stock_status) => {
  try {
    const menuItem = await Menu.findByPk(id);
    console.log(id)
     if (!menuItem) return null;

     menuItem.stock_status = stock_status;
     await menuItem.save();

     return menuItem;
  } catch (error) {
      console.error('在庫の変更に失敗しました:', error);
      throw new Error('在庫の変更に失敗しました');
  }
},
mergeOrders: async (orderIds, baseOrderId) => {
  if (!orderIds || orderIds.length < 2) throw new Error('2つ以上選んでください');

  const originalOrders = await Orders.findAll({
    where: { id: { [Op.in]: orderIds } },
    include: [{ model: OrderItems }]
  });

  const allItems = originalOrders.flatMap(o => o.OrderItems);

  // OrderItemsをbaseOrderIdに集約
  await Promise.all(allItems.map(async (item) => {
    await OrderItems.update(
      { order_id: baseOrderId },
      { where: { id: item.id } }
    );
  }));

  // 合計金額を更新
  const total = allItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  await Orders.update(
    { total_amount: total },
    { where: { id: baseOrderId } }
  );

  // 🔥 baseOrder 以外を削除
  const deleteTargets = orderIds.filter(id => id != baseOrderId);
  await OrderItems.destroy({ where: { order_id: { [Op.in]: deleteTargets } } });
  await Orders.destroy({ where: { id: { [Op.in]: deleteTargets } } });

  return { message: '統合成功', newOrderId: baseOrderId };
}





};

module.exports = orderService;
