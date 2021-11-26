const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
// Returns all tags and associated products.
router.get('/', (req, res) => {
	Tag.findAll({
		include:
		{
			model: Product,
			through: ProductTag,
			as: 'products'
		}
	}).then(data => res.json(data)).catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});
// Returns a specific tag and associated products.
router.get('/:id', (req, res) => {
	Tag.findOne({
		where: {
			id: req.params.id
		},
		include:
		{
			model: Product,
			through: ProductTag,
			as: 'products'
		}
	}).then(data => {
		if (!data) {
			res.status(404).json({ message: 'No tag found with this id' });
			return;
		}
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});
// Creates a tag.
router.post('/', (req, res) => {
	Tag.create({
        tag_name: req.body.tag_name
    }).then(data => res.json(data)).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// Updates a tag.
router.put('/:id', (req, res) => {
	Tag.update(
        {
            tag_name: req.body.tag_name
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(data => {
        if (!data) {
            res.status(404).json({ message: 'No tag found with this id' });
            return;
        }
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// Deletes a tag.
router.delete('/:id', (req, res) => {
	Tag.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => {
        if (!data) {
            res.status(404).json({ message: 'No tag found with this id' });
            return;
        }
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
