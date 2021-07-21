const UserLogs = require('./apps/models/admin/UserLog');

const cronTask = async () => {
    try {
        let currentDate = new Date();
        let prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 2);
        let Logs = await UserLogs.find({});
        Logs.map(async log => {
            if((log.login_time <= prevDate) && (log.sessionInProgress === true)){
                await UserLogs.findByIdAndUpdate({_id: log?._id},{
                    sessionInProgress: false,
                    logout_time: currentDate
                })     
            }
        });
    } catch (error) {
        console.log(error.message)
    }
    
}
module.exports = {
    cronTask
}