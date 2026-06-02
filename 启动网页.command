#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:A:h}
cd "$SCRIPT_DIR"

port=8123
dry_run=0

while [[ $# -gt 0 ]]; do
	case "$1" in
		--port)
			if [[ $# -lt 2 ]]; then
				echo "缺少端口号，请使用 --port <端口>"
				exit 1
			fi
			port="$2"
			shift 2
			;;
		--dry-run)
			dry_run=1
			shift
			;;
		-h|--help)
			cat <<'EOF'
用法：
  ./启动网页.command
  ./启动网页.command --port 8124
  ./启动网页.command --dry-run
EOF
			exit 0
			;;
		*)
			echo "不支持的参数：$1"
			exit 1
			;;
	esac
done

if ! command -v node >/dev/null 2>&1; then
	echo "未找到 node，请先安装 Node.js。"
	exit 1
fi

cache_buster=$(date +%s)
url="http://localhost:${port}/index.html?v=${cache_buster}"
log_file="/tmp/template-learning-assistant-${port}.log"
existing_pid=$(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)
existing_command=""
should_restart_service=0

if [[ -n "$existing_pid" ]]; then
	existing_command=$(ps -p "$existing_pid" -o command= | sed 's/^ *//' || true)
	if [[ "$existing_command" == *"http.server"* || "$existing_command" == *"scripts/web-server.mjs"* ]]; then
		should_restart_service=1
	else
		echo "端口 ${port} 已被其他进程占用："
		echo "$existing_command"
		echo "请改用 ./启动网页.command --port 其他端口"
		exit 1
	fi
fi

echo "项目目录：$SCRIPT_DIR"
echo "预览地址：$url"

if (( dry_run )); then
	if [[ -n "$existing_pid" ]]; then
		echo "演练模式：会停止当前端口上的旧本地服务，并启动最新的带保存/删除 API 的本地服务。"
	else
		echo "演练模式：会先生成模板数据，再启动带保存 API 的本地服务。"
	fi
	echo "演练模式：会打开浏览器。"
	exit 0
fi

echo "正在生成模板数据..."
node scripts/generate-template-data.mjs

if (( should_restart_service )); then
	echo "检测到端口 ${port} 上已有旧本地服务，正在重启为最新版本..."
	kill "$existing_pid"
	while lsof -nP -tiTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
		:
	done
	echo "正在启动本地服务..."
	nohup node scripts/web-server.mjs --port "$port" >"$log_file" 2>&1 &
	echo "服务日志：$log_file"
elif [[ -n "$existing_pid" ]]; then
	echo "检测到端口 ${port} 已有本地服务，直接复用。"
else
	echo "正在启动本地服务..."
	nohup node scripts/web-server.mjs --port "$port" >"$log_file" 2>&1 &
	echo "服务日志：$log_file"
fi

open "$url"
echo "浏览器已打开：$url"