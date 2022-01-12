<template>
  <el-table-column
    v-if="['expand', 'isrender'].includes(column.type)"
    :class-name="column.className"
    :prop="column.prop"
    :type="column.type"
    :expandRender="column.expandRender"
    :render="column.render"
    :label="column.label"
    :width="column.width"
    :fixed="column.fixed"
    :align="column.align"
    :selectable="column.selectable"
    :label-class-name="column.labelClassName"
    :sortable="column.sortable ? column.sortable : false"
    :formatter="column.formatter"
    :show-overflow-tooltip="getShowOverflowTooltip(column.showOverflowTooltip)"
    :min-width="column.minWidth"
  >
    <template slot-scope="scope">
      <cell :column="scope.column" :row="scope.row" :index="scope.$index" :render="column.render" />
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="['selection', 'index'].includes(column.type)"
    :class-name="column.className"
    :prop="column.prop"
    :type="column.type"
    :expandRender="column.expandRender"
    :render="column.render"
    :label="column.label"
    :width="column.width"
    :fixed="column.fixed"
    :align="column.align"
    :selectable="column.selectable"
    :label-class-name="column.labelClassName"
    :sortable="column.sortable ? column.sortable : false"
    :formatter="column.formatter"
    :show-overflow-tooltip="getShowOverflowTooltip(column.showOverflowTooltip)"
    :min-width="column.minWidth"
  >
  </el-table-column>
  <el-table-column
    v-else
    :class-name="column.className"
    :prop="column.prop"
    :type="column.type"
    :expandRender="column.expandRender"
    :render="column.render"
    :label="column.label"
    :width="column.width"
    :fixed="column.fixed"
    :align="column.align"
    :selectable="column.selectable"
    :label-class-name="column.labelClassName"
    :sortable="column.sortable ? column.sortable : false"
    :formatter="column.formatter"
    :show-overflow-tooltip="getShowOverflowTooltip(column.showOverflowTooltip)"
    :min-width="column.minWidth"
  >
    <template slot-scope="scope">
      {{ scope.row[column.prop] || columnEmptyText }}
    </template>
  </el-table-column>
</template>
<script>
import cell from './expand';
import PropsStatic from './props';
export default {
  name: 'collapseTableColumn',
  components: { cell },
  props: {
    // 是否异步数据，同步数据是指折叠面板头尾信息和内部table信息同一接口全返回，异步数据是指内部table请求另外的接口，异步不做默认展开操作。
    columnType: {
      type: String,
      default: '',
    },
    column: {
      type: Object,
      default() {
        return {};
      },
    },
    // 单元格内容为空时显示的占位符
    columnEmptyText: {
      type: String,
      default: '',
    },
    ...PropsStatic.tableColumn,
  },
  data() {
    return {};
  },
  // created: {},
  // mounted() {},
  // watch: {},
  methods: {
    getShowOverflowTooltip(val) {
      if (typeof val === 'boolean') {
        return val;
      } else {
        return this.showOverflowTooltip;
      }
    },
  },
};
</script>
