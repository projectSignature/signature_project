const POSUsers = require('../schema/pos/user')


const posusers = {

    create: async (user) => {
        return await POSUsers.create(user)
    },

    getByUsername: async (username) => {
      console.log('kokonikites')
        const user = await POSUsers.findOne({
            where: { username }
        })

        return user ? user.dataValues : user
    },

}

module.exports = posusers
