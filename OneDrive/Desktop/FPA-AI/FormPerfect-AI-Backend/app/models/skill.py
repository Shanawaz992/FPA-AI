from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    sport_id = Column(Integer, ForeignKey("sports.id"), nullable=False)
    difficulty_level = Column(String)  # "beginner", "intermediate", "advanced"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    sport = relationship("Sport", back_populates="skills")
    submissions = relationship("Submission", back_populates="skill")