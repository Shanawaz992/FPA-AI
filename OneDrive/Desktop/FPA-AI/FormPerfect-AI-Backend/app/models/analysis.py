from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ai_feedback = Column(Text)
    overall_score = Column(Float)  # 0-100
    technique_score = Column(Float)  # 0-100
    form_score = Column(Float)  # 0-100
    consistency_score = Column(Float)  # 0-100
    recommendations = Column(Text)
    status = Column(String, default="pending")  # "pending", "processing", "completed", "failed"
    processed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    submission = relationship("Submission", back_populates="analyses")
    user = relationship("User", back_populates="analyses")