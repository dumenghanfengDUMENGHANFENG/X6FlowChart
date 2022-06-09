// 节点样式设置
import {
  Graph
} from "@antv/x6";
const widthNode = 200;
const heightNode = 34;
// 连接桩样式
const groupsObj = {
  customPorts: {
    position: {
      name: "absolute"
    },
    attrs: {
      circle: {
        r: 4,
        magnet: true, //交互是否可连
        stroke: "#5F95FF",
        strokeWidth: 1,
        fill: "#fff",
        offset: 10,
        style: {
          visibility: "hidden",
        },
      },
    },
  },
};
// 矩形,两个矩形叠加,形成效果
export const basicsNode = Graph.registerNode("basicsNode", {
  inherit: "rect",
  width: widthNode,
  height: heightNode * 2,
  attrs: attrsObtain(2),
  markup: markupObtain(2),
  resizing: {
    enabled: true,
  },
  ports: {
    groups: groupsObj,
    items: [{
        id: "top",
        group: "customPorts",
        args: {
          x: "50%",
          y: 0
        },
      },
      {
        id: "bottom",
        group: "customPorts",
        args: {
          x: "50%",
          y: 68
        },
      },
      {
        id: "left",
        group: "customPorts",
        args: {
          x: 0,
          y: 34
        },
      },
      {
        id: "right",
        group: "customPorts",
        args: {
          x: "100%",
          y: 34
        },
      },
    ],
  },
  storage: {
    title: ''
  }
});
export const twoStageNode = Graph.registerNode("twoStageNode", {
  inherit: "rect",
  width: widthNode,
  height: heightNode * 3,
  attrs: attrsObtain(3),
  markup: markupObtain(3),
  ports: {
    groups: groupsObj,
    items: portsItems(3),
  },
  storage: {
    title: ''
  }
});
// 获取attrs
function attrsObtain(num) {
  const attrsObj = {
    index: num,
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
    // 最外层选中
    head0: {
      x: -15,
      y: -15,
      stroke: "rgba(95,149,255,0.00)",
      fill: "rgba(95,149,255,0.00)",
      strokeDasharray: 5,
      refWidth: 30,
      height: num * heightNode + 30,
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
}
// 获取 markup
function markupObtain(num) {
  const headList = [{
    tagName: "rect",
    selector: "head0",
    groupSelector: "commonStyle"
  }, ];
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
}
// 获取ports中的Items
function portsItems(num) {
  const leftList = [];
  const rightList = [];
  for (let i = 0; i < num; i++) {
    leftList.push({
      id: `left${i}`,
      group: "customPorts",
      args: {
        x: 0,
        y: heightNode / 2 + heightNode * i
      },
    });
    rightList.push({
      id: `right${i}`,
      group: "customPorts",
      args: {
        x: "100%",
        y: heightNode / 2 + heightNode * i
      },
    });
  }
  const portsItemsList = leftList.concat(rightList);
  portsItemsList.unshift({
    id: "top",
    group: "customPorts",
    args: {
      x: "50%",
      y: 0
    },
  }, {
    id: "bottom",
    group: "customPorts",
    args: {
      x: "50%",
      y: num * heightNode
    },
  });
  return portsItemsList;
}