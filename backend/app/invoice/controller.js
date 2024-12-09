const { subject } = require('@casl/ability');
const Invoice = require('./model');
const { policyFor } = require('../../utils/getToken');

const show = async (req, res, next) => {
    try {
        let { order_id } = req.params;
        let invoice = await Invoice.findOne({ order: order_id })
            .populate({
                path: 'order',
                populate: {
                    path: 'order_items',
                    populate: {
                        path: 'product', // Populasi produk terkait
                        select: 'name price' // Menentukan data yang akan diambil dari produk
                    }
                }
            })
            .populate('user'); // Pastikan user juga dipopulasi jika diperlukan

        console.log("Invoice Data:", invoice);

        if (!invoice) {
            return res.json({
                err: 1,
                msg: 'Invoice not found for the provided order_id.',
            });
        }


        let policy = policyFor(req.user);

        let subjectInvoice = subject('Invoice', { order: invoice.order, user_id: invoice.user._id });

        // Memeriksa apakah pengguna memiliki izin untuk melihat invoice ini
        if (!policy.can('read', subjectInvoice)) {
            return res.json({
                err: 1,
                msg: 'You do not have permission to view this invoice.',
            });
        }

        if (!policy.can('read', 'Invoice')) {
            return res.json({
                err: 1,
                msg: 'You are not allowed to perform this action.',
            });
        }

        // Jika izin ada, mengembalikan invoice
        return res.json(invoice);
    } catch (err) {
        console.error('Error Details:', err);
        return res.json({
            err: 1,
            msg: 'Error fetching invoice',
        });
    }
};

module.exports = {
    show
};
