const jwt = require('jsonwebtoken');

// wants to like post 
// click the like button => auth middleware ( next ) : see if the user is connected or  not  => ilke ...

const auth = async(req ,res , next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isCustumAuth = token.length < 500 ; // +500 => googleAuth
        let decodedData ;
        if(token && isCustumAuth){

            decodedData = jwt.verify(token , 'test');

            req.userId = decodedData?.id ;

        }else{
            decodedData = jwt.decode(token);
            
            req.userId = decodedData?.sub ; // sub = id google using
        }

        next();
        
    }catch(err){
        console.log(err) ;
    }
}

module.exports = auth ;