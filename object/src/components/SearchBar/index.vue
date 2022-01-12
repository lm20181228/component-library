<template>
  <div class="search-form">
    <searchQueryItem
      ref="baseForm"
      :data="baseSearchForm"
      :search="baseSearchQuery"
      class="flex-form-top"
    ></searchQueryItem>
    <template v-if="isShow">
      <transition name="el-fade-in-linear">
        <searchQueryItem
          ref="moreForm"
          :data="moreSearchForm"
          :search="moreSearchQuery"
          class="flex-form-top"
        ></searchQueryItem>
      </transition>
    </template>
    <div class="button-move">
      <el-button size="medium" type="primary" @click="search">{{ searchBtnTitle }}</el-button>
      <el-button v-if="!hideReset" size="medium" @click="reset">{{ resetBtnTitle }}</el-button>
      <!-- 自定义操作按钮 -->
      <slot name="buttons"></slot>
    </div>
    <el-divider v-if="moreSearch.length > 0" class="devide-color">
      <div @click="collapseRearsh">
        {{ isShow ? '关闭' : '展开' }}
        <i class="devide-color" :class="icon"></i>
      </div>
    </el-divider>
  </div>
</template>
<script>
import searchQueryItem from '../SearchBar/SearchFormItem';
export default {
  name: 'SearchQuery',
  components: { searchQueryItem },
  props: {
    // 基础搜索条件,包含配置参数内容
    baseSearch: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 更多搜索条件，包含配置参数内容
    moreSearch: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 基础搜索条件的form数据，不包含配置参数内容
    baseData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 更多搜索条件的form数据,不包含配置参数内容
    moreData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 是否需要隐藏重置按钮
    hideReset: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    //  搜索按钮自定义名字
    searchBtnTitle: {
      type: String,
      default: () => {
        return '搜索';
      },
    },
    //  重置按钮自定义名字
    resetBtnTitle: {
      type: String,
      default: () => {
        return '重置';
      },
    },
  },
  data() {
    return {
      icon: 'el-icon-arrow-down', //默认更多icon显示
      isShow: false, //判断展示关闭，展开字段
      baseSearchQuery: [], //基础搜索条件搜索数据
      moreSearchQuery: [], //更多搜索条件搜索数据
      searchQuery: {}, //搜索组件搜索数据
      baseSearchForm: {}, //基础搜索条件的form数据
      moreSearchForm: {}, //更多搜索条件的form数据
    };
  },
  watch: {
    // 监听基础搜索条件对象和更多搜索条件对象，因为可能存在级联数据导致搜索数据内的数据有所改变的
    baseSearch: {
      handler(value) {
        this.$set(this, 'baseSearchQuery', value);
      },
      deep: true,
    },
    moreSearch: {
      handler(value) {
        this.$set(this, 'moreSearchQuery', value);
      },
      deep: true,
    },
  },
  created() {
    // 初始化赋值
    this.$set(this, 'baseSearchForm', JSON.parse(JSON.stringify(this.baseData)));
    this.$set(this, 'moreSearchForm', JSON.parse(JSON.stringify(this.moreData)));
    // 因为可能存在级联数据导致搜索数据内的数据有所改变的，所以不深拷贝，保持数据同步
    this.$set(this, 'baseSearchQuery', this.baseSearch);
    this.$set(this, 'moreSearchQuery', this.moreSearch);
  },
  mounted() {},
  methods: {
    /**
     * @description 搜索事件
     * @author limei 2021/3/8
     * */
    search() {
      let baseFormData = {};
      let moreFormData = {};
      baseFormData = this.$refs.baseForm.getSearch();
      // 判断当前是否展开，是展开时需要获取额外的搜索条件数据
      if (this.isShow) {
        moreFormData = this.$refs.moreForm.getSearch();
      }
      // 返回所有的搜索条件
      this.searchQuery = { ...baseFormData, ...moreFormData };
      this.$emit('search', this.searchQuery);
    },
    /**
     * @description 重置搜索条件
     * @author limei 2021/3/8
     * */
    reset() {
      console.log('进入搜索条件重置嫩恩恩');
      this.$set(this, 'baseSearchForm', JSON.parse(JSON.stringify(this.baseData)));
      this.$set(this, 'moreSearchForm', JSON.parse(JSON.stringify(this.moreData)));
      console.log(this.baseSearchForm, '进入搜索条件重置嫩恩恩');

      // 返回所有的搜索条件
      this.searchQuery = { ...this.baseSearchForm, ...this.moreSearchForm };
      this.$emit('reset', this.searchQuery);
    },
    /**
     * @description 折叠搜索条件点击事件（显示更多折叠更多搜索条件）
     * @author limei 2021/3/8
     * */
    collapseRearsh() {
      this.isShow = !this.isShow;
      if (this.isShow == true) {
        this.icon = 'el-icon-arrow-up';
        this.$emit('collapseClick');
      } else if (this.isShow == false) {
        this.icon = 'el-icon-arrow-down';
      }
    },
  },
};
</script>
<style lang="less" scoped>
.search-form {
  // padding: 0 20px;
  ::v-deep .el-input__inner {
    border-radius: 2px;
  }
  ::v-deep.el-date-editor .el-range__icon,
  ::v-deep.el-date-editor .el-range-separator,
  ::v-deep.el-date-editor .el-range__close-icon {
    line-height: 25px;
  }
  ::v-deep .devide-color {
    cursor: pointer;
  }
  .devide-color ::v-deep.el-divider__text {
    color: #4974f5;
  }
  .button-move {
    margin-bottom: 16px;
    display: inline-block;
    vertical-align: bottom;
  }
}
</style>
