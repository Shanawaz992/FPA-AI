from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnalysisBase(BaseModel):
    submission_id: int
    ai_feedback: Optional[str] = None
    overall_score: Optional[float] = None
    technique_score: Optional[float] = None
    form_score: Optional[float] = None
    consistency_score: Optional[float] = None
    recommendations: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    pass

class AnalysisUpdate(BaseModel):
    ai_feedback: Optional[str] = None
    overall_score: Optional[float] = None
    technique_score: Optional[float] = None
    form_score: Optional[float] = None
    consistency_score: Optional[float] = None
    recommendations: Optional[str] = None
    status: Optional[str] = None
    processed_at: Optional[datetime] = None

class Analysis(AnalysisBase):
    id: int
    user_id: int
    status: str
    processed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True