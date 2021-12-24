<template>
  <div class="operation">
    <!-- 右键操作栏 -->
    <div class="toolBar" :style="style" v-show="toolBarIsShow">
      <div class="delete" @click="handleClick('toJSON')">导出数据</div>
      <div class="delete del" @click="handleClick('delete')">清除数据</div>
    </div>
    <!-- 节点/线邮件操作栏 -->
    <div class="toolBar" :style="nodeStyle" v-show="nodeIsShow">
      <div class="delete" @click="nodeClick('edit')">编辑</div>
      <div class="delete del" @click="nodeClick('delete')">删除</div>
    </div>
    <!-- 右侧 -->
    <div class="config" v-show="configIsShow">
      <config-node v-show="type == 'node'" @configClick="configClick" :id="id" />
      <config-edge v-show="type == 'edge'" @configClick="configClick" :id="id" />
    </div>
  </div>
</template>

<script>
import FlowGraph from '../js/index'
import ConfigNode from './configNode/index'
import ConfigEdge from './configEdge/index'
export default {
  name: 'Index',
  components: {
    ConfigNode,
    ConfigEdge
  },
  props: {
    editIsSHow: {
      typeof: Boolean
    }
  },
  data() {
    return {
      toolBarIsShow: false,//右键数据操作栏
      style: {
        left: '0px',
        top: '0px'
      },
      nodeIsShow: false,//节点/线操作
      nodeStyle: {
        left: '0px',
        top: '0px'
      },
      nodeCell: '',
      configIsShow: false,//设置栏
      type: '',
      id: '',
    }
  },
  mounted() {
    if (this.editIsSHow) {
      setTimeout(() => {
        this.boundEvent()
      }, 200)
    }
  },
  created() {
  },
  methods: {
    configClick() {
      this.configIsShow = false
    },
    boundEvent() {
      const { graph } = FlowGraph
      // 鼠标单击空白页
      graph.on('blank:click', () => {
        this.type = '';
        this.nodeCell = '';
        this.toolBarIsShow = false;
        this.nodeIsShow = false;
        this.configIsShow = false;
      })
      // 鼠标点击节点或者线
      graph.on('cell:click', ({ cell }) => {
        // this.type = cell.isNode() ? 'node' : 'edge'
        // this.id = cell.id
        // this.configIsShow = true
        this.type = '';
        this.nodeCell = '';
        this.toolBarIsShow = false;
        this.nodeIsShow = false;
        this.configIsShow = false;
      })
      // 右键节点或者线
      graph.on("cell:contextmenu", ({ e, cell }) => {
        this.nodeStyle.left = e.clientX + 'px';
        this.nodeStyle.top = e.clientY + 'px'
        this.nodeIsShow = true;
        this.toolBarIsShow = false;
        this.nodeCell = cell
      });
      // 右键空白区域弹出弹窗
      graph.on('blank:contextmenu', ({ e }) => {
        this.style.left = e.clientX + 'px';
        this.style.top = e.clientY + 'px'
        this.toolBarIsShow = true;
        this.nodeIsShow = false;
      })
    },
    // 节点操作栏
    nodeClick(event) {
      switch (event) {
        case 'edit':
          this.type = this.nodeCell.isNode() ? 'node' : 'edge'
          this.id = this.nodeCell.id;
          this.configIsShow = true;
          this.nodeIsShow = false
          break
        case 'delete':
          this.nodeCell.remove(); //删除
          this.nodeIsShow = false
          break
        default:
          break
      }
    },
    // 操作栏
    handleClick(event) {
      const { graph } = FlowGraph;
      switch (event) {
        case 'delete':
          graph.clearCells()
          localStorage.removeItem('FlowData')
          this.toolBarIsShow = false;
          break
        case 'toJSON':
          localStorage.setItem('FlowData', JSON.stringify(graph.toJSON()));
          this.toolBarIsShow = false;
          // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toolBar {
  position: fixed;
  width: 100px;
  height: 60px;
  background-color: #ffffff;
  border-radius: 10px;

  .delete {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }
  .delete:hover {
    color: #5f95ff;
  }
  .del:hover {
    color: red;
  }
}
.config {
  position: fixed;
  top: 0px;
  right: 0px;
  width: 290px;
  height: 100%;
  background-color: #ffffff;
}
</style>
