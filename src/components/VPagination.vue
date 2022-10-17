<script>
export default {
  name: 'VPagination',
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    initialPage: {
      type: Number,
      default: 1,
    },
    forcePage: {
      type: Number,
      default: undefined,
    },
    clickHandler: {
      type: Function,
      default: () => { },
    },
    pageRange: {
      type: Number,
      default: 3,
    },
    marginPages: {
      type: Number,
      default: 1,
    },
    breakViewText: {
      type: String,
      default: '…',
    },
    pageClass: {
      type: String,
      default: 'page-item',
    },
    pageLinkClass: {
      type: String,
      default: 'page-link',
    },
    prevClass: {
      type: String,
      default: 'page-item',
    },
    prevLinkClass: {
      type: String,
      default: 'page-link',
    },
    nextClass: {
      type: String,
      default: 'page-item',
    },
    nextLinkClass: {
      type: String,
      default: 'page-link',
    },
    breakViewClass: {
      type: String,
      default: '',
    },
    breakViewLinkClass: {
      type: String,
      default: '',
    },
    activeClass: {
      type: String,
      default: 'active',
    },
    disabledClass: {
      type: String,
      default: 'disabled',
    },
    firstLastButton: {
      type: Boolean,
      default: false,
    },
    hidePrevNext: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      innerValue: 1,
    }
  },
  computed: {
    selected: {
      get: function () {
        return this.modelValue || this.innerValue
      },
      set: function (newValue) {
        this.innerValue = newValue
      },
    },
    pages: function () {
      const items = {}
      if (this.pageCount <= this.pageRange) {
        for (let index = 0; index < this.pageCount; index++) {
          const page = {
            index,
            content: index + 1,
            selected: index === this.selected - 1,
          }
          items[index] = page
        }
      } else {
        const halfPageRange = Math.floor(this.pageRange / 2)
        const setPageItem = (index) => {
          const page = {
            index,
            content: index + 1,
            selected: index === this.selected - 1,
          }
          items[index] = page
        }
        const setBreakView = (index) => {
          const breakView = {
            disabled: true,
            breakView: true,
          }
          items[index] = breakView
        }
        // 1st - loop thru low end of margin pages
        for (let i = 0; i < this.marginPages; i++) {
          setPageItem(i)
        }
        // 2nd - loop thru selected range
        let selectedRangeLow = 0
        if (this.selected - halfPageRange > 0) {
          selectedRangeLow = this.selected - 1 - halfPageRange
        }
        let selectedRangeHigh = selectedRangeLow + this.pageRange - 1
        if (selectedRangeHigh >= this.pageCount) {
          selectedRangeHigh = this.pageCount - 1
          selectedRangeLow = selectedRangeHigh - this.pageRange + 1
        }
        for (
          let i = selectedRangeLow;
          i <= selectedRangeHigh && i <= this.pageCount - 1;
          i++
        ) {
          setPageItem(i)
        }
        // Check if there is breakView in the left of selected range
        if (selectedRangeLow > this.marginPages) {
          setBreakView(selectedRangeLow - 1)
        }
        // Check if there is breakView in the right of selected range
        if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
          setBreakView(selectedRangeHigh + 1)
        }
        // 3rd - loop thru high end of margin pages
        for (
          let i = this.pageCount - 1;
          i >= this.pageCount - this.marginPages;
          i--
        ) {
          setPageItem(i)
        }
      }
      return items
    },
  },
  beforeMount() {
    this.innerValue = this.initialPage
  },
  beforeUpdate() {
    if (this.forcePage === undefined) return
    if (this.forcePage !== this.selected) {
      this.selected = this.forcePage
    }
  },
  methods: {
    handlePageSelected(selected) {
      if (this.selected === selected) return
      this.innerValue = selected
      this.$emit('update:modelValue', selected)
      this.clickHandler(selected)
    },
    prevPage() {
      if (this.selected <= 1) return
      this.handlePageSelected(this.selected - 1)
    },
    nextPage() {
      if (this.selected >= this.pageCount) return
      this.handlePageSelected(this.selected + 1)
    },
    firstPageSelected() {
      return this.selected === 1
    },
    lastPageSelected() {
      return this.selected === this.pageCount || this.pageCount === 0
    },
    selectFirstPage() {
      if (this.selected <= 1) return
      this.handlePageSelected(1)
    },
    selectLastPage() {
      if (this.selected >= this.pageCount) return
      this.handlePageSelected(this.pageCount)
    },
  },
}
</script>

<template>
  <div class="rt-pagination">
    <a v-if="firstLastButton" :class="[pageLinkClass, firstPageSelected() ? disabledClass : '']" tabindex="0"
      @click="selectFirstPage()" @keyup.enter="selectFirstPage()">
      <slot name="iconarrow"></slot>
    </a>
    <a v-if="!(firstPageSelected() && hidePrevNext)" :class="[prevLinkClass, firstPageSelected() ? disabledClass : '']"
      tabindex="0" @click="prevPage()" @keyup.enter="prevPage()">
      <slot name="iconarrow"></slot>
    </a>
    <template v-for="page in pages">
      <a v-if="page.breakView" :key="page.index" :class="[
        pageLinkClass,
        breakViewLinkClass,
        page.disabled ? disabledClass : '',
      ]" tabindex="0">
        <slot name="breakViewContent">{{ breakViewText }}</slot>
      </a>
      <a v-else-if="page.disabled" :key="page.index + 1" :class="[
        pageLinkClass,
        page.selected ? activeClass : '',
        disabledClass,
      ]" tabindex="0">{{ page.content }}</a>
      <a v-else :key="page.index + 2" :class="[pageLinkClass, page.selected ? activeClass : '']" tabindex="0"
        @click="handlePageSelected(page.index + 1)" @keyup.enter="handlePageSelected(page.index + 1)">{{ page.content
        }}</a>
    </template>
    <a v-if="!(lastPageSelected() && hidePrevNext)" :class="[nextLinkClass, lastPageSelected() ? disabledClass : '']"
      tabindex="0" @click="nextPage()" @keyup.enter="nextPage()">
      <slot name="iconarrow"></slot>
    </a>
    <a v-if="firstLastButton" :class="[pageLinkClass, lastPageSelected() ? disabledClass : '']" tabindex="0"
      @click="selectLastPage()" @keyup.enter="selectLastPage()"></a>
  </div>
</template>
<style>
.rt-pagination {
  --color-white: #fff;
  --primary-color: rgba(232, 121, 249, 1);
  --text-color-grey: #c4c4c4;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  --btn-icon-gap: 5px;
}

.rt-pagination__btn {
  cursor: pointer;
  color: var(--text-color-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--color-white);
  border: 1px solid transparent;
  border-radius: 10px;
}

/*  */
.rt-pagination__btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.rt-pagination__btn--current {
  background-color: var(--primary-color);
  color: var(--color-white);

}

.rt-pagination__btn--current:hover {
  background-color: var(--primary-color);
  color: var(--color-white);
}

.rt-pagination__btn--prev {
  color: var(--text-color-grey);
  transform: rotate(180deg);
  border-color: #d5dde7;

}

.rt-pagination__btn--prev:hover,
.rt-pagination__btn--next:hover {
  background-color: var(--primary-color);
  color: var(--color-white);
}

.rt-pagination__btn--loaded {
  width: 28px;
  flex: 0 0 28px;
}

.rt-pagination__btn--next {
  color: var(--text-color-grey);
  border-color: #d5dde7;

}
</style>
