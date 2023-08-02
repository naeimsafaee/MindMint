// const winston = require("winston");


// winston.add(new winston.transports.Http());

/*winston.add(new winston.transports.File({
    filename: "logfile.log"
}));*/

module.exports = (err, req, res, next) => {
    // winston.error(err.message  , err);
    // console.log(err)
    let message = err.message;

    let statusCode = 500;
    if(err.statusCode)
        statusCode = err.statusCode

    if(statusCode >= 510)
        statusCode = 500;

    if (process.env.NODE_ENV === "development")
        return res.status(statusCode).send({
            data: [],
            message: message,
            stack: err
        });

    if(statusCode >= 500){
        console.log("ServerError" , message);
        message = "Server Error!"
    }


    return res.status(statusCode).send({
        data: [],
        message: message
    });
};