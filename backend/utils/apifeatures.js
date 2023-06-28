class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
          //querystr in url means anything after.
    //http://localhost:4000?keyword=param
    //so querystr is keyword=param.and query is simple queries of database.
    }

    search(){
        //ternary operator if keyword exist what to do
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,//regular expression
                $options:"i",//(i) means insensitive now it will find both capital and not capital
            },
        }
        :{};

        console.log(keyword);
        this.query= this.query.find({...keyword});
        return this;
    }

    filter(){
        //filter for category
        const querycopy= {...this.queryStr}//now actual copy is created not the reference copy.
        //refernce copy will be created by this.querystr and if we chnage this then copy also change
        //hence we use another ... metod .
       
        //removing some fields for category
        const removeFields=["keyword","page","limit"];
        //foreach loop delete all these keywords from querycopy
        removeFields.forEach((key)=>delete querycopy[key]);

        //filter for price and Rating
        let queryStr=JSON.stringify(querycopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g , key=>`$${key}`);
        //brackets k beech me dege sare operators.

       this.query=this.query.find(JSON.parse(queryStr));//again reconvert fromm string
       return this;
    }
  

    // how many items to show per page.
    pagination(resultperpage){
        const currentpage=Number(this.queryStr.page) || 1;
        const skip=resultperpage * (currentpage-1);
       // like hmare pass 50 h aur 10 per page dikhani h to first page p 0 skip karege
       //second page p 10 skip karke 11 se dikhege aur third page 20 skip karke 21 se dikhege.
       // jaise ham 2 page p h to formula = 10 * (2-1)=10 skip
       //hum 3 page p h = 10 * (3-1)=20 skip .
       this.query=this.query.limit(resultperpage).skip(skip);
       // this.query is nothing but product.find()
       return this;
    }
}


module.exports=ApiFeatures;