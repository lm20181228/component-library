/*
 * @Description:
 * @Version:
 * @Author: Linyer
 * @Date: 2021-09-16 09:54:33
 * @LastEditors: Linyer
 * @LastEditTime: 2021-10-11 16:54:51
 */
import CONFIG from '@/config';

import moment from 'moment';
import downloadMixin from '../utils/downloadMixin';
let EXPORTXLSX_RUL = CONFIG.baseUrl;
// console.log(config);
export default {
  components: {},
  data() {
    return {};
  },
  mixins: [downloadMixin], // 公用打电话方法
  mounted() {},
  computed: {},
  methods: {
    // 导出回调
    async exportxlsx(val, name, callBack) {
      console.log('导出url', val.ids);
      const fileNum = val.ids.length - 1; //文件数量
      let exportName = '';
      if (!!fileNum && fileNum > 0) {
        exportName = '等' + fileNum + '个';
      }
      const param = val.ids; //转化之后的传参
      let curXlsTime = moment().format('YYYYMMDDHHmmss'); // 日期
      let fileName = name + exportName + '部门人员数据' + curXlsTime + '.xls';
      this.downloadHandler(
        EXPORTXLSX_RUL +
          `/api/crisps-qdb-pc-node-public/service/yk/merchant/department/export_user.do?ids=${param}`,
        fileName,
        'get',
        { ids: param.join(',') },
      );
    },
    // 导出导入失败记录回调
    async exportxlsx1(id, name, callBack) {
      console.log('导出url', id);
      let fileName = name + '.xlsx';
      this.downloadHandler(
        EXPORTXLSX_RUL +
          `/api/crisps-qdb-pc-node-public/service/yk/merchant/user/get_export_fail_record_list.do?importNo=${id}`,
        fileName,
        'get',
        { importNo: id },
      );
    },
  },
};
