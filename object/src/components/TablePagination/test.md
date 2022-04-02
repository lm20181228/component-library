### TablePagination

::: demo
` ` `vue
<template>
  <table-pagination
    ref="tablePagination"
    class="wechat_table"
    :data="list"
    :tableColumns="tableColumns"
    :totalCount="totalCount"
    :pageSize="limit"
    :tableOptions="tableOptions"
    v-loading="tableLoading"
    @refresh="refreshTable"
    @sort-change="sortList"
  >
  </table-pagination>
</template>
<script>
import TablePagination from '@/components/TablePagination';
export default {
  name: 'Course',
  components:{
    TablePagination
  },
  data() {
    return {
      start:1,
      limit:10,
      list:[],//表格数据
      totalCount: 0, //列表数据分页展示条件
      tableOptions:{
        headerRowClassName:'row-name'
      },
      tableLoading:false,//表格加载动画
      isAsc:'',//是否升序
      orderBy:"",//依照什么排序
    };
  },
  mounted() {},
  methods: {
    /**
     * @description 渲染列表数据
     * */
    initTable(){
      //to do
    },
    /**
     * @description 分頁事件刷新列表
     * @param {param} 分页页码修改和每页条数修改之后，返回当前页码和每页条数
     * */
    refreshTable(param){
      this.start = param.start;
      this.limit = param.limit;
      this.initTable();
    },
    /**
     * @description 当表格的排序条件发生变化的时候会触发该事件
     * */
    sortList(column, prop, order){
      // ascending升序  descending降序
      this.isAsc = column.order?column.order == 'ascending'?true:false:undefined;
      this.orderBy = column.order?column.prop:undefined;
      // 修改样式 rortAscending
      this.initTable();
    },
    /**
     * 查看详情明细弹窗
     * @param {param} 必填参数，获取明细详情
     * */
    viewDetails(param) {
      //to do
    },
  },
  computed:{
    tableColumns(){
      return [
        {
          type:'index',
          label: '排序',
          width: '60px',
        },
        {
          prop: 'getTime',
          label: '获取时间',
          width: '180px',
          tooltipWidth:180,
          sortable:"custom",
          labelClassName: this.isAsc,
        },
        {
          prop: 'proPlateNodeCount',
          label: '审批节点',
        },
        {
          prop: '',
          type: 'isrender',
          label: '状态',
          render: (h, scope) => {
            return (
              <el-switch
                v-model={scope.row.switchStatus}
                active-color="#4974F5"
                onchange={(state) => {
                  this.changeRowStatus(state, scope.row, scope.index);
                }}
                inactive-color="#BFBFBF"></el-switch>
            );
          },
        },
        {
          prop: 'isAdopt',
          label: '微信添加是否通过',
          minWidth: '130px',
          type: 'isrender',
          render: (h, scope) => {
            return <span> {scope.row.isAdopt?"已通过":"未通过"}</span>;
          },
        },
        {
          prop: 'pictureAddress',
          label: '微信截图',
          type: 'isrender',
          minWidth: '130px',
          render: (h, scope) => {
            return scope.row.pictureAddress?
              <el-image
                style="width: 100px; height: 100px"
                src={scope.row.pictureAddress}
                preview-src-list={[scope.row.pictureAddress]}>
              </el-image>
              :<span>-</span>
          },
        },{
          prop: 'createTime',
          label: '操作',
          width: '80px',
          type: 'isrender',
          render: (h, scope) => {
            return (
              <el-button
                type="text"
                onclick={(e) => {
                  this.viewDetails(scope.row);
                }}>
                查看
              </el-button>
            );
          },
        },
      ]
    }
  }
};
</script>
` ` `
:::
