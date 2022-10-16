<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex'
import VPagination from "../src/components/VPagination.vue";
// import data from '../src/assets/data.js';

const store = useStore()
const data = store.state.data;
const pageRange = ref(3);
const marginPages = ref(3);
const currentPage = ref(store.state.currentPage)
const totalPages = computed(() => store.getters.getTotalPages)

const dataToRenderStore = computed(() => store.getters.getDataToRender)

const ToFilterColumn = ref('name')
const ToFilterCondition = ref('contains')
const ToFilterValue = ref('')
const isAscending = computed(() => store.getters.getAscendingValue);
const sortedColumn = computed(() => store.getters.getSortedColumnName);
const colData = Object.keys(data[0])

const onSubmitFilterData = (param, condition, value) => {
  const payload = { param, condition, value }
  store.dispatch('filterData', payload)
}

const onSortButtonClick = (col) => {
  store.dispatch('sortTableColumn', col)
}

const onPaginationPageClick = () => {
  store.dispatch('setCurrentPage', currentPage.value)
}
// page.value = computed(() => store.getters.getCurrentPage)
onMounted(() => {
  currentPage.value = store.state.currentPage
})
watch(ToFilterValue, (newValue, oldValue) => {
  if (newValue) {
    currentPage.value = store.getters.getCurrentPage;
    console.log('store: ' + store.getters.getCurrentPage);
    console.log('currentPage.value: ' + currentPage.value);
  }
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold underline mb-3">
      My table
    </h1>
    <!--  -->
    <form class="flex items-center justify-center gap-3 px-3 mb-3"
      @submit.prevent="onSubmitFilterData(`${ToFilterColumn}`, `${ToFilterCondition}`, `${ToFilterValue}`)">
      <div class="input-wrap">
        <label for="column">column to filter</label>
        <select name="column" v-model="ToFilterColumn" id="column" class="input">
          <option value="name" selected="selected">Name</option>
          <option value="count">Count</option>
          <option value="distance">Distance</option>
        </select>
      </div>
      <div class="input-wrap">
        <label for="filteringСondition">Choose filter condition</label>
        <select name="filteringСondition" v-model="ToFilterCondition" id="filteringСondition" class="input"
          placeholder="Choose condition">
          <option value="contains" selected="selected">this is contains</option>
          <option value="more">this is more than</option>
          <option value="less">this is less than</option>
          <option value="equal">this is equal to</option>
        </select>
      </div>
      <div class="input-wrap">
        <label for="filterValue">Input value</label>
        <input class="input" id="filterValue" v-model="ToFilterValue" name="filterValue" type="text"
          placeholder="input value for condition">
      </div>
    </form>
    <!--  -->
    <div class="mb-4">
      <table class="w-full max-w-full">
        <thead>
          <tr>
            <th v-for="col,i in colData" :key="i">
              <button v-if="col === 'date'">{{col.toUpperCase()}}</button>
              <button class="button" v-else @click="onSortButtonClick(col)">{{col.toUpperCase()}}
                <span v-if="sortedColumn === col"
                  :class="['arrow', isAscending && sortedColumn === col ? '' : 'arrow--down']">⬆</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataToRenderStore" :key="item.id">
            <td v-for="col,i in colData" :key="i">{{item[col]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--  -->
    <div>
      <p>Pagination</p>
      <VPagination v-model="currentPage" :page-count="totalPages" :hide-prev-next="true" :page-range="pageRange"
        :margin-pages="marginPages" :click-handler="onPaginationPageClick"
        :disabled-class="'rt-pagination__btn--disabled'" :page-link-class="'rt-pagination__btn'"
        :prev-link-class="'rt-pagination__btn rt-pagination__btn--prev'"
        :next-link-class="'rt-pagination__btn rt-pagination__btn--next'" :active-class="'rt-pagination__btn--current'">
        <template #iconarrow>
          <svg width="7" height="11" viewBox="0 0 12 18" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M1.31585 0.583588C1.90246 -0.00136659 2.85221 -1.94013e-05 3.43716 0.586597L10.7705 7.94076C11.3543 8.5262 11.3543 9.47363 10.7705 10.0591L3.43716 17.4132C2.85221 17.9999 1.90246 18.0012 1.31585 17.4162C0.729229 16.8313 0.727881 15.8815 1.31284 15.2949L7.59001 8.99992L1.31284 2.70491C0.727881 2.11829 0.729229 1.16854 1.31585 0.583588Z"
              fill="currentColor" />
          </svg>
        </template>
      </VPagination>
    </div>
  </div>
</template>

<style scoped >
.input-wrap {
  display: grid;
  justify-content: start;
  align-items: start;
  justify-items: start;
  text-align: left;
  gap: 0.5rem;
}

.input-wrap label {
  cursor: pointer;
}

.input {
  @apply border-fuchsia-400 border-2 rounded-lg px-2 py-1 cursor-pointer
}

.button {
  padding-left: 1rem;
  padding-right: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 20px;
  gap: 0.5rem;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.3s ease-in-out 0s;
}

.arrow.arrow--down {
  transform: rotate(180deg)
}
</style>
