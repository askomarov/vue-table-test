import { createStore } from "vuex";
import data from "../assets/data.js";

export default createStore({
  state: {
    data,
    currentPage: 1,
    totalPages: 1,
    dataOnPage: 5,
    dataToRender: [...data],
    isAscending: true,
    sortedColumn: "count",
  },
  getters: {
    getSortedColumnName(state) {
      return state.sortedColumn;
    },
    getAscendingValue(state) {
      return state.isAscending;
    },
    getCurrentPage(state) {
      if (state.dataToRender.length <= state.dataOnPage) {
        return (state.currentPage = 1);
      }
      return state.currentPage;
    },
    getData(state) {
      return state.data;
    },
    getTotalPages(state) {
      if (state.dataToRender.length <= state.dataOnPage) {
        return (state.totalPages = 1);
      } else {
        return (state.totalPages = Math.ceil(
          state.dataToRender.length / state.dataOnPage
        ));
      }
    },
    getDataToRender(state) {
      let from = state.currentPage * state.dataOnPage - state.dataOnPage;
      let to = state.currentPage * state.dataOnPage;
      return state.dataToRender.slice(from, to);
    },
  },
  mutations: {
    ["filterData"](state, payload) {
      let { param, condition, value } = payload;
      state.dataToRender = state.data.filter((item) => {
        if (condition === "equal") {
          return item[param] === value;
        } else if (condition === "more") {
          return item[param] > value;
        } else if (condition === "less") {
          return item[param] < value;
        } else if (condition === "contains") {
          return item[param]
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        }
      });
    },
    ["setCurrentPage"](state, num) {
      state.currentPage = num;
    },
    ["sortTableColumn"](state, payload) {
      if (state.sortedColumn === payload) {
        state.isAscending = !state.isAscending;
      } else {
        state.sortedColumn = payload;
        state.isAscending = true;
      }

      state.dataToRender.sort(function (a, b) {
        if (a[payload] > b[payload]) {
          return state.isAscending ? 1 : -1;
        } else if (a[payload] < b[payload]) {
          return state.isAscending ? -1 : 1;
        }
        return 0;
      });
    },
  },
  actions: {
    filterData({ commit }, payload) {
      commit("filterData", payload);
    },
    setCurrentPage({ commit }, num) {
      commit("setCurrentPage", num);
    },
    sortTableColumn({ commit }, payload) {
      commit("sortTableColumn", payload);
    },
  },
});
