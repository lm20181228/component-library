<template>
  <el-form ref="searchForm" class="flex-form" :model="formData">
    <template v-for="(item, index) in search">
      <!-- 自定义二级级联 只能二级 -->
      <template v-if="item.type == 'customCascading'">
        <div :key="index" class="custom-cascading">
          <el-form-item
            class="move gap place just-flex move el-icon-place"
            :label="item.label"
            :prop="item.itemList[0].prop"
          >
            <el-select
              v-model="formData[item.itemList[0].prop]"
              :clearable="item.itemList[0].clearable"
              class="form-style"
              :placeholder="item.itemList[0].placeholder"
              size="small"
              @change="change(item)"
            >
              <!-- @visible-change="item.itemList[0].visibleChange" -->
              <el-option
                v-for="(selectItem, index) in item.itemList[0].options"
                :key="index"
                :collapse-tags="item.collapseTags"
                :label="item.optionConfig ? selectItem[item.optionConfig.label] : selectItem.label"
                :value="item.optionConfig ? selectItem[item.optionConfig.value] : selectItem.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="move gap place just-flex move el-icon-place"
            :prop="item.itemList[1].prop"
          >
            <el-select
              v-model="formData[item.itemList[1].prop]"
              :clearable="item.itemList[1].clearable"
              :placeholder="item.itemList[1].placeholder"
              :multiple="item.itemList[1].multiple"
              :collapse-tags="item.itemList[1].collapseTags"
            >
              <el-option
                v-for="(selectItem, index) in item.itemList[1].options"
                :key="index"
                :label="item.optionConfig ? selectItem[item.optionConfig.label] : selectItem.label"
                :value="item.optionConfig ? selectItem[item.optionConfig.value] : selectItem.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </template>
      <el-form-item
        v-if="item.type != 'customCascading' && !item.isHide"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <!-- 范围输入 rangeInput-->
        <template v-if="item.type == 'rangeInput'">
          <el-input
            v-model="formData[item.prop1]"
            v-integer
            class="range-input"
            :clearable="item.clearable"
            :placeholder="item.placeholder"
            :maxlength="item.maxlength ? item.maxlength : 20"
          ></el-input>
          &nbsp;&nbsp;~&nbsp;&nbsp;
          <el-input
            v-model="formData[item.prop2]"
            v-integer
            class="range-input"
            :clearable="item.clearable"
            :placeholder="item.placeholder"
            :maxlength="item.maxlength ? item.maxlength : 20"
          ></el-input>
        </template>
        <!-- 范围输入 rangeInput-->
        <!-- 时间选择器 daterange-->
        <el-date-picker
          v-else-if="item.type == 'daterange'"
          v-model="formData[item.prop]"
          type="daterange"
          :clearable="item.clearable"
          :range-separator="item.rangeSeparator ? item.rangeSeparator : '至'"
          :start-placeholder="item.placeholder[0]"
          :end-placeholder="item.placeholder[1]"
          :format="item.format"
          :value-format="item.valueFormat"
          @change="datePickerChange(item)"
        ></el-date-picker>
        <!-- 时间选择器 datetimerange-->
        <el-date-picker
          v-else-if="item.type == 'datetimerange'"
          v-model="formData[item.prop]"
          type="datetimerange"
          :clearable="item.clearable"
          :range-separator="item.rangeSeparator ? item.rangeSeparator : '-'"
          :start-placeholder="item.placeholder[0]"
          :end-placeholder="item.placeholder[1]"
          :default-time="item.defaultTime"
          :format="item.format"
          :value-format="item.valueFormat"
          @change="datePickerChange(item)"
        ></el-date-picker>
        <!-- 时间点选择器 -->
        <template v-else-if="item.type == 'timeSelect'">
          <el-time-select
            v-model="formData[item.prop]"
            :clearable="item.clearable"
            :is-range="item.isRange"
            :arrow-control="item.arrowControl"
            :picker-options="item.pickerOptions"
            :selectable-range="item.selectableRange"
            :format="item.format"
            :value-format="item.valueFormat"
          ></el-time-select>
        </template>
        <!-- 年月选择器 -->
        <el-date-picker
          v-else-if="item.type == 'yearMonthSelect'"
          v-model="formData[item.prop]"
          type="month"
          :clearable="item.clearable"
          clear-icon="el-icon-circle-close"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
        <!-- 下拉选框 -->
        <el-select
          v-else-if="item.type == 'select'"
          v-model="formData[item.prop]"
          :clearable="item.clearable"
          :placeholder="item.placeholder"
          :multipler="item.multipler"
          :collapse-tags="item.collapseTags"
          :filterable="item.filterable"
          :remote="item.remote"
          :reserve-keyword="item.reserveKeyword"
          :remote-method="
            (newVal) => {
              item.handle && item.handle(newVal);
            }
          "
        >
          <el-option
            v-for="(selectItem, selectIndex) in item.options"
            :key="selectIndex"
            :label="item.optionConfig ? selectItem[item.optionConfig.label] : selectItem.label"
            :value="item.optionConfig ? selectItem[item.optionConfig.value] : selectItem.value"
          ></el-option>
        </el-select>
        <!-- 普通级联 -->
        <el-cascader
          v-else-if="item.type == 'cascader'"
          v-model="formData[item.prop]"
          :clearable="item.clearable"
          :options="item.options"
          :props="props"
          @change="cascaderChange"
        ></el-cascader>
        <!-- 普通输入框 -->
        <el-input
          v-else
          v-model="formData[item.prop]"
          :clearable="item.clearable"
          :placeholder="item.placeholder"
          :maxlength="item.maxlength ? item.maxlength : 20"
          @input="inputCkeck(item)"
        ></el-input>
        <!-- 根据业务需求，当需要在输入框后面添加业务说明时使用 -->
        <el-tooltip
          v-show="item.iconText"
          class="item"
          effect="dark"
          :content="item.iconText"
          placement="right"
        >
          <i class="el-icon-warning-outline tips-icon"></i>
        </el-tooltip>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
export default {
  name: 'SearchQueryItem',
  props: {
    // 表单form数据
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 搜索项数据，包含每一项搜索项配置参数
    search: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 表单form数据
      formData: {},
      // 搜索项数据
      baseSearch: [],
    };
  },
  watch: {
    // 监听数据
    search: {
      handler(value) {
        this.$set(this, 'baseSearch', value);
      },
      deep: true,
    },
    data: {
      handler(value) {
        this.$set(this, 'formData', JSON.parse(JSON.stringify(value)));
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    // 初始化数据
    this.$set(this, 'formData', JSON.parse(JSON.stringify(this.data)));
    // 因为可能存在级联数据导致搜索数据内的数据有所改变的，所以不深拷贝，保持数据同步
    this.$set(this, 'baseSearch', this.search);
  },
  methods: {
    /**
     * @description  获取搜索条件数据
     * @returns 返回数据为搜索条件数据组成的对象
     * @author liemi 2021/3/8
     * */
    getSearch() {
      return this.formData;
    },
    /**
     * @description  重置
     * @author liemi 2021/3/8
     * */
    reset() {},
    /**
     * @description  自定义级联change事件
     * @param {item} 必传参数，获取当前选中数据
     * @author liemi 2021/3/8
     * */
    change(item) {
      const changValue = this.formData[item.itemList[0].prop];
      item.itemList[0].change(changValue);
      this.formData[item.itemList[1].prop] = this.data[item.itemList[1].prop];
    },
    /**
     * @description  select change事件
     * @param {item} 必传参数，获取当前选中数据
     * @author liemi 2021/3/8
     * */
    cascaderChange(item) {},
    /**
     * @description  select 下拉框搜索事件
     * @param {item} 必传参数，获取组件当前选中数据
     * @author liemi 2021/3/8
     * */
    selectRemoteMethod(item, data) {
      console.log(item, data, '动态搜索');
    },
    /**
     * @description 输入框规则校验输入框,用于处理特殊业务需求需要在输入框进行输入内容校验
     * @param {item} 必传参数，获取当前输入框的所有配置项和当前输入框的值
     * @author limei 2021/11/9
     * */
    inputCkeck(item) {
      const val = this.formData[item.prop];
      // 获取通过输入框校验规则之后的数据，对输入框内容进行重置
      this.formData[item.prop] = item.handle && item.handle(val);
    },
    /**
     * @description  时间选择组件change事件 用于将获取的时间数组对象处理为两个单独的字符串
     * @param {item} 必传参数，获取组件当前值
     * @author liemi 2021/3/8
     * */
    datePickerChange(item) {
      const formData = this.formData[item.prop];
      if (formData) {
        if (item.filed.length > 1) {
          this.formData[item.filed[0]] = formData[0];
          this.formData[item.filed[1]] = formData[1];
        } else {
          this.formData[item.filed[0]] = formData;
        }
      } else {
        if (item.filed.length > 1) {
          this.formData[item.filed[0]] = '';
          this.formData[item.filed[1]] = '';
        } else {
          this.formData[item.filed[0]] = '';
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.flex-form {
  display: inline;
  .custom-cascading {
    display: flex;
  }
  .form-style {
    width: 108px;
  }
  .form-follow-style {
    width: 180px;
  }
  ::v-deep .el-form-item__content {
    display: flex;
    line-height: 32px;
  }
  ::v-deep.el-form-item {
    margin-bottom: 16px;
    margin-right: 10px;
    height: 32px;
    display: inline-block;
  }
  ::v-deep .el-form-item__label {
    line-height: 32px;
  }
  ::v-deep .el-input__inner {
    height: 32px;
  }
  // 输入框样式
  ::v-deep .select-input {
    width: 210px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: 1px solid red;
  }
  .range-input {
    width: 140px !important;
  }
  .tips-icon {
    vertical-align: middle;
    line-height: 31px;
    margin-left: 5px;
  }
}
</style>
