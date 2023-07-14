const initialState = {
    categories: [],
    category: {},
    getCategoryRequest: false,
    getCategorieSuccess: false,
    getCategoriesSuccess: false,
    getCategoriesRequest: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'RETRIEVE_Categories_SUCCESS':
            return {
                ...state,
                Categories: action.payload.data.items,
                getCategoriesSuccess: true,

            };
        case 'RETRIEVE_Categories_REQUEST':
            return {
                ...state,
                getCategoriesSuccess: false,
                getCategoriesRequest: true,
                
            };
        case 'RETRIEVE_Categories_FAILURE':
            return {
                getCategoriesSuccess: false,
                getCategoriesRequest: false,
                ...state
            };
        case 'RETRIEVE_Category_SUCCESS':
            return {
                ...state,
                Category: action.payload,
                getCategoriesuccess: true,
                getCategoryRequest: false,

            };
        case 'RETRIEVE_Category_FAILURE':
            return {
                ...state,
                getCategoriesuccess: false,
                getCategoryRequest: false,


            };
        case 'RETRIEVE_Category_REQUEST':
            return {
                ...state,
                getCategoryRequest: true,
                getCategoriesuccess: false,

            };
        default:
            return {
                ...state
            }
    }

}
