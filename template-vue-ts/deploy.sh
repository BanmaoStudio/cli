#!/bin/sh

echo "start build the project"

pnpm build

echo "build success!"


# # 定义源目录，目标服务器和目标目录
src_dir="dist/"
dest_host="bw"
dest_dir="/www/wwwroot/[project-path]"


echo "deploying to $dest_host:$dest_dir"
rsync -avzh --delete --update --progress "$src_dir" "$dest_host":"$dest_dir"
echo "deploy success"
