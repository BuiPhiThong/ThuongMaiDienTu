const Product = require("../models/products");
const asynHandler = require("express-async-handler");
const slugtify = require("slugify");

const createProduct = asynHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body.title) req.body.slug = slugtify(req.body.title);

  const response = await Product.create(req.body);

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Create Product Failed!!",
  });
});
const deleteProduct = asynHandler(async (req, res) => {
  const { pid } = req.params;

  const response = await Product.findByIdAndDelete(pid);

  return res.status(200).json({
    success: response ? true : false,
    mess: response
      ? "Delete Product Successfully!!"
      : "Delete Product Failed!!",
  });
});

const updateProduct = asynHandler(async (req, res) => {
  const { pid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body.title) {
    const { title } = req.body;
    const slug = slugtify(title);
    const dataUpdate = { ...req.body, slug };
    const response = await Product.findByIdAndUpdate(pid, dataUpdate, {
      new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        mess: response
          ? "Update Product Successfully!!"
          : "Update Product Failed!!",
      });
  }
  const response = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    mess: response
      ? "Update Product Successfully!!"
      : "Update Product Failed!!",
  });


  
});

const getAllProduct = asynHandler(async (req, res) => {
  const response = await Product.find();

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Some thing went wrong!",
  });
});


const productConditional = asynHandler(async(req,res)=>{
  const queryData = {...req.query}
 
  
  //loại bỏ các trường cần thiết khỏi query
  const fieldRemove = ["sort","page","limit","field"]

  fieldRemove.forEach(el=> delete queryData[el])

  
  //chuyển đổi toán từ so sánh thành cú pháp MongooseDB

  let queryString = JSON.stringify(queryData)
  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g,matchedEl=> `$${matchedEl}`)
  const formatQuery = JSON.parse(queryString)

  //tìm kiếm theo title nếu có
  if(req.query.title) formatQuery.title ={$regex: req.query.title ,$options:'i'};
  console.log(formatQuery);
  
  let sortBy =''
  if(req.query.sort){
    sortBy = req.query.sort.split(',').join(' ');
  }else{
    sortBy='creatAt'
  }
  //lấy danh sách sản phẩm
  let queryCommand  = Product.find(formatQuery).sort(sortBy)
  //giới hạn danh sách trả về
  if(req.query.field){
    const fields = req.query.field.split(',').join(' ')
    queryCommand =  Product.find(formatQuery).sort(sortBy).select(fields);
  }

  //pagination
  const page = parseInt(req.query.page)||1
  const limit= parseInt(req.query.limit)||5
  const skip = (page-1)*limit

  //ap dung phan trang
  queryCommand = queryCommand.skip(skip).limit(limit)

  //tính tổng số page
  const counts = await Product.countDocuments(formatQuery)
  const response = await queryCommand
  const totalPage = Math.ceil(counts/limit)

  return res.status(200).json({
    success: response ? true : false,
    products: response ? response : 'Can not get products',
    counts,
    totalPage:totalPage,
    currentPage: page
});
})

const ratings = asynHandler(async(req,res)=>{
    const {_id} = req.user

    const {star, comment, pid} = req.body
    if(!pid) throw new Error('Missing input!!!')
    const product = await Product.findById(pid)
    
    

    const alreadyRatings = product.ratings.find((el)=> el.postedBy.toString() === _id)
    
    if(alreadyRatings){
        await Product.updateOne({ratings: {$elemMatch: alreadyRatings}},{$set:{"ratings.$.star": star,"ratings.$.comment": comment}})
    }else{
        await Product.findByIdAndUpdate(pid,{ $push:{ratings: {star:star, comment: comment,postedBy:_id} } },{new:true})
    }
    //tính rating

    const afterRatings = await Product.findById(pid)
    let totalStar= afterRatings.ratings.reduce((sum,el)=>sum+el.star,0)

    // afterRatings.ratings.forEach((el)=>{
    //     totalStar+= el.star
    // })
    


    const countRating = afterRatings.ratings.length
    const averageRating = Math.round(totalStar*10/countRating)/10
    afterRatings.totalRatings= averageRating
    
    await afterRatings.save()

    return res.status(200).json({
        success: true,
        result: afterRatings? afterRatings:'Something went wrong!'
    })
})
module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  ratings,
  productConditional
};
