### searchBar

::: demo
` ` `vue
<template>
  <search-bar :baseSearch='baseSearch' :baseData='baseData'/>
</template>
<script>
import SearchBar from '@/components/SearchBar';
export default {
  name: 'Course',
  components:{
    SearchQuery
  },
  data() {
    return {
      baseSearch:[
        {
          label: '授课人群：',
          prop: 'name',
          placeholder: '请输入内容124',
          maxlength: 20,
        },
        {
          label: '添加时间：',
          prop: 'timer',
          filed: ['addStartTime', 'addEndTime'],
          placeholder: ['开始日期', '结束日期'],
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
        },
        {
          label: '是否关联考试：',
          prop: 'platform',
          placeholder: '请输入内容',
          maxlength: 20,
          type:'select',
          option:[
            {
              name:'是',
              value:1
            },
            {
              name:'否',
              value:0
            }
          ]
        },
      ],
      baseData:{
        name: '',
        platform: '',
        web: '',
        first: '',
        second: '',
        third: '',
        source: '',
        isRelated: '',
        person: '',
        timer:'',
        addStartTime: '',
        addEndTime: '',
      },
    };
  },
  mounted() {},
  methods: {
    /**
     * 查询按钮
     */
    onSubmit() {},
  },
};
</script>
` ` `
:::