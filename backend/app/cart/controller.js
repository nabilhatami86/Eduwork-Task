const CartItem = require('./cart-item/model');
const Product = require('../product/model');


const getCart = async (req, res, next) => {
    try {
        let updatedCartItems = await CartItem.find({ user: req.user._id }).populate('product');
        return res.json(updatedCartItems);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};


const updateCart = async (req, res, next) => {
    try {
        const { items } = req.body;

        const ProductIds = items.map(item => item.product_id);
        const products = await Product.find({ _id: { $in: ProductIds } });
        let CartItems = items.map(item => {
            let relatedProduct = products.find(
                product => product._id.toString() === item.product_id
            );

            return {
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user: req.user._id,
                qty: item.qty
            }
        });

        // await CartItem.deleteMany({ user: req.user._id });
        await CartItem.bulkWrite(CartItems.map(item => ({
            updateOne: {
                filter: { user: req.user._id, product: item.product },
                update: { $set: item },
                upsert: true
            }
        })));


        return res.json(CartItems)
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

const deleteCart = async (req, res, next) => {
    try {
        const id = req.params.id;
        const cart = await CartItem.findByIdAndDelete(id);
        if (!cart) {
            return res.status(404).json({
                error: 1,
                message: 'Keranjang kosong atau tidak ada item untuk dihapus'
            });
        }
        return res.json({ message: 'Keranjang berhasil dihapus', cart: cart });


    } catch (err) {
        console.error(`Error deleting cart item with ID: ${req.params.id}`, err);
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err)
    }
};


module.exports = {
    updateCart,
    getCart,
    deleteCart
}