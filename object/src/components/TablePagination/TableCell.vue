<template>
  <el-table-column
    v-if="['expand', 'isrender'].includes(column.type)"
    :prop="column.prop"
    :type="column.type"
    :expand-render="column.expandRender"
    :render="column.render"
    :label="column.label"
    :width="column.width"
    :fixed="column.fixed"
    :align="column.align"
    :selectable="column.selectable"
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
    :prop="column.prop"
    :type="column.type"
    :expand-render="column.expandRender"
    :render="column.render"
    :label="column.label"
    :width="column.width"
    :fixed="column.fixed"
    :align="column.align"
    :selectable="column.selectable"
    :sortable="column.sortable ? column.sortable : false"
    :formatter="column.formatter"
    :show-overflow-tooltip="getShowOverflowTooltip(column.showOverflowTooltip)"
    :min-width="column.minWidth"
  >
  </el-table-column>
  <el-table-column
    v-else
    :prop="column.prop"
    type="isrender"
    :expand-render="column.expandRender"
    :render="column.render"
    :label="column.label"
    :width="column.width"
    :fixed="column.fixed"
    :align="column.align"
    :selectable="column.selectable"
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
import cell from 'components/TablePagination/expand';
import PropsStatic from 'components/TablePagination/props';
export default {
  name: 'TableColumn',
  components: { cell },
  props: {
    // 表格一列展示数据和配置
    column: {
      type: Object,
      default: () => {},
    },
    // 单元格空数据占位符
    columnEmptyText: {
      type: String,
      default: '',
    },
    // 原table配置项
    ...PropsStatic.tableColumn,
  },
  data() {
    return {};
  },
  methods: {
    /**
     * @description 是否超出展示省略内容
     * @param {val} 必传参数，
     * @author limei 2021/3/8
     * */
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
