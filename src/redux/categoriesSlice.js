import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import openServer from "../middlewares/axios/openServer"

// fetch all category
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (thunkAPI) => {
        try {
            const { data } = await openServer.get("/category")
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        categories: null,
        category: "",
        loading: "idle",
        error: null,
    },
    reducers: {
        categoryQuery: (state, action) => {
            state.category = action.payload
        },
    },
    extraReducers: {
        // fetch all category
        [fetchCategories.pending]: (state) => {
            state.loading = "pending"
        },
        [fetchCategories.fulfilled]: (state, action) => {
            state.loading = "idle"
            state.categories = action.payload.categories
        },
        [fetchCategories.rejected]: (state, action) => {
            state.loading = "idle"
            state.error = action.payload
        },
    },
})

export const { categoryQuery } = categoriesSlice.actions

export default categoriesSlice.reducer
