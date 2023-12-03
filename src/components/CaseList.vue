<template>
  <div>
    <a-card title="案例列表" style="text-align:center;width: 90%; display: flex; flex-direction: column; align-items: center;margin:auto">
    <a-card style="margin-bottom: 10px;background-color: lightsteelblue;width: 100%">
      <div>相似案件检索</div>
      <a-input-search
        placeholder="请输入相似案件搜索文本"
        size="large"
        @search="onSearch"
        style="width: 60%;"
        enter-button
        v-model:value="value"
    />

    </a-card>
      <a-card style="margin-bottom: 10px;background-color: lightsteelblue;width: 100%">
      <div>按条件筛选</div>
      <a-row>
        <a-col span="6">
          <div>最小涉案金额：</div>
          <a-input-number v-model:value="moneyMin" :min="0" :max="1000000" :precision="2" placeholder="最小金额" />
        </a-col>
        <a-col span="6">
          <div>最大涉案金额：</div>
          <a-input-number v-model:value="moneyMax" :min="0" :max="1000000" :precision="2" placeholder="最大金额" />
        </a-col>
        <a-col span="6"><div>是否死刑：</div>
        <a-switch v-model:checked="ifDeath" />
      </a-col>
        <a-col span="6"><div>是否无期：</div>
        <a-switch v-model:checked="ifLife" />

      </a-col>

      </a-row>
        <a-row>

          <a-col span="6">
            <div>最短坐牢时间：</div>
            <a-input-number v-model:value="lifeMin" :min="0" :max="100" placeholder="最短坐牢时间" />
          </a-col>
          <a-col span="6">
            <div>最长坐牢时间：</div>
            <a-input-number v-model:value="lifeMax" :min="0" :max="100" placeholder="最长坐牢时间" />
          </a-col>
          <a-col :span="6">

            <a-button style="margin-top: 5px" type="primary" @click="search">快速查询</a-button>

          </a-col>
          <a-col :span="6">
          <a-button style="margin-top: 5px" type="primary" @click="searchAll">全量查询</a-button></a-col>
        </a-row>
      </a-card>
      <a-spin :spinning="isLoading" tip="加载中。。。">
      <a-card style="margin-bottom: 10px;background-color: lightsteelblue;width: 100%">
    <a-table :columns="computedColumns" :dataSource="data" style="width: 100%">

        <template v-slot:customRender="{ record }">
          <a-button type="primary" @click="viewDetails(record)">查看</a-button>
        </template>

    </a-table></a-card>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
export default defineComponent ({
  data() {
    return {
      tipContent:'加载中...',
      moneyMin: null,
      moneyMax: null,
      ifDeath: false,
      ifLife: false,
      isLoading:false,
      lifeMin: null,
      lifeMax: null,

      searchText: '',
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id' ,width: 100},
        { title: '罚款', dataIndex: 'punishOfMoney', key: 'punishOfMoney',width: 100 },
        { title: '是否无期', dataIndex: 'lifeImprisonment', key: 'lifeImprisonment',width: 100 },
        { title: '是否死刑', dataIndex: 'deathPenalty', key: 'deathPenalty',width: 100 },
        { title: '罪犯', dataIndex: 'criminals', key: 'criminals' ,width: 100},
        { title: '指控', dataIndex: 'accusation', key: 'accusation',width: 100 },

        { title: '相关条文', dataIndex: 'relevantArticles', key: 'relevantArticles' ,width: 100},
        // 添加更多列
        {
          title: '操作',
          dataIndex: 'operation',
          slots: { customRender: 'customRender' ,width: 200},
        },
      ],
      data: [],
      modalVisible: false,
      selectedRecord: {},
      selectedRecordDetails: '',
    };
  },
  mounted() {
    console.log("aaaa")
    // this.fetchData();
  },
  computed: {
    // 在计算属性中使用 getYesOrNoText 方法
    computedColumns() {
      return this.columns.map(column => {
        if (column.dataIndex === 'lifeImprisonment' || column.dataIndex === 'deathPenalty') {
          // 如果是 lifeImprisonment 或 deathPenalty，将 render 方法设置为 getYesOrNoText
          return {
            ...column,
            customRender: this.getYesOrNoText,
            slots: { headerCell: 'headerCell', bodyCell: 'bodyCell' },
          };
        }
        return column;
      });
    },
  },
  methods: {
    search() {
      // 调用后端接口并传递筛选条件
      let moneyMax=this.moneyMax
      let moneyMin=this.moneyMin
      let lifeMin=this.lifeMin
      let lifeMax=this.lifeMax
      let ifDeath=this.ifDeath
      let ifLife=this.ifLife
      if(this.moneyMax == null){
        moneyMax = -1
      }
      if(this.moneyMin == null){
        moneyMin = -1
      }
      if(this.lifeMax == null){
        lifeMax = -1
      }
      if(this.lifeMin == null){
        lifeMin = -1
      }
      if(this.ifLife == false){
        ifLife = 0
      }
      if(this.ifDeath == false){
        ifDeath = 0
      }
      if(this.ifLife == true){
        ifLife = 1
      }
      if(this.ifDeath == true){
        ifDeath = 1
      }
      this.isLoading=true
      message.info("正在筛选....只会返回少量数据",0)
      console.log(moneyMax,moneyMin,lifeMax,lifeMin,ifDeath,ifLife)
      axios.get(`http://172.19.241.188:8081/selectCaseLimit?moneyMin=${moneyMin}&moneyMax=${moneyMax}&lifeMin=${lifeMin}&lifeMax=${lifeMax}&ifDeath=${ifDeath}&ifLife=${ifLife}`)

          .then(response => {
            // 处理后端返回的数据
            this.isLoading=false
            message.success("筛选成功！",2)
            setTimeout(() => {
              message.destroy(); // 关闭所有 message
            }, 3000);
            this.data = response.data;
          })
          .catch(error => {
            console.error('查询数据时发生错误：', error);
          });
    },
    searchAll() {
      // 调用后端接口并传递筛选条件
      let moneyMax=this.moneyMax
      let moneyMin=this.moneyMin
      let lifeMin=this.lifeMin
      let lifeMax=this.lifeMax
      let ifDeath=this.ifDeath
      let ifLife=this.ifLife
      if(this.moneyMax == null){
        moneyMax = -1
      }
      if(this.moneyMin == null){
        moneyMin = -1
      }
      if(this.lifeMax == null){
        lifeMax = -1
      }
      if(this.lifeMin == null){
        lifeMin = -1
      }
      if(this.ifLife == false){
        ifLife = 0
      }
      if(this.ifDeath == false){
        ifDeath = 0
      }
      if(this.ifLife == true){
        ifLife = 1
      }
      if(this.ifDeath == true){
        ifDeath = 1
      }
      this.isLoading=true
      message.info("正在筛选....全量可能需要20s",0)
      console.log(moneyMax,moneyMin,lifeMax,lifeMin,ifDeath,ifLife)
      axios.get(`http://172.19.241.188:8081/selectCase?moneyMin=${moneyMin}&moneyMax=${moneyMax}&lifeMin=${lifeMin}&lifeMax=${lifeMax}&ifDeath=${ifDeath}&ifLife=${ifLife}`)

          .then(response => {
            // 处理后端返回的数据
            this.isLoading = false
            message.success("筛选成功！",2)
            setTimeout(() => {
              message.destroy(); // 关闭所有 message
            }, 3000);
            this.data = response.data;
          })
          .catch(error => {
            console.error('查询数据时发生错误：', error);
          });
    },
    getYesOrNoText(value) {
      return value === 0 ? '否' : '是';
    },
    fetchData() {
      this.isLoading= true
      // 使用 axios 进行 GET 请求
      axios.get('http://172.19.241.188:8081/get')
          .then(response => {
            this.isLoading = false
            this.data = response.data;
          })
          .catch(error => {
            console.error('获取数据时发生错误：', error);
          });
    },
    onSearch(value) {

      // 使用 axios 发送带有搜索文本的 POST 请求
      if(value==null){
        message.error("请输入文本！")
        return
      }this.isLoading = true
      console.log("this.searchText",typeof (value))
      const url = `https://u108550-99d2-2a112102.westc.gpuhub.com:8443/api/classify?fact=${value}`;
      console.log(url)
// 发送 GET 请求
      axios.get(url)
          .then(response => {
            console.log("response",response)
            // 处理后端返回的数据
            message.success(`经过模型分类后的罪名是：${response.data.accusation}，正在检索该类目下的相似案件，请稍等。。`,0);
            axios.post('http://172.19.241.188:8081/getSimilar', {fact:value ,accusation:response.data.accusation})
                .then(response => {
                  this.data = response.data;
                  this.isLoading = false
                  message.success("搜索成功！",2)
                  setTimeout(() => {
                    message.destroy(); // 关闭所有 message
                  }, 3000);

                })
                .catch(error => {
                  message.error('获取搜索结果时发生错误：'+error,2);
                });


          })
          .catch(error => {
            message.error('查询数据时发生错误：'+error, 2,);
          });


    },
    viewDetails(record) {
      if (record && record.id) {
        console.log("id", record.id,record);
        this.$router.push({ name: 'caseDetails', params: { id: record.id} });
      }
    },
  },

});
</script>
