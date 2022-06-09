<template>
  <a-card class="box" title="节点设置">
    <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="背景颜色">
        <colorPicker
          class="colorPicker"
          @change="colorClick"
          v-model="globalNodeAttr.attrsBackgroundColor"
        />
      </a-form-item>
      <a-form-item label="字体大小">
        <a-input-number
          style="width: 100%"
          id="inputNumber"
          v-model="globalNodeAttr.attrsFontSize"
          :min="1"
          :max="100"
          @change="onChange"
        />
      </a-form-item>
      <a-form-item label="添加节点" v-if="addNodeIsShow">
        <a-button type="primary" @click="addNode">
          <a-icon type="plus" />
        </a-button>
      </a-form-item>
      <a-form-item
        v-for="(item, index) in globalNodeAttr.attrTextList"
        :key="index"
        :label="item.type"
      >
        <a-input
          v-model="item.textWrap.text"
          v-if="!item.deleteNodeIsShow"
        ></a-input>
        <a-input
          v-model="item.textWrap.text"
          v-if="item.deleteNodeIsShow"
          style="width: 65%; margin-right: 10px"
        ></a-input>
        <a-button
          type="danger"
          v-if="item.deleteNodeIsShow"
          @click="deleteNode(index)"
        >
          <a-icon type="minus" />
        </a-button>
      </a-form-item>
    </a-form>
    <div class="submit">
      <a-button type="danger" @click="reset">取消</a-button>
      <a-button type="primary" @click="primary">设置</a-button>
    </div>
  </a-card>
</template>

<script>
import FlowGraph from "../../js/index";
const heightNode = 34;
export default {
  name: "Index1",
  props: {
    id: {
      type: String,
      default: null,
      require: true,
    },
  },
  data() {
    return {
      curCel: "",
      curCelIndex: 0,
      globalNodeAttr: {
        attrsBackgroundColor: "",
        attrsFontSize: 0,
        attrTextList: [],
      },
      addNodeIsShow: true,
      cellNew1: {},
      cellNew2: [],
    };
  },
  computed: {
    nodeIdCpt() {
      return {
        id: this.id,
      };
    },
  },
  watch: {
    nodeIdCpt(nv) {
      this.curCel = this.nodeOpt(nv, this.globalNodeAttr);
    },
  },
  created() {
    this.curCel = this.nodeOpt(this.id, this.globalNodeAttr);
  },
  methods: {
    // 删除节点
    deleteNode(index) {
      this.globalNodeAttr.attrTextList.splice(index, 1);
    },
    // 增加节点
    addNode() {
      let index = this.globalNodeAttr.attrTextList.length;
      let text = {
        ref: `head${index + 1}`,
        textWrap: { text: "" },
        type: `text${index + 1}`,
        deleteNodeIsShow: true,
      };
      this.globalNodeAttr.attrTextList.push(text);
    },
    // 设置
    primary() {
      // 添加节点了
      if (this.globalNodeAttr.attrTextList.length > this.cellNew1.index) {
        // 新增节点
        let index = this.cellNew1.index;
        let listLength = this.globalNodeAttr.attrTextList.length - index;
        let head0 = {
          x: -15,
          y: -15,
          stroke: "rgba(95,149,255,0.00)",
          fill: "rgba(95,149,255,0.00)",
          strokeDasharray: 5,
          refWidth: 30,
          height: heightNode * this.globalNodeAttr.attrTextList.length + 30,
        };
        this.curCel.attr("head0", head0);
        for (let i = 0; i < listLength; i++) {
          let head = { x: 0, y: 34 * (index + i) };
          let text = {
            ref: `head${index + i + 1}`,
            textWrap: { text: "" },
            type: `text${index + i + 1}`,
          };
          this.curCel.attr(`head${index + i + 1}`, head);
          this.curCel.attr(`text${index + i + 1}`, text);
        }
        this.curCel.markup = this.markupObtain(
          this.globalNodeAttr.attrTextList.length
        );
        // 新增连接桩
        this.curCel.ports.items = [];
        this.portsItems(this.globalNodeAttr.attrTextList.length).map((ele) => {
          this.curCel.addPort(ele);
        });
      }
      // 修改背景色
      this.curCel.attr(
        "commonStyle/stroke",
        this.globalNodeAttr.attrsBackgroundColor
      );
      this.curCel.attr(
        "head1/stroke",
        this.globalNodeAttr.attrsBackgroundColor
      );
      this.curCel.attr("head1/fill", this.globalNodeAttr.attrsBackgroundColor);
      // 修改文字大小
      this.curCel.attr(
        "commonStyle1/fontSize",
        this.globalNodeAttr.attrsFontSize
      );
      // 修改文字内容
      this.globalNodeAttr.attrTextList.map((ele) => {
        this.curCel.attr(`${ele.type}/textWrap`, ele.textWrap);
        // this.curCel.attr("text/textWrap", "");
      });
      // 存储表头
      this.curCel.store.data.storage.title =
        this.globalNodeAttr.attrTextList[0].textWrap.text;
      //  固定数目
      this.curCel.attr("index", this.globalNodeAttr.attrTextList.length);
      // 清除删除按钮
      for (let i = 0; i < this.globalNodeAttr.attrTextList.length; i++) {
        if (this.globalNodeAttr.attrTextList[i].deleteNodeIsShow) {
          this.globalNodeAttr.attrTextList[i].deleteNodeIsShow = false;
        }
      }
      this.$emit("configClick", "node");
    },
    // 处理
    nodeOpt(id) {
      let curCel = null;
      if (id) {
        const { graph } = FlowGraph;
        const cell = graph.getCellById(id);
        if (!cell || !cell.isNode()) {
          return;
        }
        curCel = cell;
        this.cellNew1 = JSON.parse(JSON.stringify(cell.attrs));
        this.cellNew2 = JSON.parse(JSON.stringify(cell.markup));
        if (this.cellNew1.index == 2) {
          this.addNodeIsShow = false;
        } else {
          this.addNodeIsShow = true;
        }
        this.cellNew1.index = (this.cellNew2.length - 1) / 2; //当前节点数
        this.globalNodeAttr.attrsFontSize = this.cellNew1.commonStyle1.fontSize; //字号
        this.globalNodeAttr.attrsBackgroundColor =
          this.cellNew1.commonStyle.stroke; //背景色
        const markupList = this.cellNew2.filter((ele) => ele.tagName == "text");
        this.globalNodeAttr.attrTextList = markupList.map((ele) => {
          return this.cellNew1[`${ele.selector}`];
        }); //文字内容
      }
      return curCel;
    },
    // 取消
    reset() {
      this.$emit("configClick", "node");
    },
    // 数字加减
    onChange(value) {
      this.globalNodeAttr.attrsFontSize = value;
    },
    // 节点背景颜色点击
    colorClick(item) {
      this.globalNodeAttr.attrsBackgroundColor = item;
    },
    // 节点颜色点击
    colorClick1(item) {
      this.globalNodeAttr.attrsTitleColor = item;
    },
    // 节点颜色点击
    colorClick2(item) {
      this.globalNodeAttr.attrsFonSizeColor = item;
    },
    // 获取attrs
    attrsObtain(num) {
      const attrsObj = {
        // rect公共样式
        commonStyle: {
          refWidth: "100%",
          height: heightNode,
          stroke: "#5F95FF",
          fill: "rgba(95,149,255,0.05)",
        },
        // text公共样式
        commonStyle1: {
          fill: "#000000",
          fontSize: 12,
          textWrap: {
            width: -10, // 宽度减少 10px
            height: "50%", // 高度为参照元素高度的一半
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
            breakWord: true, // 是否截断单词
          },
        },
      };
      for (let i = 1; i < num + 1; i++) {
        if (i == 1) {
          attrsObj[`head${i}`] = {
            x: 0,
            y: 0,
            stroke: "#5F95FF",
            fill: "rgb(95,149,255)",
          };
          attrsObj[`text${i}`] = {
            ref: `head${i}`,
            type: `text${i}`,
            fill: "#FFFFFF",
            textWrap: {
              text: "",
            },
          };
        } else {
          attrsObj[`head${i}`] = {
            x: 0,
            y: heightNode * (i - 1),
          };
          attrsObj[`text${i}`] = {
            ref: `head${i}`,
            type: `text${i}`,
            textWrap: {
              text: "",
            },
          };
        }
      }
      return attrsObj;
    },
    // 获取 markup
    markupObtain(num) {
      const headList = [
        { tagName: "rect", selector: "head0", groupSelector: "commonStyle" },
      ];
      const textList = [];
      for (let i = 1; i < num + 1; i++) {
        headList.push({
          tagName: "rect",
          selector: `head${i}`,
          groupSelector: "commonStyle",
        });
        textList.push({
          tagName: "text",
          selector: `text${i}`,
          groupSelector: "commonStyle1",
        });
      }
      const markupList = headList.concat(textList);
      return markupList;
    },
    // 获取ports中的Items
    portsItems(num) {
      const leftList = [];
      const rightList = [];
      for (let i = 0; i < num; i++) {
        leftList.push({
          id: `left${i}`,
          group: "customPorts",
          args: { x: 0, y: heightNode / 2 + heightNode * i },
        });
        rightList.push({
          id: `right${i}`,
          group: "customPorts",
          args: { x: "100%", y: heightNode / 2 + heightNode * i },
        });
      }
      const portsItemsList = leftList.concat(rightList);
      portsItemsList.unshift(
        {
          id: "top",
          group: "customPorts",
          args: { x: "50%", y: 0 },
        },
        {
          id: "bottom",
          group: "customPorts",
          args: { x: "50%", y: num * heightNode },
        }
      );
      return portsItemsList;
    },
  },
};
</script>
<style lang="scss" >
.ant-form-item {
  margin-bottom: 10px;
}
.m-colorPicker .colorBtn {
  width: 160px !important;
  height: 32px !important;
  border-radius: 4px;
  border: 1px solid #000000;
}
.m-colorPicker .box.open {
  margin-left: -25px;
}
</style>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  .ant-form-item {
    margin-bottom: 15px;
  }
  .submit {
    display: flex;
    justify-content: space-around;
  }
  .colorPicker {
    width: 100%;
  }
}
</style>
