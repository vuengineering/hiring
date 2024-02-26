from django.db import models
from django.contrib.auth.models import User

# Define choices for defect type and severity
DEFECT_TYPES = (
    ('SCRATCH', 'Scratch'),
    ('DENT', 'Dent'),
    ('MISALIGNMENT', 'Misalignment'),
    # Add more options as needed
)

SEVERITY_LEVELS = (
    ('MINOR', 'Minor'),
    ('MAJOR', 'Major'),
    ('CRITICAL', 'Critical'),
)
class InspectionResult(models.Model):
    part_number = models.CharField(max_length=50)
    inspector = models.ForeignKey(User, on_delete=models.CASCADE)
    inspection_date = models.DateTimeField(auto_now_add=True)
    passed = models.BooleanField(default=False)
    defect_type = models.CharField(max_length=20, choices=DEFECT_TYPES, blank=True)
    defect_description = models.TextField(blank=True)
    image = models.ImageField(upload_to='inspection_images/', blank=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS, blank=True)
    corrective_action = models.TextField(blank=True)

    def __str__(self):
        return f"Inspection for part {self.part_number} on {self.inspection_date}"