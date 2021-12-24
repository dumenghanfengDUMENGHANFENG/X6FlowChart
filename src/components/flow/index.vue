<template>
  <div class="wrap" :style="{ width: width, height: height }">
    <!-- 左侧工具栏 -->
    <div class="leftDrag" id="flowStencil" v-if="editIsSHow"/>
    <!-- 中间画布 -->
    <div class="middleCanvas" id="flowContainer" />
    <!--右侧工具栏-->
    <config-panel :editIsSHow="editIsSHow"/>
  </div>
</template>

<script>
import FlowGraph from './js'
import ConfigPanel from './configPanel/index'

export default {
  name: 'Index',
  components: {
    ConfigPanel
  },
  props: {
    editIsSHow:{
      typeof:Boolean
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      visible: false,
      isReady: false
    }
  },
  mounted() {
    let FlowData = JSON.parse(localStorage.getItem('FlowData'));
    if (FlowData == null) {
      FlowData = []
    }
    FlowGraph.init(this.width, this.height,this.editIsSHow) // 渲染画布
    FlowGraph.initGraphShape(FlowData) // 数据回填
    //  倒计时修改回填数据
    // var Date1 = setTimeout(function () {
    //   graphData.cells[0].labels[0].attrs.label.text = "修改"
    //   FlowGraph.initGraphShape(graphData) // 数据回填
    // }, 5000)  // 1秒后执行打印功能
    // 监听页面跨高变化
    let that = this
    // 监控宽高
    window.onresize = () => {
      return (() => {
        FlowGraph.destroy()//卸载画布
        that.getContainerSize();
        FlowGraph.init(that.width, that.height,this.editIsSHow)
        FlowGraph.initGraphShape(FlowData) // 数据回填
      })();
    };
  },
  created() {
    this.getContainerSize()
  },
  methods: {
    // 页面宽高
    getContainerSize() {
      this.width = document.body.offsetWidth + 'px'
      this.height = document.body.offsetHeight + 'px'
    }
  }
}
</script>

<style scoped lang="scss">
.wrap {
  width: 100%;
  display: flex;

  .leftDrag {
    position: relative;
    width: 270px;
  }

  .middleCanvas {
    width: calc(100% - 270px);
    height: 100%;
  }

  .button {
    position: fixed;
  }
}

// 调整边界
.ant-drawer-body {
  padding: 0;
}

//解决左侧遮罩的问题
.x6-widget-dnd {
  z-index: 1000;
}

.x6-widget-stencil-content {
  background-color: #ffffff;
}
</style>
