from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Submission])
async def read_submissions(
    skill_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if skill_id:
        submissions = crud.get_submissions_by_skill(db, skill_id=skill_id, skip=skip, limit=limit)
    else:
        submissions = crud.get_submissions_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return submissions

@router.get("/{submission_id}", response_model=schemas.Submission)
async def read_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Users can only view their own submissions
    if db_submission.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this submission")

    return db_submission

@router.post("/", response_model=schemas.Submission)
async def create_submission(
    submission: schemas.SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_submission(db=db, submission=submission, user_id=current_user.id)

@router.put("/{submission_id}", response_model=schemas.Submission)
async def update_submission(
    submission_id: int,
    submission_update: schemas.SubmissionUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Users can only update their own submissions
    if db_submission.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this submission")

    db_submission = crud.update_submission(db, submission_id=submission_id, submission_update=submission_update)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return db_submission

@router.delete("/{submission_id}")
async def delete_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Users can only delete their own submissions
    if db_submission.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this submission")

    success = crud.delete_submission(db, submission_id=submission_id)
    if not success:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": "Submission deleted successfully"}