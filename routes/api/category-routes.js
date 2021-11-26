const router = require('express').Router();
const { Category, Product } = require('../../models');
// Returnes all categories and associated products.
router.get('/', (req, res) => {
	Category.findAll({
		include:
		{
			model: Product
		}
	}).then(data => res.json(data)).catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});
// Returns a specific category and associated products.
router.get('/:id', (req, res) => {
	Category.findOne({
		where: {
			id: req.params.id
		},
		include:
		{
			model: Product
		}
	}).then(data => {
        if (!data) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// Creates a category.
router.post('/', (req, res) => {
	Category.create({
        category_name: req.body.category_name
    }).then(data => res.json(data)).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// Updates a category.
router.put('/:id', (req, res) => {
	Category.update(
        {
            category_name: req.body.category_name
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(data => {
        if (!data) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
// Deletes a category.
router.delete('/:id', (req, res) => {
	Category.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => {
        if (!data) {
            res.status(404).json({ message: 'No category found with this id' });
            return;
        }
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
