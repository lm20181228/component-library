<template>
  <div class="table-pagination">
    <!-- 表格内容展示 -->
    <el-table
      ref="tablePagination"
      :data="data"
      :height="tableOptions.height"
      :max-height="tableOptions.maxHeight"
      :stripe="tableOptions.stripe"
      :border="tableOptions.border"
      :size="tableOptions.size"
      :fit="tableOptions.fit"
      :show-header="tableOptions.showHeader"
      :highlight-current-row="tableOptions.highlightCurrentRow"
      :current-row-key="tableOptions.currentRowKey"
      :lazy="tableOptions.lazy"
      :indent="tableOptions.indent"
      :row-class-name="tableOptions.rowClassName"
      :row-style="tableOptions.rowStyle"
      :cell-class-name="tableOptions.cellClassName"
      :cell-style="tableOptions.cellStyle"
      :header-row-class-name="tableOptions.headerRowClassName"
      :header-row-style="tableOptions.headerRowStyle"
      :header-cell-class-name="tableOptions.headerCellClassName"
      :header-cell-style="tableOptions.headerCellStyle"
      :row-key="tableOptions.rowKey"
      :empty-text="tableOptions.emptyText"
      :default-expand-all="tableOptions.defaultExpandAll"
      :expand-row-keys="tableOptions.expandRowKeys"
      :default-sort="tableOptions.defaultSort"
      :tooltip-effect="tableOptions.tooltipEffect"
      :show-summary="tableOptions.showSummary"
      :sum-text="tableOptions.sumText"
      :summary-method="tableOptions.summaryMethod"
      :select-on-indeterminate="tableOptions.selectOnIndeterminate"
      :span-method="tableOptions.spanMethod"
      :load="tableOptions.load"
      :tree-props="tableOptions.treeProps"
      @select="_select"
      @select-all="_selectAll"
      @selection-change="_selectionChange"
      @cell-mouse-enter="_cellMouseEnter"
      @cell-mouse-leave="_cellMouseLeave"
      @cell-click="_cellClick"
      @cell-dblclick="_cellDBLclick"
      @row-click="_rowClick"
      @row-contextmenu="_rowContextmenu"
      @row-dblclick="_rowDBLclick"
      @header-click="_headerClick"
      @header-contextmenu="_headerContextmenu"
      @sort-change="_sortChange"
      @filter-change="_filterChange"
      @current-change="_currentChange"
      @header-dragend="_headerDragend"
      @expand-change="_expandChange"
    >
      <tableColumn
        v-for="(tableItem, tableKey) in tableColumns"
        :key="tableKey"
        :column="tableItem"
        :column-empty-text="columnEmptyText"
      >
      </tableColumn>
      <div slot="empty">
        <template v-if="!emptySlot">
          <!-- 默认暂无数据显示 -->
          <div class="prompt-message">
            <img class="icon_nodata-img" src="./images/icon_nodata.png" />
            <p class="no-more">暂无数据</p>
          </div>
        </template>
        <template v-else>
          <!-- 提供插槽修改表格内容为空时的展示 -->
          <slot name="empty"></slot>
        </template>
      </div>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-if="paginationOptions.totalCount > paginationOptions.limitShowPaginNum && paginationOptions"
      background
      :current-page="currentPage"
      :page-sizes="paginationOptions.pageSizes"
      :page-size="pageNum"
      :layout="paginationOptions.paginationOption"
      :total="paginationOptions.totalCount"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>
<script>
import TableColumn from 'components/TablePagination/TableCell';
import PropsStatic from 'components/TablePagination/props';
export default {
  name: 'PaginationTable',
  components: { TableColumn },
  props: {
    // 列表渲染数据
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 表格展示列配置项
    tableColumns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 表格空数据时展示内容
    emptySlot: {
      type: Boolean,
      default: false,
    },
    //列表分页配置
    paginationOptions: {
      type: Object,
      default: () => {
        return {
          pageSizes: [10, 20, 30, 40], //列表可选每页展示条数
          paginationOption: 'total, sizes, prev, pager, next, jumper', //显示分页按钮配置项
          limitShowPaginNum: 10, //列表数据分页展示条件,列表数量超过10条时展示分页数据
          totalCount: 0, //列表数据分页展示条件
        };
      },
    },
    // 分页展示条数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 表格配置数据
    tableOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 表格单元格数据为空时的展示内容
    columnEmptyText: {
      type: String,
      default: '-',
    },
    // 表格默认配置项
    ...PropsStatic.table,
  },
  data() {
    return {
      currentPage: 1, //当前页
      pageNum: 10, //页面列表数据条数
    };
  },
  computed: {},
  created() {
    this.pageNum = this.pageSize;
  },
  // mounted() {},
  // watch: {},
  methods: {
    //折叠面板事件
    // 表格事件
    /****************************/
    /* Original methods statrt  */
    /****************************/
    clearSelection() {
      return this.$refs.tablePagination.clearSelection();
    },
    toggleRowSelection(record, selected) {
      return this.$refs.tablePagination.toggleRowSelection(record, selected);
    },
    toggleAllSelection() {
      return this.$refs.tablePagination.toggleAllSelection();
    },
    toggleRowExpansion(record, expanded) {
      return this.$refs.tablePagination.toggleRowExpansion(record, expanded);
    },
    setCurrentRow(record) {
      return this.$refs.tablePagination.setCurrentRow(record);
    },
    clearSort() {
      return this.$refs.tablePagination.clearSort();
    },
    clearFilter() {
      return this.$refs.tablePagination.clearFilter();
    },
    doLayout() {
      return this.$refs.tablePagination.doLayout();
    },
    sort(prop, order) {
      return this.$refs.tablePagination.sort(prop, order);
    },
    /****************************/
    /* Original methods end     */
    /****************************/

    /****************************/
    /* Original methods start   */
    /****************************/
    _select(selection, row) {
      this.$emit('select', selection, row);
    },
    _selectAll(selection) {
      this.$emit('select-all', selection);
    },
    _selectionChange(selection) {
      this.$emit('selection-change', selection);
    },
    _cellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event);
    },
    _cellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event);
    },
    _cellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event);
    },
    _cellDBLclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event);
    },
    _rowClick(row, column, event) {
      this.$emit('row-click', row, column, event);
    },
    _rowContextmenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event);
    },
    _rowDBLclick(row, column, event) {
      this.$emit('row-dblclick', row, column, event);
    },
    _headerClick(column, event) {
      this.$emit('header-click', column, event);
    },
    _headerContextmenu(column, event) {
      this.$emit('header-contextmenu', column, event);
    },
    _sortChange({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order });
    },
    _filterChange(filters) {
      this.$emit('filter-change', filters);
    },
    _currentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow);
    },
    _headerDragend(newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event);
    },
    _expandChange(row, expandedRows) {
      this.$emit('expand-change', row, expandedRows);
    },
    // 分页部分事件
    /**
     * @description 重置表格事件,包含页码初始化处理
     * @author limei 2021/3/8
     * */
    resetTable() {
      this.currentPage = 1; //当前页
      this.pageNum = this.pageSize; //页面列表数据条数
    },
    /**
     * @description 改变每页条数
     * @param {val} 必传参数，页码组件自带参数
     * @author limei 2021/3/8
     * */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageNum = val;
      let data = {
        start: this.currentPage,
        limit: this.pageNum,
      };
      this.$emit('refresh', data);
    },
    /**
     * @description 改变页数
     * @param {val} 必传参数，页码组件自带参数
     * @author limei 2021/3/8
     * */
    handleCurrentChange(val) {
      this.currentPage = val;
      let data = {
        start: this.currentPage,
        limit: this.pageNum,
      };
      this.$emit('refresh', data);
    },
  },
};
</script>
<style lang="scss" scoped>
.table-pagination {
  // 无数据展示样式
  .prompt-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 120px;
    .no-more {
      color: $font-color-thead;
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
  // 表格样式修改
  .task-table-box {
    margin: 0 20px;
    border: 1px solid #e5e5e5;
    margin-bottom: 16px;
  }
  ::v-deep.el-table th {
    background-color: #fff;
  }
  //没有数据的样式
  .prompt-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0px;
    .no-more {
      height: 20px;
      line-height: 20px;
      color: $font-color-thead;
      font-size: 14px;
    }
  }
  // 折叠面板样式
  .el-collapse {
    // border-top: 1px solid #E5E5E5;
    border-bottom: none;
  }
  ::v-deep .el-collapse-item__header {
    position: relative;
    border-bottom: 1px solid #e5e5e5;
  }
  ::v-deep .el-collapse-item__wrap {
    border-bottom: none;
  }
  ::v-deep .el-collapse-item__arrow {
    position: absolute;
    left: 20px;
    color: #999;
  }
  .collapse-head {
    width: 100%;
    background-color: #f2faff;
    padding-left: 38px;
    height: 100%;
    // border: 1px solid #e5e5e5;
    font-weight: 400 !important;
    ::v-deep.grid-content {
      .grid-content-span {
        line-height: 20px;
        padding: 0 4px;
        font-size: 12px;
        color: #67c23a;
        background: #f1f9ea;
        border-radius: 2px;
        border: 1px solid #67c23a;
      }
    }
  }
  ::v-deep.el-collapse-item__content {
    padding-bottom: 0px;
  }

  // 分页样式
  .el-pagination {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  // 尾部
  .table-pagination-footer {
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // padding-right: 20px;
    font-size: 14px;
  }
}
</style>
