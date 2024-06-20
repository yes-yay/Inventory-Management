const Category = require('../models/category');
const Item = require('../models/item');

// Display list of all Categories
exports.category_list = async function (req, res, next) {
  try {
    const categories = await Category.find().exec();
    res.render('category_list', { title: 'Category List', category_list: categories });
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific Category
exports.category_detail = async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id).exec();
    const items = await Item.find({ category: req.params.id }).exec();
    if (category == null) { // No results
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category_detail', { title: 'Category Detail', category: category, category_items: items });
  } catch (err) {
    return next(err);
  }
};

// Display Category create form on GET
exports.category_create_get = function (req, res) {
  res.render('category_form', { title: 'Create Category' , category: null});
};

// Handle Category create on POST
exports.category_create_post = async function (req, res, next) {
  const category = new Category({ name: req.body.name, description: req.body.description });
  try {
    await category.save();
    res.redirect(category.url);
  } catch (err) {
    return next(err);
  }
};

// Display Category delete form on GET
  // Handle Category delete on POST
  exports.category_delete_post = async function(req, res, next) {
    try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId).exec();
  
      if (!category) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
  
      const items_in_category = await Item.find({ category: category._id }).exec();
  
      if (items_in_category.length > 0) {
        return res.render('category_pending_items', {
          title: 'Category Pending Items',
          category: category,
          category_items: items_in_category,
          error: 'Category has associated items. Please delete them first.'
        });
      }
  
      await Category.deleteOne({_id:category._id});
      res.redirect('/categories');
    } catch (err) {
      return next(err);
    }
  };
  

// Display Category update form on GET
exports.category_update_get = async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id).exec();
    if (category == null) { // No results
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category_form', { title: 'Update Category', category: category });
  } catch (err) {
    return next(err);
  }
};

// Handle Category update on POST
exports.category_update_post = async function (req, res, next) {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    _id: req.params.id // Required to prevent a new ID from being assigned
  });
  try {
    await Category.findByIdAndUpdate(req.params.id, category);
    res.redirect(category.url);
  } catch (err) {
    return next(err);
  }
};
