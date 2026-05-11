from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import uuid

app = FastAPI(title="Academic CV Editor API")

# CORS 配置 - 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应限制为具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 内存存储 (后续可替换为数据库)
resumes: Dict[str, Any] = {}


class ResumeCreate(BaseModel):
    data: Dict[str, Any]
    name: Optional[str] = None


class ResumeUpdate(BaseModel):
    data: Optional[Dict[str, Any]] = None
    name: Optional[str] = None


# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok"}


# List all resumes
@app.get("/api/resumes")
async def list_resumes():
    """获取所有简历列表"""
    return list(
        {"id": rid, "name": r.get("name", "Untitled"), "updated_at": r.get("updated_at")}
        for rid, r in resumes.items()
    )


# Get a single resume
@app.get("/api/resumes/{resume_id}")
async def get_resume(resume_id: str):
    """获取单个简历数据"""
    if resume_id not in resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resumes[resume_id]


# Create a new resume
@app.post("/api/resumes")
async def create_resume(resume: ResumeCreate):
    """创建新简历"""
    resume_id = str(uuid.uuid4())
    resumes[resume_id] = {
        "id": resume_id,
        "name": resume.name or "Untitled",
        "data": resume.data,
        "created_at": str(uuid.uuid4()),  # 简化时间戳
        "updated_at": str(uuid.uuid4()),
    }
    return resumes[resume_id]


# Update a resume
@app.put("/api/resumes/{resume_id}")
async def update_resume(resume_id: str, resume: ResumeUpdate):
    """更新简历"""
    if resume_id not in resumes:
        raise HTTPException(status_code=404, detail="Resume not found")

    existing = resumes[resume_id]
    if resume.data is not None:
        existing["data"] = resume.data
    if resume.name is not None:
        existing["name"] = resume.name
    existing["updated_at"] = str(uuid.uuid4())

    return existing


# Delete a resume
@app.delete("/api/resumes/{resume_id}")
async def delete_resume(resume_id: str):
    """删除简历"""
    if resume_id not in resumes:
        raise HTTPException(status_code=404, detail="Resume not found")

    del resumes[resume_id]
    return {"message": "Resume deleted"}


# AI 相关端点占位 (后续扩展)
@app.post("/api/ai/optimize")
async def optimize_resume(resume_data: Dict[str, Any]):
    """AI 优化简历建议 - TODO: 接入 AI 模型"""
    # 后续可以接入 Claude API 或其他 AI 服务
    return {
        "suggestions": [
            "AI 功能待实现 - 可接入 Claude API 提供优化建议"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
