# Academic CV Editor

欧美学术风格简历编辑器 - 前后端分离架构

## 项目结构

```
academic-cv-editor/
├── frontend/           # React + TypeScript 前端
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/            # FastAPI 后端
│   ├── main.py
│   ├── requirements.txt
│   └── ...
└── README.md
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

### 后端

```bash
cd backend

# 创建虚拟环境 (可选但推荐)
python -m venv venv
source venv/bin/activate  # Mac/Linux
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
python main.py
# 或使用 uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端 API 运行在 http://localhost:8000
API 文档：http://localhost:8000/docs

## API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /health | 健康检查 |
| GET | /api/resumes | 获取所有简历列表 |
| GET | /api/resumes/{id} | 获取单个简历 |
| POST | /api/resumes | 创建新简历 |
| PUT | /api/resumes/{id} | 更新简历 |
| DELETE | /api/resumes/{id} | 删除简历 |
| POST | /api/ai/optimize | AI 优化建议 (待实现) |

## 技术栈

**前端**:
- React 19 + TypeScript
- Vite
- Monaco Editor
- html2pdf.js

**后端**:
- FastAPI
- Pydantic
- Uvicorn

## 后续规划

- [ ] 接入真实数据库 (SQLite/PostgreSQL)
- [ ] 用户认证系统
- [ ] AI 简历优化功能 (Claude API)
- [ ] 更多简历模板

## License

MIT
