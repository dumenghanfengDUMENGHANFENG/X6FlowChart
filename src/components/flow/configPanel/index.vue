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
import { FunctionExt, Color } from "@antv/x6";
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
      container: '',//dom存储

      ports: '',//连接桩
      nodeAnimation: '',//节点动画
      edgeAnimation: '',//边动画

      selectIsShow: false,//是否选中
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

      removeToolsCell: ''
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
    // 节点/线操作事件
    boundEvent() {
      this.container = document.getElementById("flowContainer");
      const { graph } = FlowGraph
      // 鼠标单击空白页
      graph.on('blank:click', () => {
        this.resetType();//重置状态
        this.edgeAnimationDelete()
        this.nodeAnimationDelete('rgba(95,149,255,0.00)')
      })
      // 鼠标进入节点/线
      graph.on(
        "cell:mouseenter",
        FunctionExt.debounce(({ cell }) => {
          if (cell.isNode()) {
            this.ports = this.container.querySelectorAll(".x6-port-body");
            this.showPorts(this.ports, true);
          }
        }),
        500
      );
      // 鼠标离开节点/线
      graph.on('cell:mouseleave', ({ cell }) => {
        if (cell.isNode()) {
          this.ports = this.container.querySelectorAll(".x6-port-body");
          this.showPorts(this.ports, false);
        }
      })
      // 鼠标点击节点或者线
      graph.on('cell:click', ({ cell }) => {
        if (this.removeToolsCell != '') {
          this.removeToolsCell.removeTools();
        }
        this.edgeAnimationDelete()
        this.nodeAnimationDelete('rgba(95,149,255,0.00)')
        if (cell.isNode()) {
          this.nodeAnimationDelete(cell.attrs.head1.stroke, true)//添加节点选中动画
        } else {
          this.removeToolsCell = cell
          let color = cell.attrs.line.stroke
          // 拖动线
          // cell.addTools(
          //   [
          //     {
          //       name: 'segments',
          //       args: {
          //         snapRadius: 20,//吸附半径
          //         attrs: {
          //           fill: color
          //         },
          //         precision: 99999,
          //         // removable: false
          //       },
          //     }
          //   ]
          // )
          // 拖动箭头
          let arrowheadObj = {
            attrs: {
              fill: color,
              stroke: color
            }
          }
          cell.addTools([
            {
              name: 'source-arrowhead',
              args: arrowheadObj
            },
            {
              name: 'target-arrowhead',
              args: arrowheadObj
            }
          ])
          this.edgeAnimationDelete(true) //添加线选中动画
        }
        if (this.configIsShow) {
          this.resetType();
        }
        this.selectIsShow = true;
      })
      // 右键节点或者线
      graph.on("cell:contextmenu", ({ e, cell }) => {
        //不单击选中不出现弹窗
        if (this.selectIsShow) {
          this.nodeStyle.left = e.clientX + 'px';
          this.nodeStyle.top = e.clientY + 'px'

          this.nodeIsShow = true;
          this.toolBarIsShow = false;
          this.nodeCell = cell
        }
      });
      // 右键空白区域弹出弹窗
      graph.on('blank:contextmenu', ({ e }) => {
        this.style.left = e.clientX + 'px';
        this.style.top = e.clientY + 'px'

        this.nodeIsShow = false;
        this.toolBarIsShow = true;
      })
      //撤销
      graph.bindKey('ctrl+z', () => {
        if (graph.canUndo()) {
          graph.undo()
        }
        return false
      })
      // 复制
      graph.bindKey('ctrl+c', () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          graph.copy(cells)
        }
        return false
      })
      // 剪切
      graph.bindKey('ctrl+x', () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          graph.cut(cells)
        }
        return false
      })
      // 粘贴
      graph.bindKey('ctrl+v', () => {
        if (!graph.isClipboardEmpty()) {
          const cells = graph.paste({ offset: 100 })
          graph.cleanSelection()
          graph.select(cells)
        }
        return false
      })
    },
    //关闭右侧设置
    configClick(name) {
      if (name == 'edge') {
        this.edgeAnimationDelete()
        //清除工具集
        if (this.removeToolsCell != '') {
          this.removeToolsCell.removeTools();
        }
      }
      if (name == 'node') {
        this.nodeAnimationDelete('rgba(95,149,255,0.00)')
      }
      this.configIsShow = false
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
          //清除全部
          graph.clearCells()
          localStorage.removeItem('FlowData')
          this.toolBarIsShow = false;
          break
        case 'toJSON':
          // 导出数据
          localStorage.setItem('FlowData', JSON.stringify(graph.toJSON()));
          this.toolBarIsShow = false;
          break
        default:
          break
      }
    },
    // 连接桩隐藏处理
    showPorts(ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    },
    // 添加/删除节点动画效果
    nodeAnimationDelete(color, isShow) {
      this.ports = this.container.querySelectorAll(".x6-port-body");
      this.nodeAnimation = this.container.querySelectorAll(".x6-node");
      if (isShow) {
        //添加节点选中动画
        const nodeAnimationSelected = this.container.querySelectorAll(".x6-node-selected");
        nodeAnimationSelected[0].querySelectorAll("rect")[0].style.animation = "ant-line 30s infinite linear";
        nodeAnimationSelected[0].querySelectorAll("rect")[0].style.stroke = color;
      } else {
        for (let i = 0, len = this.nodeAnimation.length; i < len; i = i + 1) {
          this.nodeAnimation[i].querySelectorAll("rect")[0].style.animation = '';
          this.nodeAnimation[i].querySelectorAll("rect")[0].style.stroke = color;
        }
      }
    },
    // 添加/删除边动画效果
    edgeAnimationDelete(isShow) {
      this.ports = this.container.querySelectorAll(".x6-port-body");
      this.edgeAnimation = this.container.querySelectorAll(".x6-edge");
      if (isShow) {
        //添加线选中动画
        const edgeAnimationSelect = this.container.querySelectorAll(".x6-edge-selected");
        edgeAnimationSelect[0].querySelectorAll("path")[1].style.animation = "ant-line 30s infinite linear";
        edgeAnimationSelect[0].querySelectorAll("path")[1].style.strokeDasharray = 5;
      } else {
        for (let i = 0, len = this.edgeAnimation.length; i < len; i = i + 1) {
          this.edgeAnimation[i].querySelectorAll("path")[1].style.animation = '';
          this.edgeAnimation[i].querySelectorAll("path")[1].style.strokeDasharray = 0;
        }
      }
    },
    //重置状态
    resetType() {
      this.type = '';
      this.nodeCell = '';
      this.toolBarIsShow = false;
      this.nodeIsShow = false;
      this.configIsShow = false;
      this.selectIsShow = false;
      //清除工具集
      if (this.removeToolsCell != '') {
        // this.removeToolsCell.vertices=[]
        this.removeToolsCell.removeTools();
      }
    }
  }
}
</script>
<style lang="scss">
@keyframes ant-line {
  to {
    stroke-dashoffset: -1000;
  }
}
</style>
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
