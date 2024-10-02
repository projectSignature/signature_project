const Users = require('../schema/orders/user')

const ordersUserService = {
    create: async (user) => {
        return await Users.create(user)
    },

    getByUsername: async (username) => {
        const user = await Users.findOne({
            where: { username }
        })

        return user ? user.dataValues : user
    },

    getByEmail: async (email) => {
        const user = await Users.findOne({
            where: { email }
        })

        return user ? user.dataValues : user
    }
}



module.exports = ordersUserService
