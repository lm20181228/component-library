<template>
  <div>
    <div class="person-selected-way">
      <el-select
        v-model="selectWay"
        class="selected-way"
        :disabled="hasAuth"
        size="medium"
        @change="changeselectWay"
      >
        <template v-for="(item, index) in selectLawyer">
          <el-option :key="index" :label="item.label" :value="item.key"></el-option>
        </template>
        <!-- <el-option  label="律所内" value="1"></el-option>
        <el-option label="律所外" value="2"></el-option> -->
      </el-select>
      <el-select
        v-model="personSelect"
        :disabled="hasAuth || !canSelectLawyer"
        :multiple="selectOption.multiple"
        :multiple-limit="multipleLimit"
        remote
        filterable
        placeholder="请选择律师"
        :remote-method="remoteMethod"
        class="selected-person"
        size="medium"
        v-loadmore="scrollLoad"
        infinite-scroll-immediate
        v-infinite-scroll="scrollLoad"
        @change="changeSelect"
        @focus="focusSelect"
        @blur="blurClear"
      >
        <!-- @remove-tag="clearTag" -->
        <!-- v-loading="loading" -->
        <!-- v-infinite-scroll="scrollLoad" -->
        <!-- infinite-scroll-distance="30" -->
        <el-option
          v-for="item in optionsPerson"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId"
          class="infinite-list"
        >
          <span>{{ item.userName }}</span>
          <span v-if="item.userCode">({{ item.userCode }})</span>
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import { lawyerList } from '@/api/taskList.js';
export default {
  name: 'PersonSelected',
  components: {},
  props: {
    // 任务详情数据，接口调用时数据来源
    taskDetail: {
      type: Object,
      default: () => {
        return {};
      },
    },
    modelData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    selectOption: {
      type: Object,
      default: () => {
        return {};
      },
    },
    hasAuth: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      loading: false, //加载动画
      selectWay: '1', //默认选择方式
      optionsPerson: [], //人员下拉数据
      personSelect: null, //选择的人员数据
      currentPage: 1, //当前数据
      limitNum: 20, //限制每次查询条数
      totalPage: 1, //查询出来的数据总页数，用于判断是否继续滚动查询
      selectParams: {}, //人员数据搜索条件
      multipleLimit: 1, //多选状态下的显示多选条数
      selectLawyer: [
        {
          label: '律所内',
          key: '1',
        },
        {
          label: '律所外',
          key: '2',
        },
      ], //可选择的办理人是律所内还是律所外的
      canSelectLawyer: true, //是否可选择办理人
      isRemoteMethod: false, //是否经过筛选,处理筛选之后没有选中人员数据时的重新请求数据的情况 false为不需要重新请求，true为需要重新请求
    };
  },
  computed: {},
  watch: {
    taskDetail: {
      handler(value) {
        // 选择数据赋值
        this.selectWay = '1'; //办理人默认初始化为律所内
        this.currentPage = 1;
        this.selectParams = {
          start: this.currentPage,
          limit: this.limitNum,
        };
        this.getLawyerList(); //请求律师
        this.isCanSelectLawyer();
      },
      deep: true,
    },
    modelData: {
      handler(value) {
        // 选择数据赋值
        this.personSelect = [];

        this.optionsPerson = [];
        this.modelData.userName ? this.personSelect.push(this.modelData.userName) : '';
      },
    },
  },
  mounted() {
    // 初始化人员查询参数，
    this.selectParams = {
      start: this.currentPage,
      limit: this.limitNum,
    };
    const _that = this;
    this.$nextTick(() => {
      //   // 人员数据请求
      _that.isCanSelectLawyer();
    });
  },
  activated() {},
  created() {},
  beforeDestroy() {},
  methods: {
    /**
     * @description 初始化时的判断处理在此
     * */
    isCanSelectLawyer() {
      // 是否能添加外部人员  isCoordination
      // PRO_SERVICE_NODE_COOPERATE_NOT_ALLOWED不允许
      // PRO_SERVICE_NODE_COOPERATE_ALLOWED_BY_THE_SAME_MERCHANT允许同商户协作
      // PRO_SERVICE_NODE_COOPERATE_ALLOWED_BY_DIFFERENT_MERCHANT允许跨商户协作
      switch (this.taskDetail.isCoordination) {
        case 'PRO_SERVICE_NODE_COOPERATE_NOT_ALLOWED':
          this.canSelectLawyer = false;
          break;
        case 'PRO_SERVICE_NODE_COOPERATE_ALLOWED_BY_THE_SAME_MERCHANT':
          this.canSelectLawyer = true;
          this.$set(this, 'selectLawyer', [
            {
              label: '律所内',
              key: '1',
            },
          ]);
          break;
        case 'PRO_SERVICE_NODE_COOPERATE_ALLOWED_BY_DIFFERENT_MERCHANT':
          this.canSelectLawyer = true;
          this.$set(this, 'selectLawyer', [
            {
              label: '律所内',
              key: '1',
            },
            {
              label: '律所外',
              key: '2',
            },
          ]);
          break;
        default:
          this.canSelectLawyer = true;
          this.$set(this, 'selectLawyer', [
            {
              label: '律所内',
              key: '1',
            },
            {
              label: '律所外',
              key: '2',
            },
          ]);
      }
    },
    /**
     * @description 办理人查询
     * @param {query} 非必要参数，获取办理人列表数据
     * @author limei 2021/6/4
     * @return {data}
     * */
    getLawyerList(query) {
      let serviceItemCodeArray = null;
      let type = typeof this.taskDetail.serviceItemCode;
      if (type === 'string') {
        serviceItemCodeArray = this.taskDetail.serviceItemCode
          ? this.taskDetail.serviceItemCode.split(',')
          : [];
      } else {
        serviceItemCodeArray = this.taskDetail.serviceItemCode;
      }
      const param = {
        start: this.selectParams.start,
        limit: this.selectParams.limit,
        taskId: this.taskDetail.id, //任务id
        productionOrderId: this.taskDetail.productionOrderId, //生产单id
        mchId: this.taskDetail.mchId, //店铺id
        serviceItemCode: serviceItemCodeArray, //服务项code//店铺id
        searchKey: query, //电话精确，姓名模糊
        type: this.selectWay, //1.内部人员，2外部人员
      };
      lawyerList(param)
        .then((res) => {
          this.loading = false;
          // 接口请求成功之后判断code
          if (!!res && !!res.code && res.code !== 200) {
            this.$message.error({
              message: res.message,
            });
            return false;
          }
          // 接口成功，变量赋值
          if (this.currentPage > 1) {
            this.optionsPerson = this.optionsPerson.concat(res.records);
          } else {
            this.optionsPerson = res.records;
          }
          this.totalPage = res.totalPage;
        })
        .catch((error) => {
          this.loading = false;
          // 接口异常报错处理。
          this.$message.error({
            message: error.message,
          });
          return false;
        });
    },
    /**
     * @description 滚动加载更多数据
     * @author limei 2021/6/4
     * */
    scrollLoad() {
      // console.log('滚动加载！！！！！！！！！！！！！！！！！！！！');
      if (this.totalPage <= this.currentPage) {
        return false;
      }
      this.currentPage++;
      this.selectParams = {
        start: this.currentPage,
        limit: this.limitNum,
      };
      // 滚动查询
      this.getLawyerList();
    },
    /**
     * @description 人员下拉框筛选事件
     * @param {query} 必传参数，调用select下拉框原事件，获取下拉框输入内容
     * @author limei 2021/6/4
     * */
    remoteMethod(query) {
      this.optionsPerson = [];
      this.currentPage = 1;
      this.selectParams = {
        start: this.currentPage,
        limit: this.limitNum,
      };
      if (query !== '') {
        this.loading = true;
        // 打开滚动加载
        // 初始化条件
        this.isRemoteMethod = true;
        this.getLawyerList(query);
      } else {
        console.log('因为办理人输入内容为空而导致的重刷事件');
        this.resetPersonSelect();
      }
    },
    /**
     * @description 选择方式修改
     * @param {value} 必传参数，调用select change事件，用于切换姓名和人员手机号搜索方式
     * @author limei 2021/6/4
     * */
    changeselectWay(value) {
      let taskDetailLen = Object.getOwnPropertyNames(this.modelData).length;
      if (taskDetailLen <= 1) {
        // 当律师框类型为弹窗单选下拉框类型时的切换处理需要清空选择框数据
        this.personSelect = '';
        this.$emit('changeSelect', null);
      }
      this.currentPage = 1;
      this.selectParams = {
        start: this.currentPage,
        limit: this.limitNum,
      };
      this.getLawyerList();
    },
    /**
     * @description 选择框修改change事件（注意，为多选时，删除选中节点也会触发此函数，现阶段只能监听到节点的点击‘x’的移除时间，不能监听到节点在输入框内被‘backspace’键清空的事件）
     * @param {value} 必传参数，调用select change事件，当前选中数据
     * @author limei 2021/6/4
     * */
    changeSelect(value) {
      //当选择框的内容被清空时的处理,[0] 多选下拉框时会取数组集合第一项，单选下拉框时会选取字符串第一位字符
      if (!value[0]) {
        this.clearTag(value);
        return false;
      }
      // 当为切换下拉选中内容时会执行下面的代码
      let selectOption = {};
      selectOption = this.optionsPerson.find((item) => {
        return value.includes(item.userId);
      });
      selectOption.opType = '1';
      // change选中值之后的外抛事件
      this.$emit('changeSelect', selectOption);
    },
    /**
     * @description 获取焦点事件，用于重置下拉框数据
     * @author limei 2021/6/21
     */
    focusSelect() {
      if (this.optionsPerson.length <= 0 || this.isRemoteMethod) {
        this.isRemoteMethod = false;
        this.resetPersonSelect();
      }
    },
    /**
     *@description 失去焦点事件，用于处理接口重新请求
     * */
    blurClear(value) {},
    /**
     * @description 重置事件 清空下拉人员
     * 2021/6/4
     * */
    resetPersonSelect() {
      this.optionsPerson = [];
      let taskDetailLen = Object.getOwnPropertyNames(this.modelData).length;
      if (taskDetailLen > 1) {
        this.modelData.userName
          ? (this.personSelect[0] = this.modelData.userName)
          : (this.personSelect = []);
      } else {
        // this.personSelect = '';
      }
      this.currentPage = 1;
      this.selectParams = {
        start: this.currentPage,
        limit: this.limitNum,
      };
      this.getLawyerList();
    },
    /**
     * @description 清空操作
     * @param {type} 当参数值为change时表示则表示切换，不为change的时候表示为初始化
     * @author limei 2021/6/4
     * */
    clearTag(value) {
      // 查询当前
      console.log('进来的清空操作');
      let selectOption = {};
      selectOption = this.optionsPerson.find((item) => {
        return value == item.userName;
      });
      !!selectOption && Object.getOwnPropertyNames(selectOption).length > 1
        ? ''
        : (selectOption = this.modelData);
      selectOption.opType = '2';
      this.$emit('selectClear', selectOption);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~assets/styles/preset.scss';
.add-contact-modal {
  width: 100%;
  .el-form-item__error {
    margin-top: 0px;
  }
}
::v-deep .el-form .el-form-item__content {
  width: 300px;
  .select-department {
    width: 100%;
  }
}
.person-selected-way {
  display: flex;
  flex-direction: row;
  vertical-align: middle;
  justify-items: center;
  align-items: center;
  border-radius: 4px;
}
::v-deep .selected-way {
  width: 80px;
  .el-input__inner {
    padding: 0 10px;
  }
}
::v-deep .selected-person {
  width: 228px;
}

.el-select.selected-way.el-select--medium {
  margin-right: 8px;
}
</style>
