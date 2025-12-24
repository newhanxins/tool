import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Notify, Button, Field, CellGroup, NavBar, Icon, Cell, List, PullRefresh, Toast,Dialog } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Notify)
app.use(Button)
app.use(Field)
app.use(CellGroup)
app.use(NavBar)
app.use(Icon)
app.use(Cell)
app.use(List)
app.use(PullRefresh)
app.use(Toast)
app.use(Dialog)
app.mount('#app')