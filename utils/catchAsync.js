module.exports = func =>
{
    return(req,res,next) =>
    {   console.log(next);
        func(req, res, next).catch(next);
    }
}