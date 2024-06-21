const Item=require('../models/item');
const Category=require('../models/category');

exports.item_list=async (req,res)=>{
    const items=await Item.find().populate('category').exec();
    res.render('item_list',{title: 'Item List', item_list: items})
}

exports.item_detail = async function (req, res, next) {
  try {
    const item = await Item.findById(req.params.id ).populate('category').exec();
    res.render('item_detail', { title: 'Item Detail', item: item });
  } catch (err) {
    return next(err);
  }
};

exports.item_create_get= async(req,res)=>{
    const categories=await Category.find().exec();
    res.render('item_form', {title: 'Create Item', categories: categories, item: null})
}

exports.item_create_post=async(req,res)=>{
    const item=new Item({
        name: req.body.name, 
        description: req.body.description, 
        category: req.body.category, 
        price: req.body.price, 
        number_in_stock: req.body.number_in_stock
    })
    await item.save();
    res.redirect(item.url);
}

  
  // Handle deletion of selected item
  exports.item_delete_post = async function(req, res, next) {
    try {
      const itemId = req.params.id;
      const item = await Item.findById(itemId).exec();
  
      await Item.deleteOne({_id: itemId})

      res.redirect('/items');

    } catch (err) {
      return next(err);
    }
  };
  
exports.item_update_get=async function(req,res){
    const item= await Item.findById(req.params.id).populate('category').exec();
    const categories=await Category.find().exec();
    res.render('item_form', {title: 'Update Item', item: item, categories: categories})
}

exports.item_update_post=async function(req,res){

    const item= new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        number_in_stock: req.body.number_in_stock,
        _id: req.params.id
    })

    await Item.updateOne({_id: req.params.id}, item).exec();

    res.redirect(item.url);
}
