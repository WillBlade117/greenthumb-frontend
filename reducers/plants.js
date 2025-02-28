import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const plantSlice = createSlice({
  name: 'plants',
  initialState,
  reducers: {
    addPlant: (state, action) => {
      state.value = action.payload;
    },
    deletePlant: (state, action) => {
      state.value = state.value.filter((e) => e._id !== action.payload);
    },
    addPhoto: (state, action) => {
      const { plantId, photoUrl } = action.payload;
      const plant = state.value.find((p) => p._id === plantId);
      if (plant) {
        plant.pictures.push(photoUrl);
      }
    },
    reset: (state) => {
      state.value = [];
    }
  },
});

export const { addPlant, deletePlant, addPhoto, reset } = plantSlice.actions;
export default plantSlice.reducer;
