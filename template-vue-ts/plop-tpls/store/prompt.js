import fs from "fs";

function getFolder(path) {
  if (!path) return;
  let components = [];
  const files = fs.readdirSync(path);
  files.forEach((item) => {
    let stat = fs.lstatSync(`${path}/${item}`);
    if (stat.isDirectory() === true && item != "store") {
      components.push(`${path}/${item}`);
      components.push.apply(components, getFolder(`${path}/${item}`));
    }
  });
  return components;
}

export default {
  description: "创建全局模块化状态",
  prompts: [
    {
      type: "list",
      name: "path",
      message: "请选择模块创建目录",
      choices: ["src/views/", ...getFolder("src/store")],
    },
    {
      type: "input",
      name: "name",
      message: "请输入模块名称",
      validate: (v) => {
        if (!v || v.trim === "") {
          return "模块名称不能为空";
        } else {
          return true;
        }
      },
    },
  ],
  actions: (data) => {
    const actions = [
      {
        type: "add",
        path: `${data.path}/{{camelCase name}}/index.ts`,
        templateFile: "plop-tpls/store/index.hbs",
      },
      {
        type: "add",
        path: `${data.path}/{{camelCase name}}/types.ts`,
      },
    ];

    return actions;
  },
};
