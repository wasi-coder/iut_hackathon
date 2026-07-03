const mock = require("./mockData");

module.exports = {

    async getStatus(){

        return mock.getStatus();

    },

    async getUsage(){

        return mock.getUsage();

    }

}