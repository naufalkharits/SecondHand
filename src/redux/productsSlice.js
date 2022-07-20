import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit"
import openServer from "../middlewares/axios/openServer"
import closedServer from "../middlewares/axios/closedServer"

const params = new URLSearchParams(document.location.search)
const page = Number(params.get("page"))

// GET filtered product
export const getFilteredProduct = createAsyncThunk(
    "products/filterProducts",
    async (id, thunkAPI) => {
        try {
            const response = await openServer.get("/product")
            return response.data.products.filter(
                (product) => product.seller.user_id === id
            )
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// GET product by id
export const getProductById = createAsyncThunk(
    "products/getProductById",
    async (productId, thunkAPI) => {
        try {
            const response = await openServer.get(`/product/${productId}`)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// GET all product
export const getProducts = createAsyncThunk(
    "products/getProducts",
    async ({ keyword, category, offset }, thunkAPI) => {
        try {
            const response = await openServer.get(
                `/product?keyword=${keyword}&category=${category}&limit=10&offset=${offset}`
            )
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// POST product
export const insertProduct = createAsyncThunk(
    "products/insertProduct",
    async ({ formData, navigate }, thunkAPI) => {
        // for (const pair of formData.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }
        try {
            const response = await closedServer.post("/product", formData)
            navigate(`/product/${response.data.product.id}`)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// PUT product
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ productId, formData, navigate }, thunkAPI) => {
        // for (const pair of formData.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }
        try {
            const response = await closedServer.put(
                `/product/${productId}`,
                formData
            )
            navigate(`/product/${productId}`)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// DELETE product
export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async ({ productId, navigate }, thunkAPI) => {
        try {
            await closedServer.delete(`/product/${productId}`)
            navigate("/manage-product")
            return productId
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const productsAdapter = createEntityAdapter()

const productsSlice = createSlice({
    name: "products",
    initialState: productsAdapter.getInitialState({
        filteredProduct: null,
        categories: null,
        loading: "idle",
        spinner: false,
        error: null,
        keyword: "",
        category: "",
        offset: page ? page * 10 - 10 : 0,
        notification: null,
        showNotification: false,
    }),
    reducers: {
        setShowNotification: (state, action) => {
            console.log(action.payload)
            state.setShowNotification = action.payload
        },
        setNotification: (state, action) => {
            console.log(action.payload)
            state.notification = action.payload
        },
        resetError: (state) => {
            state.error = null
        },
        keywordQuery: (state, action) => {
            state.keyword = action.payload
        },
        categoryQuery: (state, action) => {
            state.category = action.payload
        },
        offsetIncrement: (state, action) => {
            state.offset = state.offset + action.payload
        },
        offsetDecrement: (state, action) => {
            state.offset = state.offset - action.payload
        },
        resetOffset: (state, action) => {
            state.offset = 0
        },
        resetProductState: (state) => {
            state.filteredProduct = null
        },
    },
    extraReducers: {
        // GET filtered product
        [getFilteredProduct.pending]: (state) => {
            state.loading = "pending"
            state.filteredProduct = null
        },
        [getFilteredProduct.fulfilled]: (state, action) => {
            state.loading = "idle"
            state.error = null
            state.filteredProduct = action.payload
        },
        [getFilteredProduct.rejected]: (state, action) => {
            state.loading = "idle"
            state.error = action.payload || "SOMETHING WRONG!!"
        },

        // GET product by id
        [getProductById.pending]: (state) => {
            state.loading = "pending"
            productsAdapter.removeAll(state)
        },
        [getProductById.fulfilled]: (state, action) => {
            state.loading = "idle"
            state.error = null
            productsAdapter.setOne(state, action.payload.product)
        },
        [getProductById.rejected]: (state, action) => {
            state.loading = "idle"
            state.error = action.payload || "SOMETHING WRONG!!"
        },

        // GET all products
        [getProducts.pending]: (state) => {
            state.loading = "pending"
            productsAdapter.removeAll(state)
        },
        [getProducts.fulfilled]: (state, action) => {
            state.loading = "idle"
            state.error = null
            productsAdapter.setAll(state, action.payload.products)
        },
        [getProducts.rejected]: (state, action) => {
            state.loading = "idle"
            state.error = action.payload || "SOMETHING WRONG!!"
        },

        // POST product
        [insertProduct.pending]: (state) => {
            state.spinner = true
            productsAdapter.removeAll(state)
        },
        [insertProduct.fulfilled]: (state, action) => {
            state.spinner = false
            state.error = null
            productsAdapter.addOne(state, action.payload.product)
        },
        [insertProduct.rejected]: (state, action) => {
            state.spinner = false
            state.error = action.payload || "SOMETHING WRONG!!"
        },

        // PUT product
        [updateProduct.pending]: (state) => {
            state.spinner = true
            productsAdapter.removeAll(state)
        },
        [updateProduct.fulfilled]: (state, action) => {
            state.spinner = false
            productsAdapter.addOne(state, action.payload.updatedProduct)
        },
        [updateProduct.rejected]: (state, action) => {
            state.spinner = false
            state.error = action.payload || "SOMETHING WRONG!!"
        },

        // DELETE product
        [deleteProduct.pending]: (state) => {
            state.spinner = true
            productsAdapter.removeAll(state)
        },
        [deleteProduct.fulfilled]: (state, action) => {
            state.spinner = false
            state.error = null
            productsAdapter.removeOne(state, action.payload)
        },
        [deleteProduct.rejected]: (state, action) => {
            state.spinner = false
            state.error = action.payload || "SOMETHING WRONG!!"
        },
    },
})

export const productsSelectors = productsAdapter.getSelectors(
    (state) => state.products
)

export const {
    resetError,
    keywordQuery,
    categoryQuery,
    offsetIncrement,
    offsetDecrement,
    resetOffset,
    resetProductState,
    setNotification,
    setShowNotification,
} = productsSlice.actions

export default productsSlice.reducer
