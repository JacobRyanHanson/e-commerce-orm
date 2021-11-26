const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
// Returns a product along with its category and tag.
router.get('/', (req, res) => {
	Product.findAll({
		include: [
			{
				model: Category
			},
			{
				model: Tag,
				through: ProductTag,
				as: 'tags'
			}
		]
	}).then(data => res.json(data)).catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});
// Returns a specific product along with its category and tag.
router.get('/:id', (req, res) => {
	Product.findOne({
		where: {
			id: req.params.id
		},
		include: [
			{
				model: Category
			},
			{
				model: Tag,
				through: ProductTag,
				as: 'tags'
			}
		]
	}).then(data => {
		if (!data) {
			res.status(404).json({ message: 'No product found with this id' });
			return;
		}
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});

// Creates a new product.
router.post('/', (req, res) => {
	Product.create(req.body).then((product) => {
		// If there's product tags, create pairings to bulk create in the ProductTag model.
		if (req.body.tagIds.length) {
			const productTagIdArr = req.body.tagIds.map((tag_id) => {
				return {
					product_id: product.id,
					tag_id
				};
			});
			return ProductTag.bulkCreate(productTagIdArr);
		}
		// If no product tags, then just respond.
		res.status(200).json(product);
	}).then((productTagIds) => res.status(200).json(productTagIds)).catch((err) => {
		console.log(err);
		res.status(400).json(err);
	});
});

// Updates a product.
router.put('/:id', (req, res) => {
	Product.update(req.body, {
		where: {
			id: req.params.id,
		},
	}).then((product) => {
		// Finds all associated tags from ProductTag.
		return ProductTag.findAll({ where: { product_id: req.params.id } });
	}).then((productTags) => {
		// Gets a list of current tag_ids.
		const productTagIds = productTags.map(({ tag_id }) => tag_id);
		// Creates a filtered list of new tag_ids.
		const newProductTags = req.body.tagIds.filter((tag_id) => !productTagIds.includes(tag_id)).map((tag_id) => {
			return {
				product_id: req.params.id,
				tag_id,
			};
		});
		// Figures out which ones to remove.
		const productTagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id)).map(({ id }) => id);

		return Promise.all([
			ProductTag.destroy({ where: { id: productTagsToRemove } }),
			ProductTag.bulkCreate(newProductTags),
		]);
	}).then((updatedProductTags) => res.json(updatedProductTags)).catch((err) => {
		console.log(err);
		res.status(400).json(err);
	});
});
// Deletes a product.
router.delete('/:id', (req, res) => {
	Product.destroy({
		where: {
			id: req.params.id
		}
	}).then(data => {
		if (!data) {
			res.status(404).json({ message: 'No product found with this id' });
			return;
		}
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});

module.exports = router;
