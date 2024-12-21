const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const InvoiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    amount: {
        type: Number,
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
}, { timestamps: true });

module.exports = model('Invoice', InvoiceSchema);
