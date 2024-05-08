const errormiddleware = (err,req,res,next)=>{ const defaulterror = {
    status: 404,
    success:failed,
    message: 'Something went wrong'
  }
  if(err?.name=='ValidationError'){
    defaulterror.status = 400;
    defaulterror.message = Object.values(err.errors).map((val)=>val.message);
  }
  //duplicate error
  if(err.code && err.code==11000){
    defaulterror.status = 400;
    defaulterror.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
  }

  res.status(defaulterror.status).json({
    success:defaulterror.success,
    message:defaulterror.message
  })
}

export default errormiddleware;
