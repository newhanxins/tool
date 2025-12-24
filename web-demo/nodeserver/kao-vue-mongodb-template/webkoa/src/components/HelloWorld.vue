<!--
 * @Author: You
 * @Date: 2023-02-14 11:16:55
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-02-14 15:47:06
 * @FilePath: \mini-vuef:\web-dome\nodeserver\webkoa\src\components\HelloWorld.vue
-->
<script setup lang="ts">
import { onMounted, ref ,reactive} from 'vue'
import axios from "axios"
defineProps<{ msg: string }>()
const count = ref(0)
const username=ref("")
const password=ref("")
function addUser(){
  axios.post('http://127.0.0.1:3000/users/add', {
    username: username.value,
    password: password.value
  })
  .then(function (response) {
    console.log(response);
    alert("添加成功")
  })
  .catch(function (error) {
    console.log(error);
  });
  // axios.get('/user', {
  //   params: {
  //     ID: 12345
  //   }
  // })
  // .then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })
  // .then(function () {
  //   // always executed
  // });  

}
function searchUser(){
  axios.post('http://127.0.0.1:3000/users/login', {
    username: 'Fred',
    password: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
    alert(response.data.data.username)
  })
  .catch(function (error) {
    console.log(error);
  });
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="searchUser">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <div>
      <input v-model="username" />
      <input v-model="password" />
      <button type="button" @click="addUser">添加</button>
    </div>
  </div>

  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
