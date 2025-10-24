from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from app import models, schemas
from app.models.analysis import Analysis

def get_analysis(db: Session, analysis_id: int):
    return db.query(Analysis).filter(Analysis.id == analysis_id).first()

def get_analyses_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Analysis).filter(Analysis.user_id == user_id).offset(skip).limit(limit).all()

def get_analyses_by_submission(db: Session, submission_id: int, skip: int = 0, limit: int = 100):
    return db.query(Analysis).filter(Analysis.submission_id == submission_id).offset(skip).limit(limit).all()

def get_analyses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Analysis).offset(skip).limit(limit).all()

def create_analysis(db: Session, analysis: schemas.AnalysisCreate, user_id: int):
    db_analysis = Analysis(
        submission_id=analysis.submission_id,
        user_id=user_id,
        ai_feedback=analysis.ai_feedback,
        overall_score=analysis.overall_score,
        technique_score=analysis.technique_score,
        form_score=analysis.form_score,
        consistency_score=analysis.consistency_score,
        recommendations=analysis.recommendations
    )
    try:
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        return db_analysis
    except IntegrityError:
        db.rollback()
        return None

def update_analysis(db: Session, analysis_id: int, analysis_update: schemas.AnalysisUpdate):
    db_analysis = get_analysis(db, analysis_id)
    if not db_analysis:
        return None

    update_data = analysis_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_analysis, field, value)

    try:
        db.commit()
        db.refresh(db_analysis)
        return db_analysis
    except IntegrityError:
        db.rollback()
        return None

def delete_analysis(db: Session, analysis_id: int):
    db_analysis = get_analysis(db, analysis_id)
    if not db_analysis:
        return False

    db.delete(db_analysis)
    db.commit()
    return True