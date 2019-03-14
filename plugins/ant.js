import Vue from 'vue'

import {
  // Affix,
  // Anchor,
  // AutoComplete,
  // Alert,
  Avatar,
  // BackTop,
  // Badge,
  Breadcrumb,
  Button,
  // Calendar,
  // Card,
  // Collapse,
  // Carousel,
  // Cascader,
  Checkbox,
  Col,
  DatePicker,
  // Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  // InputNumber,
  Layout,
  // List,
  // LocaleProvider,
  message,
  Menu,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  // Progress,
  // Radio,
  // Rate,
  Row,
  Select,
  // Slider,
  Spin,
  // Steps,
  // Switch,
  Table,
  // Transfer,
  // Tree,
  // TreeSelect,
  // Tabs,
  // Tag,
  // TimePicker,
  // Timeline,
  Tooltip,
  // Mention,
  Upload,
  Drawer
  // Skeleton,
  // Comment,
  // ConfigProvider,
} from 'ant-design-vue/lib'

Vue.use(Button)
Vue.use(Tooltip)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Checkbox)
Vue.use(Spin)
Vue.use(Menu)
Vue.use(Layout)
Vue.use(Drawer)
Vue.use(Breadcrumb)
Vue.use(Dropdown)
Vue.use(Select)
Vue.use(Avatar)
Vue.use(Col)
Vue.use(Row)
Vue.use(DatePicker)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Modal)
Vue.use(Upload)

export default function (ctx, inject) {
  ctx.$notification = notification
  inject('notification', notification)

  ctx.$message = message
  inject('message', message)
}
