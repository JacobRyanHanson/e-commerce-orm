const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
	foreignKey: 'category.id'
});
// Categories have many Products
Category.hasMany(Products, {
	foreignKey: 'category.id'
});
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tags, {
	through: 'ProductTag',
	as: 'product_tags',
	foreignKey: 'product_id'
})
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Products, {
	through: 'ProductTag',
	as: 'product_tags',
	foreignKey: 'tag_id'
})

module.exports = {
	Product,
	Category,
	Tag,
	ProductTag,
};
