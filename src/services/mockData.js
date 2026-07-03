module.exports = {

    getStatus() {

        return {
            drawingRoom:{
                fans:1,
                lights:2
            },

            workRoom1:{
                fans:0,
                lights:0
            },

            workRoom2:{
                fans:2,
                lights:3
            }
        }

    },

    getUsage(){

        return{

            totalPower:740,

            todayUsage:4.2

        }

    }

}