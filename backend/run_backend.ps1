if (Test-Path "venv\Scripts\Activate.ps1") {
    . venv\Scripts\Activate.ps1
    python manage.py runserver
} else {
    Write-Host "Virtual environment not found in backend/venv" -ForegroundColor Red
}
