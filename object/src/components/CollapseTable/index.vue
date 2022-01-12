<template>
  <div class="collapse-table">
    <!-- 数据列表展示区域 -->
    <template v-if="!!data && data.length > 0">
      <div v-for="(item, key) in data" :key="key" class="task-table-box">
        <el-collapse v-model="activeOneNames" @change="$emit('collapseChange', $event, item)">
          <el-collapse-item title :name="key.toString()">
            <!-- 折叠面板标题内容 -->
            <template slot="title">
              <div class="collapse-head">
                <slot name="collapseHeader" :itemHeader="item"></slot>
              </div>
            </template>
            <!-- 表格内容展示 -->
            <el-table
              ref="collapseTable"
              :data="!isAsyn?item[tableKey]:tableData"
              :height="tableOptions.height"
              :maxHeight="tableOptions.maxHeight"
              :stripe="tableOptions.stripe"
              :border="tableOptions.border"
              :size="tableOptions.size"
              :fit="tableOptions.fit"
              :showHeader="tableOptions.showHeader"
              :highlightCurrentRow="tableOptions.highlightCurrentRow"
              :currentRowKey="tableOptions.currentRowKey"
              :lazy="tableOptions.lazy"
              :indent="tableOptions.indent"
              :rowClassName="tableOptions.rowClassName"
              :rowStyle="tableOptions.rowStyle"
              :cellClassName="tableOptions.cellClassName"
              :cellStyle="tableOptions.cellStyle"
              :headerRowClassName="tableOptions.headerRowClassName"
              :headerRowStyle="tableOptions.headerRowStyle"
              :headerCellClassName="tableOptions.headerCellClassName"
              :headerCellStyle="tableOptions.headerCellStyle"
              :rowKey="tableOptions.rowKey"
              :emptyText="tableOptions.emptyText"
              :defaultExpandAll="tableOptions.defaultExpandAll"
              :expandRowKeys="tableOptions.expandRowKeys"
              :defaultSort="tableOptions.defaultSort"
              :tooltipEffect="tableOptions.tooltipEffect"
              :showSummary="tableOptions.showSummary"
              :sumText="tableOptions.sumText"
              :summaryMethod="tableOptions.summaryMethod"
              :selectOnIndeterminate="tableOptions.selectOnIndeterminate"
              :spanMethod="tableOptions.spanMethod"
              :load="tableOptions.load"
              :treeProps="tableOptions.treeProps"
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
              <collapseTableColumn
                v-for="(tableItem, index) in tableColumns"
                :key="tableItem.sortKey || index"
                :column="tableItem"
                :columnEmptyText="columnEmptyText"
              >
              </collapseTableColumn>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <!-- 折叠面板尾部内容，折叠之后需要显示出来 -->
        <slot name="collapseFooter" :itemFooter="item"></slot>
      </div>
      <!-- 分页区域 -->
      <el-pagination
        v-if="paginationOptions.totalCount > paginationOptions.limitShowPaginNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="paginationOptions.pageSizes"
        :page-size="pageNum"
        :layout="paginationOptions.paginationOption"
        :total="paginationOptions.totalCount"
      ></el-pagination>
    </template>
    <!-- 空白无数据展示区域 -->
    <div class="prompt-message" v-else>
      <!-- 默认展示图片，可配置展示图片和文本展示内容。后期改善 -->
      <img class="icon_nodata-img" src="./images/icon_nodata.png" />
      <p class="no-more">暂无数据</p>
    </div>
  </div>
</template>
<script>
import collapseTableColumn from './CollapseTableCell';
import PropsStatic from './props';

/**
 * @name 随机生成4位字符串
 */
function s4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * @name 创建uuid
 */
function uuid() {
  return `${s4()}${s4()}-${s4()}${s4()}-${s4()}${s4()}-${s4()}${s4()}`;
}

export default {
  name: 'CollapseTable',
  components: { collapseTableColumn },
  props: {
    // 是否异步数据，同步数据是指折叠面板头尾信息和内部table信息同一接口全返回，异步数据是指内部table请求另外的接口，异步不做默认展开操作。
    isAsyn: {
      type: Boolean,
      default: false,
    },
    // 折叠面板内table数据，（用于异步请求数据处理，即折叠面板内容和折叠表格内容数据需要不同请求完成）
    tableData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    sendSearchQuery: {
      type: Object,
      default: () => {},
    },
    //列表数据
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableColumns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 表格单格数据为空时的展示内容
    columnEmptyText: {
      type: String,
      default: '-',
    },
    //   折叠面板头部内容数据
    collapseHead: {
      // type: [Object, Array],
      type: Array,
      default: () => {
        return [];
      },
    },
    // 折叠面板内table数据的参数,使用于折叠表格折叠面板和内容在同个请求时
    tableKey: {
      type: String,
      default: '',
    },
    //列表分页配置
    paginationOptions: {
      type: Object,
      default: () => {
        return {
          pageSizes: [10, 20, 30, 40], //列表可选每页展示条数
          paginationOption: 'total, sizes, prev, pager, next, jumper', //显示分页按钮配置项
          limitShowPaginNum: 10, //列表数据分页展示条件,列表数量超过10条时展示分页操作
          totalCount: 0, //列表数据分页展示条件
        };
      },
    },
    // 每页展示条数
    pageSize: {
      type: Number,
      default: 10,
    },
    // totalCount:{
    //   type: Number,
    //   default: 10,
    // },
    // 表格配置
    tableOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    ...PropsStatic.table,
  },
  data() {
    return {
      activeOneNames: [], // 折叠面板展开的项
      currentPage: 1, //当前页
      pageNum: 10, //页面列表数据条数
    };
  },
  created() {
    this.pageNum = this.pageSize;
  },
  // watch: {},
  methods: {
    //折叠面板事件
    // 表格事件
    /****************************/
    /* Original methods statrt  */
    /****************************/
    clearSelection() {
      return this.$refs.collapseTable.clearSelection();
    },
    toggleRowSelection(record, selected) {
      return this.$refs.collapseTable.toggleRowSelection(record, selected);
    },
    toggleAllSelection() {
      return this.$refs.collapseTable.toggleAllSelection();
    },
    toggleRowExpansion(record, expanded) {
      return this.$refs.collapseTable.toggleRowExpansion(record, expanded);
    },
    setCurrentRow(record) {
      return this.$refs.collapseTable.setCurrentRow(record);
    },
    clearSort() {
      return this.$refs.collapseTable.clearSort();
    },
    clearFilter() {
      return this.$refs.collapseTable.clearFilter();
    },
    doLayout() {
      return this.$refs.collapseTable.doLayout();
    },
    sort(prop, order) {
      return this.$refs.collapseTable.sort(prop, order);
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
      this.tableColumns.forEach(item => {
        if (item.prop === prop) {
          item.sortKey = uuid();
          item.labelClassName = order;
        }
      });
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
    // 重置页码事件
    resetTable() {
      console.log('resetTable时间内部');
      this.activeOneNames = []; // 折叠面板展开的项
      this.currentPage = 1; //当前页
      this.pageNum = this.pageSize; //页面列表数据条数
    },
    // 改变每页条数
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageNum = val;
      // this.$set(this.paginationOptions,"pageSize",val)
      let data = {
        start: this.currentPage,
        limit: this.pageNum,
        ...this.sendSearchQuery,
      };
      console.log(data, '查询调教');
      this.$emit('refresh', data);
    },
    // 改变页数
    handleCurrentChange(val) {
      this.currentPage = val;
      let data = {
        start: this.currentPage,
        limit: this.pageNum,
        ...this.sendSearchQuery,
      };
      this.$emit('refresh', data);
    },
  },
};
</script>
<style lang="scss" scoped>
.collapse-table {
  // 无数据展示样式
  .prompt-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 120px;
    .no-more {
      color: #999999;
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
  // 折叠面板样式
  .el-collapse {
    // border-top: 1px solid #E5E5E5;
    border-bottom: none;
  }
  ::v-deep .el-collapse-item__header {
    position: relative;
    height: 78px;
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
  .collapse-table-footer {
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
  }
}
</style>
