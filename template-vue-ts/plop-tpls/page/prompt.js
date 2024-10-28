// import fs from 'fs'
// import path from 'path'
//
// function getFolder(path) {
//   if (!path) return;
//   let components = [];
//   const files = fs.readdirSync(path)
//   files.forEach((item) => {
//     let stat = fs.lstatSync(`${path}/${item}`);
//     if (stat.isDirectory() === true && item != 'views') {
//       components.push(`${path}/${item}`);
//       components.push.apply(components, getFolder(`${path}/${item}`))
//     }
//   })
//   return components;
// }

// const validateYes_No = (v) => {
//   if (v === 'Y' || v === 'y') {
//     return true
//   } else if (v === 'N' || v === 'n') {
//     return true
//   } else {
//     return '请键入Y或者N'
//   }
// }

function selectPageType() {
  return [
    {
      type: "list",
      name: "pageType",
      message: "请选择要创建的页面类型",
      choices: [
        { name: "空白页", value: "default" },
        { name: "表格", value: "table" },
        { name: "表单", value: "form" },
        { name: "详情页", value: "detail" },
      ],
    },
    {
      type: "list",
      name: "tableType",
      message: "请选择要创建的表格类型",
      choices: [
        { name: "查询表格", value: "table-query" },
        { name: "统计表格", value: "table-statement" },
        { name: "左树右表", value: "table-left-right-layout" },
      ],
      when: (answers) => answers.pageType === "table",
    },
    {
      type: "list",
      name: "formType",
      message: "请选择要创建的表单类型",
      choices: [
        { name: "基础表单", value: "form-query" },
        { name: "分组表单", value: "form-group" },
        { name: "分步表单", value: "form-step" },
      ],
      when: (answers) => answers.pageType === "form",
    },
    {
      type: "checkbox",
      name: "actions",
      message: "页面操作功能",
      choices: [
        { name: "selection - 表格多选功能", value: "selection" },
        { name: "add - 新增功能", value: "add" },
        { name: "edit - 编辑功能", value: "edit" },
        { name: "modal - 弹窗功能", value: "modal" },
        { name: "delete - 删除功能", value: "delete" },
        { name: "exportFile - 导出功能", value: "exportFile" },
      ],
      when: (answers) =>
        answers.tableType === "table-query" ||
        answers.tableType === "table-statement",
    },
  ];
}

export default {
  description: "创建页面",
  prompts: [
    ...selectPageType(),
    // 创建业务模块名称
    {
      type: "input",
      name: "name",
      message: "请输入页面名称",
      validate: (v) => {
        if (!v || v.trim === "") {
          return "页面名称不能为空";
        } else {
          return true;
        }
      },
    },
    {
      type: "list",
      name: "isViews",
      message: "是否在Views中创建页面",
      choices: [
        { name: "默认 - 在Views目录下直接创建", value: "default" },
        { name: "功能模块 - 在Views目录下创建功能模块", value: "views-module" },
        { name: "其他", value: "other" },
      ],
      // default: false,
    },
    // {
    //   type: 'list',
    //   name: 'path',
    //   message: '请选择页面创建目录',
    //   choices: getFolder('src/views'),
    //   when: (answers) => {
    //     return answers.isViews === 'default'
    //   }
    // },
    {
      type: "list",
      name: "path",
      message: "请输入文件路径",
      when: (answers) => {
        return answers.isViews === "other";
      },
    },
    {
      type: "input",
      name: "module",
      message: "请输入模块名称",
      when: (answers) => {
        return answers.isViews === "views-module";
      },
    },
  ],
  actions: (data) => {
    // 页面创建的路径
    console.log(data);
    const rootPath = "src/views";
    // const path = `${rootPath}/`
    // let relativePath = path.relative(rootPath, '')
    // console.log(relativePath);

    function getPath(file = "index.vue") {
      switch (data.isViews) {
        case "views-module":
          return `${rootPath}/${data.module}/${data.name}/${file}`;
        case "other":
          return `${data.path}/${data.name}/${file}`;
        default:
          return `${rootPath}/${data.name}/${file}`;
      }
    }
    function getBoolean(actions, action) {
      if (actions) return;
      if (action) return;
      return actions.includes(action);
    }
    // 创建表格的动作
    function tableActions(pageType) {
      if (!pageType) return [];
      let actions = [];
      // 创建 页面
      actions.push({
        type: "add",
        path: getPath(),
        templateFile: `plop-tpls/page/table/${pageType}.hbs`,
        data: {
          name: data.name,
          isSelection: getBoolean(data.actions, "selection"),
          isAddend: getBoolean(data.actions, "add"),
          isEdit: getBoolean(data.actions, "edit"),
          isModal: getBoolean(data.actions, "modal"),
          isDelete: getBoolean(data.actions, "delete"),
          isExportFile: getBoolean(data.actions, "exportFile"),
          isActions:
            getBoolean(data.actions, "edit") ||
            getBoolean(data.actions, "delete"),
        },
      });
      // 创建 types
      actions.push({
        type: "add",
        path: getPath("types.ts"),
        templateFile: "plop-tpls/page/types.hbs",
        data: {
          name: data.name,
          isAddend: getBoolean(data.actions, "add"),
        },
      });
      // 创建 Service
      actions.push({
        type: "add",
        path: getPath("service.ts"),
        templateFile: "plop-tpls/page/service.hbs",
        data: {
          name: data.name,
          isEdit: getBoolean(data.actions, "edit"),
          isDelete: getBoolean(data.actions, "delete"),
          isExportFile: getBoolean(data.actions, "exportFile"),
          module: data.module,
        },
      });
      // 创建 Store
      actions.push({
        type: "add",
        path: getPath("store.ts"),
        templateFile: "plop-tpls/page/store.hbs",
        data: {
          name: data.name,
          isDelete: getBoolean(data.actions, "delete"),
          isEdit: getBoolean(data.actions, "edit"),
          isExportFile: getBoolean(data.actions, "exportFile"),
        },
      });
      // 创建弹出层
      actions.push({
        type: "add",
        path: getPath("components/TableActionModal.vue"),
        templateFile: "plop-tpls/page/table/components/table-action-modal.hbs",
        data: {
          name: data.name,
        },
      });
      return actions;
    }

    let actions = [];
    if (data.pageType === "default") {
      actions.push({
        type: "add",
        path: getPath(),
        templateFile: "plop-tpls/page/blank/index.hbs",
        data: {
          name: data.name,
        },
      });
    }

    if (data.pageType === "table") {
      // table-query
      actions = [...actions, ...tableActions(data.tableType)];
    }
    console.log(actions);

    return actions;
  },
};
