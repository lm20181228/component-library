import CONFIG from '@/config';
import { sign } from '@fe/common';

export default {
  name: 'DownloadMixin',
  data() {
    return {};
  },
  computed: {
    // ...mapState(["sessionId","userInfo"]),
  },
  methods: {
    /**
     * 下载文件
     *
     * 原方法 downloadHandler(url, fileName) by zhaojianmei
     * 因为新需求的下载是post请求，但是重复写的代码和原有的代码重复度太高，不同的地方只有两处，所以考虑直接在原方法上改写，如果有问题，可以再退回之前的方法。现在只是觉得代码重复量太大了。
     * @param {url} 必要参数，请求的url
     * @param {fileName} 必要参数，下载的文件名
     * @param {type} 不必要的参数(新添加方法)，不填写默认为get请求方法，填写"post"之后会变成post请求，type 为 "post"的时候，params必填
     * @param {additional} 不必要参数(新添加方法)，当get请求时，不用填写，参数可以直接放在url里面直接传递，当post请求时，params必填，需要使用 send(params)方法传递参数。。
     * @param {config} 不必要参数，传入自定义的验签内容
     * @author 原方法：zhaojianmei    新添加post方法部分 limei1@dgg.net 2020/3/31
     * */
    downloadHandler(url, fileName, type = 'get', additional, callBack = () => {}, config) {
      // 获取入参的config数据，主要是自定义的验签内容
      let argumentsConfig = {};
      for (let arg of arguments) {
        if (arg.config) {
          argumentsConfig = arg.config;
        }
      }
      // const loading = this.$loading({
      //   lock: true,
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(255, 255, 255, 0.8)',
      // });
      const _this = this;
      const signData = sign({
        method: type,
        rawData: type == 'get' ? additional : additional.params,
        sysCode: argumentsConfig.SYS_CODE ? argumentsConfig.SYS_CODE : CONFIG.SYS_CODE,
        secret: argumentsConfig.SECRET ? argumentsConfig.SECRET : CONFIG.SECRET,
        token: JSON.parse(localStorage.getItem('token')),
      });

      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open(type, url, true);
      const mchDetailId = JSON.parse(localStorage.getItem('mchInfo'))?.mchDetailId || undefined;
      const mchUserId = JSON.parse(localStorage.getItem('mchInfo'))?.mchUserId || undefined;
      const userId = JSON.parse(localStorage.getItem('userInfo'))?.id || undefined;
      xmlResquest.setRequestHeader('X-User-Agent', '4b43c3f3-d817-4576-95b1-ad8519a2f14e');
      xmlResquest.setRequestHeader('X-Req-MerchantId', mchDetailId);
      xmlResquest.setRequestHeader('X-Req-MerchantUserId', mchUserId);
      xmlResquest.setRequestHeader('X-Req-UserId', userId);
      for (let item of Object.entries(signData)) {
        xmlResquest.setRequestHeader(item[0], item[1]);
      }
      // 验签

      // X-Req-UserId 用于处理导出数据和页面数据不同的问题
      // if(additional){
      //   if(additional.userId){
      //     xmlResquest.setRequestHeader("X-Req-UserId", this.userInfo.userId);
      //   }
      // }
      xmlResquest.responseType = 'blob';
      xmlResquest.timeout = 0; // 设置超时时间
      xmlResquest.onload = function (oEvent) {
        const content = xmlResquest.response;
        // 因为可能后端可能会传递json格式的报错信息，所以在接收信息的时候需要判断一下是否是json文件。如果是json文件，则为报错信息。不是json文件就是正常文本信息
        let fileReader = new FileReader();
        fileReader.onload = function () {
          try {
            let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
            // if (jsonData.code) {
              _this.$message.warning({
                message: jsonData.message,
              });
            // }
          } catch (error) {
            // 解析出错，可以下载，说明不是json对象
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            const blob = new Blob([content]);
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          }
        };
        fileReader.readAsText(content);
      };
      // 判断现在的请求方式和传递的参数 修改判断条件，保证传参有误时能正常调用
      if (additional && type == 'post') {
        // xmlResquest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xmlResquest.send(JSON.stringify(additional.params));
      } else {
        xmlResquest.send();
      }

      xmlResquest.onloadend = () => {
        // loading.close();
        callBack('success');
      };
      xmlResquest.onerror = (e) => {
        // loading.close();
        callBack('error');
        _this.$message.error({
          message: '服务端报错',
        });
      };
      // 请求超时
      /* xmlResquest.ontimeout = e => {
        loading.close();
        Notification.error({
          message: '请求超时'
        })
      }; */
    },
  },
};
