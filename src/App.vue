<script setup>
import { ref, computed } from 'vue';
const ToFilterColumn = ref('name')
const ToFilterCondition = ref('contains')
const ToFilterValue = ref('')
const ascending = ref(true);
const sortColumn = ref('count');
const dataJson = ref([
  {
    "date": "15.10.2022",
    "count": 1,
    "name": 'Artem',
    "distance": 150
  },
  {
    "date": "17.10.2022",
    "count": 2,
    "name": 'Milosh',
    "distance": 200
  },
  {
    "date": "19.10.2022",
    "count": 3,
    "name": 'Nickolas',
    "distance": 250
  },
])

const sortTableColumn = (col) => {
  if (sortColumn.value === col) {
    ascending.value = !ascending.value;
  } else {
    sortColumn.value = col;
    ascending.value = true;
  }

  dataJson.value.sort(function (a, b) {
    if (a[col] > b[col]) {
      return ascending.value ? 1 : -1
    } else if (a[col] < b[col]) {
      return ascending.value ? -1 : 1
    }
    return 0;
  })
};

const colData = computed(() => {
  if (dataJson.value.length == 0) {
    return [];
  }
  return Object.keys(dataJson.value[0])
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold underline mb-3">
      My table
    </h1>
    <form class="flex items-center justify-center gap-3 px-3 mb-3">
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
    <div class="mb-4">
      <table class="w-full max-w-full">
        <thead>
          <tr>
            <th v-for="col,i in colData" :key="i">
              <button v-if="col === 'date'">{{col.toUpperCase()}}</button>
              <button class="button" v-else @click="sortTableColumn(col)">{{col.toUpperCase()}}
                <span v-if="sortColumn === col"
                  :class="['arrow', ascending && sortColumn === col ? '' : 'arrow--down']">⬆</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataJson" :key="item.id">
            <td v-for="col,i in colData" :key="i">{{item[col]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <p>Pagination</p>
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

.datarow-enter-active,
.datarow-leave-active {
  transition: all 0.5s ease;
}

.datarow-enter-from,
.datarow-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
