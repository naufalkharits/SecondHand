import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";
import openServer from "../axios/openServer";
import closedServer from "../axios/closedServer";

const params = new URLSearchParams(document.location.search);
const page = Number(params.get("page"));

// GET filtered product
export const getFilteredProduct = createAsyncThunk(
    "products/filterProducts",
    async (id, thunkAPI) => {
        try {
            const response = await openServer.get("/product");
            return response.data.products.filter(
                (product) => product.seller_id === id
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// GET product by id
export const getProductById = createAsyncThunk(
    "products/getProductById",
    async (productId, thunkAPI) => {
        try {
            const response = await openServer.get(`/product/${productId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// GET all product
export const getProducts = createAsyncThunk(
    "products/getProducts",
    async ({ keyword, category, offset }, thunkAPI) => {
        try {
            const response = await openServer.get(
                `/product?keyword=${keyword}&category=${category}&limit=10&offset=${offset}`
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// POST product
export const insertProduct = createAsyncThunk(
    "products/insertProduct",
    async ({ formData, process, navigate }, thunkAPI) => {
        // for (const pair of formData.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }
        try {
            const response = await closedServer.post("/product", formData);
            if (process === "idle") navigate("/manage-product");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// PUT product
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ productId, formData, process, navigate }, thunkAPI) => {
        // for (const pair of formData.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }
        try {
            const response = await closedServer.put(
                `/product/${productId}`,
                formData
            );
            navigate("/manage-product");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// DELETE product
export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async ({ productId, process, navigate }, thunkAPI) => {
        try {
            await closedServer.delete(`/product/${productId}`);
            navigate("/manage-product");
            return productId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const productsAdapter = createEntityAdapter();

const productsSlice = createSlice({
    name: "products",
    initialState: productsAdapter.getInitialState({
        filteredProduct: null,
        categories: null,
        loading: "idle",
        process: "idle",
        error: null,
        keyword: "",
        category: "",
        offset: page ? page * 10 - 10 : 0,
    }),
    reducers: {
        // setLoading: (state, action) => {
        //     state.loading = action.payload;
        // },
        keywordQuery: (state, action) => {
            state.keyword = action.payload;
        },
        categoryQuery: (state, action) => {
            state.category = action.payload;
        },
        offsetIncrement: (state, action) => {
            state.offset = state.offset + action.payload;
        },
        offsetDecrement: (state, action) => {
            state.offset = state.offset - action.payload;
        },
        resetOffset: (state, action) => {
            state.offset = 0;
        },
    },
    extraReducers: {
        // GET filtered product
        [getFilteredProduct.pending]: (state) => {
            state.loading = "pending";
            state.filter = null;
        },
        [getFilteredProduct.fulfilled]: (state, action) => {
            state.loading = "idle";
            state.error = null;
            state.filteredProduct = action.payload;
        },
        [getFilteredProduct.rejected]: (state, action) => {
            state.loading = "idle";
            state.error = action.payload || "SOMETHING WRONG!!";
        },

        // GET product by id
        [getProductById.pending]: (state) => {
            state.loading = "pending";
            productsAdapter.removeAll(state);
        },
        [getProductById.fulfilled]: (state, action) => {
            state.loading = "idle";
            state.error = null;
            productsAdapter.setOne(state, action.payload.product);
        },
        [getProductById.rejected]: (state, action) => {
            state.loading = "idle";
            state.error = action.payload || "SOMETHING WRONG!!";
        },

        // GET all products
        [getProducts.pending]: (state) => {
            state.loading = "pending";
            productsAdapter.removeAll(state);
        },
        [getProducts.fulfilled]: (state, action) => {
            state.loading = "idle";
            state.error = null;
            productsAdapter.setAll(state, action.payload.products);
        },
        [getProducts.rejected]: (state, action) => {
            state.loading = "idle";
            state.error = action.payload || "SOMETHING WRONG!!";
        },

        // POST product
        [insertProduct.pending]: (state) => {
            state.process = "pending";
            productsAdapter.removeAll(state);
        },
        [insertProduct.fulfilled]: (state, action) => {
            state.process = "idle";
            state.error = null;
            productsAdapter.addOne(state, action.payload.product);
        },
        [insertProduct.rejected]: (state, action) => {
            state.process = "idle";
            state.error = action.payload || "SOMETHING WRONG!!";
        },

        // PUT product
        [updateProduct.pending]: (state) => {
            state.process = "pending";
            productsAdapter.removeAll(state);
        },
        [updateProduct.fulfilled]: (state, action) => {
            state.process = "idle";
            productsAdapter.addOne(state, action.payload.updatedProduct);
        },
        [updateProduct.rejected]: (state, action) => {
            state.process = "idle";
            state.error = action.payload || "SOMETHING WRONG!!";
        },

        // DELETE product
        [deleteProduct.pending]: (state) => {
            state.process = "pending";
            productsAdapter.removeAll(state);
        },
        [deleteProduct.fulfilled]: (state, action) => {
            state.process = "idle";
            state.error = null;
            productsAdapter.removeOne(state, action.payload);
        },
        [deleteProduct.rejected]: (state, action) => {
            state.process = "idle";
            state.error = action.payload || "SOMETHING WRONG!!";
        },
    },
});

export const productsSelectors = productsAdapter.getSelectors(
    (state) => state.products
);

export const {
    setLoading,
    keywordQuery,
    categoryQuery,
    offsetIncrement,
    offsetDecrement,
    resetOffset,
} = productsSlice.actions;

export default productsSlice.reducer;
