// State object with filters and temporary place for the recipes.
export const state = {
    filters: {
        searchTerm: '',
        sortBy: 'name',
        filterBy: undefined,
    },
    data: {
        searchTerm: '',
        recipes: []
    }
};