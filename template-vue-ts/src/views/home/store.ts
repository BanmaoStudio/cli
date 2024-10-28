import { defineStore } from "pinia";

export const useHomeStore = defineStore({
  id: "home",
  state: () => ({
    quickStations: [],
    stationInfoData: {},
    alarmData: {},
  }),
  actions: {
  },
});
