import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/carts";
const token = localStorage.getItem("token");

// Action untuk menambahkan item ke keranjang
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (product, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const currentCart = state.cart.items;
            console.log("Current Cart:", currentCart);

            const existingProduct = currentCart.find(
                (item) => item.product._id === product._id
            );

            const updateQty = existingProduct
                ? existingProduct.qty + product.qty
                : product.qty;
            console.log("Updated quantity:", updateQty);

            const response = await axios.put(
                BASE_URL,
                {
                    items: [{ product_id: product._id, qty: updateQty }],
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    });

// Action untuk mendapatkan item dari keranjang
export const getCartItems = createAsyncThunk(
    'cart/getCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    });

export const incrementQty = createAsyncThunk(
    'cart/incrementQty',
    async ({ product_id, qty }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                BASE_URL,
                {
                    items: [{ product_id, qty: qty + 1 }]
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const decrementQty = createAsyncThunk(
    'cart/decrementQty',
    async ({ product_id, qty }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                BASE_URL,
                {
                    items: [{ product_id, qty: qty - 1 }]
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



export const deleteCart = createAsyncThunk(
    "cart/deleteCart",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            if (!id) throw new Error('Invalid ID');
            await axios.delete(`${BASE_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    });





const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        qty: 0,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                console.log("Cart updated successfully:", action.payload);
                state.items = action.payload;


            })
            .addCase(addToCart.rejected, (state, action) => {
                console.error("Failed to add product to cart:", action.payload);
                state.error = action.payload;
            })
            .addCase(incrementQty.fulfilled, (state, action) => {
                const { product_id, qty } = action.payload;
                const existingItem = state.items.find((item) => item.product === product_id);

                if (existingItem) {
                    existingItem.qty = qty;
                }
            })
            .addCase(incrementQty.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(decrementQty.fulfilled, (state, action) => {
                const { product_id, qty } = action.payload;
                const existingItem = state.items.find((item) => item.product === product_id);

                if (existingItem) {
                    if (existingItem <= 0) {
                        state.items = state.items.filter((item) => item.product !== product_id);
                    } else {
                        existingItem.qty = qty;
                    }
                }
            })
            .addCase(decrementQty.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteCart.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteCart.rejected, (state, action) => {
                state.error = action.payload;
            });

    },
});

export const {
    clearCart,
    increase,
    decrease,
    calculateTotals,
    removeItem,
} = cartSlice.actions;

export default cartSlice.reducer;
