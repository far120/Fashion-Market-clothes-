// const logger = require('../utils/logger');
const logger = require('../utils/logger');
module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error(`Error: ${req.method} ${req.originalUrl} | ${err.message}`, {
        stack:err.stack,
        user: req.user?.id,
    statusCode:err.statusCode
})

    if(process.env.NODE_ENV === 'devlopment'){
        return res.status(err.statusCode).json({
            status : err.status,
            error:err,
            message:err.message,
            stack:err.stack

        })
    }

    if(process.env.NODE_ENV === 'production'){
      if(err.isOperational){
        return res.status(err.statusCode).json({
            status : err.status,
            message:err.message,

        })
    }


     return res.status(500).json({
        status:'error',
        message:'somthing went wrong'
    })


    }
   res.status(err.statusCode).json({
    status:err.status,
    message:err.message
   })

}