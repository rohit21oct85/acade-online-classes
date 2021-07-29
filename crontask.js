const UserLogs = require('./apps/models/admin/UserLog');

const cronTask = async () => {
    try {
        let currentDate = new Date();
        let prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        let LogsData = await UserLogs.find({
            sessionInProgress: true,
            login_time: {
                $lt: currentDate
            }     
        });
        if(LogsData?.length > 0){
            LogsData.map(async log => {
                let loginTime = new Date(log?.login_time);
                let new_time = new Date();
                let seconds = (new_time - loginTime) / 1000;
                // console.log(seconds);
                await UserLogs.findByIdAndUpdate({_id: log?._id},{
                    sessionInProgress: false,
                    logout_time: currentDate,
                    total_session: seconds
                });     
            });
        }
    } catch (error) {
        console.log(error.message)
    }
    
}
module.exports = {
    cronTask
}