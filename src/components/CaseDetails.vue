<template>
  <div>
    <a-card title="案例详情" style="text-align:center;width: 60%; display: flex; flex-direction: column; align-items: center;margin:auto">
      <a-descriptions layout="vertical" :bordered="true" column="5" style="width: 100%;" >
        <a-descriptions-item  label="ID" :span="2">{{ detailCase.id }}</a-descriptions-item>

        <a-descriptions-item label="刑罚" :span="1" >{{ detailCase.punishOfMoney }}</a-descriptions-item>
        <a-descriptions-item label="是否无期" :span="1">{{ detailCase.lifeImprisonment }}</a-descriptions-item>
        <a-descriptions-item label="是否死刑" :span="1">{{ detailCase.deathPenalty }}</a-descriptions-item>
        <a-descriptions-item label="罪犯" :span="1">{{ detailCase.criminals }}</a-descriptions-item>
        <a-descriptions-item label="指控" :span="1"  >{{ detailCase.accusation }}</a-descriptions-item>
        <a-descriptions-item label="相关条文" :span="1" >{{ detailCase.relevantArticles }}</a-descriptions-item>
        <a-descriptions-item label="坐牢时间"  :span="1" >{{ detailCase.imprisonment }}</a-descriptions-item>
        <a-descriptions-item label="事实" >{{ detailCase.fact }}</a-descriptions-item>
        <!-- 添加更多属性 -->
      </a-descriptions>
      <a-button type="primary" @click="goBack" style="margin-top: 20px;">返回主页</a-button>
    </a-card>
  </div>
</template>

<script>
import { Card, Descriptions } from 'ant-design-vue';
import axios from 'axios';
export default {
  components: {
    'a-card': Card,
    'a-descriptions': Descriptions,
    'a-descriptions-item': Descriptions.Item,
  },
  props: ['id'],
  data(){
    return{
      detailCase: {},
      description:null
    }
  },

  created() {
    console.log("this.id",this.id)
    this.getDetailCase(this.id);

  },
  methods:{
    getDetailCase(id) {
      // 使用传入的 id 调用接口
      axios.get(`http://172.19.241.188:8081/getDetailCase?id=${id}`)
          .then(response => {
            // 处理接口返回的数据
            this.detailCase = response.data;
            console.log(this.detailCase)
          })
          .catch(error => {
            console.error('Error fetching detail case:', error);
          });
    },
    goBack() {
      // 使用 $router 返回主页
      this.$router.push({ path: '/' });
    },
  }
};
</script>

<style scoped>
/* 可以添加一些样式进行排版 */
</style>
