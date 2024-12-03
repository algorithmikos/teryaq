import { createSlice } from "@reduxjs/toolkit";

const WeightGuideSlice = createSlice({
  name: "WeightGuideSlice",
  initialState: [
    {
      id: "1",
      item: "معكرونة حمراء دون خضر",
      calc: 0.2,
      carb: 0,
      type: "edible",
      tags: [""],
    },
    {
      id: "2",
      item: "معكرونة حمراء بخضر",
      calc: 0.15,
      carb: 0,
      type: "edible",
      tags: [""],
    },
    {
      id: "3",
      item: "معكرونة اسباغيتي",
      calc: 0.2,
      carb: 0,
      type: "edible",
      tags: [""],
    },
    {
      id: "4",
      item: "معكرونة بصوص البيستو",
      calc: 0.17,
      carb: 0,
      type: "edible",
      tags: [""],
    },
  ],
  reducers: {
    setWeightGuide: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setWeightGuide } = WeightGuideSlice.actions;
export default WeightGuideSlice.reducer;
