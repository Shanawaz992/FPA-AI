from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Analysis])
async def read_analyses(
    submission_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if submission_id:
        analyses = crud.get_analyses_by_submission(db, submission_id=submission_id, skip=skip, limit=limit)
    else:
        analyses = crud.get_analyses_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return analyses

@router.get("/{analysis_id}", response_model=schemas.Analysis)
async def read_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_analysis = crud.get_analysis(db, analysis_id=analysis_id)
    if db_analysis is None:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Users can only view their own analyses
    if db_analysis.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this analysis")

    return db_analysis

@router.post("/", response_model=schemas.Analysis)
async def create_analysis(
    analysis: schemas.AnalysisCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if the submission belongs to the current user
    db_submission = crud.get_submission(db, submission_id=analysis.submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    if db_submission.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to create analysis for this submission")

    return crud.create_analysis(db=db, analysis=analysis, user_id=current_user.id)

@router.put("/{analysis_id}", response_model=schemas.Analysis)
async def update_analysis(
    analysis_id: int,
    analysis_update: schemas.AnalysisUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_analysis = crud.get_analysis(db, analysis_id=analysis_id)
    if db_analysis is None:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Users can only update their own analyses
    if db_analysis.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this analysis")

    db_analysis = crud.update_analysis(db, analysis_id=analysis_id, analysis_update=analysis_update)
    if db_analysis is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return db_analysis

@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_analysis = crud.get_analysis(db, analysis_id=analysis_id)
    if db_analysis is None:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Users can only delete their own analyses
    if db_analysis.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this analysis")

    success = crud.delete_analysis(db, analysis_id=analysis_id)
    if not success:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"message": "Analysis deleted successfully"}