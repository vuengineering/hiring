from random import randint
from inspektor.apps.core.models import Image, Inspection

Errors = {
    "ERROR_001": "This is inspection error 1 happening...",
    "ERROR_002": "This is inspection error 2 happening...",
    "ERROR_003": "This is inspection error 3 happening...",
    "ERROR_004": "This is inspection error 4 happening...",
}


def run_inference_on_image(image: Image):
    """
    This is a mocked version of the inspection algorithm.
    TODO: Possible bottleneck here. Think about queueing inspections using Google PubSub or similar.


    Args:
        image: Image

    Returns: Inspection model instance after saving into DB.

    """

    result = randint(0, 1)
    inspection = Inspection(
        inspection_result=result,
        image=image,
        inspection_errors=[] if result else [Errors["ERROR_001"], Errors["ERROR_003"]],
    )
    inspection.save()
    return inspection
